const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');

// Submit Application - Customer
router.post('/submit', auth, async (req, res) => {
    try {
        const { loanAmount, loanPurpose, tenure, employmentType, annualIncome, existingEmi } = req.body;

        if (!loanAmount || !loanPurpose || !tenure || !annualIncome) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please fill all required fields' 
            });
        }

        // Calculate risk score
        let creditRisk = 25;
        let fraudRisk = 10;

        if (annualIncome > 1000000) creditRisk -= 10;
        if (annualIncome < 300000) creditRisk += 15;
        if (existingEmi > (annualIncome / 12) * 0.4) creditRisk += 20;

        // Create application with PENDING status
        const application = new Application({
            userId: req.userId,
            loanAmount: parseInt(loanAmount),
            loanPurpose: loanPurpose || 'Personal',
            tenure: parseInt(tenure) || 36,
            employmentType: employmentType || 'salaried',
            annualIncome: parseInt(annualIncome),
            existingEmi: parseInt(existingEmi) || 0,
            riskScore: {
                credit: creditRisk,
                fraud: fraudRisk
            },
            decision: 'PENDING',
            explanation: 'Application submitted for admin review',
            status: 'pending'
        });

        await application.save();
        console.log('✅ Application saved with ID:', application._id);

        // Notify customer
        const user = await User.findById(req.userId);
        if (user) {
            user.notifications = user.notifications || [];
            user.notifications.push({
                title: 'Application Submitted',
                message: 'Your loan application has been submitted for admin review.',
                type: 'info',
                read: false,
                createdAt: new Date()
            });
            await user.save();
        }

        // Notify admin
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            admin.notifications = admin.notifications || [];
            const loanAmountStr = parseInt(loanAmount).toLocaleString();
            admin.notifications.push({
                title: 'New Application',
                message: 'New loan application of ₹' + loanAmountStr + ' from ' + (user?.name || 'Customer'),
                type: 'info',
                read: false,
                createdAt: new Date()
            });
            await admin.save();
            console.log('✅ Admin notified');
        }

        res.json({
            success: true,
            application: {
                id: application._id,
                loanAmount: application.loanAmount,
                loanPurpose: application.loanPurpose,
                tenure: application.tenure,
                riskScore: application.riskScore,
                decision: application.decision,
                explanation: application.explanation,
                status: application.status,
                createdAt: application.createdAt,
                message: 'Application submitted for admin review'
            }
        });
    } catch (error) {
        console.error('Application submit error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to submit application' 
        });
    }
});

// Get Application History - Customer
router.get('/history', auth, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            applications: applications.map(app => ({
                id: app._id,
                loanAmount: app.loanAmount,
                loanPurpose: app.loanPurpose,
                tenure: app.tenure,
                riskScore: app.riskScore,
                decision: app.decision,
                explanation: app.explanation,
                status: app.status,
                createdAt: app.createdAt,
                reviewedAt: app.reviewedAt,
                decisionReason: app.decisionReason
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
