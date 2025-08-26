const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Message Details
  subject: {
    type: String,
    required: true,
    trim: true
  },
  
  content: {
    type: String,
    required: true
  },
  
  // Sender and Recipient
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true
  },
  
  senderModel: {
    type: String,
    required: true,
    enum: ['Admin', 'Client']
  },
  
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: true
  },
  
  recipientModel: {
    type: String,
    required: true,
    enum: ['Admin', 'Client']
  },
  
  // Message Type
  type: {
    type: String,
    enum: ['support', 'notification', 'announcement', 'personal'],
    default: 'personal'
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'archived'],
    default: 'sent'
  },
  
  // Read Status
  readAt: {
    type: Date
  },
  
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'readByModel'
  },
  
  readByModel: {
    type: String,
    enum: ['Admin', 'Client']
  },
  
  // Attachments
  attachments: [{
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    mimeType: { type: String }
  }],
  
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Thread ID for grouping related messages
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Metadata
  metadata: {
    // For notifications
    notificationType: {
      type: String,
      enum: ['account_approved', 'transaction_completed', 'document_uploaded', 'system_alert', 'other']
    },
    
    // For support tickets
    ticketId: String,
    
    // For announcements
    announcementType: {
      type: String,
      enum: ['general', 'maintenance', 'update', 'security']
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ threadId: 1 });
messageSchema.index({ createdAt: -1 });

// Method to mark message as read
messageSchema.methods.markAsRead = function(userId, userModel) {
  this.status = 'read';
  this.readAt = new Date();
  this.readBy = userId;
  this.readByModel = userModel;
  return this.save();
};

// Method to get message summary
messageSchema.methods.getSummary = function() {
  return {
    id: this._id,
    subject: this.subject,
    content: this.content,
    type: this.type,
    priority: this.priority,
    status: this.status,
    createdAt: this.createdAt,
    readAt: this.readAt,
    hasAttachments: this.attachments && this.attachments.length > 0
  };
};

// Static method to get unread count for a user
messageSchema.statics.getUnreadCount = async function(userId, userModel) {
  return this.countDocuments({
    recipient: userId,
    status: { $in: ['sent', 'delivered'] }
  });
};

// Static method to get conversation thread
messageSchema.statics.getConversation = async function(threadId, userId, userModel) {
  return this.find({
    $or: [
      { threadId: threadId },
      { _id: threadId }
    ],
    $or: [
      { sender: userId },
      { recipient: userId }
    ]
  })
  .sort({ createdAt: 1 })
  .populate('sender', 'firstName lastName email')
  .populate('recipient', 'firstName lastName email')
  .lean();
};

module.exports = mongoose.model('Message', messageSchema); 