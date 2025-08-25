const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
require('dotenv').config();

const clientAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.clientId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const client = await Client.findById(decoded.clientId);
    if (!client) {
      return res.status(401).json({ message: 'Client not found' });
    }

    req.client = client;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { clientAuth }; 