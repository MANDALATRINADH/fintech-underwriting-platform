const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');

// Get all applications
router.get('/applications', auth, async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }
        
        const applications = await Application.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            applications: applications
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Review application - FIXED
router.put('/applications/:id/review', auth, async (req, res) => {
    try {
        console.log('🔐 Review request received');
        console.log('📦 ID:', req.params.id);
        console.log('📦 Body:', req.body);
        
        // Check admin
        if (req.userRole !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied. Admin only.' 
            });
        }
        
        const { id } = req.params;
        const { decision, decisionReason } = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Application ID is required' 
            });
        }
        
        if (!decision || !['APPROVED', 'REJECTED', 'REVIEW'].includes(decision)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid decision' 
            });
        }
        
        // Find application
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ 
                success: false, 
                error: 'Application not found' 
            });
        }
        
        // Update
        application.decision = decision;
        application.decisionReason = decisionReason || '';
        application.reviewedBy = req.userId;
        application.reviewedAt = new Date();
        application.status = decision === 'APPROVED' ? 'approved' : 
                            decision === 'REJECTED' ? 'rejected' : 'reviewed';
        
        await application.save();
        
        console.log('✅ Application updated:', application._id, 'Decision:', decision);
        
        res.json({
            success: true,
            application: application
        });
    } catch (error) {
        console.error('❌ Review error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to review application' 
        });
    }
});

module.exports = router;
