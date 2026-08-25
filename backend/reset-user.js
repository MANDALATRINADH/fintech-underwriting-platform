const mongoose = require('mongoose');
const User = require('./src/models/User');

const resetUser = async () => {
    await mongoose.connect('mongodb://localhost:27017/fintech');
    const user = await User.findOne({ email: 'demo@example.com' });
    if (user) {
        user.verificationStatus = { aadhaar: false, pan: false, email: false };
        await user.save();
        console.log('✅ User verification status reset to PENDING');
        console.log('Aadhaar:', user.verificationStatus.aadhaar);
        console.log('PAN:', user.verificationStatus.pan);
    }
    process.exit();
};

resetUser();
