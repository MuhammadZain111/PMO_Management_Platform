import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFound, Forbidden, Conflict } from '../utils/AppError.js';
import { hasPermission } from '../services/permissionService.js';
import { canAccessProject, canManageProject, getMembership } from '../services/projectAccessService.js';
import { audit } from '../services/auditService.js';

function serializeProject(project) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    members: project.members?.map((m) => ({
      id: m.id,
      userId: m.userId,
      projectRole: m.projectRole,
      user: m.user ? { id: m.user.id, name: m.user.name, email: m.user.email } : undefined
    }))
  };
}

// List: PMO_ADMIN / anyone with projects.view + a PMO-level role sees every
// project; everyone else only sees projects they're a ProjectMember of.
// This is the list-level equivalent of the canAccessProject check.
export const listProjects = asyncHandler(async (req, res) => {
  const seesAll = req.auth.isPmoAdmin || (req.auth.roles.includes('PMO_MANAGER') && hasPermission(req.auth, 'projects.view'));

  const projects = await prisma.project.findMany({
    where: seesAll ? {} : { members: { some: { userId: req.auth.userId } } },
    orderBy: { createdAt: 'desc' },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
  });

  res.status(200).json({ success: true, data: projects.map(serializeProject) });
});

export const getProject = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!(await canAccessProject(req.auth.userId, id, req.auth))) throw Forbidden('You do not have access to this project');

  const project = await prisma.project.findUnique({
    where: { id },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
  });
  if (!project) throw NotFound('Project not found');
  res.status(200).json({ success: true, data: serializeProject(project) });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.create({ data: req.body });
  await audit(req.auth.userId, 'project.created', `project:${project.id}`, { name: project.name });
  res.status(201).json({ success: true, data: serializeProject(project) });
});

export const updateProject = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!(await canManageProject(req.auth.userId, id, req.auth))) throw Forbidden('You cannot manage this project');

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw NotFound('Project not found');

  const project = await prisma.project.update({ where: { id }, data: req.body });
  await audit(req.auth.userId, 'project.updated', `project:${id}`, req.body);
  res.status(200).json({ success: true, data: serializeProject(project) });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw NotFound('Project not found');

  await prisma.project.delete({ where: { id } });
  await audit(req.auth.userId, 'project.deleted', `project:${id}`, { name: existing.name });
  res.status(200).json({ success: true, data: {} });
});

// ---- Project Access (ProjectMember) — the "Project Access" admin page ----

export const addProjectMember = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const { userId, projectRole } = req.body;

  const [project, user] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma.user.findUnique({ where: { id: userId } })
  ]);
  if (!project) throw NotFound('Project not found');
  if (!user) throw NotFound('User not found');

  const existing = await getMembership(userId, projectId);
  if (existing) throw Conflict('This user is already a member of this project');

  const member = await prisma.projectMember.create({ data: { projectId, userId, projectRole } });
  await audit(req.auth.userId, 'project.access.granted', `project:${projectId}`, { userId, projectRole });
  res.status(201).json({ success: true, data: member });
});

export const removeProjectMember = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  const existing = await getMembership(userId, projectId);
  if (!existing) throw NotFound('This user is not a member of this project');

  await prisma.projectMember.delete({ where: { id: existing.id } });
  await audit(req.auth.userId, 'project.access.removed', `project:${projectId}`, { userId });
  res.status(200).json({ success: true, data: {} });
});
