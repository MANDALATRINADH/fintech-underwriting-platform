const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Delete existing admin if any
        await User.deleteOne({ email: 'admin@example.com' });
        
        // Create new admin
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin user created:');
        console.log('  Email: admin@example.com');
        console.log('  Password: admin123');
        console.log('  Role: admin');
        
        // Also create a customer if not exists
        let customer = await User.findOne({ email: 'demo@example.com' });
        if (!customer) {
            customer = new User({
                name: 'Demo Customer',
                email: 'demo@example.com',
                password: 'password123',
                phone: '9876543210',
                role: 'customer'
            });
            await customer.save();
            console.log('✅ Customer user created');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();
