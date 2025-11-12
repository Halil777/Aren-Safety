/**
 * Super Admin Dashboard
 *
 * Platform-wide metrics and health overview
 */

import { Card, Row, Col, Statistic, Table, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MOCK_TENANT_LIST, getPlatformMetrics } from '../../../shared/config/mock-tenants';
import type { TenantListItem } from '../../../shared/types/tenant';
import { formatPrice } from '../../../shared/config/mock-plans';

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
  margin: 0;
  font-size: 14px;
`;

const StyledCard = styled(Card)`
  height: 100%;

  .ant-card-head-title {
    font-weight: 600;
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

export default function SuperAdminDashboard() {
  const { t } = useTranslation();
  const metrics = getPlatformMetrics();

  // Recent tenants (last 5)
  const recentTenants = [...MOCK_TENANT_LIST]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Tenants needing attention
  const tenantsNeedingAttention = MOCK_TENANT_LIST.filter(
    (t) => t.isPastDue || t.status === 'trial' || t.status === 'suspended'
  );

  const recentTenantsColumns: ColumnsType<TenantListItem> = [
    {
      title: t('superAdmin.dashboard.tenant', 'Tenant'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TenantListItem) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{record.ownerEmail}</div>
        </div>
      ),
    },
    {
      title: t('superAdmin.dashboard.plan', 'Plan'),
      dataIndex: 'planName',
      key: 'plan',
      render: (planName: string) => (
        <Badge
          color={
            planName === 'FREE'
              ? 'default'
              : planName === 'PRO'
              ? 'blue'
              : 'purple'
          }
          text={planName}
        />
      ),
    },
    {
      title: t('superAdmin.dashboard.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          active: 'success',
          trial: 'warning',
          past_due: 'error',
          suspended: 'default',
        };
        return (
          <Badge
            status={statusColors[status] as any}
            text={status.replace('_', ' ')}
          />
        );
      },
    },
    {
      title: t('superAdmin.dashboard.users', 'Users'),
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: t('superAdmin.dashboard.created', 'Created'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const attentionColumns: ColumnsType<TenantListItem> = [
    {
      title: t('superAdmin.dashboard.tenant', 'Tenant'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('superAdmin.dashboard.issue', 'Issue'),
      key: 'issue',
      render: (_, record: TenantListItem) => {
        if (record.isPastDue)
          return <Badge status="error" text="Payment Past Due" />;
        if (record.status === 'trial')
          return <Badge status="warning" text="Trial Ending Soon" />;
        if (record.status === 'suspended')
          return <Badge status="default" text="Suspended" />;
        return null;
      },
    },
    {
      title: t('superAdmin.dashboard.action', 'Action'),
      key: 'action',
      render: (_, record: TenantListItem) => (
        <a href={`/super-admin/tenants/${record.id}`}>
          {t('superAdmin.dashboard.view', 'View')}
        </a>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>{t('superAdmin.dashboard.title', 'Platform Dashboard')}</PageTitle>
        <PageDescription>
          {t(
            'superAdmin.dashboard.description',
            'Overview of your multi-tenant platform health and metrics'
          )}
        </PageDescription>
      </PageHeader>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <MetricIcon $color="#6366f1">
              <Building2 size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.dashboard.totalTenants', 'Total Tenants')}
              value={metrics.totalTenants}
              suffix={
                <span style={{ fontSize: 14, color: '#10b981' }}>
                  +{metrics.newTenantsThisMonth} this month
                </span>
              }
            />
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <MetricIcon $color="#10b981">
              <TrendingUp size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.dashboard.activeTenants', 'Active Tenants')}
              value={metrics.activeTenants}
              valueStyle={{ color: '#10b981' }}
            />
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <MetricIcon $color="#3b82f6">
              <Users size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.dashboard.totalUsers', 'Total Users')}
              value={metrics.totalUsers}
              suffix={
                <span style={{ fontSize: 14, opacity: 0.7 }}>
                  {metrics.activeUsersLast30Days} active
                </span>
              }
            />
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <MetricIcon $color="#f59e0b">
              <DollarSign size={24} />
            </MetricIcon>
            <Statistic
              title={t('superAdmin.dashboard.mrr', 'Monthly Recurring Revenue')}
              value={formatPrice(metrics.monthlyRecurringRevenue)}
              valueStyle={{ color: '#f59e0b' }}
            />
          </StyledCard>
        </Col>
      </Row>

      {/* Health Indicators */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <StyledCard>
            <Statistic
              title={
                <span>
                  <Clock size={14} style={{ marginRight: 8 }} />
                  {t('superAdmin.dashboard.trialTenants', 'Trial Tenants')}
                </span>
              }
              value={metrics.trialTenants}
              valueStyle={{ color: '#f59e0b' }}
            />
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StyledCard>
            <Statistic
              title={
                <span>
                  <AlertCircle size={14} style={{ marginRight: 8 }} />
                  {t('superAdmin.dashboard.paymentIssues', 'Payment Issues')}
                </span>
              }
              value={metrics.tenantsWithPaymentIssues}
              valueStyle={{ color: '#ef4444' }}
            />
          </StyledCard>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <StyledCard>
            <Statistic
              title={
                <span>
                  <AlertCircle size={14} style={{ marginRight: 8 }} />
                  {t('superAdmin.dashboard.nearQuota', 'Near Quota Limits')}
                </span>
              }
              value={metrics.tenantsNearQuotaLimits}
              valueStyle={{ color: '#f59e0b' }}
            />
          </StyledCard>
        </Col>
      </Row>

      {/* Recent Tenants & Attention Needed */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <StyledCard
            title={t('superAdmin.dashboard.recentTenants', 'Recent Tenants')}
          >
            <Table
              columns={recentTenantsColumns}
              dataSource={recentTenants}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </StyledCard>
        </Col>

        <Col xs={24} lg={10}>
          <StyledCard
            title={
              <span>
                <AlertCircle
                  size={16}
                  style={{ marginRight: 8, color: '#f59e0b' }}
                />
                {t('superAdmin.dashboard.needsAttention', 'Needs Attention')}
              </span>
            }
          >
            <Table
              columns={attentionColumns}
              dataSource={tenantsNeedingAttention}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
}
