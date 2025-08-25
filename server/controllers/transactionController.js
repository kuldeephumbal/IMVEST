const Transaction = require('../models/Transaction');
const Client = require('../models/Client');
const { writeAuditLog } = require('../utils/auditLogger');

// Create a new transaction (admin-only)
async function create(req, res) {
  try {
    const { clientId, type, amount, paymentMethod, description, bankDetails, notes } = req.body;

    if (!clientId || !type || !amount || !paymentMethod || !description) {
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

// List transactions for a client (admin-only)
async function listForClient(req, res) {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const query = { client: clientId };
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(query),
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

// Admin list (all transactions)
async function list(req, res) {
  try {
    const { page = 1, limit = 20, type, status, clientEmail } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    if (clientEmail) {
      const client = await Client.findOne({ email: clientEmail.toLowerCase() }).select('_id');
      query.client = client ? client._id : null;
    }

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.json({
      transactions: transactions.map(t => t.getSummary()),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error listing transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get client balance summary
async function getBalance(req, res) {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const balance = await Transaction.getClientBalance(clientId);
    res.json(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { create, listForClient, list, getBalance }; 