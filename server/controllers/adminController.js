const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Client = require('../models/Client');
const OTP = require('../models/OTP');
const { writeAuditLog } = require('../utils/auditLogger');
const { sendOTPEmail, generateOTP } = require('../utils/emailService');

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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
}; 