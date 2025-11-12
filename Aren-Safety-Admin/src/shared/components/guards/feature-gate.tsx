/**
 * Feature Gate Component
 *
 * Conditionally renders children based on plan-based feature access
 * Shows upgrade prompt for locked features
 */

import { type ReactNode } from 'react';
import { Button, Card } from 'antd';
import { Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import styled from 'styled-components';
import { useHasFeature, useFeatureLockReason, usePlanTier } from '../../hooks/use-feature-gates';
import { useCurrentTenant } from '../../stores/tenant-store';
import type { PlanFeatures } from '../../types/tenant';

const LockedFeatureCard = styled(Card)`
  text-align: center;
  margin: 24px 0;

  .ant-card-body {
    padding: 48px 24px;
  }
`;

const LockIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)')};
  color: #f59e0b;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors[theme.mode].textSecondary};
  margin-bottom: 24px;
  font-size: 14px;
`;

const PlanBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 4px;
`;

interface FeatureGateProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  featureName?: string;
  featureDescription?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
  featureName,
}: FeatureGateProps) {
  const { t } = useTranslation();
  const hasFeature = useHasFeature(feature);
  const lockReason = useFeatureLockReason(feature);
  const planTier = usePlanTier();
  const tenant = useCurrentTenant();

  // Feature is enabled - render children
  if (hasFeature) {
    return <>{children}</>;
  }

  // Feature is locked - show fallback or upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default locked feature UI
  const requiredPlan = planTier === 'free' ? 'Pro' : 'Enterprise';
  const billingUrl = tenant ? `/t/${tenant.slug}/settings/billing` : '/settings/billing';

  if (!showUpgrade) {
    return null;
  }

  return (
    <LockedFeatureCard>
      <LockIcon>
        <Lock size={32} />
      </LockIcon>
      <FeatureTitle>
        {featureName || t('featureGate.lockedFeature', 'Premium Feature')}
      </FeatureTitle>
      <FeatureDescription>
        {lockReason ||
          t('featureGate.upgradeRequired', 'This feature requires a higher plan tier.')}
      </FeatureDescription>
      <div style={{ marginBottom: 16 }}>
        {t('featureGate.availableOn', 'Available on')}
        <PlanBadge>{requiredPlan}</PlanBadge>
        {t('featureGate.andHigher', 'and higher')}
      </div>
      <Link to={billingUrl}>
        <Button type="primary" size="large" icon={<Sparkles size={16} />}>
          {t('featureGate.upgradePlan', `Upgrade to ${requiredPlan}`)}
        </Button>
      </Link>
    </LockedFeatureCard>
  );
}

/**
 * Inline Feature Gate (for smaller UI elements)
 */
interface InlineFeatureGateProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
}

export function InlineFeatureGate({ feature, children }: InlineFeatureGateProps) {
  const hasFeature = useHasFeature(feature);
  return hasFeature ? <>{children}</> : null;
}

/**
 * Feature Lock Badge (shows lock icon on disabled features)
 */
interface FeatureLockBadgeProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
}

export function FeatureLockBadge({ feature, children }: FeatureLockBadgeProps) {
  const { t } = useTranslation();
  const hasFeature = useHasFeature(feature);
  const lockReason = useFeatureLockReason(feature);

  if (hasFeature) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative', opacity: 0.6, pointerEvents: 'none' }}>
      {children}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#f59e0b',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        title={lockReason || t('featureGate.locked', 'Locked')}
      >
        <Lock size={12} />
        {t('featureGate.pro', 'PRO')}
      </div>
    </div>
  );
}
