// backend/src/utils/jwt.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Authorization header required' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid Authorization header' });
  const token = parts[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { signToken, verifyToken, authMiddleware };
