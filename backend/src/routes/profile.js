const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// ============================================
// GET PROFILE
// ============================================
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verificationStatus: user.verificationStatus,
                profile: user.profile || {},
                notifications: user.notifications || []
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// UPDATE FULL PROFILE
// ============================================
router.put('/profile', auth, async (req, res) => {
    try {
        const { 
            name, phone, address, employmentStatus, annualIncome, dateOfBirth,
            companyName, companyAddress, hrName, hrEmail, hrPhone,
            jobTitle, department, salary, experienceYears
        } = req.body;

        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData['profile.address'] = address;
        if (dateOfBirth !== undefined) updateData['profile.dateOfBirth'] = dateOfBirth;
        if (employmentStatus !== undefined) updateData['profile.employmentStatus'] = employmentStatus;
        if (annualIncome !== undefined) updateData['profile.annualIncome'] = annualIncome;
        if (companyName !== undefined) updateData['profile.companyName'] = companyName;
        if (companyAddress !== undefined) updateData['profile.companyAddress'] = companyAddress;
        if (hrName !== undefined) updateData['profile.hrName'] = hrName;
        if (hrEmail !== undefined) updateData['profile.hrEmail'] = hrEmail;
        if (hrPhone !== undefined) updateData['profile.hrPhone'] = hrPhone;
        if (jobTitle !== undefined) updateData['profile.jobTitle'] = jobTitle;
        if (department !== undefined) updateData['profile.department'] = department;
        if (salary !== undefined) updateData['profile.salary'] = salary;
        if (experienceYears !== undefined) updateData['profile.experienceYears'] = experienceYears;

        const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// UPDATE NAME - FIXED
// ============================================
router.put('/name', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, { name: name }, { new: true });
        res.json({ success: true, name: user.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// UPDATE PHONE - FIXED
// ============================================
router.put('/phone', auth, async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, { phone: phone }, { new: true });
        res.json({ success: true, phone: user.phone });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// UPDATE ADDRESS - FIXED
// ============================================
router.put('/address', auth, async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, { 'profile.address': address }, { new: true });
        res.json({ success: true, profile: user.profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// UPDATE EMPLOYMENT - FIXED
// ============================================
router.put('/employment', auth, async (req, res) => {
    try {
        const { employmentStatus, annualIncome, companyName, hrName, hrEmail, jobTitle, salary } = req.body;
        const user = await User.findByIdAndUpdate(req.userId, {
            'profile.employmentStatus': employmentStatus,
            'profile.annualIncome': annualIncome,
            'profile.companyName': companyName,
            'profile.hrName': hrName,
            'profile.hrEmail': hrEmail,
            'profile.jobTitle': jobTitle,
            'profile.salary': salary
        }, { new: true });
        res.json({ success: true, profile: user.profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
