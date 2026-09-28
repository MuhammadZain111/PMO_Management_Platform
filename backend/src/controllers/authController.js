import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import * as authService from '../services/authService.js';
import { getUserAuthContext, serializeUser } from '../services/permissionService.js';
import { audit } from '../services/auditService.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

// Cookie options shared by every place that sets/clears the refresh cookie.
// httpOnly always on (never readable from JS — that's the point of using a
// cookie for the refresh token instead of localStorage). secure + sameSite
// tighten up automatically once NODE_ENV=production.
function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'strict' : 'lax',
    path: '/api/auth',
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000
  };
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, rawRefreshToken, user } = await authService.login(email, password);

  res.cookie(REFRESH_COOKIE_NAME, rawRefreshToken, refreshCookieOptions());
  await audit(user.id, 'auth.login', `user:${user.id}`);

  res.status(200).json({ success: true, data: { accessToken, user } });
});

export const refresh = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const { accessToken, rawRefreshToken: newRawRefreshToken, user } = await authService.rotateRefreshToken(rawRefreshToken);

  res.cookie(REFRESH_COOKIE_NAME, newRawRefreshToken, refreshCookieOptions());
  res.status(200).json({ success: true, data: { accessToken, user } });
});

export const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.logout(rawRefreshToken);
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
  if (req.auth?.userId) await audit(req.auth.userId, 'auth.logout', `user:${req.auth.userId}`);
  res.status(200).json({ success: true, data: {} });
});

export const me = asyncHandler(async (req, res) => {
  // authenticate middleware already loaded this fresh; req.auth.user is the
  // full Prisma row (with passwordHash) — never send that back as-is.
  const authContext = await getUserAuthContext(req.auth.userId);
  res.status(200).json({
    success: true,
    data: { user: serializeUser(authContext.user, authContext.roles, authContext.permissions) }
  });
});
