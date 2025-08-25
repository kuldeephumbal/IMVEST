const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'admin.login', 'admin.create', 'admin.update', 'admin.change_password', 'admin.logout'
  status: { type: String, enum: ['success', 'failure'], required: true },

  actor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    email: { type: String },
    role: { type: String },
  },

  target: {
    type: { type: String }, // e.g., 'admin'
    id: { type: mongoose.Schema.Types.ObjectId },
    summary: { type: String }, // e.g., 'admin: email@example.com'
  },

  ip: { type: String },
  userAgent: { type: String },
  requestId: { type: String },

  message: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }, // keep light; avoid sensitive data
  
  // Additional audit fields
  userRole: { type: String, default: 'anonymous' },
  apiType: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'UNKNOWN'] },
  apiStatus: { type: String, enum: ['success', 'failure'] },
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Indexes for faster filtering
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ 'actor.id': 1, createdAt: -1 });
auditLogSchema.index({ 'actor.email': 1, createdAt: -1 });
auditLogSchema.index({ status: 1, createdAt: -1 });
auditLogSchema.index({ 'target.id': 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema); 