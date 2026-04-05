import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import startCronJobs from './jobs/reminderCron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import carRoutes from './routes/cars.js';
import documentRoutes from './routes/documents.js';
import reminderRoutes from './routes/reminders.js';
import paymentRoutes from './routes/payments.js';
import locationRoutes from './routes/location.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';
import forumRoutes from './routes/forum.js';

// Load env vars
dotenv.config();

// Initialize Cron Jobs & DB
startCronJobs();


const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 })); // 15 minutes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/forum', forumRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('Hello World'));


const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/intellicar');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});