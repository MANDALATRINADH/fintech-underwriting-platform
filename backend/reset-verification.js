const mongoose = require('mongoose');
const User = require('./src/models/User');

const resetVerification = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Reset all users' verification status
        const result = await User.updateMany(
            {},
            { 
                'verificationStatus.aadhaar': false,
                'verificationStatus.pan': false,
                'verificationStatus.email': false,
                'verificationStatus.employment': false
            }
        );
        
        console.log('✅ Verification status reset for all users');
        console.log('📊 Modified:', result.modifiedCount, 'users');
        
        // Show updated users
        const users = await User.find({});
        console.log('\n📋 Updated Users:');
        users.forEach(u => {
            console.log('  -', u.email, '| Aadhaar:', u.verificationStatus.aadhaar, '| PAN:', u.verificationStatus.pan);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetVerification();
