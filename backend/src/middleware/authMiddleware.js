import { verifyAccessToken } from '../utils/token.js';
import { getUserAuthContext } from '../services/permissionService.js';
import { Unauthorized } from '../utils/AppError.js';

// Verifies the Bearer access token, loads the user's current roles/permissions
// fresh from the DB (not trusted from the token — see token.js comment), and
// attaches { userId, ...authContext } to req.auth. An unauthenticated request
// NEVER reaches req.auth being set to anything — it always throws 401 instead.
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) throw Unauthorized('Missing or invalid Authorization header');

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw Unauthorized('Access token is invalid or has expired');
    }

    const authContext = await getUserAuthContext(payload.sub);
    if (!authContext) throw Unauthorized('User no longer exists');
    if (authContext.user.status !== 'ACTIVE') throw Unauthorized('This account has been deactivated');

    req.auth = { userId: authContext.user.id, ...authContext };
    next();
  } catch (err) {
    next(err);
  }
}
