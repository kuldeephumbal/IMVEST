const express = require('express');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Admin Registration (secured by permission: user_management)
router.post('/register', adminAuth, requirePermission('user_management'), adminController.register);

// Admin Login
router.post('/login', adminController.login);

// Get current admin profile
router.get('/profile', adminAuth, adminController.getProfile);

// Update admin profile
router.put('/profile', adminAuth, adminController.updateProfile);

// Change password
router.put('/change-password', adminAuth, adminController.changePassword);

// Logout (client-side token removal)
router.post('/logout', adminAuth, adminController.logout);

// ============================================================================
// PASSWORD RESET FLOW
// ============================================================================

// Forgot Password - Send OTP
router.post('/forgot-password', adminController.forgotPassword);

// Verify OTP
router.post('/verify-otp', adminController.verifyOTP);

// Reset Password
router.post('/reset-password', adminController.resetPassword);

module.exports = router; 