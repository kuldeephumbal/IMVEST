const express = require('express');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

// List audit logs with basic filters and pagination
router.get('/', 
  adminAuth, 
  requirePermission('view_reports'),
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        action,
        status,
        actorEmail,
        from, // ISO date
        to,   // ISO date
      } = req.query;

      const filters = {};
      if (action) filters.action = action;
      if (status) filters.status = status;
      if (actorEmail) filters['actor.email'] = actorEmail;

      if (from || to) {
        filters.createdAt = {};
        if (from) filters.createdAt.$gte = new Date(from);
        if (to) filters.createdAt.$lte = new Date(to);
      }

      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);

      const [items, total] = await Promise.all([
        AuditLog.find(filters)
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize)
          .lean(),
        AuditLog.countDocuments(filters),
      ]);

      res.json({
        page: pageNum,
        limit: pageSize,
        total,
        items,
      });
    } catch (error) {
      console.error('List audit logs error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get single audit log by id
router.get('/:id', 
  adminAuth, 
  requirePermission('view_reports'),
  async (req, res) => {
    try {
      const item = await AuditLog.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (error) {
      console.error('Get audit log error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router; 