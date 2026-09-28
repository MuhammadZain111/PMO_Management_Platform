import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFound, Conflict, Forbidden } from '../utils/AppError.js';
import { hashPassword } from '../services/authService.js';
import { getUserAuthContext, serializeUser } from '../services/permissionService.js';
import { audit } from '../services/auditService.js';

const PMO_ADMIN_ROLE = 'PMO_ADMIN';

async function loadSerializedUser(id) {
  const ctx = await getUserAuthContext(id);
  if (!ctx) return null;
  return serializeUser(ctx.user, ctx.roles, ctx.permissions);
}

export const listUsers = asyncHandler(async (req, res) => {
  const { search, status, roleId } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: String(search), mode: 'insensitive' } },
            { email: { contains: String(search), mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(roleId ? { userRoles: { some: { roleId: Number(roleId) } } } : {})
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { userRoles: { include: { role: true } }, userPermissions: { include: { permission: true } } }
  });

  const data = users.map((u) =>
    serializeUser(
      u,
      u.userRoles.map((ur) => ur.role.name),
      Array.from(new Set([
        ...u.userRoles.flatMap(() => []), // role-derived permissions omitted from list view for performance
        ...u.userPermissions.map((up) => up.permission.name)
      ]))
    )
  );

  res.status(200).json({ success: true, data });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await loadSerializedUser(req.params.id);
  if (!user) throw NotFound('User not found');
  res.status(200).json({ success: true, data: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, roleIds } = req.body;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw Conflict('A user with this email already exists');

  // Guard: creating a user directly into PMO_ADMIN requires the actor to
  // already be PMO_ADMIN — same rule as assignRole below, checked up front.
  if (roleIds?.length) {
    const roles = await prisma.role.findMany({ where: { id: { in: roleIds } } });
    if (roles.some((r) => r.name === PMO_ADMIN_ROLE) && !req.auth.isPmoAdmin) {
      throw Forbidden('Only a PMO administrator can grant the PMO_ADMIN role');
    }
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      ...(roleIds?.length ? { userRoles: { create: roleIds.map((roleId) => ({ roleId })) } } : {})
    }
  });

  await audit(req.auth.userId, 'user.created', `user:${user.id}`, { email: user.email });
  res.status(201).json({ success: true, data: await loadSerializedUser(user.id) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw NotFound('User not found');

  if (email && email.toLowerCase() !== target.email) {
    const clash = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (clash) throw Conflict('A user with this email already exists');
  }

  await prisma.user.update({
    where: { id },
    data: { ...(name ? { name } : {}), ...(email ? { email: email.toLowerCase() } : {}) }
  });

  await audit(req.auth.userId, 'user.updated', `user:${id}`, { name, email });
  res.status(200).json({ success: true, data: await loadSerializedUser(id) });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw NotFound('User not found');
  if (id === req.auth.userId) throw Forbidden('You cannot delete your own account');

  // Soft delete: PMO systems need the audit trail and history (project
  // membership, audit logs referencing this user) to survive. Deactivating
  // is the practical "delete" — hard delete is available via status=INACTIVE
  // followed by a real DB-level purge if ever truly needed.
  await prisma.user.update({ where: { id }, data: { status: 'INACTIVE' } });
  await prisma.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });

  await audit(req.auth.userId, 'user.deleted', `user:${id}`);
  res.status(200).json({ success: true, data: {} });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw NotFound('User not found');
  if (id === req.auth.userId && status === 'INACTIVE') throw Forbidden('You cannot deactivate your own account');

  await prisma.user.update({ where: { id }, data: { status } });
  if (status === 'INACTIVE') {
    await prisma.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  await audit(req.auth.userId, status === 'ACTIVE' ? 'user.reactivated' : 'user.deactivated', `user:${id}`);
  res.status(200).json({ success: true, data: await loadSerializedUser(id) });
});

export const assignRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { roleId } = req.body;

  const [target, role] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.role.findUnique({ where: { id: roleId } })
  ]);
  if (!target) throw NotFound('User not found');
  if (!role) throw NotFound('Role not found');

  // The privilege-escalation guard the spec calls out explicitly: granting
  // PMO_ADMIN requires the actor to already BE PMO_ADMIN, full stop — having
  // users.update (which e.g. PMO_MANAGER might have) is not enough on its own.
  if (role.name === PMO_ADMIN_ROLE && !req.auth.isPmoAdmin) {
    throw Forbidden('Only a PMO administrator can grant the PMO_ADMIN role');
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId, roleId } },
    update: {},
    create: { userId, roleId }
  });

  await audit(req.auth.userId, 'role.assigned', `user:${userId}`, { role: role.name });
  res.status(200).json({ success: true, data: await loadSerializedUser(userId) });
});

export const removeRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const roleId = req.params.roleId;

  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw NotFound('Role not found');

  if (role.name === PMO_ADMIN_ROLE && !req.auth.isPmoAdmin) {
    throw Forbidden('Only a PMO administrator can remove the PMO_ADMIN role');
  }
  if (role.name === PMO_ADMIN_ROLE && userId === req.auth.userId) {
    const remainingAdmins = await prisma.userRole.count({ where: { roleId, NOT: { userId } } });
    if (remainingAdmins === 0) throw Forbidden('Cannot remove the last remaining PMO_ADMIN');
  }

  await prisma.userRole.deleteMany({ where: { userId, roleId } });
  await audit(req.auth.userId, 'role.removed', `user:${userId}`, { role: role.name });
  res.status(200).json({ success: true, data: await loadSerializedUser(userId) });
});

export const assignPermission = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { permissionId } = req.body;

  const [target, permission] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.permission.findUnique({ where: { id: permissionId } })
  ]);
  if (!target) throw NotFound('User not found');
  if (!permission) throw NotFound('Permission not found');

  await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId, permissionId } },
    update: {},
    create: { userId, permissionId }
  });

  await audit(req.auth.userId, 'permission.assigned', `user:${userId}`, { permission: permission.name });
  res.status(200).json({ success: true, data: await loadSerializedUser(userId) });
});

export const removePermission = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const permissionId = req.params.permissionId;

  const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
  if (!permission) throw NotFound('Permission not found');

  await prisma.userPermission.deleteMany({ where: { userId, permissionId } });
  await audit(req.auth.userId, 'permission.removed', `user:${userId}`, { permission: permission.name });
  res.status(200).json({ success: true, data: await loadSerializedUser(userId) });
});
