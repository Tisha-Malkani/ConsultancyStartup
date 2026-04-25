import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => process.env.JWT_SECRET;

// Hard protect — blocks unauthenticated requests
export const protect = async (req, res, next) => {
  let token;
  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    return res.status(500).json({ error: 'Authentication is not configured.' });
  }

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }
  res.status(401).json({ error: 'Not authorized, no token provided' });
};

// Soft protect — attaches user if token present, but doesn't block if not
export const optionalAuth = async (req, res, next) => {
  try {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      return next();
    }

    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer')) {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch {
    // token invalid or expired — just continue as guest
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
};
