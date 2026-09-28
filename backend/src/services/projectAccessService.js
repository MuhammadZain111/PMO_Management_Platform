import prisma from '../config/prisma.js';
import { hasPermission } from './permissionService.js';

// Project-level access is deliberately NOT derived from global roles.
// Having the PROJECT_MANAGER role does not grant access to any project by
// itself — only a ProjectMember row does. This is what stops Ahmed
// (PROJECT_MANAGER on Project A) from touching Project B.

async function getMembership(userId, projectId) {
  return prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: Number(projectId), userId: Number(userId) } }
  });
}

// Can the user view/read this project's data?
export async function canAccessProject(userId, projectId, authContext) {
  if (authContext?.isPmoAdmin) return true; // PMO_ADMIN accesses every project
  if (hasPermission(authContext, 'projects.view') && authContext.roles.includes('PMO_MANAGER')) return true; // PMO_MANAGER per spec
  const membership = await getMembership(userId, projectId);
  return !!membership;
}

// Can the user manage (edit/delete/manage milestones etc.) this specific project?
export async function canManageProject(userId, projectId, authContext) {
  if (authContext?.isPmoAdmin) return true;
  if (authContext.roles.includes('PMO_MANAGER') && hasPermission(authContext, 'projects.update')) return true;
  const membership = await getMembership(userId, projectId);
  return membership?.projectRole === 'PROJECT_MANAGER';
}

export { getMembership };
