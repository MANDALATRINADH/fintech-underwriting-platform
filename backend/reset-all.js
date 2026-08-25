const mongoose = require('mongoose');
const User = require('./src/models/User');

const resetAll = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Reset ALL users' verification status
        const result = await User.updateMany(
            {},
            { 
                'verificationStatus.aadhaar': false,
                'verificationStatus.pan': false,
                'verificationStatus.email': false,
                'verificationStatus.employment': false
            }
        );
        
        console.log('✅ All verification statuses reset to FALSE');
        console.log('📊 Modified:', result.modifiedCount, 'users');
        
        // Show all users
        const users = await User.find({});
        console.log('\n📋 Users:');
        users.forEach(u => {
            console.log('  -', u.email, '| Aadhaar:', u.verificationStatus.aadhaar, '| PAN:', u.verificationStatus.pan);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAll();
