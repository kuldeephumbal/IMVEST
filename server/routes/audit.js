const express = require('express');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const auditController = require('../controllers/auditController');
const router = express.Router();

// List audit logs with basic filters and pagination
router.get('/', adminAuth, requirePermission('view_reports'), auditController.list);

// Get single audit log by id
router.get('/:id', adminAuth, requirePermission('view_reports'), auditController.getById);

module.exports = router; 