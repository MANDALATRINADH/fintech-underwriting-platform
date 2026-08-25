const mongoose = require('mongoose');
const User = require('./src/models/User');

const checkUsers = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        const users = await User.find({});
        console.log('📊 All users in database:');
        users.forEach(u => {
            console.log('  Email:', u.email);
            console.log('  Role:', u.role);
            console.log('  ID:', u._id);
            console.log('---');
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
