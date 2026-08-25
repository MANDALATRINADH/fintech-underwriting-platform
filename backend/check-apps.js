const mongoose = require('mongoose');
const Application = require('./src/models/Application');

const checkApps = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        const count = await Application.countDocuments();
        console.log('📊 Total applications in database:', count);
        
        if (count > 0) {
            const apps = await Application.find().limit(5);
            console.log('📋 Sample applications:', apps.map(a => ({
                id: a._id,
                loanAmount: a.loanAmount,
                decision: a.decision,
                userId: a.userId
            })));
        } else {
            console.log('⚠️ No applications found. Create one from customer page.');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkApps();
