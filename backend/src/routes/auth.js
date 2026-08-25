const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'fintech-super-secret-key-2026';

// ============================================
// CUSTOMER SIGNUP - NEW
// ============================================
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        console.log('🔐 Signup attempt:', email);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'User already exists with this email' 
            });
        }

        // Create new user with verification status reset
        const user = new User({
            name: name || 'New Customer',
            email: email,
            password: password,
            phone: phone || '',
            role: 'customer',
            verificationStatus: { 
                aadhaar: false, 
                pan: false, 
                email: false, 
                employment: false 
            }
        });

        await user.save();
        console.log('✅ New customer created:', user.email);

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verificationStatus: user.verificationStatus
            }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// CUSTOMER LOGIN - RESETS VERIFICATION
// ============================================
router.post('/customer', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Customer login attempt:', email);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        if (user.role !== 'customer') {
            return res.status(403).json({ success: false, error: 'Not a customer account' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        // Reset verification status on login
        user.verificationStatus = {
            aadhaar: false,
            pan: false,
            email: false,
            employment: false
        };
        await user.save();
        console.log('🔄 Verification reset for customer:', user.email);

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verificationStatus: user.verificationStatus
            }
        });
    } catch (error) {
        console.error('❌ Customer login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ADMIN LOGIN - NO RESET
// ============================================
router.post('/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Admin login attempt:', email);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not an admin account' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verificationStatus: user.verificationStatus || { aadhaar: false, pan: false }
            }
        });
    } catch (error) {
        console.error('❌ Admin login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// DEMO LOGIN - FOR TESTING
// ============================================
router.post('/demo', async (req, res) => {
    try {
        console.log('🔐 Demo login requested');
        
        let user = await User.findOne({ email: 'demo@example.com' });
        if (!user) {
            user = new User({
                name: 'Demo Customer',
                email: 'demo@example.com',
                password: 'password123',
                phone: '9876543210',
                role: 'customer',
                verificationStatus: { aadhaar: false, pan: false, email: false, employment: false }
            });
            await user.save();
            console.log('✅ Customer created');
        }

        user.verificationStatus = {
            aadhaar: false,
            pan: false,
            email: false,
            employment: false
        };
        await user.save();
        console.log('🔄 Verification reset for demo user');

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verificationStatus: user.verificationStatus
            }
        });
    } catch (error) {
        console.error('❌ Demo login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
