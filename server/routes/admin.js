import express from 'express';
import db from '../db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);

  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = generateToken(admin);

  // Store session
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  db.prepare('INSERT INTO admin_sessions (token, expiresAt, createdAt) VALUES (?, ?, ?)').run(
    token,
    expiresAt,
    new Date().toISOString()
  );

  res.json({
    token,
    username: admin.username,
    expiresAt,
  });
});

// POST /api/admin/logout
router.post('/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  }

  res.json({ message: '登出成功' });
});

// GET /api/admin/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    username: req.admin.username,
  });
});

export default router;
