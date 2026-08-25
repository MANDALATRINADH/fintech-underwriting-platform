const mongoose = require('mongoose');
const User = require('./src/models/User');

const forceCreateAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Delete all existing users
        await User.deleteMany({});
        console.log('✅ All users deleted');
        
        // Create admin
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin created:');
        console.log('  Email: admin@example.com');
        console.log('  Password: admin123');
        console.log('  Role: admin');
        
        // Create customer
        const customer = new User({
            name: 'Demo Customer',
            email: 'demo@example.com',
            password: 'password123',
            phone: '9876543210',
            role: 'customer'
        });
        await customer.save();
        console.log('✅ Customer created:');
        console.log('  Email: demo@example.com');
        console.log('  Password: password123');
        console.log('  Role: customer');
        
        // Verify
        const users = await User.find({});
        console.log('\n📊 All users:');
        users.forEach(u => {
            console.log('  -', u.email, '| Role:', u.role);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

forceCreateAdmin();
