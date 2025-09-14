import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL_DAYS = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10);

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export function generateRefreshTokenString() {
  return crypto.randomBytes(48).toString('hex');
}

export function refreshTokenExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return d;
}
