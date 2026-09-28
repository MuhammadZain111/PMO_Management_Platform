import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../config/env.js';

// Access token: short-lived, carries just the user id. Roles/permissions are
// re-fetched from the DB on every request (see authMiddleware) rather than
// trusted from the token, so a permission change takes effect immediately
// instead of waiting for the token to expire.
export function signAccessToken(userId) {
  return jwt.sign({ sub: userId, type: 'access' }, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret); // throws on invalid/expired
}

// Refresh token: a random opaque string, not a JWT — nothing to "decode",
// its only job is to be an unguessable bearer secret. We store its SHA-256
// hash in the DB (never the raw value) so a DB leak doesn't leak usable tokens.
export function generateRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export function refreshTokenExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + env.refreshTokenTtlDays);
  return d;
}
