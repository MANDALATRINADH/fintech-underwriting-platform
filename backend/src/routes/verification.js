const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Simple in-memory OTP store
const otpStore = {};

// Generate OTP
const generateOTP = () => {
    return '123456'; // Fixed for demo
};

// Aadhaar OTP Generation
router.post('/aadhaar/generate-otp', auth, async (req, res) => {
    try {
        const { aadhaarNumber, phoneNumber } = req.body;
        const cleaned = aadhaarNumber.replace(/[^0-9]/g, '');
        if (cleaned.length !== 12) {
            return res.status(400).json({ success: false, error: 'Invalid Aadhaar number' });
        }

        const otp = generateOTP();
        const referenceId = 'REF_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        
        otpStore[referenceId] = { otp, expiresAt: Date.now() + 300000 };
        const maskedPhone = phoneNumber.slice(0, 4) + '******' + phoneNumber.slice(-2);

        res.json({ success: true, referenceId, message: 'OTP sent to ' + maskedPhone, maskedPhone });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Aadhaar OTP Verify
router.post('/aadhaar/verify-otp', auth, async (req, res) => {
    try {
        const { referenceId, otp } = req.body;
        const stored = otpStore[referenceId];
        if (!stored) {
            return res.json({ success: false, verified: false, error: 'Invalid request' });
        }
        if (Date.now() > stored.expiresAt) {
            delete otpStore[referenceId];
            return res.json({ success: false, verified: false, error: 'OTP expired' });
        }
        if (stored.otp === otp) {
            delete otpStore[referenceId];
            await User.findByIdAndUpdate(req.userId, { 'verificationStatus.aadhaar': true });
            return res.json({ success: true, verified: true, data: { name: 'Verified User' } });
        }
        return res.json({ success: false, verified: false, error: 'Invalid OTP' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PAN Verification
router.post('/pan/verify', auth, async (req, res) => {
    try {
        const { panNumber, name, dob } = req.body;
        const cleaned = panNumber.toUpperCase().replace(/[^0-9A-Z]/g, '');
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(cleaned)) {
            return res.status(400).json({ success: false, verified: false, error: 'Invalid PAN format' });
        }

        await User.findByIdAndUpdate(req.userId, {
            'verificationStatus.pan': true,
            'profile.panNumber': cleaned,
            'profile.dateOfBirth': dob
        });

        res.json({
            success: true,
            verified: true,
            data: {
                name: name || 'Verified User',
                panNumber: cleaned,
                panStatus: 'Active',
                panType: 'Individual'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
