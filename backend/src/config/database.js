const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fintech');
        console.log('MongoDB Connected: ' + conn.connection.host);
        return conn;
    } catch (error) {
        console.log('MongoDB not available - running in demo mode');
        return null;
    }
};

module.exports = connectDB;
