const { randomUUID } = require('crypto');

const requestContext = (req, res, next) => {
  // Basic request metadata for audit logs
  req.context = {
    requestId: req.headers['x-request-id'] || randomUUID(),
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress,
    userAgent: req.headers['user-agent'] || '',
  };

  // Expose request-id to clients
  res.setHeader('x-request-id', req.context.requestId);

  next();
};

module.exports = requestContext; 