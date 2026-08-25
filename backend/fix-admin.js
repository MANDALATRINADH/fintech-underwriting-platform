const mongoose = require('mongoose');
const User = require('./src/models/User');

const fixAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fintech');
        
        // Find and update admin
        const admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            admin.role = 'admin';
            await admin.save();
            console.log('✅ Admin role fixed:', admin.email, 'Role:', admin.role);
        } else {
            // Create admin if not exists
            const newAdmin = new User({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                phone: '9876543210',
                role: 'admin'
            });
            await newAdmin.save();
            console.log('✅ Admin created:', newAdmin.email, 'Role:', newAdmin.role);
        }
        
        // Fix customer
        const customer = await User.findOne({ email: 'demo@example.com' });
        if (customer) {
            customer.role = 'customer';
            await customer.save();
            console.log('✅ Customer role fixed:', customer.email, 'Role:', customer.role);
        }
        
        // Show all users
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

fixAdmin();
