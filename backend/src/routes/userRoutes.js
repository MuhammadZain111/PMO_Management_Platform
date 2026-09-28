import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  assignRoleSchema,
  assignPermissionSchema,
  idParamSchema,
  userRoleParamsSchema,
  userPermissionParamsSchema
} from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('users.view'), userController.listUsers);
router.get('/:id', validate(idParamSchema, 'params'), requirePermission('users.view'), userController.getUser);
router.post('/', requirePermission('users.create'), validate(createUserSchema), userController.createUser);
router.patch('/:id', validate(idParamSchema, 'params'), requirePermission('users.update'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', validate(idParamSchema, 'params'), requirePermission('users.delete'), userController.deleteUser);

router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  requirePermission('users.update'),
  validate(updateUserStatusSchema),
  userController.updateUserStatus
);

router.post('/:id/roles', validate(idParamSchema, 'params'), requirePermission('users.update'), validate(assignRoleSchema), userController.assignRole);
router.delete('/:id/roles/:roleId', validate(userRoleParamsSchema, 'params'), requirePermission('users.update'), userController.removeRole);

router.post(
  '/:id/permissions',
  validate(idParamSchema, 'params'),
  requirePermission('permissions.assign'),
  validate(assignPermissionSchema),
  userController.assignPermission
);
router.delete(
  '/:id/permissions/:permissionId',
  validate(userPermissionParamsSchema, 'params'),
  requirePermission('permissions.assign'),
  userController.removePermission
);

export default router;
