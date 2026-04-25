import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import indexRoutes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api', indexRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Consultancy API is running...');
});

// Database Connection
const connectDB = async () => {
  try {
    // We try to connect using the URI from .env, or fallback to localhost for local testing
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/consultancy');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
