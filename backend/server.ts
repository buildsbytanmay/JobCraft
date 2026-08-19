import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import jobRoutes from './routes/jobRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check API
app.get('/api/health', (_req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'ok',
    service: 'JobCraft Backend API',
    database: dbStatus,
    aiModel: 'gemini-3.7-flash',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/jobs', jobRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 JobCraft Backend running on port ${PORT}`);
});

export default app;
