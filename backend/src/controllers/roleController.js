import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFound, Conflict, Forbidden } from '../utils/AppError.js';
import { audit } from '../services/auditService.js';

const PMO_ADMIN_ROLE = 'PMO_ADMIN';

function serializeRole(role) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    createdAt: role.createdAt,
    permissions: role.rolePermissions?.map((rp) => rp.permission) ?? undefined,
    userCount: role._count?.userRoles ?? undefined
  };
}

export const listRoles = asyncHandler(async (req, res) => {
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: { rolePermissions: { include: { permission: true } }, _count: { select: { userRoles: true } } }
  });
  res.status(200).json({ success: true, data: roles.map(serializeRole) });
});

export const getRole = asyncHandler(async (req, res) => {
  const role = await prisma.role.findUnique({
    where: { id: req.params.id },
    include: { rolePermissions: { include: { permission: true } }, _count: { select: { userRoles: true } } }
  });
  if (!role) throw NotFound('Role not found');
  res.status(200).json({ success: true, data: serializeRole(role) });
});

export const createRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) throw Conflict('A role with this name already exists');

  // Only PMO_ADMIN may create another role literally named PMO_ADMIN-equivalent
  // full-access role is already prevented by name uniqueness; custom roles
  // created here are never isSystem, so they're always safely deletable later.
  const role = await prisma.role.create({ data: { name, description, isSystem: false } });
  await audit(req.auth.userId, 'role.created', `role:${role.id}`, { name });
  res.status(201).json({ success: true, data: serializeRole(role) });
});

export const updateRole = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw NotFound('Role not found');
  if (role.isSystem && req.body.name) throw Forbidden('System role names cannot be changed');

  const updated = await prisma.role.update({
    where: { id },
    data: {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.description !== undefined ? { description: req.body.description } : {})
    },
    include: { rolePermissions: { include: { permission: true } } }
  });

  await audit(req.auth.userId, 'role.updated', `role:${id}`, req.body);
  res.status(200).json({ success: true, data: serializeRole(updated) });
});

export const deleteRole = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { userRoles: true } } } });
  if (!role) throw NotFound('Role not found');

  if (role.isSystem) throw Forbidden(`"${role.name}" is a system role and cannot be deleted`);
  if (role._count.userRoles > 0) throw Conflict(`Cannot delete "${role.name}" — it is still assigned to ${role._count.userRoles} user(s)`);

  await prisma.role.delete({ where: { id } });
  await audit(req.auth.userId, 'role.deleted', `role:${id}`, { name: role.name });
  res.status(200).json({ success: true, data: {} });
});

export const addPermissionToRole = asyncHandler(async (req, res) => {
  const roleId = req.params.id;
  const { permissionId } = req.body;

  const [role, permission] = await Promise.all([
    prisma.role.findUnique({ where: { id: roleId } }),
    prisma.permission.findUnique({ where: { id: permissionId } })
  ]);
  if (!role) throw NotFound('Role not found');
  if (!permission) throw NotFound('Permission not found');

  if (role.name === PMO_ADMIN_ROLE && !req.auth.isPmoAdmin) {
    throw Forbidden('Only a PMO administrator can modify the PMO_ADMIN role');
  }

  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId, permissionId } },
    update: {},
    create: { roleId, permissionId }
  });

  await audit(req.auth.userId, 'role.permission.assigned', `role:${roleId}`, { permission: permission.name });
  const updated = await prisma.role.findUnique({ where: { id: roleId }, include: { rolePermissions: { include: { permission: true } } } });
  res.status(200).json({ success: true, data: serializeRole(updated) });
});

export const removePermissionFromRole = asyncHandler(async (req, res) => {
  const roleId = req.params.id;
  const permissionId = req.params.permissionId;

  const [role, permission] = await Promise.all([
    prisma.role.findUnique({ where: { id: roleId } }),
    prisma.permission.findUnique({ where: { id: permissionId } })
  ]);
  if (!role) throw NotFound('Role not found');
  if (!permission) throw NotFound('Permission not found');

  if (role.name === PMO_ADMIN_ROLE) {
    throw Forbidden('PMO_ADMIN always retains every permission and cannot have one removed');
  }

  await prisma.rolePermission.deleteMany({ where: { roleId, permissionId } });
  await audit(req.auth.userId, 'role.permission.removed', `role:${roleId}`, { permission: permission.name });
  const updated = await prisma.role.findUnique({ where: { id: roleId }, include: { rolePermissions: { include: { permission: true } } } });
  res.status(200).json({ success: true, data: serializeRole(updated) });
});
