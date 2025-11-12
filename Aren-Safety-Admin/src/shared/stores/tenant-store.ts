/**
 * Tenant Store
 *
 * Manages current tenant context, impersonation state, and tenant-specific settings
 * Uses Zustand with persistence for tenant context across sessions
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Tenant,
  ImpersonationSession,
  UserTenantMembership,
} from '../types/tenant';

// ============================================================================
// Store State Interface
// ============================================================================

interface TenantState {
  // Current tenant context
  currentTenant: Tenant | null;
  currentTenantId: string | null;

  // User's tenant memberships
  userTenants: UserTenantMembership[];

  // Impersonation state
  impersonation: ImpersonationSession;

  // Loading states
  isLoadingTenant: boolean;
  tenantError: string | null;

  // ========================================================================
  // Actions
  // ========================================================================

  /**
   * Set the current tenant context
   * Called after tenant selection or route-based tenant detection
   */
  setCurrentTenant: (tenant: Tenant | null) => void;

  /**
   * Set user's tenant memberships
   * Called after authentication
   */
  setUserTenants: (tenants: UserTenantMembership[]) => void;

  /**
   * Switch to a different tenant
   * Clears current context and sets new tenant
   */
  switchTenant: (tenantId: string) => void;

  /**
   * Start impersonation session
   * Super Admin only - impersonate a tenant with read-only access
   */
  startImpersonation: (
    tenant: Tenant,
    impersonatorId: string,
    impersonatorEmail: string,
    readOnly?: boolean
  ) => void;

  /**
   * Exit impersonation session
   * Returns to Super Admin Console
   */
  exitImpersonation: () => void;

  /**
   * Clear tenant context
   * Called on logout
   */
  clearTenantContext: () => void;

  /**
   * Update tenant data
   * Called after tenant settings changes
   */
  updateTenant: (updates: Partial<Tenant>) => void;

  /**
   * Set loading state
   */
  setLoadingTenant: (loading: boolean) => void;

  /**
   * Set error state
   */
  setTenantError: (error: string | null) => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialImpersonationState: ImpersonationSession = {
  isImpersonating: false,
  isReadOnly: true,
};

// ============================================================================
// Tenant Store
// ============================================================================

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTenant: null,
      currentTenantId: null,
      userTenants: [],
      impersonation: initialImpersonationState,
      isLoadingTenant: false,
      tenantError: null,

      // ======================================================================
      // Actions Implementation
      // ======================================================================

      setCurrentTenant: (tenant) => {
        set({
          currentTenant: tenant,
          currentTenantId: tenant?.id || null,
          tenantError: null,
        });
      },

      setUserTenants: (tenants) => {
        set({ userTenants: tenants });
      },

      switchTenant: (tenantId) => {
        const userTenants = get().userTenants;
        const tenantMembership = userTenants.find((t) => t.tenantId === tenantId);

        if (!tenantMembership) {
          set({
            tenantError: `Tenant with ID ${tenantId} not found in user memberships`,
          });
          return;
        }

        // Clear current context
        set({
          currentTenant: null,
          currentTenantId: tenantId,
          isLoadingTenant: true,
          tenantError: null,
        });

        // In a real app, you would fetch full tenant data here
        // For now, we'll set loading to false after tenant switch
        // The actual tenant data will be fetched by the component
        setTimeout(() => {
          set({ isLoadingTenant: false });
        }, 100);
      },

      startImpersonation: (tenant, impersonatorId, impersonatorEmail, readOnly = true) => {
        set({
          currentTenant: tenant,
          currentTenantId: tenant.id,
          impersonation: {
            isImpersonating: true,
            impersonatorId,
            impersonatorEmail,
            impersonatedTenantId: tenant.id,
            impersonatedTenantName: tenant.name,
            startedAt: new Date().toISOString(),
            isReadOnly: readOnly,
          },
          tenantError: null,
        });
      },

      exitImpersonation: () => {
        set({
          currentTenant: null,
          currentTenantId: null,
          impersonation: initialImpersonationState,
          tenantError: null,
        });
      },

      clearTenantContext: () => {
        set({
          currentTenant: null,
          currentTenantId: null,
          userTenants: [],
          impersonation: initialImpersonationState,
          isLoadingTenant: false,
          tenantError: null,
        });
      },

      updateTenant: (updates) => {
        const currentTenant = get().currentTenant;
        if (!currentTenant) return;

        set({
          currentTenant: {
            ...currentTenant,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setLoadingTenant: (loading) => {
        set({ isLoadingTenant: loading });
      },

      setTenantError: (error) => {
        set({ tenantError: error });
      },
    }),
    {
      name: 'tenant-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        currentTenantId: state.currentTenantId,
        userTenants: state.userTenants,
        // Don't persist impersonation state (security)
      }),
    }
  )
);

// ============================================================================
// Selector Hooks (for optimized re-renders)
// ============================================================================

/**
 * Get current tenant
 */
export const useCurrentTenant = () =>
  useTenantStore((state) => state.currentTenant);

/**
 * Get current tenant ID
 */
export const useCurrentTenantId = () =>
  useTenantStore((state) => state.currentTenantId);

/**
 * Get user's tenant memberships
 */
export const useUserTenants = () =>
  useTenantStore((state) => state.userTenants);

/**
 * Get impersonation state
 */
export const useImpersonation = () =>
  useTenantStore((state) => state.impersonation);

/**
 * Check if currently impersonating
 */
export const useIsImpersonating = () =>
  useTenantStore((state) => state.impersonation.isImpersonating);

/**
 * Get current user's role in the current tenant
 */
export const useCurrentTenantRole = () => {
  const currentTenantId = useCurrentTenantId();
  const userTenants = useUserTenants();

  if (!currentTenantId) return null;

  const membership = userTenants.find((t) => t.tenantId === currentTenantId);
  return membership?.role || null;
};

/**
 * Check if user has access to multiple tenants
 */
export const useHasMultipleTenants = () => {
  const userTenants = useUserTenants();
  return userTenants.length > 1;
};

/**
 * Get tenant loading state
 */
export const useTenantLoading = () =>
  useTenantStore((state) => state.isLoadingTenant);

/**
 * Get tenant error
 */
export const useTenantError = () =>
  useTenantStore((state) => state.tenantError);
