/**
 * Axios Instance Configuration
 *
 * Multi-tenant aware HTTP client with automatic:
 * - Authentication token injection
 * - Tenant context headers
 * - Impersonation headers
 * - Error handling and auth refresh
 */

import axios from 'axios';
import { useAuthStore } from '@/shared/stores/auth-store';
import { useTenantStore } from '@/shared/stores/tenant-store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// ============================================================================
// Request Interceptor
// ============================================================================

axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Add authentication token
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Add tenant context
    const tenantState = useTenantStore.getState();
    const { currentTenantId, impersonation } = tenantState;

    // Add tenant ID header for tenant-scoped requests
    if (currentTenantId && !config.url?.startsWith('/super-admin')) {
      config.headers['X-Tenant-Id'] = currentTenantId;
    }

    // 3. Add impersonation headers if active
    if (impersonation.isImpersonating) {
      config.headers['X-Impersonating'] = 'true';
      config.headers['X-Impersonator-Id'] = impersonation.impersonatorId || '';
      config.headers['X-Impersonated-Tenant-Id'] = impersonation.impersonatedTenantId || '';

      // Block mutations in read-only impersonation mode
      if (impersonation.isReadOnly) {
        const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        if (mutationMethods.includes(config.method?.toUpperCase() || '')) {
          console.warn('[Impersonation] Blocked mutation request in read-only mode:', config.url);
          return Promise.reject(
            new Error('Mutations are not allowed in read-only impersonation mode')
          );
        }
      }
    }

    // 4. Add request ID for tracing
    config.headers['X-Request-Id'] = crypto.randomUUID();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor
// ============================================================================

axiosInstance.interceptors.response.use(
  (response) => {
    // Success response - return as is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Prevent infinite loop
      if (originalRequest._retry) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Try to refresh token once
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().updateToken(token, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('[Axios] Forbidden:', error.response.data);
      // Don't auto-logout on 403 - user might need to upgrade plan or contact admin
    }

    // Handle 402 Payment Required (plan restriction)
    if (error.response?.status === 402) {
      console.warn('[Axios] Payment/Plan restriction:', error.response.data);
      // UI should show upgrade modal
    }

    // Handle 429 Too Many Requests (rate limiting)
    if (error.response?.status === 429) {
      console.warn('[Axios] Rate limit exceeded:', error.response.data);
      // UI should show rate limit message
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// Export
// ============================================================================

export default axiosInstance;
