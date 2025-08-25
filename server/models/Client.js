const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  ssn: {
    type: String,
    required: true,
    unique: true
  },
  
  // Address Information
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'suspended', 'active'],
    default: 'pending'
  },
  
  // KYC Verification
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending'
  },
  
  // Documents
  documents: {
    driverLicense: { type: String }, // File path
    ssnCard: { type: String }, // File path
    proofOfAddress: { type: String }, // File path
    additionalDocs: [{ type: String }] // Array of file paths
  },
  
  // Investment Information
  investmentPlan: {
    type: String,
    enum: ['8%_compounded', '6%_simple', '12%_futures', '14%_futures'],
    required: true
  },
  initialInvestment: {
    type: Number,
    required: true,
    min: 1000
  },
  
  // Account Details
  totalInvested: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  
  // Dates
  startDate: {
    type: Date
  },
  maturityDate: {
    type: Date
  },
  
  // Referral
  referralCode: {
    type: String
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  
  // Approval Information
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: {
    type: Date
  },
  approvalNotes: {
    type: String
  },
  
  // Bank Information
  bankAccount: {
    accountNumber: { type: String },
    routingNumber: { type: String },
    bankName: { type: String }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
clientSchema.index({ email: 1 });
clientSchema.index({ ssn: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ kycStatus: 1 });
clientSchema.index({ createdAt: -1 });

// Virtual for full name
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to calculate maturity date based on investment plan
clientSchema.methods.calculateMaturityDate = function() {
  if (!this.startDate) return null;
  
  const startDate = new Date(this.startDate);
  let maturityDate = new Date(startDate);
  
  switch (this.investmentPlan) {
    case '8%_compounded':
    case '6%_simple':
      maturityDate.setFullYear(maturityDate.getFullYear() + 1); // 1 year
      break;
    case '12%_futures':
    case '14%_futures':
      maturityDate.setMonth(maturityDate.getMonth() + 6); // 6 months
      break;
  }
  
  return maturityDate;
};

// Hash sensitive document ID numbers if stored (not hashing files). For now, only password.

clientSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

clientSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Client', clientSchema); 