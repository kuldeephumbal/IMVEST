const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require("dotenv").config();

// Verify admin token
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is an admin
    if (decoded.role !== 'admin' && decoded.role !== 'manager' && decoded.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin account not found or inactive' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Check specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.admin.permissions.includes(permission)) {
      return res.status(403).json({ 
        message: `Access denied. Permission '${permission}' required.` 
      });
    }

    next();
  };
};

// Check if admin is super admin
const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ message: 'Super admin privileges required' });
  }

  next();
};

module.exports = {
  adminAuth,
  requirePermission,
  requireSuperAdmin
}; 