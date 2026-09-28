import { Router } from 'express';
import * as roleController from '../controllers/roleController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createRoleSchema,
  updateRoleSchema,
  rolePermissionSchema,
  idParamSchema,
  rolePermissionParamsSchema
} from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('roles.view'), roleController.listRoles);
router.get('/:id', validate(idParamSchema, 'params'), requirePermission('roles.view'), roleController.getRole);
router.post('/', requirePermission('roles.create'), validate(createRoleSchema), roleController.createRole);
router.patch('/:id', validate(idParamSchema, 'params'), requirePermission('roles.update'), validate(updateRoleSchema), roleController.updateRole);
router.delete('/:id', validate(idParamSchema, 'params'), requirePermission('roles.delete'), roleController.deleteRole);

router.post(
  '/:id/permissions',
  validate(idParamSchema, 'params'),
  requirePermission('permissions.assign'),
  validate(rolePermissionSchema),
  roleController.addPermissionToRole
);
router.delete(
  '/:id/permissions/:permissionId',
  validate(rolePermissionParamsSchema, 'params'),
  requirePermission('permissions.assign'),
  roleController.removePermissionFromRole
);

export default router;
