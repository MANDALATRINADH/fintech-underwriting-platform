const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    verificationStatus: {
        aadhaar: { type: Boolean, default: false },
        pan: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        employment: { type: Boolean, default: false }
    },
    profile: {
        // Personal Info
        address: { type: String, default: '' },
        dateOfBirth: { type: String, default: '' },
        panNumber: { type: String, default: '' },
        aadhaarNumber: { type: String, default: '' },
        
        // Employment Details
        employmentStatus: { type: String, default: 'employed' },
        annualIncome: { type: Number, default: 0 },
        
        // Company Details
        companyName: { type: String, default: '' },
        companyAddress: { type: String, default: '' },
        companyWebsite: { type: String, default: '' },
        companyPhone: { type: String, default: '' },
        companyEmail: { type: String, default: '' },
        
        // HR Contact Details
        hrName: { type: String, default: '' },
        hrEmail: { type: String, default: '' },
        hrPhone: { type: String, default: '' },
        hrDesignation: { type: String, default: '' },
        
        // Job Details
        jobTitle: { type: String, default: '' },
        jobDescription: { type: String, default: '' },
        department: { type: String, default: '' },
        reportingManager: { type: String, default: '' },
        
        // Salary & Benefits
        salary: { type: String, default: '' },
        salaryStructure: { type: String, default: '' },
        benefits: { type: String, default: '' },
        
        // Employment History
        employmentStartDate: { type: String, default: '' },
        employmentEndDate: { type: String, default: '' },
        previousEmployer: { type: String, default: '' },
        previousJobTitle: { type: String, default: '' },
        experienceYears: { type: Number, default: 0 },
        
        // Verification Documents
        offerLetter: { type: String, default: '' },
        paySlip: { type: String, default: '' },
        experienceLetter: { type: String, default: '' }
    },
    notifications: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
