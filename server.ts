import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB, getDBStatus } from './backend/config/db.js';
import jobRoutes from './backend/routes/jobRoutes.js';
import { errorHandler } from './backend/middleware/errorMiddleware.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MongoDB connection
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req, res) => {
    const dbStatus = getDBStatus();
    res.json({
      status: 'ok',
      service: 'JobCraft API',
      database: dbStatus,
      aiModel: 'gemini-3.7-flash',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Job Routes
  app.use('/api/jobs', jobRoutes);

  // Global Error Handler for API
  app.use(errorHandler);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 JobCraft running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
