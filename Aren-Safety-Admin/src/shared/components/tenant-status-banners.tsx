/**
 * Tenant Status Banners
 *
 * Displays contextual banners for:
 * - Trial status and countdown
 * - Past due payment warnings
 * - Suspended account notices
 */

import { Alert, Button } from 'antd';
import { AlertCircle, CreditCard, Clock, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import styled from 'styled-components';
import { useCurrentTenant } from '../stores/tenant-store';
import { useIsInTrial, useTrialDaysRemaining, useIsPastDue, useIsSuspended } from '../hooks/use-feature-gates';

const BannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StyledAlert = styled(Alert)`
  border-radius: 0;
  border-left: none;
  border-right: none;

  .ant-alert-message {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    flex: 1;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const BannerText = styled.div`
  flex: 1;
`;

const BannerTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const BannerDescription = styled.div`
  font-size: 13px;
  opacity: 0.9;
`;

export function TenantStatusBanners() {
  const { t } = useTranslation();
  const tenant = useCurrentTenant();
  const isInTrial = useIsInTrial();
  const trialDaysRemaining = useTrialDaysRemaining();
  const isPastDue = useIsPastDue();
  const isSuspended = useIsSuspended();

  if (!tenant) return null;

  const billingUrl = `/t/${tenant.slug}/settings/billing`;

  return (
    <BannerContainer>
      {/* Suspended Account Banner */}
      {isSuspended && (
        <StyledAlert
          type="error"
          banner
          message={
            <BannerContent>
              <Lock size={20} />
              <BannerText>
                <BannerTitle>
                  {t('tenantStatus.suspended.title', 'Account Suspended')}
                </BannerTitle>
                <BannerDescription>
                  {t(
                    'tenantStatus.suspended.description',
                    'Your account has been suspended. Please contact support to resolve this issue.'
                  )}
                </BannerDescription>
              </BannerText>
              <Button type="primary" danger href="mailto:support@example.com">
                {t('tenantStatus.suspended.contactSupport', 'Contact Support')}
              </Button>
            </BannerContent>
          }
        />
      )}

      {/* Past Due Payment Banner */}
      {isPastDue && !isSuspended && (
        <StyledAlert
          type="error"
          banner
          message={
            <BannerContent>
              <CreditCard size={20} />
              <BannerText>
                <BannerTitle>
                  {t('tenantStatus.pastDue.title', 'Payment Past Due')}
                </BannerTitle>
                <BannerDescription>
                  {t(
                    'tenantStatus.pastDue.description',
                    'Your payment is past due. Please update your payment method to avoid service interruption.'
                  )}
                </BannerDescription>
              </BannerText>
              <Link to={billingUrl}>
                <Button type="primary" danger icon={<CreditCard size={14} />}>
                  {t('tenantStatus.pastDue.updatePayment', 'Update Payment')}
                </Button>
              </Link>
            </BannerContent>
          }
        />
      )}

      {/* Trial Status Banner */}
      {isInTrial && !isPastDue && !isSuspended && trialDaysRemaining !== null && (
        <StyledAlert
          type={trialDaysRemaining <= 3 ? 'warning' : 'info'}
          banner
          message={
            <BannerContent>
              <Clock size={20} />
              <BannerText>
                <BannerTitle>
                  {trialDaysRemaining === 0
                    ? t('tenantStatus.trial.lastDay', 'Last Day of Trial')
                    : trialDaysRemaining === 1
                    ? t('tenantStatus.trial.oneDayLeft', '1 Day Left in Trial')
                    : t('tenantStatus.trial.daysLeft', {
                        defaultValue: '{{count}} Days Left in Trial',
                        count: trialDaysRemaining,
                      })}
                </BannerTitle>
                <BannerDescription>
                  {trialDaysRemaining <= 3
                    ? t(
                        'tenantStatus.trial.upgradeNow',
                        'Upgrade now to continue using all features without interruption.'
                      )
                    : t(
                        'tenantStatus.trial.enjoyFeatures',
                        'Enjoy full access to all features during your trial period.'
                      )}
                </BannerDescription>
              </BannerText>
              {trialDaysRemaining <= 7 && (
                <Link to={billingUrl}>
                  <Button
                    type={trialDaysRemaining <= 3 ? 'primary' : 'default'}
                    icon={<CreditCard size={14} />}
                  >
                    {t('tenantStatus.trial.upgrade', 'Upgrade Now')}
                  </Button>
                </Link>
              )}
            </BannerContent>
          }
        />
      )}
    </BannerContainer>
  );
}

/**
 * Individual Trial Banner (for settings page or dashboard)
 */
export function TrialBanner() {
  const { t } = useTranslation();
  const tenant = useCurrentTenant();
  const isInTrial = useIsInTrial();
  const trialDaysRemaining = useTrialDaysRemaining();

  if (!tenant || !isInTrial || trialDaysRemaining === null) return null;

  const billingUrl = `/t/${tenant.slug}/settings/billing`;

  return (
    <Alert
      type="info"
      showIcon
      icon={<Clock size={18} />}
      message={
        <div>
          <strong>
            {trialDaysRemaining === 0
              ? t('trial.lastDay', 'Last day of your trial')
              : trialDaysRemaining === 1
              ? t('trial.oneDayRemaining', '1 day remaining in your trial')
              : t('trial.daysRemaining', {
                  defaultValue: '{{count}} days remaining in your trial',
                  count: trialDaysRemaining,
                })}
          </strong>
        </div>
      }
      description={t(
        'trial.upgradeMessage',
        'Upgrade your plan to continue accessing all features after your trial ends.'
      )}
      action={
        <Link to={billingUrl}>
          <Button type="primary" size="small">
            {t('trial.viewPlans', 'View Plans')}
          </Button>
        </Link>
      }
    />
  );
}

/**
 * Quota Warning Banner (for specific features)
 */
interface QuotaWarningProps {
  current: number;
  limit: number;
  feature: string;
  upgradeUrl?: string;
}

export function QuotaWarningBanner({ current, limit, feature, upgradeUrl }: QuotaWarningProps) {
  const { t } = useTranslation();
  const percentageUsed = Math.round((current / limit) * 100);

  if (limit === -1 || percentageUsed < 80) return null;

  const isNearLimit = percentageUsed >= 90;

  return (
    <Alert
      type={isNearLimit ? 'warning' : 'info'}
      showIcon
      icon={<AlertCircle size={18} />}
      message={
        <div>
          <strong>
            {isNearLimit
              ? t('quota.nearLimit', 'Approaching {{feature}} limit', { feature })
              : t('quota.warning', '{{feature}} usage high', { feature })}
          </strong>
        </div>
      }
      description={t('quota.description', {
        defaultValue: 'You are using {{current}} of {{limit}} {{feature}} ({{percentage}}%)',
        current,
        limit,
        feature,
        percentage: percentageUsed,
      })}
      action={
        upgradeUrl && (
          <Link to={upgradeUrl}>
            <Button type="primary" size="small">
              {t('quota.upgrade', 'Upgrade Plan')}
            </Button>
          </Link>
        )
      }
    />
  );
}
