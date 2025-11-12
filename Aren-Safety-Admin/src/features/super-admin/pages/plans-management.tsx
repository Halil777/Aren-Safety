/**
 * Plans Management Page
 *
 * Super Admin page to view and manage subscription plans
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Descriptions,
  Collapse,
  Switch,
  InputNumber,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Check, X, Edit, TrendingUp } from 'lucide-react';
import styled from 'styled-components';
import { MOCK_PLANS, formatPrice, calculateYearlySavings } from '../../../shared/config/mock-plans';
import { MOCK_TENANT_LIST } from '../../../shared/config/mock-tenants';
import type { PlanFeatures } from '../../../shared/types/tenant';

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors[theme.mode].textSecondary};
  margin: 0 0 16px 0;
  font-size: 14px;
`;

const StatsRow = styled(Row)`
  margin-bottom: 24px;
`;

const PlanCard = styled(Card)<{ $isPopular?: boolean }>`
  height: 100%;
  ${({ $isPopular }) =>
    $isPopular &&
    `
    border: 2px solid #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  `}

  .ant-card-head {
    background: ${({ $isPopular }) =>
      $isPopular ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent'};
    color: ${({ $isPopular }) => ($isPopular ? 'white' : 'inherit')};
  }
`;

const PriceDisplay = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin: 16px 0;
`;

const PriceSubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 16px;
`;

const FeatureList = styled.div`
  margin-top: 16px;
`;

const FeatureItem = styled.div<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.4)};
`;

const PopularBadge = styled.div`
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin-bottom: 8px;
`;

export default function PlansManagementPage() {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);

  // Calculate distribution of tenants by plan
  const planDistribution = MOCK_PLANS.map((plan) => ({
    planId: plan.id,
    planName: plan.name,
    count: MOCK_TENANT_LIST.filter((t) => t.planTier === plan.tier).length,
  }));

  // Feature comparison columns
  const featureKeys: (keyof PlanFeatures)[] = [
    'employeeManagement',
    'observationTracking',
    'warningsAndFines',
    'correctiveActions',
    'trainingModule',
    'basicAnalytics',
    'advancedAnalytics',
    'heatmapAnalytics',
    'dataExport',
    'bulkImport',
    'apiAccess',
    'customBranding',
    'customDomain',
    'prioritySupport',
  ];

  const featureLabels: Record<keyof PlanFeatures, string> = {
    employeeManagement: 'Employee Management',
    observationTracking: 'Observation Tracking',
    departmentManagement: 'Department Management',
    projectCodeManagement: 'Project Code Management',
    warningsAndFines: 'Warnings & Fines',
    correctiveActions: 'Corrective Actions',
    trainingModule: 'Training Module',
    basicAnalytics: 'Basic Analytics',
    advancedAnalytics: 'Advanced Analytics',
    heatmapAnalytics: 'Heatmap Analytics',
    dataExport: 'Data Export',
    bulkImport: 'Bulk Import',
    apiAccess: 'API Access',
    customBranding: 'Custom Branding',
    customDomain: 'Custom Domain',
    multiUserAccess: 'Multi-User Access',
    roleBasedAccess: 'Role-Based Access',
    emailSupport: 'Email Support',
    prioritySupport: 'Priority Support',
    dedicatedAccountManager: 'Dedicated Account Manager',
  };

  const comparisonColumns: ColumnsType<{ feature: string }> = [
    {
      title: t('superAdmin.plans.table.feature', 'Feature'),
      dataIndex: 'feature',
      key: 'feature',
      width: 250,
      fixed: 'left',
    },
    ...MOCK_PLANS.map((plan) => ({
      title: plan.displayName.en,
      key: plan.id,
      align: 'center' as const,
      render: (_: any, record: { feature: string }) => {
        const featureKey = record.feature as keyof PlanFeatures;
        const enabled = plan.features[featureKey];
        return enabled ? (
          <Check size={20} color="#10b981" />
        ) : (
          <X size={20} color="#ef4444" />
        );
      },
    })),
  ];

  const comparisonData = featureKeys.map((key) => ({
    key,
    feature: featureLabels[key],
  }));

  const handleSave = () => {
    message.success(t('superAdmin.plans.saveSuccess', 'Plans updated successfully'));
    setEditMode(false);
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>{t('superAdmin.plans.title', 'Plans & Pricing')}</PageTitle>
        <PageDescription>
          {t(
            'superAdmin.plans.description',
            'Manage subscription plans, features, and pricing tiers'
          )}
        </PageDescription>
      </PageHeader>

      {/* Stats */}
      <StatsRow gutter={16}>
        {planDistribution.map((dist) => (
          <Col key={dist.planId} xs={24} sm={8}>
            <Card>
              <Statistic
                title={`${dist.planName} Plan Tenants`}
                value={dist.count}
                prefix={<TrendingUp size={20} />}
              />
            </Card>
          </Col>
        ))}
      </StatsRow>

      {/* Plan Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {MOCK_PLANS.map((plan) => (
          <Col key={plan.id} xs={24} md={8}>
            <PlanCard
              $isPopular={plan.isPopular}
              title={
                <div>
                  {plan.isPopular && <PopularBadge>Most Popular</PopularBadge>}
                  <div>{plan.displayName.en}</div>
                </div>
              }
              extra={
                <Tag color={plan.tier === 'enterprise' ? 'purple' : plan.tier === 'pro' ? 'blue' : 'default'}>
                  {plan.tier.toUpperCase()}
                </Tag>
              }
            >
              <PriceDisplay>
                {plan.monthlyPrice === 0 ? (
                  'Free'
                ) : (
                  <>
                    {formatPrice(plan.monthlyPrice)}
                    <span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span>
                  </>
                )}
              </PriceDisplay>

              {plan.monthlyPrice > 0 && (
                <PriceSubtext>
                  or {formatPrice(plan.yearlyPrice)}/year (
                  {calculateYearlySavings(plan)}% off)
                </PriceSubtext>
              )}

              <div style={{ fontSize: 14, marginBottom: 16 }}>
                {plan.description.en}
              </div>

              <Descriptions column={1} size="small">
                <Descriptions.Item label="Users">
                  {plan.limits.maxUsers === -1 ? 'Unlimited' : plan.limits.maxUsers}
                </Descriptions.Item>
                <Descriptions.Item label="Observations">
                  {plan.limits.maxObservations === -1
                    ? 'Unlimited'
                    : plan.limits.maxObservations}
                </Descriptions.Item>
                <Descriptions.Item label="Storage">
                  {plan.limits.maxStorageMB}MB
                </Descriptions.Item>
                <Descriptions.Item label="Trial Days">
                  {plan.trialDays} days
                </Descriptions.Item>
              </Descriptions>

              <FeatureList>
                <strong>Key Features:</strong>
                <FeatureItem $enabled={plan.features.advancedAnalytics}>
                  {plan.features.advancedAnalytics ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                  Advanced Analytics
                </FeatureItem>
                <FeatureItem $enabled={plan.features.customBranding}>
                  {plan.features.customBranding ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                  Custom Branding
                </FeatureItem>
                <FeatureItem $enabled={plan.features.apiAccess}>
                  {plan.features.apiAccess ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                  API Access
                </FeatureItem>
                <FeatureItem $enabled={plan.features.prioritySupport}>
                  {plan.features.prioritySupport ? (
                    <Check size={16} color="#10b981" />
                  ) : (
                    <X size={16} color="#ef4444" />
                  )}
                  Priority Support
                </FeatureItem>
              </FeatureList>

              {editMode && (
                <Button
                  type="dashed"
                  block
                  icon={<Edit size={16} />}
                  style={{ marginTop: 16 }}
                >
                  {t('superAdmin.plans.editPlan', 'Edit Plan')}
                </Button>
              )}
            </PlanCard>
          </Col>
        ))}
      </Row>

      {/* Feature Comparison Table */}
      <Card
        title={t('superAdmin.plans.comparison', 'Feature Comparison')}
        extra={
          <Space>
            <span>
              {t('superAdmin.plans.editMode', 'Edit Mode')}:
            </span>
            <Switch checked={editMode} onChange={setEditMode} />
            {editMode && (
              <Button type="primary" onClick={handleSave}>
                {t('common.save', 'Save Changes')}
              </Button>
            )}
          </Space>
        }
      >
        <Table
          columns={comparisonColumns}
          dataSource={comparisonData}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>

      {/* Detailed Plan Settings (Collapsible) */}
      <Card style={{ marginTop: 24 }} title={t('superAdmin.plans.advanced', 'Advanced Settings')}>
        <Collapse>
          {MOCK_PLANS.map((plan) => (
            <Collapse.Panel
              header={`${plan.displayName.en} - Advanced Settings`}
              key={plan.id}
            >
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Plan ID">{plan.id}</Descriptions.Item>
                <Descriptions.Item label="Tier">{plan.tier}</Descriptions.Item>
                <Descriptions.Item label="Monthly Price">
                  {editMode ? (
                    <InputNumber
                      value={plan.monthlyPrice}
                      prefix="$"
                      suffix="/100"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    formatPrice(plan.monthlyPrice)
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Yearly Price">
                  {editMode ? (
                    <InputNumber
                      value={plan.yearlyPrice}
                      prefix="$"
                      suffix="/100"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    formatPrice(plan.yearlyPrice)
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Stripe Monthly ID">
                  {plan.stripeMonthlyPriceId || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Stripe Yearly ID">
                  {plan.stripeYearlyPriceId || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Collapse.Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  );
}
