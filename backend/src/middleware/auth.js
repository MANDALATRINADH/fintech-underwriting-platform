const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'fintech-super-secret-key-2026');
        console.log('📦 Decoded token:', decoded);
        console.log('👤 Role from token:', decoded.role);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Use role from token, not from database (for admin check)
        req.userId = user._id;
        req.user = user;
        req.userRole = decoded.role || user.role; // Prefer token role
        req.userEmail = decoded.email || user.email;
        
        console.log('✅ Authenticated user:', req.userEmail, 'Role:', req.userRole);
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = auth;
