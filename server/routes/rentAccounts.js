import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to parse JSON fields
function parseAccount(account) {
  return {
    ...account,
    knifeSkins: JSON.parse(account.knifeSkins || '[]'),
    operatorSkins: JSON.parse(account.operatorSkins || '{}'),
  };
}

// GET /api/rent-accounts - Public, get all rent accounts
router.get('/', (req, res) => {
  try {
    const accounts = db.prepare('SELECT * FROM rent_accounts WHERE status = ? ORDER BY createdAt DESC').all('active');
    res.json(accounts.map(parseAccount));
  } catch (error) {
    console.error('Error fetching rent accounts:', error);
    res.status(500).json({ error: '获取账号列表失败' });
  }
});

// GET /api/rent-accounts/all - Admin, get all rent accounts (including inactive)
router.get('/all', authenticateToken, (req, res) => {
  try {
    const accounts = db.prepare('SELECT * FROM rent_accounts ORDER BY createdAt DESC').all();
    res.json(accounts.map(parseAccount));
  } catch (error) {
    console.error('Error fetching all rent accounts:', error);
    res.status(500).json({ error: '获取账号列表失败' });
  }
});

// GET /api/rent-accounts/:id
router.get('/:id', (req, res) => {
  try {
    const account = db.prepare('SELECT * FROM rent_accounts WHERE id = ?').get(req.params.id);
    if (!account) {
      return res.status(404).json({ error: '账号不存在' });
    }
    res.json(parseAccount(account));
  } catch (error) {
    console.error('Error fetching rent account:', error);
    res.status(500).json({ error: '获取账号详情失败' });
  }
});

// POST /api/rent-accounts - Admin, create new rent account
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      id,
      region,
      server,
      loginType,
      rank,
      harvardCoins,
      totalAssets,
      assetsDisplay,
      level,
      safeBox,
      stamina,
      awmAmmo,
      trainingLevel,
      rangeLevel,
      knifeSkins,
      operatorSkins,
      price,
      deposit,
      note,
      status,
    } = req.body;

    const now = new Date().toISOString();
    const accountId = id || 'SJZ' + Date.now().toString().slice(-6);

    db.prepare(`
      INSERT INTO rent_accounts (
        id, region, server, loginType, rank, harvardCoins, totalAssets, assetsDisplay,
        level, safeBox, stamina, awmAmmo, trainingLevel, rangeLevel,
        knifeSkins, operatorSkins, price, deposit, note, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run([
      accountId,
      region,
      server,
      loginType,
      rank,
      harvardCoins,
      totalAssets,
      assetsDisplay,
      level,
      safeBox,
      stamina,
      awmAmmo,
      trainingLevel,
      rangeLevel,
      JSON.stringify(knifeSkins || []),
      JSON.stringify(operatorSkins || {}),
      price,
      deposit,
      note || '',
      status || 'active',
      now,
      now,
    ]);

    const created = db.prepare('SELECT * FROM rent_accounts WHERE id = ?').get(accountId);
    res.status(201).json(parseAccount(created));
  } catch (error) {
    console.error('Error creating rent account:', error);
    res.status(500).json({ error: '创建账号失败' });
  }
});

// PUT /api/rent-accounts/:id - Admin, update rent account
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM rent_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    const {
      region,
      server,
      loginType,
      rank,
      harvardCoins,
      totalAssets,
      assetsDisplay,
      level,
      safeBox,
      stamina,
      awmAmmo,
      trainingLevel,
      rangeLevel,
      knifeSkins,
      operatorSkins,
      price,
      deposit,
      note,
      status,
    } = req.body;

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE rent_accounts SET
        region = ?,
        server = ?,
        loginType = ?,
        rank = ?,
        harvardCoins = ?,
        totalAssets = ?,
        assetsDisplay = ?,
        level = ?,
        safeBox = ?,
        stamina = ?,
        awmAmmo = ?,
        trainingLevel = ?,
        rangeLevel = ?,
        knifeSkins = ?,
        operatorSkins = ?,
        price = ?,
        deposit = ?,
        note = ?,
        status = ?,
        updatedAt = ?
      WHERE id = ?
    `).run([
      region ?? existing.region,
      server ?? existing.server,
      loginType ?? existing.loginType,
      rank ?? existing.rank,
      harvardCoins ?? existing.harvardCoins,
      totalAssets ?? existing.totalAssets,
      assetsDisplay ?? existing.assetsDisplay,
      level ?? existing.level,
      safeBox ?? existing.safeBox,
      stamina ?? existing.stamina,
      awmAmmo ?? existing.awmAmmo,
      trainingLevel ?? existing.trainingLevel,
      rangeLevel ?? existing.rangeLevel,
      knifeSkins ? JSON.stringify(knifeSkins) : existing.knifeSkins,
      operatorSkins ? JSON.stringify(operatorSkins) : existing.operatorSkins,
      price ?? existing.price,
      deposit ?? existing.deposit,
      note ?? existing.note,
      status ?? existing.status,
      now,
      id,
    ]);

    const updated = db.prepare('SELECT * FROM rent_accounts WHERE id = ?').get(id);
    res.json(parseAccount(updated));
  } catch (error) {
    console.error('Error updating rent account:', error);
    res.status(500).json({ error: '更新账号失败' });
  }
});

// DELETE /api/rent-accounts/:id - Admin, delete rent account
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM rent_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    db.prepare('DELETE FROM rent_accounts WHERE id = ?').run(id);
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('Error deleting rent account:', error);
    res.status(500).json({ error: '删除账号失败' });
  }
});

export default router;
