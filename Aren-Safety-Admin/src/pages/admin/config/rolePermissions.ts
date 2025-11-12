import type { UserRole, Permission } from '@/shared/types/tenant';

// Role display names
export const ROLE_NAMES: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  tenant_owner: 'Tenant Owner',
  tenant_admin: 'Tenant Admin',
  head_of_safety: 'Head of Safety',
  inspector: 'Inspector',
  department_supervisor: 'Department Supervisor',
  manager: 'Manager',
  viewer: 'Viewer',
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: 'Full platform access across all tenants',
  tenant_owner: 'Full access to tenant including billing and user management',
  tenant_admin: 'Full access to tenant except billing settings',
  head_of_safety: 'Safety management and advanced analytics access',
  inspector: 'Can create and edit observations and warnings',
  department_supervisor: 'Department-level observation and employee access',
  manager: 'Limited read and basic operation access',
  viewer: 'Read-only access to all modules',
};

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'employees:view',
    'employees:create',
    'employees:edit',
    'employees:delete',
    'observations:view',
    'observations:create',
    'observations:edit',
    'observations:delete',
    'observations:export',
    'warnings:view',
    'warnings:create',
    'warnings:approve',
    'analytics:view',
    'analytics:advanced',
    'analytics:heatmap',
    'settings:view',
    'settings:edit',
    'settings:billing',
    'settings:users',
    'settings:branding',
    'data:export',
    'data:import',
    'data:api_access',
  ],
  tenant_owner: [
    'employees:view',
    'employees:create',
    'employees:edit',
    'employees:delete',
    'observations:view',
    'observations:create',
    'observations:edit',
    'observations:delete',
    'observations:export',
    'warnings:view',
    'warnings:create',
    'warnings:approve',
    'analytics:view',
    'analytics:advanced',
    'analytics:heatmap',
    'settings:view',
    'settings:edit',
    'settings:billing',
    'settings:users',
    'settings:branding',
    'data:export',
    'data:import',
  ],
  tenant_admin: [
    'employees:view',
    'employees:create',
    'employees:edit',
    'employees:delete',
    'observations:view',
    'observations:create',
    'observations:edit',
    'observations:delete',
    'observations:export',
    'warnings:view',
    'warnings:create',
    'warnings:approve',
    'analytics:view',
    'analytics:advanced',
    'analytics:heatmap',
    'settings:view',
    'settings:edit',
    'settings:users',
    'data:export',
    'data:import',
  ],
  head_of_safety: [
    'employees:view',
    'observations:view',
    'observations:create',
    'observations:edit',
    'observations:export',
    'warnings:view',
    'warnings:create',
    'warnings:approve',
    'analytics:view',
    'analytics:advanced',
    'data:export',
  ],
  inspector: [
    'employees:view',
    'observations:view',
    'observations:create',
    'observations:edit',
    'warnings:view',
    'warnings:create',
    'analytics:view',
  ],
  department_supervisor: [
    'employees:view',
    'observations:view',
    'observations:create',
    'warnings:view',
    'analytics:view',
  ],
  manager: [
    'employees:view',
    'observations:view',
    'warnings:view',
    'analytics:view',
  ],
  viewer: [
    'employees:view',
    'observations:view',
    'warnings:view',
    'analytics:view',
  ],
};

// Permission display names
export const PERMISSION_NAMES: Record<Permission, string> = {
  'employees:view': 'View Employees',
  'employees:create': 'Create Employees',
  'employees:edit': 'Edit Employees',
  'employees:delete': 'Delete Employees',
  'observations:view': 'View Observations',
  'observations:create': 'Create Observations',
  'observations:edit': 'Edit Observations',
  'observations:delete': 'Delete Observations',
  'observations:export': 'Export Observations',
  'warnings:view': 'View Warnings',
  'warnings:create': 'Create Warnings',
  'warnings:approve': 'Approve Warnings',
  'analytics:view': 'View Analytics',
  'analytics:advanced': 'Advanced Analytics',
  'analytics:heatmap': 'Heatmap Analytics',
  'settings:view': 'View Settings',
  'settings:edit': 'Edit Settings',
  'settings:billing': 'Manage Billing',
  'settings:users': 'Manage Users',
  'settings:branding': 'Manage Branding',
  'data:export': 'Export Data',
  'data:import': 'Import Data',
  'data:api_access': 'API Access',
};

// Permission categories for organized display
export const PERMISSION_CATEGORIES = {
  'Employee Management': [
    'employees:view',
    'employees:create',
    'employees:edit',
    'employees:delete',
  ] as Permission[],
  'Observations': [
    'observations:view',
    'observations:create',
    'observations:edit',
    'observations:delete',
    'observations:export',
  ] as Permission[],
  'Warnings & Fines': [
    'warnings:view',
    'warnings:create',
    'warnings:approve',
  ] as Permission[],
  'Analytics': [
    'analytics:view',
    'analytics:advanced',
    'analytics:heatmap',
  ] as Permission[],
  'Settings': [
    'settings:view',
    'settings:edit',
    'settings:billing',
    'settings:users',
    'settings:branding',
  ] as Permission[],
  'Data Management': [
    'data:export',
    'data:import',
    'data:api_access',
  ] as Permission[],
};

// Get permissions for a specific role
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Check if a role has a specific permission
export const roleHasPermission = (role: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};
