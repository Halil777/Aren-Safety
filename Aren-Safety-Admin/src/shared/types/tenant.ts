/**
 * Multi-Tenant SaaS Type Definitions
 *
 * Core types for tenant management, subscription plans, billing, and access control
 */

// ============================================================================
// Tenant Types
// ============================================================================

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'past_due' | 'canceled';

export interface Tenant {
  id: string;
  name: string;
  slug: string; // Used in route-based tenant context: /t/{slug}
  status: TenantStatus;

  // Ownership
  ownerId: string;
  ownerEmail: string;

  // Subscription
  planId: string;
  subscriptionStatus: SubscriptionStatus;

  // Trial information
  trialEndsAt?: string; // ISO date
  isInTrial: boolean;

  // Billing
  billingEmail?: string;
  paymentMethodOnFile: boolean;

  // Branding
  branding?: TenantBranding;

  // Settings
  defaultLocale: 'en' | 'ru' | 'tr';
  defaultTheme: 'light' | 'dark' | 'system';

  // Metadata
  createdAt: string;
  updatedAt: string;

  // Custom domain (optional white-label feature)
  customDomain?: string;
}

export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string; // Hex color (e.g., "#6366f1")
  accentColor?: string;

  // Optional custom name for white-label
  displayName?: string;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  planId: string;
  defaultLocale?: 'en' | 'ru' | 'tr';
  startWithTrial?: boolean;
  trialDays?: number;
}

export interface UpdateTenantInput {
  name?: string;
  billingEmail?: string;
  defaultLocale?: 'en' | 'ru' | 'tr';
  defaultTheme?: 'light' | 'dark' | 'system';
  branding?: Partial<TenantBranding>;
}

// ============================================================================
// Subscription & Plan Types
// ============================================================================

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export type BillingInterval = 'month' | 'year';

export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  displayName: {
    en: string;
    ru: string;
    tr: string;
  };
  description: {
    en: string;
    ru: string;
    tr: string;
  };

  // Pricing
  monthlyPrice: number; // USD cents (e.g., 4900 = $49.00)
  yearlyPrice: number;  // USD cents (e.g., 47040 = $470.40, 20% discount)
  currency: string;     // ISO currency code (USD, EUR, etc.)

  // Stripe IDs (for payment integration)
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;

  // Trial
  trialDays: number;

  // Features & Limits
  features: PlanFeatures;
  limits: PlanLimits;

  // Display
  isPopular?: boolean;
  displayOrder: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatures {
  // Core Features
  employeeManagement: boolean;
  observationTracking: boolean;
  departmentManagement: boolean;
  projectCodeManagement: boolean;

  // Advanced Features
  warningsAndFines: boolean;
  correctiveActions: boolean;
  trainingModule: boolean;

  // Analytics
  basicAnalytics: boolean;
  advancedAnalytics: boolean;
  heatmapAnalytics: boolean;

  // Data Management
  dataExport: boolean;        // Excel/PDF export
  apiAccess: boolean;          // REST API access
  bulkImport: boolean;         // Bulk data import

  // Collaboration
  multiUserAccess: boolean;
  roleBasedAccess: boolean;

  // Branding
  customBranding: boolean;
  customDomain: boolean;

  // Support
  emailSupport: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
}

export interface PlanLimits {
  maxUsers: number;              // -1 for unlimited
  maxObservations: number;       // -1 for unlimited
  maxDepartments: number;        // -1 for unlimited
  maxProjects: number;           // -1 for unlimited
  maxStorageMB: number;          // Media/document storage
  maxMediaUploadsPerMonth: number;
  maxAPICallsPerDay: number;     // -1 for unlimited

  // Data retention
  dataRetentionMonths: number;   // -1 for unlimited
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;

  // Current period
  currentPeriodStart: string; // ISO date
  currentPeriodEnd: string;   // ISO date

  // Trial
  trialStart?: string;
  trialEnd?: string;

  // Stripe
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;

  // Cancellation
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Billing Types
// ============================================================================

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface Invoice {
  id: string;
  tenantId: string;
  subscriptionId: string;

  // Amount
  amountDue: number;      // Cents
  amountPaid: number;     // Cents
  currency: string;

  // Status
  status: InvoiceStatus;

  // Dates
  periodStart: string;
  periodEnd: string;
  dueDate?: string;
  paidAt?: string;

  // Stripe
  stripeInvoiceId?: string;
  hostedInvoiceUrl?: string;  // Link to Stripe-hosted invoice
  invoicePdfUrl?: string;

  // Line items
  lineItems: InvoiceLineItem[];

  // Metadata
  createdAt: string;
}

export interface InvoiceLineItem {
  description: string;
  amount: number;        // Cents
  quantity: number;
  period?: {
    start: string;
    end: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';

  // Card details (masked)
  card?: {
    brand: string;      // visa, mastercard, etc.
    last4: string;
    expMonth: number;
    expYear: number;
  };

  // Bank details (masked)
  bankAccount?: {
    bankName: string;
    last4: string;
  };

  isDefault: boolean;
  stripePaymentMethodId?: string;
}

export interface BillingOverview {
  tenantId: string;

  // Current subscription
  currentPlan: Plan;
  subscriptionStatus: SubscriptionStatus;
  billingInterval: BillingInterval;

  // Next billing
  nextBillingDate?: string;
  nextBillingAmount?: number;

  // Trial
  isInTrial: boolean;
  trialEndsAt?: string;
  daysRemainingInTrial?: number;

  // Payment
  paymentMethod?: PaymentMethod;
  paymentMethodOnFile: boolean;

  // Past due
  isPastDue: boolean;
  pastDueAmount?: number;

  // Invoices
  upcomingInvoice?: Invoice;
  recentInvoices: Invoice[];

  // Usage (for quota monitoring)
  usage: UsageMetrics;
}

export interface UsageMetrics {
  tenantId: string;
  periodStart: string;
  periodEnd: string;

  // User metrics
  activeUsers: number;
  maxUsers: number;  // From plan limit

  // Data metrics
  totalObservations: number;
  maxObservations: number;

  totalDepartments: number;
  maxDepartments: number;

  totalProjects: number;
  maxProjects: number;

  // Storage
  storageUsedMB: number;
  maxStorageMB: number;

  // API usage
  apiCallsToday: number;
  maxAPICallsPerDay: number;

  // Media uploads
  mediaUploadsThisMonth: number;
  maxMediaUploadsPerMonth: number;
}

// ============================================================================
// User & Access Control Types (Multi-Tenant Extensions)
// ============================================================================

export type UserRole =
  | 'super_admin'           // Platform admin (Super Admin Console access)
  | 'tenant_owner'          // Tenant owner (full tenant access + billing)
  | 'tenant_admin'          // Tenant admin (full tenant access, no billing)
  | 'head_of_safety'        // Department head
  | 'inspector'             // Safety inspector
  | 'department_supervisor' // Department supervisor
  | 'manager'               // General manager
  | 'viewer';               // Read-only user

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;

  // Multi-tenant context
  tenants: UserTenantMembership[];

  // Current session context
  currentTenantId?: string;

  // Platform role (if super admin)
  isSuperAdmin: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserTenantMembership {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  role: UserRole;
  department?: string;
  position?: string;

  // Status
  isActive: boolean;
  invitedAt: string;
  joinedAt?: string;

  // Permissions (future extension for granular RBAC)
  permissions?: string[];
}

// ============================================================================
// Permission & Feature Gating Types
// ============================================================================

export type Permission =
  // Employee management
  | 'employees:view'
  | 'employees:create'
  | 'employees:edit'
  | 'employees:delete'

  // Observations
  | 'observations:view'
  | 'observations:create'
  | 'observations:edit'
  | 'observations:delete'
  | 'observations:export'

  // Warnings & Fines
  | 'warnings:view'
  | 'warnings:create'
  | 'warnings:approve'

  // Analytics
  | 'analytics:view'
  | 'analytics:advanced'
  | 'analytics:heatmap'

  // Settings
  | 'settings:view'
  | 'settings:edit'
  | 'settings:billing'
  | 'settings:users'
  | 'settings:branding'

  // Data management
  | 'data:export'
  | 'data:import'
  | 'data:api_access';

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  label: {
    en: string;
    ru: string;
    tr: string;
  };
  description: {
    en: string;
    ru: string;
    tr: string;
  };
}

// ============================================================================
// Impersonation Types
// ============================================================================

export interface ImpersonationSession {
  isImpersonating: boolean;
  impersonatorId?: string;
  impersonatorEmail?: string;
  impersonatedTenantId?: string;
  impersonatedTenantName?: string;
  startedAt?: string;
  isReadOnly: boolean;
}

// ============================================================================
// Super Admin Dashboard Types
// ============================================================================

export interface PlatformMetrics {
  // Tenant metrics
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;

  // Revenue metrics (MRR/ARR)
  monthlyRecurringRevenue: number;  // Cents
  annualRecurringRevenue: number;   // Cents

  // User metrics
  totalUsers: number;
  activeUsersLast30Days: number;

  // Health metrics
  tenantsWithPaymentIssues: number;
  tenantsNearQuotaLimits: number;

  // Growth
  newTenantsThisMonth: number;
  churnedTenantsThisMonth: number;

  // Period
  periodStart: string;
  periodEnd: string;
}

export interface TenantListItem {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;

  // Subscription
  planName: string;
  planTier: PlanTier;
  subscriptionStatus: SubscriptionStatus;

  // Owner
  ownerEmail: string;
  ownerName: string;

  // Trial
  isInTrial: boolean;
  trialEndsAt?: string;

  // Billing
  paymentMethodOnFile: boolean;
  isPastDue: boolean;

  // Activity
  lastActivityAt?: string;
  userCount: number;

  // Dates
  createdAt: string;
}

// ============================================================================
// Feature Flag Types
// ============================================================================

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabledForPlans: PlanTier[];
  enabledByDefault: boolean;
  requiresPermission?: Permission;
}

// ============================================================================
// Quota Check Types
// ============================================================================

export interface QuotaCheckResult {
  withinLimit: boolean;
  current: number;
  limit: number;
  percentageUsed: number;
  feature: string;
  upgradeRequired: boolean;
}
