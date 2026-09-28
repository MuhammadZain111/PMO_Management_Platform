import prisma from '../config/prisma.js';

// Loads a user's roles + effective permission set (role permissions ∪ direct
// user permissions). This is the ONE place that computes "what can this user
// do" — middleware, controllers, and the /auth/me endpoint all call this
// instead of re-deriving it, so there's exactly one implementation to audit.
export async function getUserAuthContext(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } },
      userPermissions: { include: { permission: true } }
    }
  });

  if (!user) return null;

  const roles = user.userRoles.map((ur) => ur.role.name);
  const isPmoAdmin = roles.includes('PMO_ADMIN');

  const rolePermissionNames = user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.name));
  const directPermissionNames = user.userPermissions.map((up) => up.permission.name);
  const permissions = Array.from(new Set([...rolePermissionNames, ...directPermissionNames]));

  return { user, roles, permissions, isPmoAdmin };
}

// PMO_ADMIN bypasses every permission check (full unrestricted access), but
// this function is never used to bypass *authentication* — it only runs
// against an already-authenticated req.auth, never an anonymous request.
export function hasPermission(authContext, permissionName) {
  if (!authContext) return false;
  if (authContext.isPmoAdmin) return true;
  return authContext.permissions.includes(permissionName);
}

export function hasRole(authContext, roleName) {
  if (!authContext) return false;
  return authContext.roles.includes(roleName);
}

// Strips passwordHash and flattens role/permission rows into plain string
// arrays — the shape returned by /auth/login, /auth/me, and the users API.
export function serializeUser(user, roles = [], permissions = []) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles,
    permissions
  };
}
