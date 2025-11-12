/**
 * Feature Gating Hooks
 *
 * Plan-based feature access control and quota enforcement
 * Checks subscription plan and limits to gate features
 */
import { useCurrentTenant } from '../stores/tenant-store';
import { useIsSuperAdmin } from '../stores/auth-store';
import type { PlanTier, QuotaCheckResult } from '../types/tenant';

// ============================================================================
// Feature Flags by Plan Tier
// ============================================================================

interface FeatureAccess {
  // Core features
  employeeManagement: boolean;
  observationTracking: boolean;
  departmentManagement: boolean;
  projectCodeManagement: boolean;

  // Advanced features
  warningsAndFines: boolean;
  correctiveActions: boolean;
  trainingModule: boolean;

  // Analytics
  basicAnalytics: boolean;
  advancedAnalytics: boolean;
  heatmapAnalytics: boolean;

  // Data
  dataExport: boolean;
  bulkImport: boolean;
  apiAccess: boolean;

  // Branding
  customBranding: boolean;
  customDomain: boolean;

  // Collaboration
  multiUserAccess: boolean;
  roleBasedAccess: boolean;

  // Support
  emailSupport: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
}

const PLAN_FEATURES: Record<PlanTier, FeatureAccess> = {
  free: {
    // Core features (limited)
    employeeManagement: true,
    observationTracking: true,
    departmentManagement: true,
    projectCodeManagement: true,

    // Advanced features (disabled)
    warningsAndFines: false,
    correctiveActions: false,
    trainingModule: false,

    // Analytics (basic only)
    basicAnalytics: true,
    advancedAnalytics: false,
    heatmapAnalytics: false,

    // Data (limited)
    dataExport: false,
    bulkImport: false,
    apiAccess: false,

    // Branding (disabled)
    customBranding: false,
    customDomain: false,

    // Collaboration (limited)
    multiUserAccess: false,
    roleBasedAccess: false,

    // Support (basic)
    emailSupport: false,
    prioritySupport: false,
    dedicatedAccountManager: false,
  },

  pro: {
    // Core features (full access)
    employeeManagement: true,
    observationTracking: true,
    departmentManagement: true,
    projectCodeManagement: true,

    // Advanced features (enabled)
    warningsAndFines: true,
    correctiveActions: true,
    trainingModule: true,

    // Analytics (advanced)
    basicAnalytics: true,
    advancedAnalytics: true,
    heatmapAnalytics: false,

    // Data (full access)
    dataExport: true,
    bulkImport: true,
    apiAccess: false,

    // Branding (enabled)
    customBranding: true,
    customDomain: false,

    // Collaboration (full access)
    multiUserAccess: true,
    roleBasedAccess: true,

    // Support (email + priority)
    emailSupport: true,
    prioritySupport: true,
    dedicatedAccountManager: false,
  },

  enterprise: {
    // Everything enabled
    employeeManagement: true,
    observationTracking: true,
    departmentManagement: true,
    projectCodeManagement: true,
    warningsAndFines: true,
    correctiveActions: true,
    trainingModule: true,
    basicAnalytics: true,
    advancedAnalytics: true,
    heatmapAnalytics: true,
    dataExport: true,
    bulkImport: true,
    apiAccess: true,
    customBranding: true,
    customDomain: true,
    multiUserAccess: true,
    roleBasedAccess: true,
    emailSupport: true,
    prioritySupport: true,
    dedicatedAccountManager: true,
  },
};

// ============================================================================
// Mock Plan Limits (would come from API in real app)
// ============================================================================

const PLAN_LIMITS = {
  free: {
    maxUsers: 3,
    maxObservations: 50,
    maxDepartments: 5,
    maxProjects: 3,
    maxStorageMB: 100,
    maxMediaUploadsPerMonth: 20,
    maxAPICallsPerDay: 0,
    dataRetentionMonths: 3,
  },
  pro: {
    maxUsers: 25,
    maxObservations: 1000,
    maxDepartments: 20,
    maxProjects: 50,
    maxStorageMB: 5000,
    maxMediaUploadsPerMonth: 500,
    maxAPICallsPerDay: 0,
    dataRetentionMonths: 24,
  },
  enterprise: {
    maxUsers: -1, // Unlimited
    maxObservations: -1,
    maxDepartments: -1,
    maxProjects: -1,
    maxStorageMB: 50000,
    maxMediaUploadsPerMonth: -1,
    maxAPICallsPerDay: -1,
    dataRetentionMonths: -1,
  },
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Get current plan tier
 */
export function usePlanTier(): PlanTier {
  const tenant = useCurrentTenant();
  const isSuperAdmin = useIsSuperAdmin();

  // Super Admin gets enterprise features
  if (isSuperAdmin) {
    return 'enterprise';
  }

  // In a real app, you'd fetch the plan from the tenant's subscription
  // For now, we'll default to 'free'
  // TODO: Integrate with actual subscription data
  return (tenant?.planId as PlanTier) || 'free';
}

/**
 * Check if a feature is enabled for current plan
 */
export function useHasFeature(feature: keyof FeatureAccess): boolean {
  const planTier = usePlanTier();
  const isSuperAdmin = useIsSuperAdmin();

  // Super Admin always has access
  if (isSuperAdmin) {
    return true;
  }

  return PLAN_FEATURES[planTier][feature];
}

/**
 * Get all features for current plan
 */
export function usePlanFeatures(): FeatureAccess {
  const planTier = usePlanTier();
  return PLAN_FEATURES[planTier];
}

/**
 * Get plan limits for current plan
 */
export function usePlanLimits() {
  const planTier = usePlanTier();
  return PLAN_LIMITS[planTier];
}

/**
 * Check if user count is within limit
 */
export function useUserQuotaCheck(currentUserCount: number): QuotaCheckResult {
  const limits = usePlanLimits();
  const planTier = usePlanTier();

  const withinLimit =
    limits.maxUsers === -1 || currentUserCount < limits.maxUsers;

  return {
    withinLimit,
    current: currentUserCount,
    limit: limits.maxUsers,
    percentageUsed:
      limits.maxUsers === -1
        ? 0
        : Math.round((currentUserCount / limits.maxUsers) * 100),
    feature: 'users',
    upgradeRequired: !withinLimit && planTier !== 'enterprise',
  };
}

/**
 * Check if observation count is within limit
 */
export function useObservationQuotaCheck(
  currentObservationCount: number
): QuotaCheckResult {
  const limits = usePlanLimits();
  const planTier = usePlanTier();

  const withinLimit =
    limits.maxObservations === -1 ||
    currentObservationCount < limits.maxObservations;

  return {
    withinLimit,
    current: currentObservationCount,
    limit: limits.maxObservations,
    percentageUsed:
      limits.maxObservations === -1
        ? 0
        : Math.round((currentObservationCount / limits.maxObservations) * 100),
    feature: 'observations',
    upgradeRequired: !withinLimit && planTier !== 'enterprise',
  };
}

/**
 * Check if storage is within limit
 */
export function useStorageQuotaCheck(currentStorageMB: number): QuotaCheckResult {
  const limits = usePlanLimits();
  const planTier = usePlanTier();

  const withinLimit =
    limits.maxStorageMB === -1 || currentStorageMB < limits.maxStorageMB;

  return {
    withinLimit,
    current: currentStorageMB,
    limit: limits.maxStorageMB,
    percentageUsed:
      limits.maxStorageMB === -1
        ? 0
        : Math.round((currentStorageMB / limits.maxStorageMB) * 100),
    feature: 'storage',
    upgradeRequired: !withinLimit && planTier !== 'enterprise',
  };
}

/**
 * Get upgrade URL for current plan
 */
export function useUpgradeUrl(): string {
  const tenant = useCurrentTenant();
  const planTier = usePlanTier();

  if (!tenant) return '/settings/billing';

  // Route to billing page for upgrade
  return `/t/${tenant.slug}/settings/billing?upgrade=${
    planTier === 'free' ? 'pro' : 'enterprise'
  }`;
}

/**
 * Check if tenant is in trial
 */
export function useIsInTrial(): boolean {
  const tenant = useCurrentTenant();
  return tenant?.isInTrial || false;
}

/**
 * Get days remaining in trial
 */
export function useTrialDaysRemaining(): number | null {
  const tenant = useCurrentTenant();

  if (!tenant?.isInTrial || !tenant.trialEndsAt) {
    return null;
  }

  const now = new Date();
  const trialEnd = new Date(tenant.trialEndsAt);
  const daysRemaining = Math.ceil(
    (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, daysRemaining);
}

/**
 * Check if tenant is past due
 */
export function useIsPastDue(): boolean {
  const tenant = useCurrentTenant();
  return tenant?.subscriptionStatus === 'past_due';
}

/**
 * Check if tenant is suspended
 */
export function useIsSuspended(): boolean {
  const tenant = useCurrentTenant();
  return tenant?.status === 'suspended';
}

/**
 * Get feature lock reason (for UI messaging)
 */
export function useFeatureLockReason(feature: keyof FeatureAccess): string | null {
  const hasFeature = useHasFeature(feature);
  const planTier = usePlanTier();
  const isSuspended = useIsSuspended();
  const isPastDue = useIsPastDue();

  if (isSuspended) {
    return 'Your account is suspended. Please contact support.';
  }

  if (isPastDue) {
    return 'Your payment is past due. Please update your billing information.';
  }

  if (!hasFeature) {
    if (planTier === 'free') {
      return 'Upgrade to Pro or Enterprise to unlock this feature.';
    } else if (planTier === 'pro') {
      return 'Upgrade to Enterprise to unlock this feature.';
    }
  }

  return null;
}

/**
 * Check if quota warning should be shown
 */
export function useShowQuotaWarning(
  quotaCheck: QuotaCheckResult,
  threshold: number = 80
): boolean {
  return quotaCheck.percentageUsed >= threshold && quotaCheck.limit !== -1;
}
