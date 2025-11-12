/**
 * Mock Tenant Data
 *
 * Sample tenant data for development and demo purposes
 */

import type { Tenant, TenantListItem } from '../types/tenant';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant_acme',
    name: 'ACME Construction',
    slug: 'acme',
    status: 'active',
    ownerId: 'user_acme_owner',
    ownerEmail: 'owner@acme-construction.com',
    planId: 'plan_pro',
    subscriptionStatus: 'active',
    isInTrial: false,
    billingEmail: 'billing@acme-construction.com',
    paymentMethodOnFile: true,
    branding: {
      logoUrl: undefined,
      primaryColor: '#e11d48', // Rose
      displayName: 'ACME Construction Safety',
    },
    defaultLocale: 'en',
    defaultTheme: 'light',
    createdAt: '2025-08-15T10:00:00Z',
    updatedAt: '2025-10-01T14:30:00Z',
  },
  {
    id: 'tenant_techcorp',
    name: 'TechCorp Industries',
    slug: 'techcorp',
    status: 'active',
    ownerId: 'user_techcorp_owner',
    ownerEmail: 'admin@techcorp.com',
    planId: 'plan_enterprise',
    subscriptionStatus: 'active',
    isInTrial: false,
    billingEmail: 'finance@techcorp.com',
    paymentMethodOnFile: true,
    branding: {
      logoUrl: undefined,
      primaryColor: '#3b82f6', // Blue
      accentColor: '#06b6d4', // Cyan
      displayName: 'TechCorp Safety Platform',
    },
    defaultLocale: 'en',
    defaultTheme: 'dark',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-10-15T16:20:00Z',
  },
  {
    id: 'tenant_startup',
    name: 'Startup Inc',
    slug: 'startup',
    status: 'trial',
    ownerId: 'user_startup_owner',
    ownerEmail: 'founder@startup.io',
    planId: 'plan_pro',
    subscriptionStatus: 'trialing',
    isInTrial: true,
    trialEndsAt: '2025-11-01T23:59:59Z', // 13 days from now
    paymentMethodOnFile: false,
    branding: {
      primaryColor: '#6366f1', // Indigo (default)
    },
    defaultLocale: 'en',
    defaultTheme: 'system',
    createdAt: '2025-10-05T12:00:00Z',
    updatedAt: '2025-10-18T09:15:00Z',
  },
  {
    id: 'tenant_manufacturing',
    name: 'Manufacturing Co',
    slug: 'manufacturing',
    status: 'past_due',
    ownerId: 'user_manufacturing_owner',
    ownerEmail: 'owner@manufacturing.com',
    planId: 'plan_pro',
    subscriptionStatus: 'past_due',
    isInTrial: false,
    billingEmail: 'accounts@manufacturing.com',
    paymentMethodOnFile: true,
    branding: {
      primaryColor: '#f59e0b', // Amber
    },
    defaultLocale: 'en',
    defaultTheme: 'light',
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-10-10T11:00:00Z',
  },
  {
    id: 'tenant_suspended',
    name: 'Suspended Company',
    slug: 'suspended',
    status: 'suspended',
    ownerId: 'user_suspended_owner',
    ownerEmail: 'owner@suspended.com',
    planId: 'plan_free',
    subscriptionStatus: 'canceled',
    isInTrial: false,
    paymentMethodOnFile: false,
    branding: {
      primaryColor: '#6366f1',
    },
    defaultLocale: 'en',
    defaultTheme: 'light',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z',
  },
  {
    id: 'tenant_global',
    name: 'Global Safety Corp',
    slug: 'global',
    status: 'active',
    ownerId: 'user_global_owner',
    ownerEmail: 'admin@global-safety.com',
    planId: 'plan_enterprise',
    subscriptionStatus: 'active',
    isInTrial: false,
    billingEmail: 'billing@global-safety.com',
    paymentMethodOnFile: true,
    branding: {
      primaryColor: '#10b981', // Green
      displayName: 'Global Safety Management',
    },
    defaultLocale: 'ru',
    defaultTheme: 'light',
    customDomain: 'safety.global-corp.com',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-10-12T14:00:00Z',
  },
];

export const MOCK_TENANT_LIST: TenantListItem[] = MOCK_TENANTS.map((tenant) => ({
  id: tenant.id,
  name: tenant.name,
  slug: tenant.slug,
  status: tenant.status,
  planName: tenant.planId.replace('plan_', '').toUpperCase(),
  planTier: tenant.planId.replace('plan_', '') as any,
  subscriptionStatus: tenant.subscriptionStatus,
  ownerEmail: tenant.ownerEmail,
  ownerName: `Owner of ${tenant.name}`, // Mock owner name
  isInTrial: tenant.isInTrial,
  trialEndsAt: tenant.trialEndsAt,
  paymentMethodOnFile: tenant.paymentMethodOnFile,
  isPastDue: tenant.subscriptionStatus === 'past_due',
  lastActivityAt: tenant.updatedAt,
  userCount: Math.floor(Math.random() * 20) + 1, // Random user count for demo
  createdAt: tenant.createdAt,
}));

/**
 * Get tenant by ID
 */
export function getTenantById(tenantId: string): Tenant | undefined {
  return MOCK_TENANTS.find((t) => t.id === tenantId);
}

/**
 * Get tenant by slug
 */
export function getTenantBySlug(slug: string): Tenant | undefined {
  return MOCK_TENANTS.find((t) => t.slug === slug);
}

/**
 * Get tenant list item by ID
 */
export function getTenantListItemById(tenantId: string): TenantListItem | undefined {
  return MOCK_TENANT_LIST.find((t) => t.id === tenantId);
}

/**
 * Calculate days remaining in trial
 */
export function getTrialDaysRemaining(tenant: Tenant): number | null {
  if (!tenant.isInTrial || !tenant.trialEndsAt) return null;

  const now = new Date();
  const trialEnd = new Date(tenant.trialEndsAt);
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysRemaining);
}

/**
 * Filter tenants by status
 */
export function filterTenantsByStatus(status: Tenant['status']): TenantListItem[] {
  return MOCK_TENANT_LIST.filter((t) => t.status === status);
}

/**
 * Filter tenants by plan tier
 */
export function filterTenantsByPlan(planTier: string): TenantListItem[] {
  return MOCK_TENANT_LIST.filter((t) => t.planTier === planTier);
}

/**
 * Get platform metrics (for Super Admin dashboard)
 */
export function getPlatformMetrics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    totalTenants: MOCK_TENANT_LIST.length,
    activeTenants: MOCK_TENANT_LIST.filter((t) => t.status === 'active').length,
    trialTenants: MOCK_TENANT_LIST.filter((t) => t.isInTrial).length,
    suspendedTenants: MOCK_TENANT_LIST.filter((t) => t.status === 'suspended').length,

    // Mock revenue (would come from billing system)
    monthlyRecurringRevenue: 29700, // $297.00
    annualRecurringRevenue: 356400, // $3,564.00

    // Mock user metrics
    totalUsers: MOCK_TENANT_LIST.reduce((sum, t) => sum + t.userCount, 0),
    activeUsersLast30Days: Math.floor(
      MOCK_TENANT_LIST.reduce((sum, t) => sum + t.userCount, 0) * 0.7
    ),

    // Health metrics
    tenantsWithPaymentIssues: MOCK_TENANT_LIST.filter((t) => t.isPastDue).length,
    tenantsNearQuotaLimits: 2, // Mock

    // Growth (mock data)
    newTenantsThisMonth: MOCK_TENANT_LIST.filter(
      (t) => new Date(t.createdAt) >= thirtyDaysAgo
    ).length,
    churnedTenantsThisMonth: 0,

    periodStart: thirtyDaysAgo.toISOString(),
    periodEnd: now.toISOString(),
  };
}
