import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to parse JSON fields
function parseAccount(account) {
  // Ensure knifeSkins is always an array
  let knifeSkins = [];
  if (account.knifeSkins) {
    if (typeof account.knifeSkins === 'string') {
      try { knifeSkins = JSON.parse(account.knifeSkins); } catch { knifeSkins = []; }
    } else if (Array.isArray(account.knifeSkins)) {
      knifeSkins = account.knifeSkins;
    }
  }

  // Ensure operatorSkins is always an object
  let operatorSkins = {};
  if (account.operatorSkins) {
    if (typeof account.operatorSkins === 'string') {
      try { operatorSkins = JSON.parse(account.operatorSkins); } catch { operatorSkins = {}; }
    } else if (typeof account.operatorSkins === 'object') {
      operatorSkins = account.operatorSkins;
    }
  }

  return {
    ...account,
    knifeSkins,
    operatorSkins,
    isOwnFace: Boolean(account.isOwnFace),
    superGuarantee: Boolean(account.superGuarantee),
    sixSetHead: account.sixSetHead ?? 0,
    sixSetArmor: account.sixSetArmor ?? 0,
    mainInterface: account.mainInterface || '',
    warehouse: account.warehouse || '',
    other: account.other || '',
  };
}

// Helper: safe value for logging
function safeValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (Number.isNaN(val)) return 'NaN';
  return val;
}

// GET /api/sell-accounts - Admin, get all sell accounts
router.get('/', authenticateToken, (req, res) => {
  try {
    const accounts = db.prepare('SELECT * FROM sell_accounts ORDER BY createdAt DESC').all();
    res.json(accounts.map(parseAccount));
  } catch (error) {
    console.error('Error fetching sell accounts:', error);
    res.status(500).json({ error: '获取账号列表失败' });
  }
});

// GET /api/sell-accounts/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const account = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(req.params.id);
    if (!account) {
      return res.status(404).json({ error: '账号不存在' });
    }
    res.json(parseAccount(account));
  } catch (error) {
    console.error('Error fetching sell account:', error);
    res.status(500).json({ error: '获取账号详情失败' });
  }
});

// POST /api/sell-accounts - Public, submit new sell account
router.post('/', (req, res) => {
  try {
    const {
      id,
      userId,
      userName,
      region,
      server,
      loginType,
      totalAssets,
      harvardCoins,
      level,
      rank,
      safeBox,
      stamina,
      trainingLevel,
      rangeLevel,
      awmAmmo,
      sixSetHead,
      sixSetArmor,
      banRecord,
      isOwnFace,
      superGuarantee,
      knifeSkins,
      operatorSkins,
      price,
      note,
      mainInterface,
      warehouse,
      other,
    } = req.body;

    const now = new Date().toISOString();
    const accountId = id || 'SELL' + Date.now().toString().slice(-6);

    db.prepare(`
      INSERT INTO sell_accounts (
        id, userId, userName, region, server, loginType, totalAssets, harvardCoins,
        level, rank, safeBox, stamina, trainingLevel, rangeLevel, awmAmmo,
        sixSetHead, sixSetArmor, banRecord, isOwnFace, superGuarantee, knifeSkins, operatorSkins,
        price, note, status, submittedAt, createdAt, updatedAt,
        mainInterface, warehouse, other
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)
    `).run([
      accountId,
      userId || 'USER' + Math.floor(Math.random() * 10000),
      userName || '用户' + Math.floor(Math.random() * 10000),
      region,
      server,
      loginType,
      totalAssets,
      harvardCoins,
      level,
      rank,
      safeBox,
      stamina,
      trainingLevel || '1级',
      rangeLevel || '1级',
      awmAmmo || 0,
      sixSetHead || 0,
      sixSetArmor || 0,
      banRecord || '无封禁记录',
      isOwnFace ? 1 : 0,
      superGuarantee ? 1 : 0,
      JSON.stringify(knifeSkins || []),
      JSON.stringify(operatorSkins || {}),
      price,
      note || '',
      now,
      now,
      now,
      mainInterface || null,
      warehouse || null,
      other || null,
    ]);

    const created = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(accountId);
    res.status(201).json(parseAccount(created));
  } catch (error) {
    console.error('=== ERROR creating sell account ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body:', JSON.stringify(req.body, safeValue));
    res.status(500).json({ error: '提交账号失败' });
  }
});

// PUT /api/sell-accounts/:id/approve - Admin, approve sell account
router.put('/:id/approve', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sell_accounts SET status = 'approved', updatedAt = ? WHERE id = ?
    `).run(now, id);

    const updated = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);
    res.json(parseAccount(updated));
  } catch (error) {
    console.error('Error approving sell account:', error);
    res.status(500).json({ error: '审核账号失败' });
  }
});

// PUT /api/sell-accounts/:id/reject - Admin, reject sell account
router.put('/:id/reject', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sell_accounts SET status = 'rejected', updatedAt = ? WHERE id = ?
    `).run(now, id);

    const updated = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);
    res.json(parseAccount(updated));
  } catch (error) {
    console.error('Error rejecting sell account:', error);
    res.status(500).json({ error: '拒绝账号失败' });
  }
});

// PUT /api/sell-accounts/:id/complete - Admin, mark sell account as completed
router.put('/:id/complete', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE sell_accounts SET status = 'completed', updatedAt = ? WHERE id = ?
    `).run(now, id);

    const updated = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);
    res.json(parseAccount(updated));
  } catch (error) {
    console.error('Error completing sell account:', error);
    res.status(500).json({ error: '完成交易失败' });
  }
});

// PUT /api/sell-accounts/:id - Admin, update sell account
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    const {
      region,
      server,
      loginType,
      totalAssets,
      harvardCoins,
      level,
      rank,
      safeBox,
      stamina,
      trainingLevel,
      rangeLevel,
      awmAmmo,
      sixSetHead,
      sixSetArmor,
      banRecord,
      isOwnFace,
      superGuarantee,
      knifeSkins,
      operatorSkins,
      price,
      note,
      status,
    } = req.body;

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE sell_accounts SET
        region = ?,
        server = ?,
        loginType = ?,
        totalAssets = ?,
        harvardCoins = ?,
        level = ?,
        rank = ?,
        safeBox = ?,
        stamina = ?,
        trainingLevel = ?,
        rangeLevel = ?,
        awmAmmo = ?,
        sixSetHead = ?,
        sixSetArmor = ?,
        banRecord = ?,
        isOwnFace = ?,
        superGuarantee = ?,
        knifeSkins = ?,
        operatorSkins = ?,
        price = ?,
        note = ?,
        status = ?,
        updatedAt = ?
      WHERE id = ?
    `).run([
      region ?? existing.region,
      server ?? existing.server,
      loginType ?? existing.loginType,
      totalAssets ?? existing.totalAssets,
      harvardCoins ?? existing.harvardCoins,
      level ?? existing.level,
      rank ?? existing.rank,
      safeBox ?? existing.safeBox,
      stamina ?? existing.stamina,
      trainingLevel ?? existing.trainingLevel,
      rangeLevel ?? existing.rangeLevel,
      awmAmmo ?? existing.awmAmmo,
      sixSetHead ?? existing.sixSetHead,
      sixSetArmor ?? existing.sixSetArmor,
      banRecord ?? existing.banRecord,
      isOwnFace !== undefined ? (isOwnFace ? 1 : 0) : existing.isOwnFace,
      superGuarantee !== undefined ? (superGuarantee ? 1 : 0) : existing.superGuarantee,
      knifeSkins ? JSON.stringify(knifeSkins) : existing.knifeSkins,
      operatorSkins ? JSON.stringify(operatorSkins) : existing.operatorSkins,
      price ?? existing.price,
      note ?? existing.note,
      status ?? existing.status,
      now,
      id,
    ]);

    const updated = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);
    res.json(parseAccount(updated));
  } catch (error) {
    console.error('Error updating sell account:', error);
    res.status(500).json({ error: '更新账号失败' });
  }
});

// DELETE /api/sell-accounts/:id - Admin, delete sell account
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM sell_accounts WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: '账号不存在' });
    }

    db.prepare('DELETE FROM sell_accounts WHERE id = ?').run(id);
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('Error deleting sell account:', error);
    res.status(500).json({ error: '删除账号失败' });
  }
});

export default router;
