const express = require('express');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const router = express.Router();

// First Super Admin Registration (no auth required - only works if no admins exist)
router.post('/register/first-admin', adminController.registerFirstAdmin);

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

// ============================================================================
// ADMIN DASHBOARD - CLIENT MANAGEMENT
// ============================================================================

// Get all clients with filtering and pagination
router.get('/clients', adminAuth, requirePermission('view_reports'), adminController.getAllClients);

// Get client details
router.get('/clients/:clientId', adminAuth, requirePermission('view_reports'), adminController.getClientDetails);

// Update client status
router.put('/clients/:clientId/status', adminAuth, requirePermission('approve_clients'), adminController.updateClientStatus);

// Update client details
router.put('/clients/:clientId', adminAuth, requirePermission('approve_clients'), adminController.updateClient);

// Delete client
router.delete('/clients/:clientId', adminAuth, requirePermission('approve_clients'), adminController.deleteClient);

// ============================================================================
// ADMIN DASHBOARD - DOCUMENT MANAGEMENT
// ============================================================================

// Get client documents
router.get('/clients/:clientId/documents', adminAuth, requirePermission('view_reports'), adminController.getClientDocuments);

// ============================================================================
// ADMIN DASHBOARD - FINANCIAL REPORTS & ANALYTICS
// ============================================================================

// Get dashboard overview
router.get('/dashboard/overview', adminAuth, requirePermission('view_reports'), adminController.getDashboardOverview);

// Get financial reports
router.get('/dashboard/financial-reports', adminAuth, requirePermission('view_reports'), adminController.getFinancialReports);

// ============================================================================
// ADMIN DASHBOARD - REFERRAL MANAGEMENT
// ============================================================================

// Get referral analytics
router.get('/dashboard/referral-analytics', adminAuth, requirePermission('view_reports'), adminController.getReferralAnalytics);

// ============================================================================
// ADMIN DASHBOARD - SYSTEM MONITORING
// ============================================================================

// Get system health
router.get('/dashboard/system-health', adminAuth, requirePermission('view_reports'), adminController.getSystemHealth);

module.exports = router; 