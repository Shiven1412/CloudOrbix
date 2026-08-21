import express from 'express';
import { getUserByEmail, createAuditEntry, verifyPassword } from '../db.js';
import { generateToken, protectRoute } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await getUserByEmail(normalizedEmail);
  if (!user || !user.isActive) {
    createAuditEntry(normalizedEmail, 'User Login Failed', null, 'Access denied');
    return res.status(403).json({ message: 'Access Denied. Contact Application Administrator.' });
  }

  const passwordMatches = user.password?.startsWith('$2')
    ? await verifyPassword(password, user.password)
    : String(user.password) === String(password);

  if (!passwordMatches) {
    createAuditEntry(normalizedEmail, 'User Login Failed', null, 'Invalid password');
    return res.status(403).json({ message: 'Access Denied. Contact Application Administrator.' });
  }

  const token = generateToken(user);
  createAuditEntry(user.email, 'User Login', null, 'Successful login');

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      isActive: user.isActive,
    },
  });
});

router.post('/sso', async (req, res) => {
  const { email } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: 'Company email is required.' });
  }

  const user = await getUserByEmail(normalizedEmail);
  if (!user || !user.isActive) {
    createAuditEntry(normalizedEmail, 'User Login Failed', null, 'SSO user not allowed');
    return res.status(403).json({ message: 'Access Denied. Contact Application Administrator.' });
  }

  const token = generateToken(user);
  createAuditEntry(user.email, 'User Login', null, 'Entra ID SSO login');

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      isActive: user.isActive,
    },
  });
});

router.get('/me', protectRoute, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
