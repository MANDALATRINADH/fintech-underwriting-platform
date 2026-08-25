const mongoose = require('mongoose');
const User = require('./src/models/User');
const Application = require('./src/models/Application');

const resetDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Delete everything
        await User.deleteMany({});
        await Application.deleteMany({});
        console.log('✅ Database cleared');
        
        // Create Admin with explicit role
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'  // MUST be 'admin'
        });
        await admin.save();
        console.log('✅ Admin created:', admin.email, 'Role:', admin.role);
        
        // Create Customer
        const customer = new User({
            name: 'Demo Customer',
            email: 'demo@example.com',
            password: 'password123',
            phone: '9876543210',
            role: 'customer'
        });
        await customer.save();
        console.log('✅ Customer created:', customer.email, 'Role:', customer.role);
        
        // Verify
        const users = await User.find({});
        console.log('\n📊 All users:');
        users.forEach(u => {
            console.log('  Email:', u.email, '| Role:', u.role);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetDB();
