/**
 * Billing Dashboard Page
 *
 * Super Admin page showing platform-wide billing metrics and revenue
 */

import { useTranslation } from 'react-i18next';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Badge,
  Progress,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Calendar,
} from 'lucide-react';
import styled from 'styled-components';
import { MOCK_TENANT_LIST } from '../../../shared/config/mock-tenants';
import { formatPrice } from '../../../shared/config/mock-plans';
import type { TenantListItem } from '../../../shared/types/tenant';

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

const StatsCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`;

const MetricIcon = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  margin-bottom: 12px;
`;

export default function BillingDashboardPage() {
  const { t } = useTranslation();

  // Calculate metrics
  const metrics = {
    // Revenue (mock calculations)
    mrr: 29700, // $297.00 (sum of monthly prices for active tenants)
    arr: 356400, // $3,564.00 (MRR * 12)
    avgRevenuePerTenant: 9900, // $99.00

    // Subscriptions
    totalSubscriptions: MOCK_TENANT_LIST.length,
    activeSubscriptions: MOCK_TENANT_LIST.filter((t) => t.subscriptionStatus === 'active').length,
    trialSubscriptions: MOCK_TENANT_LIST.filter((t) => t.isInTrial).length,

    // Payment issues
    pastDueCount: MOCK_TENANT_LIST.filter((t) => t.isPastDue).length,
    noPaymentMethod: MOCK_TENANT_LIST.filter((t) => !t.paymentMethodOnFile).length,

    // Growth (mock)
    mrrGrowth: 15.5, // 15.5% MoM growth
    newSubscriptionsThisMonth: 2,
    churnedThisMonth: 0,
  };

  // Tenants with payment issues
  const paymentIssues = MOCK_TENANT_LIST.filter(
    (t) => t.isPastDue || !t.paymentMethodOnFile
  );

  // Upcoming renewals (mock - next 30 days)
  const upcomingRenewals = MOCK_TENANT_LIST.filter((t) => t.subscriptionStatus === 'active').slice(0, 5);

  const issuesColumns: ColumnsType<TenantListItem> = [
    {
      title: t('superAdmin.billing.table.tenant', 'Tenant'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('superAdmin.billing.table.issue', 'Issue'),
      key: 'issue',
      render: (_, record: TenantListItem) => {
        if (record.isPastDue) {
          return <Tag color="error">Payment Past Due</Tag>;
        }
        if (!record.paymentMethodOnFile) {
          return <Tag color="warning">No Payment Method</Tag>;
        }
        return null;
      },
    },
    {
      title: t('superAdmin.billing.table.plan', 'Plan'),
      dataIndex: 'planName',
      key: 'plan',
    },
    {
      title: t('superAdmin.billing.table.owner', 'Owner'),
      dataIndex: 'ownerEmail',
      key: 'owner',
    },
  ];

  const renewalsColumns: ColumnsType<TenantListItem> = [
    {
      title: t('superAdmin.billing.table.tenant', 'Tenant'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('superAdmin.billing.table.plan', 'Plan'),
      dataIndex: 'planName',
      key: 'plan',
      render: (plan: string) => (
        <Tag color={plan === 'ENTERPRISE' ? 'purple' : 'blue'}>{plan}</Tag>
      ),
    },
    {
      title: t('superAdmin.billing.table.renewalDate', 'Renewal Date'),
      key: 'renewal',
      render: () => {
        // Mock renewal date (random within next 30 days)
        const days = Math.floor(Math.random() * 30) + 1;
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString();
      },
    },
    {
      title: t('superAdmin.billing.table.amount', 'Amount'),
      key: 'amount',
      render: (_, record: TenantListItem) => {
        // Mock amounts based on plan
        const amounts = { FREE: 0, PRO: 4900, ENTERPRISE: 19900 };
        const amount = amounts[record.planName as keyof typeof amounts] || 0;
        return formatPrice(amount);
      },
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>{t('superAdmin.billing.title', 'Billing Dashboard')}</PageTitle>
        <PageDescription>
          {t(
            'superAdmin.billing.description',
            'Platform-wide revenue metrics and subscription health'
          )}
        </PageDescription>
      </PageHeader>

      {/* Revenue Metrics */}
      <StatsRow gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <MetricIcon $color="#10b981">
              <DollarSign size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.billing.mrr', 'Monthly Recurring Revenue')}
              value={formatPrice(metrics.mrr)}
              valueStyle={{ color: '#10b981' }}
              suffix={
                <span style={{ fontSize: 14, color: '#10b981' }}>
                  +{metrics.mrrGrowth}%
                </span>
              }
            />
          </StatsCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <MetricIcon $color="#3b82f6">
              <TrendingUp size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.billing.arr', 'Annual Recurring Revenue')}
              value={formatPrice(metrics.arr)}
              valueStyle={{ color: '#3b82f6' }}
            />
          </StatsCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <MetricIcon $color="#6366f1">
              <CreditCard size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.billing.avgRevenue', 'Avg Revenue/Tenant')}
              value={formatPrice(metrics.avgRevenuePerTenant)}
              valueStyle={{ color: '#6366f1' }}
            />
          </StatsCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <MetricIcon $color="#f59e0b">
              <AlertCircle size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.billing.paymentIssues', 'Payment Issues')}
              value={metrics.pastDueCount + metrics.noPaymentMethod}
              valueStyle={{ color: '#ef4444' }}
            />
          </StatsCard>
        </Col>
      </StatsRow>

      {/* Subscription Health */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card title={t('superAdmin.billing.subscriptions', 'Subscriptions')}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Active</span>
                <strong>{metrics.activeSubscriptions}</strong>
              </div>
              <Progress
                percent={(metrics.activeSubscriptions / metrics.totalSubscriptions) * 100}
                strokeColor="#10b981"
                showInfo={false}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Trial</span>
                <strong>{metrics.trialSubscriptions}</strong>
              </div>
              <Progress
                percent={(metrics.trialSubscriptions / metrics.totalSubscriptions) * 100}
                strokeColor="#f59e0b"
                showInfo={false}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Issues</span>
                <strong>{metrics.pastDueCount + metrics.noPaymentMethod}</strong>
              </div>
              <Progress
                percent={((metrics.pastDueCount + metrics.noPaymentMethod) / metrics.totalSubscriptions) * 100}
                strokeColor="#ef4444"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={t('superAdmin.billing.growth', 'Growth')}>
            <Statistic
              title={t('superAdmin.billing.newThisMonth', 'New This Month')}
              value={metrics.newSubscriptionsThisMonth}
              prefix={<TrendingUp size={20} />}
              valueStyle={{ color: '#10b981' }}
              style={{ marginBottom: 24 }}
            />
            <Statistic
              title={t('superAdmin.billing.churnedThisMonth', 'Churned This Month')}
              value={metrics.churnedThisMonth}
              prefix={<AlertCircle size={20} />}
              valueStyle={{ color: metrics.churnedThisMonth > 0 ? '#ef4444' : '#10b981' }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={t('superAdmin.billing.health', 'Payment Health')}>
            <div style={{ marginBottom: 16 }}>
              <Badge status="error" text="Past Due" />
              <div style={{ float: 'right', fontWeight: 600 }}>{metrics.pastDueCount}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Badge status="warning" text="No Payment Method" />
              <div style={{ float: 'right', fontWeight: 600 }}>{metrics.noPaymentMethod}</div>
            </div>
            <div>
              <Badge status="success" text="Healthy" />
              <div style={{ float: 'right', fontWeight: 600 }}>
                {metrics.totalSubscriptions - metrics.pastDueCount - metrics.noPaymentMethod}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Payment Issues Table */}
      {paymentIssues.length > 0 && (
        <Card
          title={
            <span>
              <AlertCircle size={16} style={{ marginRight: 8, color: '#ef4444' }} />
              {t('superAdmin.billing.issuesTitle', 'Tenants Requiring Attention')}
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <Table
            columns={issuesColumns}
            dataSource={paymentIssues}
            rowKey="id"
            pagination={false}
          />
        </Card>
      )}

      {/* Upcoming Renewals */}
      <Card
        title={
          <span>
            <Calendar size={16} style={{ marginRight: 8 }} />
            {t('superAdmin.billing.upcomingRenewals', 'Upcoming Renewals (Next 30 Days)')}
          </span>
        }
      >
        <Table
          columns={renewalsColumns}
          dataSource={upcomingRenewals}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
