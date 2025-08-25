const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const Transaction = require('../models/Transaction');
const { writeAuditLog } = require('../utils/auditLogger');

// Helper to sign client JWT
function signClientToken(client) {
  return jwt.sign(
    {
      clientId: client._id,
      email: client.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Client Registration
async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      ssn,
      address,
      investmentPlan,
      initialInvestment,
      referralCode,
      password
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !dateOfBirth || !ssn || !investmentPlan || !initialInvestment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let addressObj;
    try {
      addressObj = JSON.parse(address);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid address format' });
    }

    const investmentAmount = parseFloat(initialInvestment);
    if (investmentAmount < 1000) {
      return res.status(400).json({ message: 'Minimum investment amount is $1,000' });
    }

    const existingClient = await Client.findOne({ $or: [{ email }, { ssn }] });
    if (existingClient) {
      return res.status(409).json({ message: 'Client with this email or SSN already exists' });
    }

    const documents = {};
    if (req.files) {
      if (req.files.driverLicense) documents.driverLicense = req.files.driverLicense[0].path;
      if (req.files.ssnCard) documents.ssnCard = req.files.ssnCard[0].path;
      if (req.files.proofOfAddress) documents.proofOfAddress = req.files.proofOfAddress[0].path;
    }

    const client = new Client({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      ssn,
      address: addressObj,
      investmentPlan,
      initialInvestment: investmentAmount,
      referralCode,
      documents,
      totalInvested: investmentAmount,
      currentBalance: investmentAmount,
    });

    // Optional password if provided
    if (password) client.password = password;

    await client.save();

    const transaction = new Transaction({
      client: client._id,
      type: 'deposit',
      amount: investmentAmount,
      status: 'pending',
      paymentMethod: 'bank_transfer',
      description: `Initial investment - ${investmentPlan}`,
      metadata: { investmentPlan }
    });
    await transaction.save();

    await writeAuditLog(req, {
      action: 'client.register',
      status: 'success',
      target: { type: 'client', id: client._id, summary: `client: ${client.email}` },
      metadata: { investmentPlan, initialInvestment: investmentAmount, hasDocuments: Object.keys(documents).length > 0 }
    });

    res.status(201).json({ message: 'Client registered successfully. Pending approval.', clientId: client._id, status: client.status });
  } catch (error) {
    console.error('Client registration error:', error);
    await writeAuditLog(req, { action: 'client.register', status: 'failure', message: 'Server error during registration', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Pending approvals
async function getPendingApprovals(req, res) {
  try {
    const pendingClients = await Client.find({ status: 'pending' })
      .select('firstName lastName email phone initialInvestment investmentPlan createdAt documents')
      .sort({ createdAt: -1 });
    res.json({ pendingClients, count: pendingClients.length });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Approve/decline/request info
async function approveClient(req, res) {
  try {
    const { clientId } = req.params;
    const { action, notes } = req.body;

    if (!['approve', 'decline', 'request_info'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be approve, decline, or request_info' });
    }

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (client.status !== 'pending') return res.status(400).json({ message: 'Client is not in pending status' });

    let newStatus;
    const updateData = { approvalNotes: notes, approvedBy: req.admin._id, approvedAt: new Date() };

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        updateData.startDate = new Date();
        updateData.maturityDate = client.calculateMaturityDate();
        updateData.kycStatus = 'verified';
        break;
      case 'decline':
        newStatus = 'declined';
        break;
      case 'request_info':
        newStatus = 'pending';
        delete updateData.approvedBy;
        delete updateData.approvedAt;
        break;
    }

    updateData.status = newStatus;
    await Client.findByIdAndUpdate(clientId, updateData);

    if (action === 'approve') {
      await Transaction.findOneAndUpdate({ client: clientId, type: 'deposit' }, { status: 'completed' });
    }

    await writeAuditLog(req, {
      action: `client.${action}`,
      status: 'success',
      target: { type: 'client', id: clientId, summary: `client: ${client.email}` },
      metadata: { previousStatus: client.status, newStatus, notes }
    });

    res.json({ message: `Client ${action}d successfully`, status: newStatus });
  } catch (error) {
    console.error('Error updating client status:', error);
    await writeAuditLog(req, { action: 'client.approve', status: 'failure', message: 'Server error during approval', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Create transaction
async function createTransaction(req, res) {
  try {
    const { clientId } = req.params;
    const { type, amount, paymentMethod, description, bankDetails, notes } = req.body;

    if (!type || !amount || !paymentMethod || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const transactionAmount = parseFloat(amount);
    if (transactionAmount <= 0) return res.status(400).json({ message: 'Amount must be greater than 0' });

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (!['approved', 'active'].includes(client.status)) return res.status(400).json({ message: 'Client must be approved to perform transactions' });

    if (type === 'withdrawal') {
      const balance = await Transaction.getClientBalance(clientId);
      if (balance.currentBalance < transactionAmount) return res.status(400).json({ message: 'Insufficient balance for withdrawal' });
    }

    const transaction = new Transaction({
      client: clientId,
      type,
      amount: transactionAmount,
      status: 'pending',
      paymentMethod,
      description,
      bankDetails,
      notes,
      createdBy: req.admin?._id
    });

    await transaction.save();

    await writeAuditLog(req, {
      action: `transaction.${type}`,
      status: 'success',
      target: { type: 'transaction', id: transaction._id, summary: `${type}: $${transactionAmount}` },
      metadata: { clientId, amount: transactionAmount, paymentMethod }
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction: transaction.getSummary() });
  } catch (error) {
    console.error('Error creating transaction:', error);
    await writeAuditLog(req, { action: 'transaction.create', status: 'failure', message: 'Server error during transaction creation', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Get balance
async function getBalance(req, res) {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const balance = await Transaction.getClientBalance(clientId);
    res.json({
      client: { id: client._id, fullName: client.fullName, email: client.email, status: client.status, investmentPlan: client.investmentPlan, startDate: client.startDate, maturityDate: client.maturityDate },
      balance,
      investmentDetails: { initialInvestment: client.initialInvestment, totalInvested: client.totalInvested, totalEarned: client.totalEarned, currentBalance: client.currentBalance }
    });
  } catch (error) {
    console.error('Error fetching client balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get transactions
async function getTransactions(req, res) {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const query = { client: clientId };
    if (type) query.type = type;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('processedBy', 'firstName lastName'),
      Transaction.countDocuments(query)
    ]);

    res.json({
      transactions: transactions.map(t => t.getSummary()),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Client Login (requires docs present and status approved/active)
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const client = await Client.findOne({ email: email.toLowerCase() });
    if (!client) return res.status(401).json({ message: 'Invalid credentials' });

    const hasDocs = !!(client.documents?.driverLicense && client.documents?.ssnCard && client.documents?.proofOfAddress);
    if (!hasDocs) return res.status(403).json({ message: 'Documents not on file. Please upload required KYC documents.' });

    if (!['approved', 'active'].includes(client.status)) return res.status(403).json({ message: 'Account not approved yet.' });

    const isValid = await client.comparePassword(password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    client.lastLogin = new Date();
    await client.save();

    const token = signClientToken(client);

    await writeAuditLog(req, { action: 'client.login', status: 'success', target: { type: 'client', id: client._id, summary: `client: ${client.email}` } });

    res.json({ message: 'Login successful', token, client: { id: client._id, email: client.email, fullName: client.fullName } });
  } catch (error) {
    console.error('Client login error:', error);
    await writeAuditLog(req, { action: 'client.login', status: 'failure', message: 'Server error during login', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Client Overview (for dashboard)
async function getOverview(req, res) {
  try {
    const clientId = req.client._id;
    const client = await Client.findById(clientId).lean();
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const balance = await Transaction.getClientBalance(clientId);

    const last6 = await Transaction.find({ client: clientId, status: { $in: ['pending', 'completed'] } })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const monthly = {};
    last6.forEach(t => {
      const key = new Date(t.createdAt).toISOString().slice(0, 7);
      if (!monthly[key]) monthly[key] = { deposits: 0, withdrawals: 0, interest: 0 };
      if (t.type === 'deposit') monthly[key].deposits += t.amount;
      if (t.type === 'withdrawal') monthly[key].withdrawals += t.amount;
      if (t.type === 'interest_payment') monthly[key].interest += t.amount;
    });

    res.json({
      overview: {
        totalInvested: balance.totalDeposits,
        interestEarnedToDate: balance.totalInterest,
        currentBalance: balance.currentBalance,
        planType: client.investmentPlan,
        startDate: client.startDate,
        maturityDate: client.maturityDate,
        status: client.status,
      },
      performance: monthly,
    });
  } catch (error) {
    console.error('Client overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  register,
  getPendingApprovals,
  approveClient,
  createTransaction,
  getBalance,
  getTransactions,
  login,
  getOverview,
}; 