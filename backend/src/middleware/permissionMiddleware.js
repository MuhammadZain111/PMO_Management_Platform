import { hasPermission, hasRole } from '../services/permissionService.js';
import { Forbidden } from '../utils/AppError.js';

// Usage: router.post('/users', authenticate, requirePermission('users.create'), createUser)
// Must run after authenticate — relies on req.auth being set.
// PMO_ADMIN passes every check (see permissionService.hasPermission).
export function requirePermission(permissionName) {
  return (req, res, next) => {
    if (!hasPermission(req.auth, permissionName)) {
      return next(Forbidden(`You do not have permission to perform this action (requires "${permissionName}")`));
    }
    next();
  };
}

export function requireRole(roleName) {
  return (req, res, next) => {
    if (!hasRole(req.auth, roleName) && !req.auth?.isPmoAdmin) {
      return next(Forbidden(`This action requires the "${roleName}" role`));
    }
    next();
  };
}

// Accepts if the user has ANY of the given permissions.
export function requireAnyPermission(...permissionNames) {
  return (req, res, next) => {
    if (req.auth?.isPmoAdmin || permissionNames.some((p) => hasPermission(req.auth, p))) return next();
    return next(Forbidden('You do not have permission to perform this action'));
  };
}
