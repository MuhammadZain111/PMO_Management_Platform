import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requirePermission } from '../middleware/permissionMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  idParamSchema,
  projectMemberParamsSchema
} from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

// Listing/reading a single project is authorized per-project inside the
// controller (canAccessProject) rather than a blanket permission — see
// projectAccessService.js. Everything else below is a global permission gate.
router.get('/', projectController.listProjects);
router.get('/:id', validate(idParamSchema, 'params'), projectController.getProject);

router.post('/', requirePermission('projects.create'), validate(createProjectSchema), projectController.createProject);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', validate(idParamSchema, 'params'), requirePermission('projects.delete'), projectController.deleteProject);

router.post(
  '/:id/members',
  validate(idParamSchema, 'params'),
  requirePermission('projects.manage_access'),
  validate(addProjectMemberSchema),
  projectController.addProjectMember
);
router.delete(
  '/:id/members/:userId',
  validate(projectMemberParamsSchema, 'params'),
  requirePermission('projects.manage_access'),
  projectController.removeProjectMember
);

export default router;
