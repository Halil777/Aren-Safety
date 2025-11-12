/**
 * Authentication Store
 *
 * Manages user authentication state with multi-tenant support
 * Integrates with tenant-store for tenant context management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserTenantMembership } from '../types/tenant';
import { useTenantStore } from './tenant-store';

// ============================================================================
// Auth State Interface
// ============================================================================

interface AuthState {
  // User data
  user: User | null;

  // Authentication token
  token: string | null;

  // Authentication status
  isAuthenticated: boolean;

  // Refresh token (for token renewal)
  refreshToken: string | null;

  // ========================================================================
  // Actions
  // ========================================================================

  /**
   * Login user
   * Sets user data, tokens, and initializes tenant context
   */
  login: (user: User, token: string, refreshToken?: string) => void;

  /**
   * Logout user
   * Clears auth state and tenant context
   */
  logout: () => void;

  /**
   * Update user data
   * Partial update of user information
   */
  updateUser: (user: Partial<User>) => void;

  /**
   * Update token
   * Called after token refresh
   */
  updateToken: (token: string, refreshToken?: string) => void;

  /**
   * Update user tenant memberships
   * Called when user's tenant access changes
   */
  updateTenantMemberships: (tenants: UserTenantMembership[]) => void;
}

// ============================================================================
// Auth Store
// ============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // ======================================================================
      // Actions Implementation
      // ======================================================================

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });

        // Initialize tenant context with user's tenant memberships
        if (user.tenants && user.tenants.length > 0) {
          const tenantStore = useTenantStore.getState();
          tenantStore.setUserTenants(user.tenants);

          // If user has a current tenant ID set, keep it
          // Otherwise, set the first tenant as current
          if (!user.currentTenantId && user.tenants.length === 1) {
            // Auto-select the only tenant
            tenantStore.switchTenant(user.tenants[0].tenantId);
          } else if (user.currentTenantId) {
            tenantStore.switchTenant(user.currentTenantId);
          }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        // Clear tenant context
        const tenantStore = useTenantStore.getState();
        tenantStore.clearTenantContext();
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      updateToken: (token, refreshToken) => {
        set({ token, refreshToken });
      },

      updateTenantMemberships: (tenants) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              tenants,
            },
          });

          // Update tenant store
          const tenantStore = useTenantStore.getState();
          tenantStore.setUserTenants(tenants);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Persist these fields only
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================================================
// Selector Hooks (for optimized re-renders)
// ============================================================================

/**
 * Get current authenticated user
 */
export const useUser = () => useAuthStore((state) => state.user);

/**
 * Get authentication token
 */
export const useToken = () => useAuthStore((state) => state.token);

/**
 * Check if user is authenticated
 */
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

/**
 * Check if user is Super Admin (platform level)
 */
export const useIsSuperAdmin = () =>
  useAuthStore((state) => state.user?.isSuperAdmin || false);

/**
 * Get user's full name
 */
export const useUserFullName = () => {
  const user = useUser();
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`;
};
