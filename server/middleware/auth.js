import jwt from 'jsonwebtoken';

const JWT_SECRET = 'dR7#kL9$mN2@vB5*wQ8^jH4&cF6';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '未授权访问' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' });
    }
    req.admin = decoded;
    next();
  });
}

export function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export { JWT_SECRET };
