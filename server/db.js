import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data.db');

// Module-level database instance (set during initDb)
let _db = null;

// Helper: convert undefined/NaN to null (sql.js doesn't support these)
function undefToNull(val) {
  if (val === undefined || val === null || Number.isNaN(val)) return null;
  return val;
}

// Helper: process params array - convert undefined to null
function processParams(params) {
  if (!Array.isArray(params)) return params;
  return params.map(undefToNull);
}

// Synchronous-looking wrapper for sql.js
class DbWrapper {
  constructor(database) {
    this._db = database;
  }

  run(sql, params = []) {
    this._db.run(sql, processParams(params));
    this._save();
    return { changes: this._db.getRowsModified() };
  }

  exec(sql) {
    return this._db.exec(sql);
  }

  prepare(sql) {
    const stmt = this._db.prepare(sql);
    return {
      bind(params = []) {
        if (params === undefined || params === null) {
          // noop
        } else if (Array.isArray(params)) {
          stmt.bind(processParams(params));
        } else if (typeof params === 'object') {
          stmt.bind(Object.values(params).map(undefToNull));
        } else {
          // Single value - wrap in array
          stmt.bind([undefToNull(params)]);
        }
      },
      run(...args) {
        let params;
        if (args.length === 0) {
          params = [];
        } else if (args.length === 1 && Array.isArray(args[0])) {
          params = processParams(args[0]);
        } else if (args.length === 1 && typeof args[0] === 'object') {
          params = Object.values(args[0]).map(undefToNull);
        } else {
          params = args.map(undefToNull);
        }
        stmt.bind(params);
        stmt.step();
        stmt.free();
        _db._save();
        return { changes: _db._db.getRowsModified() };
      },
      get(...args) {
        let params;
        if (args.length === 0) {
          params = [];
        } else if (args.length === 1 && Array.isArray(args[0])) {
          params = processParams(args[0]);
        } else if (args.length === 1 && typeof args[0] === 'object') {
          params = Object.values(args[0]).map(undefToNull);
        } else {
          params = args.map(undefToNull);
        }
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return null;
      },
      all(...args) {
        let params;
        if (args.length === 0) {
          params = [];
        } else if (args.length === 1 && Array.isArray(args[0])) {
          params = processParams(args[0]);
        } else if (args.length === 1 && typeof args[0] === 'object') {
          params = Object.values(args[0]).map(undefToNull);
        } else {
          params = args.map(undefToNull);
        }
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      }
    };
  }

  _save() {
    if (this._db) {
      const data = this._db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    }
  }
}

// Proxy object that forwards to the actual db
// Throws an error if db isn't initialized yet
const dbProxy = new Proxy({}, {
  get(target, prop) {
    if (!_db) {
      throw new Error('Database not initialized. Call initDb() first.');
    }
    return _db[prop];
  }
});

// Initialize database
async function initDb() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  let data = null;
  if (fs.existsSync(dbPath)) {
    data = fs.readFileSync(dbPath);
  }

  const database = new SQL.Database(data);
  _db = new DbWrapper(database);

  // Enable foreign keys
  _db.run('PRAGMA foreign_keys = ON');

  // Create tables
  _db.run(`
    CREATE TABLE IF NOT EXISTS rent_accounts (
      id TEXT PRIMARY KEY,
      region TEXT NOT NULL,
      server TEXT NOT NULL,
      loginType TEXT NOT NULL,
      rank TEXT NOT NULL,
      harvardCoins REAL NOT NULL DEFAULT 0,
      totalAssets REAL NOT NULL DEFAULT 0,
      assetsDisplay TEXT,
      level INTEGER DEFAULT 0,
      safeBox TEXT NOT NULL,
      stamina TEXT NOT NULL,
      awmAmmo INTEGER DEFAULT 0,
      trainingLevel TEXT,
      rangeLevel TEXT,
      knifeSkins TEXT DEFAULT '[]',
      operatorSkins TEXT DEFAULT '{}',
      price REAL NOT NULL DEFAULT 0,
      deposit REAL DEFAULT 0,
      note TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS sell_accounts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      userName TEXT,
      accountName TEXT DEFAULT '',
      region TEXT NOT NULL,
      server TEXT NOT NULL,
      loginType TEXT NOT NULL,
      totalAssets REAL NOT NULL DEFAULT 0,
      harvardCoins REAL NOT NULL DEFAULT 0,
      level INTEGER DEFAULT 0,
      rank TEXT NOT NULL,
      safeBox TEXT NOT NULL,
      stamina TEXT NOT NULL,
      trainingLevel TEXT,
      rangeLevel TEXT,
      awmAmmo INTEGER DEFAULT 0,
      sixSetHead INTEGER DEFAULT 0,
      sixSetArmor INTEGER DEFAULT 0,
      banRecord TEXT DEFAULT '无封禁记录',
      isOwnFace INTEGER DEFAULT 0,
      superGuarantee INTEGER DEFAULT 0,
      knifeSkins TEXT DEFAULT '[]',
      operatorSkins TEXT DEFAULT '{}',
      price REAL DEFAULT 0,
      note TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      submittedAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      mainInterface TEXT,
      warehouse TEXT,
      other TEXT
    )
  `);

  // Add new columns to existing database if they don't exist
  try {
    _db.run('ALTER TABLE sell_accounts ADD COLUMN sixSetHead INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists, ignore
  }
  try {
    _db.run('ALTER TABLE sell_accounts ADD COLUMN sixSetArmor INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists, ignore
  }

  _db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      expiresAt TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Insert default admin if not exists
  const adminExists = _db.exec('SELECT COUNT(*) as count FROM admin');
  if (adminExists[0]?.values[0][0] === 0) {
    _db.run(
      'INSERT INTO admin (username, password) VALUES (?, ?)',
      ['admin', 'Delta@Rent#2024!Secure']
    );
    console.log('Default admin created: admin / Delta@Rent#2024!Secure');
  }

  // Seed some sample rent accounts if table is empty
  const rentAccountCount = _db.exec('SELECT COUNT(*) as count FROM rent_accounts');
  if (rentAccountCount[0]?.values[0][0] === 0) {
    const now = new Date().toISOString();
    const sampleRentAccounts = [
      {
        id: 'SJZ307642',
        region: '广东省',
        server: 'QQ',
        loginType: 'account',
        rank: '钻石',
        harvardCoins: 5,
        totalAssets: 5,
        assetsDisplay: '5000万',
        level: 0,
        safeBox: '9grid',
        stamina: '7',
        awmAmmo: 70,
        trainingLevel: '7级',
        rangeLevel: '6级',
        knifeSkins: JSON.stringify(['电锯惊魂', '暗星']),
        operatorSkins: JSON.stringify({ '露娜': ['黑-天际线'], '无名': ['夜鹰'] }),
        price: 765,
        deposit: 559,
        note: '12格卡包，航天巴克...',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'SJZ308521',
        region: '浙江省',
        server: '微信',
        loginType: 'qrcode',
        rank: '黑鹰',
        harvardCoins: 8,
        totalAssets: 8,
        assetsDisplay: '8000万',
        level: 0,
        safeBox: '9grid',
        stamina: '7',
        awmAmmo: 120,
        trainingLevel: '7级',
        rangeLevel: '7级',
        knifeSkins: JSON.stringify(['怜悯', '影锋']),
        operatorSkins: JSON.stringify({ '威龙': ['凌霄戍卫', '蛟龙行动'], '红狼': ['蚀金玫瑰'] }),
        price: 1280,
        deposit: 800,
        note: '全皮肤，满级干员',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const account of sampleRentAccounts) {
      _db.run(`
        INSERT INTO rent_accounts (
          id, region, server, loginType, rank, harvardCoins, totalAssets, assetsDisplay,
          level, safeBox, stamina, awmAmmo, trainingLevel, rangeLevel,
          knifeSkins, operatorSkins, price, deposit, note, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        account.id, account.region, account.server, account.loginType, account.rank,
        account.harvardCoins, account.totalAssets, account.assetsDisplay, account.level,
        account.safeBox, account.stamina, account.awmAmmo, account.trainingLevel, account.rangeLevel,
        account.knifeSkins, account.operatorSkins, account.price, account.deposit,
        account.note, account.status, account.createdAt, account.updatedAt
      ]);
    }
    console.log(`Seeded ${sampleRentAccounts.length} sample rent accounts`);
  }

  console.log('Database initialized');
  return dbProxy;
}

export default dbProxy;
export { initDb };
