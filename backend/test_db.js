import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

testConnection();
