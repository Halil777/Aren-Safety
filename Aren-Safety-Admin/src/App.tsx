/**
 * Application Router
 *
 * Multi-tenant routing structure:
 * - /super-admin/* - Platform administration (Super Admin only)
 * - /t/:tenantSlug/* - Tenant-scoped admin panel (Tenant users)
 * - / - Landing/redirect page
 */

import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import styled from 'styled-components';
import { useAuthStore } from '@/shared/stores/auth-store';

// Layouts
import { MainLayout } from '@/app/layouts/main-layout';
import { SuperAdminLayout } from '@/app/layouts/super-admin-layout';

// Guards
import { SuperAdminGuard } from '@/shared/components/guards/super-admin-guard';
import { TenantGuard } from '@/shared/components/guards/tenant-guard';

// Tenant Admin Pages (eager loaded - main bundle)
import { ObservationsPage } from '@/pages/observations/index';
import { DepartmentsPage } from '@/pages/departments/index';
import { ProjectCodesPage } from '@/pages/project-codes/index';
import { TrainingPage } from '@/pages/training/index';
import TeamPage from '@/pages/team';
import SettingsPage from '@/pages/settings';
import SupervisorsPage from '@/pages/supervisors';
import CategoriesPage from '@/pages/categories';
import BranchesPage from '@/pages/branches';

// Auth Pages
import LoginPage from '@/pages/login-backend';

// Super Admin Pages (lazy loaded - code split)
const SuperAdminDashboard = lazy(
  () => import('@/features/super-admin/pages/dashboard')
);
const TenantsListPage = lazy(
  () => import('@/features/super-admin/pages/tenants-backend')
);
const TenantFormPage = lazy(
  () => import('@/features/super-admin/pages/tenant-form-backend')
);
const TenantDetailPage = lazy(
  () => import('@/features/super-admin/pages/tenant-detail-backend')
);
const PlansManagementPage = lazy(
  () => import('@/features/super-admin/pages/plans-management')
);
const BillingDashboardPage = lazy(
  () => import('@/features/super-admin/pages/billing-dashboard')
);
const PlatformSettingsPage = lazy(
  () => import('@/features/super-admin/pages/settings')
);

// Loading component
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors[theme.mode].background};
`;

function PageLoader() {
  return (
    <LoadingContainer>
      <Spin size="large" tip="Loading..." />
    </LoadingContainer>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // If authenticated, redirect to appropriate dashboard
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (isAuthenticated && user) {
      if (user.isSuperAdmin) {
        navigate('/super-admin');
      } else if (user.tenants && user.tenants.length > 0) {
        navigate(`/t/${user.tenants[0].tenantSlug}`);
      }
    }
  }, [isAuthenticated, user, navigate]);

  // If not authenticated, let the effect handle redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome</h1>
      <p>Redirecting...</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing Page */}
        <Route index element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* ============================================================ */}
        {/* SUPER ADMIN ROUTES (Platform Administration)                */}
        {/* ============================================================ */}
        <Route path="/super-admin" element={<SuperAdminGuard />}>
          <Route element={<SuperAdminLayout />}>
            {/* Dashboard */}
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <SuperAdminDashboard />
                </Suspense>
              }
            />

            {/* Tenants Management */}
            <Route
              path="tenants"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TenantsListPage />
                </Suspense>
              }
            />
            <Route
              path="tenants/new"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TenantFormPage />
                </Suspense>
              }
            />
            <Route
              path="tenants/:tenantId"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TenantDetailPage />
                </Suspense>
              }
            />
            <Route
              path="tenants/:tenantId/edit"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TenantFormPage />
                </Suspense>
              }
            />

            {/* Plans Management */}
            <Route
              path="plans"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PlansManagementPage />
                </Suspense>
              }
            />

            {/* Billing */}
            <Route
              path="billing"
              element={
                <Suspense fallback={<PageLoader />}>
                  <BillingDashboardPage />
                </Suspense>
              }
            />

            {/* Platform Settings */}
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PlatformSettingsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* ============================================================ */}
        {/* TENANT ADMIN ROUTES (Tenant-Scoped)                         */}
        {/* ============================================================ */}
        <Route path="/t/:tenantSlug" element={<TenantGuard />}>
          <Route element={<MainLayout />}>
            {/* Redirect index to observations */}
            <Route index element={<Navigate to="observations" replace />} />

            {/* Team (Combined Employees, Safety, Inspectors) */}
            <Route path="team" element={<TeamPage />} />

            {/* Supervisors */}
            <Route path="supervisors" element={<SupervisorsPage />} />

            {/* Core Features (PRESERVED - no changes to these pages) */}
            <Route path="observations" element={<ObservationsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="project-codes" element={<ProjectCodesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="branches" element={<BranchesPage />} />

            {/* Additional Features */}
            <Route path="training" element={<TrainingPage />} />

            {/* Settings */}
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
