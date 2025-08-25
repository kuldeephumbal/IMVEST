const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { adminAuth, requirePermission } = require('../middleware/adminAuth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

// Controllers and client auth
const clientController = require('../controllers/clientController');
const { clientAuth } = require('../middleware/clientAuth');

// ============================================================================
// CLIENT REGISTRATION & DOCUMENT UPLOAD
// ============================================================================
router.post('/register', 
  upload.fields([
    { name: 'driverLicense', maxCount: 1 },
    { name: 'ssnCard', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 }
  ]), 
  clientController.register
);

// ============================================================================
// CLIENT APPROVAL WORKFLOW
// ============================================================================
router.get('/pending-approvals', adminAuth, requirePermission('approve_clients'), clientController.getPendingApprovals);
router.post('/:clientId/approve', adminAuth, requirePermission('approve_clients'), clientController.approveClient);

// ============================================================================
// CLIENT LOGIN AND SELF OVERVIEW
// ============================================================================
router.post('/login', clientController.login);
router.get('/me/overview', clientAuth, clientController.getOverview);

module.exports = router; 