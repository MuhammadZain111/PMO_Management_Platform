// Single source of truth for the RBAC taxonomy. Both the seed script and any
// code that needs to reference a permission/role name by string imports from here,
// so there is exactly one place that defines what exists.

export const PERMISSIONS = [
  // Users
  { name: 'users.view', description: 'View users' },
  { name: 'users.create', description: 'Create users' },
  { name: 'users.update', description: 'Edit users' },
  { name: 'users.delete', description: 'Delete/deactivate users' },
  // Roles
  { name: 'roles.view', description: 'View roles' },
  { name: 'roles.create', description: 'Create roles' },
  { name: 'roles.update', description: 'Edit roles' },
  { name: 'roles.delete', description: 'Delete roles' },
  // Permissions
  { name: 'permissions.view', description: 'View permissions' },
  { name: 'permissions.create', description: 'Create permissions' },
  { name: 'permissions.assign', description: 'Assign permissions to roles or users' },
  // Projects
  { name: 'projects.view', description: 'View projects' },
  { name: 'projects.create', description: 'Create projects' },
  { name: 'projects.update', description: 'Edit projects' },
  { name: 'projects.delete', description: 'Delete projects' },
  { name: 'projects.manage_access', description: 'Assign/remove project members' },
  // Milestones (part of the existing Project Plan module)
  { name: 'milestones.view', description: 'View milestones' },
  { name: 'milestones.create', description: 'Create milestones' },
  { name: 'milestones.update', description: 'Edit milestones' },
  { name: 'milestones.delete', description: 'Delete milestones' },
  // RAID (not yet built in the existing frontend — permission reserved for it)
  { name: 'raid.view', description: 'View RAID log' },
  { name: 'raid.create', description: 'Create RAID entries' },
  { name: 'raid.update', description: 'Edit RAID entries' },
  { name: 'raid.delete', description: 'Delete RAID entries' },
  // Actions (not yet built in the existing frontend — permission reserved for it)
  { name: 'actions.view', description: 'View action items' },
  { name: 'actions.create', description: 'Create action items' },
  { name: 'actions.update', description: 'Edit action items' },
  { name: 'actions.delete', description: 'Delete action items' },
  // Dashboard
  { name: 'dashboard.view', description: 'View the portfolio dashboard' }
];

export const PERMISSION_NAMES = PERMISSIONS.map((p) => p.name);

// Roles and the permissions each one gets by default at seed time.
// PMO_ADMIN gets every permission (see seed.js) and additionally bypasses
// permission checks entirely in code — see permissionService.userHasPermission.
export const ROLES = [
  { name: 'PMO_ADMIN', description: 'Full unrestricted access to the PMO system', isSystem: true, permissions: 'ALL' },
  {
    name: 'PMO_MANAGER',
    description: 'Manages PMO operations across all projects',
    isSystem: true,
    permissions: [
      'dashboard.view',
      'projects.view', 'projects.create', 'projects.update', 'projects.manage_access',
      'milestones.view', 'milestones.create', 'milestones.update', 'milestones.delete',
      'raid.view', 'raid.create', 'raid.update', 'raid.delete',
      'actions.view', 'actions.create', 'actions.update', 'actions.delete',
      'users.view'
    ]
  },
  {
    name: 'PROJECT_MANAGER',
    description: 'Manages the projects they are assigned to',
    isSystem: true,
    permissions: [
      'dashboard.view',
      'projects.view', 'projects.update',
      'milestones.view', 'milestones.create', 'milestones.update', 'milestones.delete',
      'raid.view', 'raid.create', 'raid.update', 'raid.delete',
      'actions.view', 'actions.create', 'actions.update', 'actions.delete'
    ]
  },
  {
    name: 'PROJECT_MEMBER',
    description: 'Contributes to the projects they belong to',
    isSystem: true,
    permissions: [
      'dashboard.view',
      'projects.view',
      'milestones.view', 'milestones.update',
      'raid.view', 'raid.create', 'raid.update',
      'actions.view', 'actions.create', 'actions.update'
    ]
  },
  {
    name: 'EXECUTIVE',
    description: 'Read-only dashboard and portfolio access',
    isSystem: true,
    permissions: ['dashboard.view', 'projects.view', 'milestones.view', 'raid.view', 'actions.view']
  },
  {
    name: 'VIEWER',
    description: 'Basic read-only access',
    isSystem: true,
    permissions: ['dashboard.view', 'projects.view']
  }
];
