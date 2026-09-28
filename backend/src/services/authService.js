import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { getUserAuthContext, serializeUser } from './permissionService.js';
import { signAccessToken, generateRefreshToken, hashToken, refreshTokenExpiry } from '../utils/token.js';

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

// Issues a fresh access token + a fresh refresh token (rows are inserted,
// never updated in place) and stores only the refresh token's hash.
async function issueTokens(userId) {
  const accessToken = signAccessToken(userId);
  const rawRefreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(rawRefreshToken), expiresAt: refreshTokenExpiry() }
  });
  return { accessToken, rawRefreshToken };
}

export async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Same error for "no such user" and "wrong password" — don't leak which one.
  if (!user) throw new AppError('Invalid email or password', 401);

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) throw new AppError('Invalid email or password', 401);

  if (user.status !== 'ACTIVE') throw new AppError('This account has been deactivated', 401);

  const authContext = await getUserAuthContext(user.id);
  const { accessToken, rawRefreshToken } = await issueTokens(user.id);

  return {
    accessToken,
    rawRefreshToken,
    user: serializeUser(authContext.user, authContext.roles, authContext.permissions)
  };
}

// Refresh token rotation: the incoming token is looked up by hash, checked
// for expiry/revocation, immediately revoked, and a brand new one issued.
// If someone replays an already-used (revoked) refresh token, we treat that
// as a signal of possible theft and revoke every refresh token for that user.
export async function rotateRefreshToken(rawRefreshToken) {
  if (!rawRefreshToken) throw new AppError('No refresh token provided', 401);

  const tokenHash = hashToken(rawRefreshToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing) throw new AppError('Invalid refresh token', 401);

  if (existing.revokedAt) {
    // Reuse of a revoked token — possible theft. Nuke all sessions for this user.
    await prisma.refreshToken.updateMany({
      where: { userId: existing.userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
    throw new AppError('Refresh token has already been used. All sessions have been revoked, please log in again.', 401);
  }

  if (existing.expiresAt < new Date()) throw new AppError('Refresh token has expired', 401);

  const user = await prisma.user.findUnique({ where: { id: existing.userId } });
  if (!user || user.status !== 'ACTIVE') throw new AppError('Account is not active', 401);

  await prisma.refreshToken.update({ where: { id: existing.id }, data: { revokedAt: new Date() } });

  const authContext = await getUserAuthContext(user.id);
  const { accessToken, rawRefreshToken: newRawRefreshToken } = await issueTokens(user.id);

  return {
    accessToken,
    rawRefreshToken: newRawRefreshToken,
    user: serializeUser(authContext.user, authContext.roles, authContext.permissions)
  };
}

export async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}
