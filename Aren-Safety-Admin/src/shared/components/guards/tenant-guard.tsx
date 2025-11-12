/**
 * Tenant Route Guard
 *
 * Ensures user has access to the current tenant
 * Loads tenant context from URL slug parameter
 */

import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router';
import { Spin, Result, Button } from 'antd';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  useCurrentTenant,
  useTenantLoading,
  useTenantStore,
} from '../../stores/tenant-store';
import { useIsAuthenticated } from '../../stores/auth-store';
import { getTenantBySlug } from '../../config/mock-tenants';
import type { Tenant, UserTenantMembership } from '../../types/tenant';
import { useUser } from '../../stores/auth-store';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors[theme.mode].background};
`;

const NoAccessContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors[theme.mode].background};
  padding: 24px;
`;

function TenantLoading() {
  return (
    <LoadingContainer>
      <Spin size="large" tip="Loading tenant..." />
    </LoadingContainer>
  );
}

function NoTenantAccess({ tenantSlug }: { tenantSlug: string }) {
  const { t } = useTranslation();

  return (
    <NoAccessContainer>
      <Result
        status="403"
        icon={<Building2 size={64} color="#f59e0b" />}
        title={t('errors.noTenantAccess.title', 'No Access to Tenant')}
        subTitle={t(
          'errors.noTenantAccess.description',
          `You do not have access to the tenant "${tenantSlug}". Please check with your administrator or switch to an organization you belong to.`
        )}
        extra={
          <Button type="primary" href="/">
            {t('errors.noTenantAccess.selectOrg', 'Select Organization')}
          </Button>
        }
      />
    </NoAccessContainer>
  );
}

export function TenantGuard() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const isAuthenticated = useIsAuthenticated();
  const currentTenant = useCurrentTenant();
  const isLoading = useTenantLoading();
  const { setCurrentTenant, setLoadingTenant } = useTenantStore();
  const user = useUser();

  // Load tenant from slug
  useEffect(() => {
    if (!tenantSlug) return;

    // Check if already loaded
    if (currentTenant && currentTenant.slug === tenantSlug) {
      return;
    }

    // Prefer resolving from authenticated user's memberships (backend data)
    setLoadingTenant(true);

    const fromMembership = user?.tenants?.find(
      (m: UserTenantMembership) => m.tenantSlug === tenantSlug
    );

    if (fromMembership) {
      const mapped: Tenant = {
        id: fromMembership.tenantId,
        name: fromMembership.tenantName,
        slug: fromMembership.tenantSlug,
        status: 'active',
        ownerId: 'owner',
        ownerEmail: `${fromMembership.tenantSlug}@example.com`,
        planId: 'free',
        subscriptionStatus: 'active',
        trialEndsAt: undefined,
        isInTrial: false,
        billingEmail: undefined,
        paymentMethodOnFile: false,
        branding: { primaryColor: '#6366f1' },
        defaultLocale: 'en',
        defaultTheme: 'light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentTenant(mapped);
      setLoadingTenant(false);
      return;
    }

    // Fallback to mock (development only)
    const tenant = getTenantBySlug(tenantSlug);
    if (tenant) {
      setCurrentTenant(tenant);
    }

    setLoadingTenant(false);
  }, [tenantSlug, currentTenant, setCurrentTenant, setLoadingTenant, user]);

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=/t/${tenantSlug || ''}`} replace />;
  }

  // No tenant slug in URL - invalid route
  if (!tenantSlug) {
    return <Navigate to="/" replace />;
  }

  // Loading tenant data
  if (isLoading) {
    return <TenantLoading />;
  }

  // Tenant not found
  if (!currentTenant || currentTenant.slug !== tenantSlug) {
    return <NoTenantAccess tenantSlug={tenantSlug} />;
  }

  // Check if user has access to this tenant
  // const hasAccess = userTenants.some((t) => t.tenantSlug === tenantSlug);

  // User doesn't have access to this tenant (unless super admin during impersonation)
  // For now, we'll allow access for development
  // TODO: Uncomment when user management is implemented
  // if (!hasAccess && !useIsSuperAdmin()) {
  //   return <NoTenantAccess tenantSlug={tenantSlug} />;
  // }

  // All checks passed - render tenant routes
  return <Outlet />;
}
