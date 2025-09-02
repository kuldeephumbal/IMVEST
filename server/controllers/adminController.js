const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const OTP = require('../models/OTP');
const { writeAuditLog } = require('../utils/auditLogger');
const { sendOTPEmail, generateOTP } = require('../utils/emailService');

// Register first super admin (no auth required - only works if no admins exist)
async function registerFirstAdmin(req, res) {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, password, first name, and last name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ 
        message: 'Admin already exists in the system. Use the regular registration endpoint with proper authentication.' 
      });
    }

    // Check if this specific email already exists
    const existingEmail = await Admin.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create the first super admin
    const admin = new Admin({ 
      email: email.toLowerCase(), 
      password, 
      firstName, 
      lastName, 
      role: role || 'super_admin', 
      permissions: permissions || [
        'approve_clients',
        'manage_investments',
        'view_reports',
        'manage_contracts',
        'system_settings',
        'user_management'
      ],
      isActive: true
    });
    
    await admin.save();

    await writeAuditLog(req, { 
      action: 'admin.create_first', 
      status: 'success', 
      target: { type: 'admin', id: admin._id, summary: `first admin: ${admin.email}` }, 
      metadata: { createdRole: admin.role } 
    });

    const adminData = { 
      id: admin._id, 
      email: admin.email, 
      firstName: admin.firstName, 
      lastName: admin.lastName, 
      role: admin.role, 
      permissions: admin.permissions, 
      isActive: admin.isActive, 
      createdAt: admin.createdAt 
    };

    res.status(201).json({ 
      message: 'First super admin created successfully! You can now login with these credentials.', 
      admin: adminData 
    });
  } catch (error) {
    console.error('First admin registration error:', error);
    await writeAuditLog(req, { 
      action: 'admin.create_first', 
      status: 'failure', 
      message: 'Server error during first admin create', 
      metadata: { error: error?.message } 
    });
    res.status(500).json({ message: 'Server error' });
  }
}

// Register admin (requires user_management permission)
async function register(req, res) {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body;

    if (!email || !password || !firstName || !lastName) {
      await writeAuditLog(req, { action: 'admin.create', status: 'failure', message: 'Missing required fields', metadata: { email } });
      return res.status(400).json({ message: 'Email, password, first name, and last name are required' });
    }

    if (password.length < 6) {
      await writeAuditLog(req, { action: 'admin.create', status: 'failure', message: 'Password too short', metadata: { email } });
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      await writeAuditLog(req, { action: 'admin.create', status: 'failure', message: 'Admin already exists', metadata: { email } });
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const admin = new Admin({ email, password, firstName, lastName, role: role || 'admin', permissions: permissions || ['approve_clients', 'view_reports'] });
    await admin.save();

    await writeAuditLog(req, { action: 'admin.create', status: 'success', target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` }, metadata: { createdRole: admin.role } });

    const adminData = { id: admin._id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName, role: admin.role, permissions: admin.permissions, isActive: admin.isActive, createdAt: admin.createdAt };

    res.status(201).json({ message: 'Admin created successfully', admin: adminData });
  } catch (error) {
    console.error('Admin registration error:', error);
    await writeAuditLog(req, { action: 'admin.create', status: 'failure', message: 'Server error during create', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Login admin
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      await writeAuditLog(req, { action: 'admin.login', status: 'failure', message: 'Missing credentials', metadata: { email } });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      await writeAuditLog(req, { action: 'admin.login', status: 'failure', message: 'Invalid credentials (no account)', metadata: { email } });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.isLocked()) {
      await writeAuditLog(req, { action: 'admin.login', status: 'failure', message: 'Account locked', target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` } });
      return res.status(423).json({ message: 'Account is temporarily locked due to too many failed login attempts' });
    }

    if (!admin.isActive) {
      await writeAuditLog(req, { action: 'admin.login', status: 'failure', message: 'Account deactivated', target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` } });
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      await admin.incLoginAttempts();
      await writeAuditLog(req, { action: 'admin.login', status: 'failure', message: 'Invalid credentials (bad password)', target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` } });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await admin.resetLoginAttempts();

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role, permissions: admin.permissions }, process.env.JWT_SECRET, { expiresIn: '24h' });

    await writeAuditLog(req, { action: 'admin.login', status: 'success', target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` } });

    const adminData = { id: admin._id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName, role: admin.role, permissions: admin.permissions, isActive: admin.isActive, lastLogin: admin.lastLogin };

    res.json({ message: 'Login successful', token, admin: adminData });
  } catch (error) {
    console.error('Admin login error:', error);
    await writeAuditLog(req, { action: 'admin.login', status: 'failure', message: 'Server error during login', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Get profile
async function getProfile(req, res) {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    await writeAuditLog(req, { action: 'admin.profile.read', status: 'success', target: { type: 'admin', id: req.admin._id, summary: `admin: ${req.admin.email}` } });
    res.json({ admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    await writeAuditLog(req, { action: 'admin.profile.read', status: 'failure', message: 'Server error during profile read', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Update profile
async function updateProfile(req, res) {
  try {
    const { firstName, lastName, email } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) {
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase(), _id: { $ne: req.admin._id } });
      if (existingAdmin) {
        await writeAuditLog(req, { action: 'admin.profile.update', status: 'failure', message: 'Email already in use', metadata: { attemptEmail: email } });
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = email.toLowerCase();
    }

    const admin = await Admin.findByIdAndUpdate(req.admin._id, updates, { new: true, runValidators: true }).select('-password');

    await writeAuditLog(req, { action: 'admin.profile.update', status: 'success', target: { type: 'admin', id: req.admin._id, summary: `admin: ${admin.email}` } });

    res.json({ message: 'Profile updated successfully', admin });
  } catch (error) {
    console.error('Update admin profile error:', error);
    await writeAuditLog(req, { action: 'admin.profile.update', status: 'failure', message: 'Server error during profile update', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Change password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      await writeAuditLog(req, { action: 'admin.change_password', status: 'failure', message: 'Missing fields' });
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      await writeAuditLog(req, { action: 'admin.change_password', status: 'failure', message: 'New password too short' });
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(req.admin._id);
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      await writeAuditLog(req, { action: 'admin.change_password', status: 'failure', message: 'Current password incorrect' });
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    await writeAuditLog(req, { action: 'admin.change_password', status: 'success', target: { type: 'admin', id: req.admin._id, summary: `admin: ${admin.email}` } });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    await writeAuditLog(req, { action: 'admin.change_password', status: 'failure', message: 'Server error during change password', metadata: { error: error?.message } });
    res.status(500).json({ message: 'Server error' });
  }
}

// Logout
async function logout(req, res) {
  await writeAuditLog(req, { action: 'admin.logout', status: 'success', target: { type: 'admin', id: req.admin._id, summary: `admin: ${req.admin.email}` } });
  res.json({ message: 'Logout successful' });
}

// Forgot Password - Send OTP
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const otpRecord = new OTP({
      email: email.toLowerCase(),
      otp,
      userType: admin.role,
      userId: admin._id,
      type: 'password_reset'
    });

    await otpRecord.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, admin.role, admin.firstName);

    if (!emailSent) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    await writeAuditLog(req, {
      action: 'admin.forgot_password',
      status: 'success',
      target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` }
    });

    res.json({ 
      message: 'OTP sent successfully to your email',
      email: email.toLowerCase(), // Return masked email for verification
      otp: otp // For testing purposes - remove in production
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    await writeAuditLog(req, {
      action: 'admin.forgot_password',
      status: 'failure',
      message: 'Server error during forgot password',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
}

// Verify OTP
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'password_reset',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get user details
    let user;
    if (otpRecord.userType === 'admin' || otpRecord.userType === 'manager') {
      user = await Admin.findById(otpRecord.userId);
    } else if (otpRecord.userType === 'client') {
      user = await Client.findById(otpRecord.userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await writeAuditLog(req, {
      action: 'admin.verify_otp',
      status: 'success',
      target: { type: 'admin', id: user._id, summary: `admin: ${user.email}` }
    });

    res.json({
      message: 'OTP verified successfully',
      userType: otpRecord.userType,
      email: user.email,
      name: user.firstName || user.fullName
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    await writeAuditLog(req, {
      action: 'admin.verify_otp',
      status: 'failure',
      message: 'Server error during OTP verification',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
}

// Reset Password
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'password_reset',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user password
    let user;
    if (otpRecord.userType === 'admin' || otpRecord.userType === 'manager') {
      user = await Admin.findById(otpRecord.userId);
      if (!user) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      user.password = newPassword;
      await user.save();
    } else if (otpRecord.userType === 'client') {
      user = await Client.findById(otpRecord.userId);
      if (!user) {
        return res.status(404).json({ message: 'Client not found' });
      }
      user.password = newPassword;
      await user.save();
    }

    // Mark OTP as used
    await otpRecord.markAsUsed();

    await writeAuditLog(req, {
      action: 'admin.reset_password',
      status: 'success',
      target: { type: 'admin', id: user._id, summary: `admin: ${user.email}` }
    });

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    await writeAuditLog(req, {
      action: 'admin.reset_password',
      status: 'failure',
      message: 'Server error during password reset',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
}

// ============================================================================
// ADMIN DASHBOARD - CLIENT MANAGEMENT
// ============================================================================

// Get all clients with filtering and pagination
async function getAllClients(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search, 
      investmentPlan,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (investmentPlan) query.investmentPlan = investmentPlan;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    const [clients, total] = await Promise.all([
      Client.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password')
        .lean(),
      Client.countDocuments(query)
    ]);

    res.json({
      clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get client details
async function getClientDetails(req, res) {
  try {
    const { clientId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: 'Invalid client ID format' });
    }
    
    const client = await Client.findById(clientId).select('-password');
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Get transaction summary
    const Transaction = require('../models/Transaction');
    let balance = { totalDeposits: 0, totalWithdrawals: 0, totalInterest: 0, totalFees: 0, currentBalance: 0 };
    try {
      balance = await Transaction.getClientBalance(clientId);
    } catch (balanceError) {
      console.error('Error fetching client balance:', balanceError);
      // Continue with default balance values
    }

    // Get recent transactions
    let recentTransactions = [];
    try {
      recentTransactions = await Transaction.find({ client: clientId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    } catch (transactionError) {
      console.error('Error fetching client transactions:', transactionError);
      // Continue with empty transactions array
    }

    res.json({
      client,
      balance,
      recentTransactions
    });
  } catch (error) {
    console.error('Get client details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update client status
async function updateClientStatus(req, res) {
  try {
    const { clientId } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'approved', 'declined', 'suspended', 'active'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const previousStatus = client.status;
    client.status = status;
    if (notes) client.approvalNotes = notes;
    client.approvedBy = req.admin._id;
    client.approvedAt = new Date();

    if (status === 'approved' && previousStatus !== 'approved') {
      client.startDate = new Date();
      client.maturityDate = client.calculateMaturityDate();
      client.kycStatus = 'verified';
    }

    await client.save();

    await writeAuditLog(req, {
      action: 'admin.client.status_update',
      status: 'success',
      target: { type: 'client', id: clientId, summary: `client: ${client.email}` },
      metadata: { previousStatus, newStatus: status, notes }
    });

    res.json({ message: 'Client status updated successfully', client });
  } catch (error) {
    console.error('Update client status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update client details
async function updateClient(req, res) {
  try {
    const { clientId } = req.params;
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      status, 
      investmentPlan, 
      address 
    } = req.body;

    // Validate email if changing
    if (email) {
      const existingClient = await Client.findOne({ 
        email, 
        _id: { $ne: clientId } 
      });
      
      if (existingClient) {
        return res.status(400).json({ 
          message: 'Email is already in use by another client' 
        });
      }
    }

    // Check if client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update client data
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (status && ['pending', 'approved', 'declined', 'suspended', 'active'].includes(status)) {
      updates.status = status;
    }
    if (investmentPlan && ['8%_compounded', '6%_simple', '12%_futures', '14%_futures'].includes(investmentPlan)) {
      updates.investmentPlan = investmentPlan;
    }
    if (address && typeof address === 'object') {
      updates.address = {};
      if (address.street) updates.address.street = address.street;
      if (address.city) updates.address.city = address.city;
      if (address.state) updates.address.state = address.state;
      if (address.zipCode) updates.address.zipCode = address.zipCode;
      if (address.country) updates.address.country = address.country;
    }

    // Update client record
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    await writeAuditLog(req, {
      action: 'admin.client.update',
      status: 'success',
      target: { type: 'client', id: clientId, summary: `client: ${client.email}` },
      metadata: { updates: Object.keys(updates) }
    });

    res.json({ 
      message: 'Client updated successfully', 
      client: updatedClient 
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete client
async function deleteClient(req, res) {
  try {
    const { clientId } = req.params;
    
    // Check if client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Store client email for audit log
    const clientEmail = client.email;
    
    // Delete client's transactions
    await Transaction.deleteMany({ client: clientId });
    
    // Delete the client
    await Client.findByIdAndDelete(clientId);
    
    await writeAuditLog(req, {
      action: 'admin.client.delete',
      status: 'success',
      target: { type: 'client', id: clientId, summary: `client: ${clientEmail}` },
      metadata: { clientDeleted: true }
    });
    
    res.json({ 
      message: 'Client and all associated data deleted successfully' 
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ============================================================================
// ADMIN DASHBOARD - DOCUMENT MANAGEMENT
// ============================================================================

// Get client documents
async function getClientDocuments(req, res) {
  try {
    const { clientId } = req.params;
    
    const client = await Client.findById(clientId).select('documents firstName lastName email');
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({
      client: {
        id: client._id,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email
      },
      documents: client.documents
    });
  } catch (error) {
    console.error('Get client documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ============================================================================
// ADMIN DASHBOARD - FINANCIAL REPORTS & ANALYTICS
// ============================================================================

// Get dashboard overview
async function getDashboardOverview(req, res) {
  try {
    const { period = '30days' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const Client = require('../models/Client');
    const Transaction = require('../models/Transaction');

    // Get client counts
    const [totalClients, activeClients, pendingClients] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: { $in: ['approved', 'active'] } }),
      Client.countDocuments({ status: 'pending' })
    ]);

    // Get transaction summary
    const transactionStats = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalDeposits: {
            $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0] }
          },
          totalWithdrawals: {
            $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0] }
          },
          totalInterest: {
            $sum: { $cond: [{ $eq: ['$type', 'interest_payment'] }, '$amount', 0] }
          },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    // Get investment plan distribution
    const planDistribution = await Client.aggregate([
      { $match: { status: { $in: ['approved', 'active'] } } },
      {
        $group: {
          _id: '$investmentPlan',
          count: { $sum: 1 },
          totalInvested: { $sum: '$initialInvestment' }
        }
      }
    ]);

    const stats = transactionStats[0] || {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalInterest: 0,
      transactionCount: 0
    };

    res.json({
      period,
      overview: {
        totalClients,
        activeClients,
        pendingClients,
        totalDeposits: stats.totalDeposits,
        totalWithdrawals: stats.totalWithdrawals,
        totalInterest: stats.totalInterest,
        transactionCount: stats.transactionCount
      },
      planDistribution
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get financial reports
async function getFinancialReports(req, res) {
  try {
    const { startDate, endDate, reportType = 'monthly' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
    const end = endDate ? new Date(endDate) : new Date();

    const Transaction = require('../models/Transaction');

    let groupBy;
    let dateFormat;
    
    switch (reportType) {
      case 'daily':
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'weekly':
        groupBy = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } };
        dateFormat = 'YYYY-WW';
        break;
      case 'monthly':
      default:
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        dateFormat = 'YYYY-MM';
        break;
    }

    const report = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: groupBy,
          deposits: {
            $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0] }
          },
          withdrawals: {
            $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0] }
          },
          interest: {
            $sum: { $cond: [{ $eq: ['$type', 'interest_payment'] }, '$amount', 0] }
          },
          fees: {
            $sum: { $cond: [{ $eq: ['$type', 'fee'] }, '$amount', 0] }
          },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      reportType,
      dateFormat,
      startDate: start,
      endDate: end,
      data: report
    });
  } catch (error) {
    console.error('Get financial reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ============================================================================
// ADMIN DASHBOARD - REFERRAL MANAGEMENT
// ============================================================================

// Get referral analytics
async function getReferralAnalytics(req, res) {
  try {
    const Client = require('../models/Client');

    const referralStats = await Client.aggregate([
      {
        $match: {
          referredBy: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$referredBy',
          referralCount: { $sum: 1 },
          activeReferrals: {
            $sum: { $cond: [{ $in: ['$status', ['approved', 'active']] }, 1, 0] }
          },
          totalInvested: { $sum: '$initialInvestment' }
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'referrer'
        }
      },
      {
        $unwind: '$referrer'
      },
      {
        $project: {
          referrerName: { $concat: ['$referrer.firstName', ' ', '$referrer.lastName'] },
          referrerEmail: '$referrer.email',
          referralCount: 1,
          activeReferrals: 1,
          totalInvested: 1
        }
      },
      { $sort: { referralCount: -1 } }
    ]);

    const totalReferrals = await Client.countDocuments({ referredBy: { $exists: true, $ne: null } });
    const activeReferrals = await Client.countDocuments({ 
      referredBy: { $exists: true, $ne: null },
      status: { $in: ['approved', 'active'] }
    });

    res.json({
      totalReferrals,
      activeReferrals,
      referralStats
    });
  } catch (error) {
    console.error('Get referral analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ============================================================================
// ADMIN DASHBOARD - SYSTEM MONITORING
// ============================================================================

// Get system health
async function getSystemHealth(req, res) {
  try {
    const Client = require('../models/Client');
    const Transaction = require('../models/Transaction');
    const AuditLog = require('../models/AuditLog');

    // Get recent activity
    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('actor', 'firstName lastName email')
      .lean();

    // Get pending actions
    const pendingActions = {
      pendingApprovals: await Client.countDocuments({ status: 'pending' }),
      pendingTransactions: await Transaction.countDocuments({ status: 'pending' })
    };

    // Get system stats
    const systemStats = {
      totalClients: await Client.countDocuments(),
      totalTransactions: await Transaction.countDocuments(),
      totalAuditLogs: await AuditLog.countDocuments()
    };

    res.json({
      systemStats,
      pendingActions,
      recentActivity
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  register,
  registerFirstAdmin,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllClients,
  getClientDetails,
  updateClientStatus,
  updateClient,
  deleteClient,
  getClientDocuments,
  getDashboardOverview,
  getFinancialReports,
  getReferralAnalytics,
  getSystemHealth,
}; 