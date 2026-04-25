import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import indexRoutes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];
const rawFrontendOrigins = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '';
const allowedOrigins = rawFrontendOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const missingEnvVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
if (missingEnvVars.length) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.error('Missing required environment variable in production: FRONTEND_URL');
  process.exit(1);
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
};

// Middleware
app.set('trust proxy', 1);
app.use(cors(corsOptions));
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
    const conn = await mongoose.connect(process.env.MONGO_URI);
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
