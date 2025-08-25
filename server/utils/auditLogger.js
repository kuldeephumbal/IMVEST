const AuditLog = require('../models/AuditLog');

/**
 * Write an audit log entry. Never include secrets or raw passwords in metadata or message.
 * @param {object} req - Express request (used for context and actor)
 * @param {object} options
 * @param {string} options.action - e.g. 'admin.login', 'admin.create'
 * @param {('success'|'failure')} options.status
 * @param {string} [options.message]
 * @param {object} [options.target] - { type, id, summary }
 * @param {object} [options.metadata] - lightweight, non-sensitive structured data
 * @param {object} [options.actorOverride] - { id, email, role }
 */
async function writeAuditLog(req, { action, status, message, target, metadata, actorOverride }) {
  try {
    const actorFromReq = req?.admin ? {
      id: req.admin._id,
      email: req.admin.email,
      role: req.admin.role,
    } : undefined;

    const actor = actorOverride || actorFromReq || undefined;

    const context = req?.context || {};

    await AuditLog.create({
      action,
      status,
      actor,
      target,
      ip: context.ip,
      userAgent: context.userAgent,
      requestId: context.requestId,
      message,
      metadata,
      // Additional audit fields
      userRole: actor?.role || 'anonymous',
      apiType: req?.method || 'UNKNOWN',
      apiStatus: status,
      timestamp: new Date(),
      requestId: context.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  } catch (err) {
    // Do not throw; avoid breaking request flow due to logging errors
    console.error('Audit log write failed:', err?.message || err);
  }
}

module.exports = {
  writeAuditLog,
}; 