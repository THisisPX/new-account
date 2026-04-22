import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:4173'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// Initialize database then load routes and start server
async function start() {
  try {
    await initDb();
    console.log('Database initialized');

    // Import routes after DB is initialized
    const { default: adminRoutes } = await import('./routes/admin.js');
    const { default: rentAccountRoutes } = await import('./routes/rentAccounts.js');
    const { default: sellAccountRoutes } = await import('./routes/sellAccounts.js');

    // Routes
    app.use('/api/admin', adminRoutes);
    app.use('/api/rent-accounts', rentAccountRoutes);
    app.use('/api/sell-accounts', sellAccountRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('API endpoints:');
      console.log('  POST   /api/admin/login');
      console.log('  POST   /api/admin/logout');
      console.log('  GET    /api/admin/me');
      console.log('  GET    /api/rent-accounts');
      console.log('  GET    /api/rent-accounts/all');
      console.log('  GET    /api/rent-accounts/:id');
      console.log('  POST   /api/rent-accounts');
      console.log('  PUT    /api/rent-accounts/:id');
      console.log('  DELETE /api/rent-accounts/:id');
      console.log('  GET    /api/sell-accounts');
      console.log('  GET    /api/sell-accounts/:id');
      console.log('  POST   /api/sell-accounts');
      console.log('  PUT    /api/sell-accounts/:id/approve');
      console.log('  PUT    /api/sell-accounts/:id/reject');
      console.log('  PUT    /api/sell-accounts/:id/complete');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
