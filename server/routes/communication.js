const express = require('express');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const { clientAuth } = require('../middleware/clientAuth');
const communicationController = require('../controllers/communicationController');
const router = express.Router();

// ============================================================================
// CLIENT MESSAGE ROUTES
// ============================================================================

// Get messages for client
router.get('/messages', clientAuth, communicationController.getMessages);

// Get conversation thread
router.get('/messages/conversation/:threadId', clientAuth, communicationController.getConversation);

// Send message (client to admin)
router.post('/messages', clientAuth, communicationController.sendMessage);

// Mark message as read
router.put('/messages/:messageId/read', clientAuth, communicationController.markAsRead);

// Get unread count
router.get('/messages/unread-count', clientAuth, communicationController.getUnreadCount);

// ============================================================================
// ADMIN MESSAGE ROUTES
// ============================================================================

// Get all messages (admin)
router.get('/admin/messages', adminAuth, requirePermission('view_reports'), communicationController.getAllMessages);

// Send message (admin to client)
router.post('/admin/messages', adminAuth, requirePermission('manage_clients'), communicationController.sendMessage);

// Send mass message to multiple clients
router.post('/admin/messages/mass', adminAuth, requirePermission('manage_clients'), communicationController.sendMassMessage);

// Get conversation thread (admin)
router.get('/admin/messages/conversation/:threadId', adminAuth, requirePermission('view_reports'), communicationController.getConversation);

// Mark message as read (admin)
router.put('/admin/messages/:messageId/read', adminAuth, requirePermission('view_reports'), communicationController.markAsRead);

// Get unread count (admin)
router.get('/admin/messages/unread-count', adminAuth, requirePermission('view_reports'), communicationController.getUnreadCount);

// Delete message (admin only)
router.delete('/admin/messages/:messageId', adminAuth, requirePermission('manage_clients'), communicationController.deleteMessage);

module.exports = router; 