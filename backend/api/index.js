import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from '../server/config/database.js';
import transactionRoutes from '../server/routes/transactions.js';
import budgetRoutes from '../server/routes/budgets.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://expense-tracker-frontend-xi-jet.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to database
let dbConnected = false;
async function ensureDbConnection() {
  if (!dbConnected) {
    await connectToDatabase();
    dbConnected = true;
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await ensureDbConnection();
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message 
    });
  }
});

// Root endpoint
app.get('/', async (req, res) => {
  try {
    await ensureDbConnection();
    res.json({ 
      status: 'OK', 
      message: 'Personal Expense Tracker API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        transactions: '/api/transactions',
        budgets: '/api/budgets'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message 
    });
  }
});

// API routes
app.use('/api', async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api', transactionRoutes);
app.use('/api', budgetRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
