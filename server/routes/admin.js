const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { adminAuth, requirePermission, requireSuperAdmin } = require('../middleware/adminAuth');
const { writeAuditLog } = require('../utils/auditLogger');
const router = express.Router();

// Admin Registration (secured by permission: user_management)
router.post('/register', adminAuth, requirePermission('user_management'), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      await writeAuditLog(req, {
        action: 'admin.create',
        status: 'failure',
        message: 'Missing required fields',
        metadata: { email }
      });
      return res.status(400).json({ 
        message: 'Email, password, first name, and last name are required' 
      });
    }

    if (password.length < 6) {
      await writeAuditLog(req, {
        action: 'admin.create',
        status: 'failure',
        message: 'Password too short',
        metadata: { email }
      });
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      await writeAuditLog(req, {
        action: 'admin.create',
        status: 'failure',
        message: 'Admin already exists',
        metadata: { email }
      });
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create new admin
    const admin = new Admin({
      email,
      password,
      firstName,
      lastName,
      role: role || 'admin',
      permissions: permissions || ['approve_clients', 'view_reports']
    });

    await admin.save();

    await writeAuditLog(req, {
      action: 'admin.create',
      status: 'success',
      target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` },
      metadata: { createdRole: admin.role }
    });

    // Return admin data without password
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
      message: 'Admin created successfully',
      admin: adminData
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    await writeAuditLog(req, {
      action: 'admin.create',
      status: 'failure',
      message: 'Server error during create',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      await writeAuditLog(req, {
        action: 'admin.login',
        status: 'failure',
        message: 'Missing credentials',
        metadata: { email }
      });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      await writeAuditLog(req, {
        action: 'admin.login',
        status: 'failure',
        message: 'Invalid credentials (no account)',
        metadata: { email }
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      await writeAuditLog(req, {
        action: 'admin.login',
        status: 'failure',
        message: 'Account locked',
        target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` }
      });
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to too many failed login attempts' 
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      await writeAuditLog(req, {
        action: 'admin.login',
        status: 'failure',
        message: 'Account deactivated',
        target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` }
      });
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();
      await writeAuditLog(req, {
        action: 'admin.login',
        status: 'failure',
        message: 'Invalid credentials (bad password)',
        target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` }
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await writeAuditLog(req, {
      action: 'admin.login',
      status: 'success',
      target: { type: 'admin', id: admin._id, summary: `admin: ${admin.email}` }
    });

    // Return admin data without password
    const adminData = {
      id: admin._id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin
    };

    res.json({
      message: 'Login successful',
      token,
      admin: adminData
    });

  } catch (error) {
    console.error('Admin login error:', error);
    await writeAuditLog(req, {
      action: 'admin.login',
      status: 'failure',
      message: 'Server error during login',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin profile
router.get('/profile', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    await writeAuditLog(req, {
      action: 'admin.profile.read',
      status: 'success',
      target: { type: 'admin', id: req.admin._id, summary: `admin: ${req.admin.email}` }
    });
    res.json({ admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    await writeAuditLog(req, {
      action: 'admin.profile.read',
      status: 'failure',
      message: 'Server error during profile read',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin profile
router.put('/profile', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) {
      // Check if email is already taken by another admin
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: req.admin._id } 
      });
      if (existingAdmin) {
        await writeAuditLog(req, {
          action: 'admin.profile.update',
          status: 'failure',
          message: 'Email already in use',
          metadata: { attemptEmail: email }
        });
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = email.toLowerCase();
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    await writeAuditLog(req, {
      action: 'admin.profile.update',
      status: 'success',
      target: { type: 'admin', id: req.admin._id, summary: `admin: ${admin.email}` }
    });

    res.json({
      message: 'Profile updated successfully',
      admin
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    await writeAuditLog(req, {
      action: 'admin.profile.update',
      status: 'failure',
      message: 'Server error during profile update',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      await writeAuditLog(req, {
        action: 'admin.change_password',
        status: 'failure',
        message: 'Missing fields'
      });
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      await writeAuditLog(req, {
        action: 'admin.change_password',
        status: 'failure',
        message: 'New password too short'
      });
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Verify current password
    const admin = await Admin.findById(req.admin._id);
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      await writeAuditLog(req, {
        action: 'admin.change_password',
        status: 'failure',
        message: 'Current password incorrect'
      });
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    await writeAuditLog(req, {
      action: 'admin.change_password',
      status: 'success',
      target: { type: 'admin', id: req.admin._id, summary: `admin: ${admin.email}` }
    });

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    await writeAuditLog(req, {
      action: 'admin.change_password',
      status: 'failure',
      message: 'Server error during change password',
      metadata: { error: error?.message }
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (client-side token removal)
router.post('/logout', adminAuth, async (req, res) => {
  await writeAuditLog(req, {
    action: 'admin.logout',
    status: 'success',
    target: { type: 'admin', id: req.admin._id, summary: `admin: ${req.admin.email}` }
  });
  res.json({ message: 'Logout successful' });
});

module.exports = router; 