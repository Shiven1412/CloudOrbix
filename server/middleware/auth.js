import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'clmp-dev-secret';

export function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    },
    JWT_SECRET,
    { expiresIn: '12h' },
  );
}

export async function protectRoute(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await getUserByEmail(decoded.email);

    if (!user || !user.isActive) {
      return res.status(403).json({ message: 'Access Denied. Contact Application Administrator.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      isActive: user.isActive,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access Denied. Contact Application Administrator.' });
    }

    next();
  };
}
