const express = require('express');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

// Create transaction
router.post('/', adminAuth, requirePermission('manage_investments'), transactionController.create);

// List transactions (admin)
router.get('/', adminAuth, requirePermission('view_reports'), transactionController.list);

// List transactions for a client
router.get('/client/:clientId', adminAuth, requirePermission('view_reports'), transactionController.listForClient);

// Get client balance
router.get('/client/:clientId/balance', adminAuth, requirePermission('view_reports'), transactionController.getBalance);

module.exports = router; 