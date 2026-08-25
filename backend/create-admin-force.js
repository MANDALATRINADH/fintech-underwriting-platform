const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Delete ALL users
        await User.deleteMany({});
        console.log('✅ All users deleted');
        
        // Create Admin with EXPLICIT role
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'  // MUST be exactly 'admin'
        });
        await admin.save();
        console.log('✅ Admin created:');
        console.log('  Email:', admin.email);
        console.log('  Role:', admin.role);
        console.log('  ID:', admin._id);
        
        // Create Customer
        const customer = new User({
            name: 'Demo Customer',
            email: 'demo@example.com',
            password: 'password123',
            phone: '9876543210',
            role: 'customer'
        });
        await customer.save();
        console.log('✅ Customer created:');
        console.log('  Email:', customer.email);
        console.log('  Role:', customer.role);
        
        // Verify
        const users = await User.find({});
        console.log('\n📊 Final users:');
        users.forEach(u => {
            console.log('  Email:', u.email, '| Role:', u.role);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();
