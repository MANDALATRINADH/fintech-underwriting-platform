const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    loanAmount: { 
        type: Number, 
        required: true 
    },
    loanPurpose: { 
        type: String, 
        enum: ['Personal', 'Home', 'Car', 'Education', 'Business', 'Medical', 'Other'],
        default: 'Personal' 
    },
    tenure: { 
        type: Number, 
        default: 36 
    },
    employmentType: { 
        type: String, 
        enum: ['salaried', 'self-employed', 'business'], 
        default: 'salaried' 
    },
    annualIncome: { 
        type: Number, 
        required: true 
    },
    existingEmi: { 
        type: Number, 
        default: 0 
    },
    riskScore: {
        credit: { type: Number, min: 0, max: 100, default: 25 },
        fraud: { type: Number, min: 0, max: 100, default: 10 }
    },
    decision: { 
        type: String, 
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'REVIEW'], 
        default: 'PENDING' 
    },
    decisionReason: { 
        type: String, 
        default: '' 
    },
    reviewedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    reviewedAt: { 
        type: Date 
    },
    explanation: { 
        type: String, 
        default: 'Awaiting admin review' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'reviewed', 'approved', 'rejected'], 
        default: 'pending' 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);
