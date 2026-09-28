import { z } from 'zod';

// ---- auth -------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().trim().email('Must be a valid email'),
  password: z.string().min(1, 'Password is required')
});

// ---- users -------------------------------------------------------------
export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleIds: z.array(z.number().int().positive()).optional()
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z.string().trim().email().optional()
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE'])
});

export const assignRoleSchema = z.object({
  roleId: z.number().int().positive()
});

export const assignPermissionSchema = z.object({
  permissionId: z.number().int().positive()
});

// ---- roles -------------------------------------------------------------
export const createRoleSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100)
    .regex(/^[A-Z0-9_]+$/, 'Role name must be UPPER_SNAKE_CASE'),
  description: z.string().trim().max(500).optional()
});

export const updateRoleSchema = z.object({
  name: z.string().trim().min(1).max(100).regex(/^[A-Z0-9_]+$/, 'Role name must be UPPER_SNAKE_CASE').optional(),
  description: z.string().trim().max(500).nullable().optional()
});

export const rolePermissionSchema = z.object({
  permissionId: z.number().int().positive()
});

// ---- permissions ---------------------------------------------------------
export const createPermissionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150)
    .regex(/^[a-z0-9_]+\.[a-z0-9_]+$/, 'Permission name must look like "module.action" (lowercase)'),
  description: z.string().trim().max(500).optional()
});

export const updatePermissionSchema = z.object({
  description: z.string().trim().max(500).optional()
});

// ---- projects -------------------------------------------------------------
export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(300),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional()
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional()
});

export const addProjectMemberSchema = z.object({
  userId: z.number().int().positive(),
  projectRole: z.enum(['PROJECT_MANAGER', 'PROJECT_MEMBER', 'VIEWER'])
});

// ---- shared param schemas ------------------------------------------------
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const userRoleParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  roleId: z.coerce.number().int().positive()
});

export const userPermissionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  permissionId: z.coerce.number().int().positive()
});

export const rolePermissionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  permissionId: z.coerce.number().int().positive()
});

export const projectMemberParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive()
});

