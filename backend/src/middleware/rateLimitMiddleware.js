import rateLimit from 'express-rate-limit';

// Applied only to the auth routes (login/refresh) — the ones worth throttling
// against brute-force/credential-stuffing. Keyed by IP by default.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' }
});
