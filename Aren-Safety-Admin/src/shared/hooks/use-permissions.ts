/**
 * RBAC Permissions Hook
 *
 * Provides role-based access control utilities for checking user permissions
 * Integrates with auth and tenant stores for multi-tenant RBAC
 */

import { useMemo } from 'react';
import { useIsSuperAdmin } from '../stores/auth-store';
import { useCurrentTenantRole, useIsImpersonating } from '../stores/tenant-store';
import type { Permission, UserRole } from '../types/tenant';

// ============================================================================
// Role to Permissions Mapping
// ============================================================================

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Super Admin - platform-wide access
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

  // Tenant Owner - full tenant access including billing
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

  // Tenant Admin - full tenant access except billing
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

  // Head of Safety - safety management + analytics
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

  // Inspector - observations and warnings
  inspector: [
    'employees:view',
    'observations:view',
    'observations:create',
    'observations:edit',
    'warnings:view',
    'warnings:create',
    'analytics:view',
  ],

  // Department Supervisor - department-scoped access
  department_supervisor: [
    'employees:view',
    'observations:view',
    'observations:create',
    'warnings:view',
    'analytics:view',
  ],

  // Manager - limited access
  manager: [
    'employees:view',
    'observations:view',
    'warnings:view',
    'analytics:view',
  ],

  // Viewer - read-only access
  viewer: [
    'employees:view',
    'observations:view',
    'warnings:view',
    'analytics:view',
  ],
};

// ============================================================================
// Permission Hooks
// ============================================================================

/**
 * Get user's permissions based on role
 */
export function usePermissions(): Permission[] {
  const isSuperAdmin = useIsSuperAdmin();
  const currentTenantRole = useCurrentTenantRole();
  const isImpersonating = useIsImpersonating();

  return useMemo(() => {
    // Super Admin has all permissions (unless impersonating)
    if (isSuperAdmin && !isImpersonating) {
      return ROLE_PERMISSIONS.super_admin;
    }

    // If impersonating or in tenant context, use tenant role
    if (currentTenantRole) {
      return ROLE_PERMISSIONS[currentTenantRole] || [];
    }

    // Fallback to empty permissions
    return [];
  }, [isSuperAdmin, currentTenantRole, isImpersonating]);
}

/**
 * Check if user has a specific permission
 */
export function useHasPermission(permission: Permission): boolean {
  const permissions = usePermissions();
  const isImpersonating = useIsImpersonating();

  // Block all write permissions during impersonation
  if (isImpersonating) {
    const writePermissions: Permission[] = [
      'employees:create',
      'employees:edit',
      'employees:delete',
      'observations:create',
      'observations:edit',
      'observations:delete',
      'warnings:create',
      'warnings:approve',
      'settings:edit',
      'settings:billing',
      'settings:users',
      'settings:branding',
      'data:import',
    ];

    if (writePermissions.includes(permission)) {
      return false;
    }
  }

  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function useHasAnyPermission(permissions: Permission[]): boolean {
  const userPermissions = usePermissions();
  return permissions.some((p) => userPermissions.includes(p));
}

/**
 * Check if user has all of the specified permissions
 */
export function useHasAllPermissions(permissions: Permission[]): boolean {
  const userPermissions = usePermissions();
  return permissions.every((p) => userPermissions.includes(p));
}

/**
 * Get user's role in current tenant
 */
export function useRole(): UserRole | null {
  const isSuperAdmin = useIsSuperAdmin();
  const currentTenantRole = useCurrentTenantRole();
  const isImpersonating = useIsImpersonating();

  if (isSuperAdmin && !isImpersonating) {
    return 'super_admin';
  }

  return currentTenantRole;
}

/**
 * Check if user has a specific role
 */
export function useHasRole(role: UserRole): boolean {
  const userRole = useRole();
  return userRole === role;
}

/**
 * Check if user has any of the specified roles
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const userRole = useRole();
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Check if user is tenant owner or admin
 */
export function useIseTenantAdmin(): boolean {
  return useHasAnyRole(['tenant_owner', 'tenant_admin']);
}

/**
 * Check if user can access billing
 */
export function useCanAccessBilling(): boolean {
  return useHasPermission('settings:billing');
}

/**
 * Check if user can manage users
 */
export function useCanManageUsers(): boolean {
  return useHasPermission('settings:users');
}

/**
 * Check if user can export data
 */
export function useCanExportData(): boolean {
  return useHasPermission('data:export');
}

/**
 * Check if user has read-only access
 */
export function useIsReadOnly(): boolean {
  const role = useRole();
  const isImpersonating = useIsImpersonating();

  return role === 'viewer' || isImpersonating;
}
