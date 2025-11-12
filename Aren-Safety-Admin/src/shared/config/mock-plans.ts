/**
 * Mock Subscription Plans
 *
 * Sample plan data for development and demo purposes
 */

import type { Plan, PlanTier } from '../types/tenant';

export const MOCK_PLANS: Plan[] = [
  {
    id: 'plan_free',
    name: 'Free',
    tier: 'free' as PlanTier,
    displayName: {
      en: 'Free Plan',
      ru: 'Бесплатный План',
      tr: 'Ücretsiz Plan',
    },
    description: {
      en: 'Perfect for small teams getting started with safety management',
      ru: 'Идеально для небольших команд, начинающих управление безопасностью',
      tr: 'Güvenlik yönetimine başlayan küçük ekipler için mükemmel',
    },
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    trialDays: 14,
    features: {
      employeeManagement: true,
      observationTracking: true,
      departmentManagement: true,
      projectCodeManagement: true,
      warningsAndFines: false,
      correctiveActions: false,
      trainingModule: false,
      basicAnalytics: true,
      advancedAnalytics: false,
      heatmapAnalytics: false,
      dataExport: false,
      apiAccess: false,
      bulkImport: false,
      multiUserAccess: false,
      roleBasedAccess: false,
      customBranding: false,
      customDomain: false,
      emailSupport: true,
      prioritySupport: false,
      dedicatedAccountManager: false,
    },
    limits: {
      maxUsers: 3,
      maxObservations: 50,
      maxDepartments: 5,
      maxProjects: 3,
      maxStorageMB: 100,
      maxMediaUploadsPerMonth: 20,
      maxAPICallsPerDay: 0,
      dataRetentionMonths: 3,
    },
    displayOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    tier: 'pro' as PlanTier,
    displayName: {
      en: 'Professional',
      ru: 'Профессиональный',
      tr: 'Profesyonel',
    },
    description: {
      en: 'Advanced features for growing safety teams and organizations',
      ru: 'Расширенные функции для растущих команд и организаций',
      tr: 'Büyüyen güvenlik ekipleri ve organizasyonlar için gelişmiş özellikler',
    },
    monthlyPrice: 4900, // $49.00
    yearlyPrice: 47040, // $470.40 (20% discount)
    currency: 'USD',
    stripeMonthlyPriceId: 'price_pro_monthly',
    stripeYearlyPriceId: 'price_pro_yearly',
    trialDays: 14,
    features: {
      employeeManagement: true,
      observationTracking: true,
      departmentManagement: true,
      projectCodeManagement: true,
      warningsAndFines: true,
      correctiveActions: true,
      trainingModule: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      heatmapAnalytics: false,
      dataExport: true,
      apiAccess: false,
      bulkImport: true,
      multiUserAccess: true,
      roleBasedAccess: true,
      customBranding: true,
      customDomain: false,
      emailSupport: true,
      prioritySupport: true,
      dedicatedAccountManager: false,
    },
    limits: {
      maxUsers: 25,
      maxObservations: 1000,
      maxDepartments: 20,
      maxProjects: 50,
      maxStorageMB: 5000,
      maxMediaUploadsPerMonth: 500,
      maxAPICallsPerDay: 0,
      dataRetentionMonths: 24,
    },
    isPopular: true,
    displayOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    tier: 'enterprise' as PlanTier,
    displayName: {
      en: 'Enterprise',
      ru: 'Корпоративный',
      tr: 'Kurumsal',
    },
    description: {
      en: 'Unlimited power for large organizations with advanced needs',
      ru: 'Неограниченные возможности для крупных организаций',
      tr: 'Gelişmiş ihtiyaçları olan büyük kuruluşlar için sınırsız güç',
    },
    monthlyPrice: 19900, // $199.00
    yearlyPrice: 191040, // $1,910.40 (20% discount)
    currency: 'USD',
    stripeMonthlyPriceId: 'price_enterprise_monthly',
    stripeYearlyPriceId: 'price_enterprise_yearly',
    trialDays: 30,
    features: {
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
      apiAccess: true,
      bulkImport: true,
      multiUserAccess: true,
      roleBasedAccess: true,
      customBranding: true,
      customDomain: true,
      emailSupport: true,
      prioritySupport: true,
      dedicatedAccountManager: true,
    },
    limits: {
      maxUsers: -1, // Unlimited
      maxObservations: -1,
      maxDepartments: -1,
      maxProjects: -1,
      maxStorageMB: 50000,
      maxMediaUploadsPerMonth: -1,
      maxAPICallsPerDay: -1,
      dataRetentionMonths: -1,
    },
    displayOrder: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): Plan | undefined {
  return MOCK_PLANS.find((p) => p.id === planId);
}

/**
 * Get plan by tier
 */
export function getPlanByTier(tier: PlanTier): Plan | undefined {
  return MOCK_PLANS.find((p) => p.tier === tier);
}

/**
 * Format price in cents to dollar string
 */
export function formatPrice(cents: number, currency: string = 'USD'): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

/**
 * Calculate yearly savings percentage
 */
export function calculateYearlySavings(plan: Plan): number {
  if (plan.monthlyPrice === 0) return 0;

  const yearlyFromMonthly = plan.monthlyPrice * 12;
  const savings = yearlyFromMonthly - plan.yearlyPrice;
  return Math.round((savings / yearlyFromMonthly) * 100);
}
