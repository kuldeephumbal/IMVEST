const Message = require('../models/Message');
const Client = require('../models/Client');
const Admin = require('../models/Admin');
const { writeAuditLog } = require('../utils/auditLogger');

// ============================================================================
// MESSAGE MANAGEMENT
// ============================================================================

// Send message (admin to client or client to admin)
async function sendMessage(req, res) {
  try {
    const { recipientId, subject, content, type = 'personal', priority = 'normal', replyTo } = req.body;
    
    if (!recipientId || !subject || !content) {
      return res.status(400).json({ message: 'Recipient, subject, and content are required' });
    }

    // Determine sender info
    const senderId = req.admin?._id || req.client?._id;
    const senderModel = req.admin ? 'Admin' : 'Client';
    
    if (!senderId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify recipient exists
    let recipientModel;
    let recipient = await Client.findById(recipientId);
    if (recipient) {
      recipientModel = 'Client';
    } else {
      recipient = await Admin.findById(recipientId);
      if (recipient) {
        recipientModel = 'Admin';
      } else {
        return res.status(404).json({ message: 'Recipient not found' });
      }
    }

    // Create message
    const messageData = {
      sender: senderId,
      senderModel,
      recipient: recipientId,
      recipientModel,
      subject,
      content,
      type,
      priority
    };

    // Handle reply
    if (replyTo) {
      const originalMessage = await Message.findById(replyTo);
      if (originalMessage) {
        messageData.replyTo = replyTo;
        messageData.threadId = originalMessage.threadId || replyTo;
      }
    }

    const message = new Message(messageData);
    await message.save();

    await writeAuditLog(req, {
      action: 'message.send',
      status: 'success',
      target: { type: 'message', id: message._id, summary: `message: ${subject}` },
      metadata: { recipientId, type, priority }
    });

    res.status(201).json({ 
      message: 'Message sent successfully', 
      messageId: message._id 
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get messages for current user
async function getMessages(req, res) {
  try {
    const { page = 1, limit = 20, type, status, unreadOnly = false } = req.query;
    
    const userId = req.admin?._id || req.client?._id;
    const userModel = req.admin ? 'Admin' : 'Client';
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const query = {
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    };

    if (type) query.type = type;
    if (status) query.status = status;
    if (unreadOnly === 'true') {
      query.status = { $in: ['sent', 'delivered'] };
      query.recipient = userId;
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sender', 'firstName lastName email')
        .populate('recipient', 'firstName lastName email')
        .lean(),
      Message.countDocuments(query)
    ]);

    // Mark messages as read if user is recipient
    const unreadMessages = messages.filter(m => 
      m.recipient._id.toString() === userId.toString() && 
      ['sent', 'delivered'].includes(m.status)
    );

    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map(msg => 
          Message.findByIdAndUpdate(msg._id, {
            status: 'read',
            readAt: new Date(),
            readBy: userId,
            readByModel: userModel
          })
        )
      );
    }

    res.json({
      messages: messages.map(m => ({
        ...m,
        isSender: m.sender._id.toString() === userId.toString()
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get conversation thread
async function getConversation(req, res) {
  try {
    const { threadId } = req.params;
    const userId = req.admin?._id || req.client?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const messages = await Message.getConversation(threadId, userId);
    
    res.json({ messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Mark message as read
async function markAsRead(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.admin?._id || req.client?._id;
    const userModel = req.admin ? 'Admin' : 'Client';
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    await message.markAsRead(userId, userModel);

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get unread count
async function getUnreadCount(req, res) {
  try {
    const userId = req.admin?._id || req.client?._id;
    const userModel = req.admin ? 'Admin' : 'Client';
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const count = await Message.getUnreadCount(userId, userModel);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// ============================================================================
// ADMIN-ONLY FUNCTIONS
// ============================================================================

// Send mass message to multiple clients
async function sendMassMessage(req, res) {
  try {
    const { clientIds, subject, content, type = 'announcement', priority = 'normal' } = req.body;
    
    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return res.status(400).json({ message: 'Client IDs array is required' });
    }

    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    const senderId = req.admin._id;
    const messages = [];

    for (const clientId of clientIds) {
      const client = await Client.findById(clientId);
      if (client) {
        const message = new Message({
          sender: senderId,
          senderModel: 'Admin',
          recipient: clientId,
          recipientModel: 'Client',
          subject,
          content,
          type,
          priority
        });
        messages.push(message);
      }
    }

    await Message.insertMany(messages);

    await writeAuditLog(req, {
      action: 'message.mass_send',
      status: 'success',
      target: { type: 'message', summary: `mass message: ${subject}` },
      metadata: { recipientCount: messages.length, type, priority }
    });

    res.json({ 
      message: `Mass message sent to ${messages.length} clients`,
      sentCount: messages.length
    });
  } catch (error) {
    console.error('Send mass message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all messages (admin only)
async function getAllMessages(req, res) {
  try {
    const { page = 1, limit = 20, type, status, senderType, recipientType } = req.query;
    
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (senderType) query.senderModel = senderType;
    if (recipientType) query.recipientModel = recipientType;

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sender', 'firstName lastName email')
        .populate('recipient', 'firstName lastName email')
        .lean(),
      Message.countDocuments(query)
    ]);

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete message (admin only)
async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Message.findByIdAndDelete(messageId);

    await writeAuditLog(req, {
      action: 'message.delete',
      status: 'success',
      target: { type: 'message', id: messageId, summary: `message: ${message.subject}` }
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  sendMessage,
  getMessages,
  getConversation,
  markAsRead,
  getUnreadCount,
  sendMassMessage,
  getAllMessages,
  deleteMessage
}; 