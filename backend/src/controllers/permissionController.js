import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFound, Conflict } from '../utils/AppError.js';
import { audit } from '../services/auditService.js';

export const listPermissions = asyncHandler(async (req, res) => {
  const permissions = await prisma.permission.findMany({ orderBy: { name: 'asc' } });
  res.status(200).json({ success: true, data: permissions });
});

export const getPermission = asyncHandler(async (req, res) => {
  const permission = await prisma.permission.findUnique({ where: { id: req.params.id } });
  if (!permission) throw NotFound('Permission not found');
  res.status(200).json({ success: true, data: permission });
});

// Only reachable by PMO_ADMIN (see permissionRoutes.js) — creating/editing the
// permission catalog itself is the most privileged operation in the system,
// since it defines what "having a permission" even means.
export const createPermission = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const existing = await prisma.permission.findUnique({ where: { name } });
  if (existing) throw Conflict('A permission with this name already exists');

  const permission = await prisma.permission.create({ data: { name, description } });
  await audit(req.auth.userId, 'permission.created', `permission:${permission.id}`, { name });
  res.status(201).json({ success: true, data: permission });
});

export const updatePermission = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) throw NotFound('Permission not found');

  const updated = await prisma.permission.update({
    where: { id },
    data: { description: req.body.description }
  });

  await audit(req.auth.userId, 'permission.updated', `permission:${id}`, req.body);
  res.status(200).json({ success: true, data: updated });
});
