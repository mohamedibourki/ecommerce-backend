import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import logger from './middlewares/looger';

dotenv.config();

const app = express();

// Middleware
app.use(express.json())
app.use(cors());
app.use(logger);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

export default app;