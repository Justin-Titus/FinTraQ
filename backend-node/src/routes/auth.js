import express from 'express';
import cookieParser from 'cookie-parser';
import User from '../models/User.js';
import { signAccessToken, generateRefreshTokenString, refreshTokenExpiryDate } from '../utils/tokens.js';
import { registerSchema, loginSchema, sanitizeString, normalizeEmail } from '../utils/validation.js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const REFRESH_COOKIE_NAME = 'rt';
const REMEMBER_COOKIE_NAME = 'rm';

function setRememberCookie(res, persistent) {
  // Store a simple flag for persistence to reapply on token rotation
  if (persistent) {
    res.cookie(REMEMBER_COOKIE_NAME, '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 1000 * 60 * 60 * 24 * (parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10)),
    });
  } else {
    // Clear remember flag for session-only
    res.clearCookie(REMEMBER_COOKIE_NAME, { path: '/api/auth' });
  }
}

function setRefreshCookie(res, token, persistent = true) {
  const cookieBase = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  };
  if (persistent) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      ...cookieBase,
      maxAge: 1000 * 60 * 60 * 24 * (parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10)),
    });
  } else {
    // Session cookie (no maxAge)
    res.cookie(REFRESH_COOKIE_NAME, token, cookieBase);
  }
  setRememberCookie(res, persistent);
}

// Rate limiters for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const raw = {
      name: sanitizeString(req.body?.name),
      email: normalizeEmail(req.body?.email),
      password: sanitizeString(req.body?.password),
    };
    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues?.[0]?.message || 'Invalid input' });
    }
    const { name, email, password } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'user' });
    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = generateRefreshTokenString();
    user.refreshTokens.push({ token: refreshToken, expiresAt: refreshTokenExpiryDate() });
    await user.save();

    // Default to persistent cookie on register
    setRefreshCookie(res, refreshToken, true);
    return res.status(201).json({ user: user.toJSON(), accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const raw = {
      email: normalizeEmail(req.body?.email),
      password: sanitizeString(req.body?.password),
    };
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues?.[0]?.message || 'Invalid input' });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = generateRefreshTokenString();

    // Optionally remove expired tokens
    user.refreshTokens = user.refreshTokens.filter(rt => !rt.expiresAt || rt.expiresAt > new Date());
    user.refreshTokens.push({ token: refreshToken, expiresAt: refreshTokenExpiryDate(), userAgent: req.headers['user-agent'], ip: req.ip });
    await user.save();

    // Respect remember flag from client (default true if omitted)
    const persistent = req.body?.remember !== false;
    setRefreshCookie(res, refreshToken, persistent);
    return res.json({ user: user.toJSON(), accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Google login removed

// Refresh token (rotation)
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    if (!user) {
      // Clear cookie if token is not found
      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Find the exact token entry
    const tokenEntry = user.refreshTokens.find(rt => rt.token === refreshToken);
    if (!tokenEntry || (tokenEntry.expiresAt && tokenEntry.expiresAt <= new Date())) {
      // Remove expired/invalid token
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
      await user.save();
      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
      return res.status(401).json({ error: 'Expired refresh token' });
    }

    // Rotate: remove old, add new
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    const newRefreshToken = generateRefreshTokenString();
    user.refreshTokens.push({ token: newRefreshToken, expiresAt: refreshTokenExpiryDate(), userAgent: req.headers['user-agent'], ip: req.ip });
    await user.save();

    // Issue new access token
    const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role });

    // Preserve persistence behavior across rotation using remember flag cookie
    const persistent = req.cookies?.[REMEMBER_COOKIE_NAME] === '1';
    setRefreshCookie(res, newRefreshToken, persistent);
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (refreshToken) {
      const user = await User.findOne({ 'refreshTokens.token': refreshToken });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
        await user.save();
      }
    }
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
    res.clearCookie(REMEMBER_COOKIE_NAME, { path: '/api/auth' });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    // Require valid access token
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    delete user.refreshTokens;
    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});


export default router;
