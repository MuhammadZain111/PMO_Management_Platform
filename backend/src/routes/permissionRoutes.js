import { Router } from 'express';
import * as permissionController from '../controllers/permissionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requirePermission, requireRole } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createPermissionSchema, updatePermissionSchema, idParamSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('permissions.view'), permissionController.listPermissions);
router.get('/:id', validate(idParamSchema, 'params'), requirePermission('permissions.view'), permissionController.getPermission);

// Spec: "Only authorized PMO administrators should be allowed to create or
// modify permissions" — stricter than a plain permission check, so this is
// gated on the PMO_ADMIN role specifically, not just permissions.create.
router.post('/', requireRole('PMO_ADMIN'), validate(createPermissionSchema), permissionController.createPermission);
router.patch('/:id', validate(idParamSchema, 'params'), requireRole('PMO_ADMIN'), validate(updatePermissionSchema), permissionController.updatePermission);

export default router;
