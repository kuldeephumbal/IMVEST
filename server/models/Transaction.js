const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Client Reference
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'interest_payment', 'fee', 'refund'],
    required: true
  },
  
  // Amount Information
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'ach', 'wire', 'check', 'internal'],
    required: true
  },
  
  // Bank Details (for withdrawals)
  bankDetails: {
    accountNumber: { type: String },
    routingNumber: { type: String },
    bankName: { type: String }
  },
  
  // Reference Information
  referenceNumber: {
    type: String,
    unique: true
  },
  
  // Description
  description: {
    type: String,
    required: true
  },
  
  // Processing Information
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  processedAt: {
    type: Date
  },
  
  // Failure Information
  failureReason: {
    type: String
  },
  
  // Metadata for different transaction types
  metadata: {
    // For interest payments
    interestPeriod: {
      startDate: { type: Date },
      endDate: { type: Date }
    },
    
    // For deposits
    investmentPlan: {
      type: String,
      enum: ['8%_compounded', '6%_simple', '12%_futures', '14%_futures']
    },
    
    // For fees
    feeType: {
      type: String,
      enum: ['monthly_fee', 'withdrawal_fee', 'late_fee', 'other']
    }
  },
  
  // Audit Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  // Notes
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ client: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ referenceNumber: 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save middleware to generate reference number
transactionSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.referenceNumber = `TXN-${timestamp}-${random}`;
  }
  next();
});

// Method to get transaction summary
transactionSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.type,
    amount: this.amount,
    status: this.status,
    description: this.description,
    referenceNumber: this.referenceNumber,
    createdAt: this.createdAt
  };
};

// Static method to get client balance
transactionSchema.statics.getClientBalance = async function(clientId) {
  const result = await this.aggregate([
    { $match: { client: mongoose.Types.ObjectId(clientId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalDeposits: {
          $sum: {
            $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0]
          }
        },
        totalWithdrawals: {
          $sum: {
            $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0]
          }
        },
        totalInterest: {
          $sum: {
            $cond: [{ $eq: ['$type', 'interest_payment'] }, '$amount', 0]
          }
        },
        totalFees: {
          $sum: {
            $cond: [{ $eq: ['$type', 'fee'] }, '$amount', 0]
          }
        }
      }
    }
  ]);
  
  if (result.length === 0) {
    return {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalInterest: 0,
      totalFees: 0,
      currentBalance: 0
    };
  }
  
  const { totalDeposits, totalWithdrawals, totalInterest, totalFees } = result[0];
  const currentBalance = totalDeposits + totalInterest - totalWithdrawals - totalFees;
  
  return {
    totalDeposits,
    totalWithdrawals,
    totalInterest,
    totalFees,
    currentBalance
  };
};

module.exports = mongoose.model('Transaction', transactionSchema); 