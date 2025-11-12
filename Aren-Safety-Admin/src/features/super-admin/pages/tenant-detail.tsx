/**
 * Tenant Detail Page
 *
 * Detailed view of a single tenant with metrics and management actions
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  Table,
  Badge,
  Modal,
  message,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ArrowLeft,
  Edit,
  UserCog,
  Power,
  PowerOff,
  Trash2,
  TrendingUp,
  Users,
  Database,
  HardDrive,
} from 'lucide-react';
import styled from 'styled-components';
import { getTenantById, getTenantListItemById } from '../../../shared/config/mock-tenants';
import { getPlanById } from '../../../shared/config/mock-plans';
import type { UsageMetrics } from '../../../shared/types/tenant';

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const TitleText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const StatsRow = styled(Row)`
  margin-bottom: 24px;
`;

const StatsCard = styled(Card)`
  .ant-card-body {
    padding: 20px;
  }
`;

export default function TenantDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const tenant = tenantId ? getTenantById(tenantId) : null;
  const tenantListItem = tenantId ? getTenantListItemById(tenantId) : null;
  const plan = tenant ? getPlanById(tenant.planId) : null;

  if (!tenant || !tenantListItem) {
    return (
      <div>
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/super-admin/tenants')}
        >
          {t('common.back', 'Back to Tenants')}
        </Button>
        <Card>
          <p>{t('superAdmin.tenants.detail.notFound', 'Tenant not found')}</p>
        </Card>
      </div>
    );
  }

  // Mock usage metrics
  const usageMetrics: UsageMetrics = {
    tenantId: tenant.id,
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date().toISOString(),
    activeUsers: tenantListItem.userCount,
    maxUsers: plan?.limits.maxUsers || 3,
    totalObservations: Math.floor(Math.random() * 100),
    maxObservations: plan?.limits.maxObservations || 50,
    totalDepartments: Math.floor(Math.random() * 10),
    maxDepartments: plan?.limits.maxDepartments || 5,
    totalProjects: Math.floor(Math.random() * 5),
    maxProjects: plan?.limits.maxProjects || 3,
    storageUsedMB: Math.floor(Math.random() * 500),
    maxStorageMB: plan?.limits.maxStorageMB || 100,
    apiCallsToday: Math.floor(Math.random() * 1000),
    maxAPICallsPerDay: plan?.limits.maxAPICallsPerDay || 0,
    mediaUploadsThisMonth: Math.floor(Math.random() * 50),
    maxMediaUploadsPerMonth: plan?.limits.maxMediaUploadsPerMonth || 20,
  };

  const handleSuspend = () => {
    Modal.confirm({
      title: t('superAdmin.tenants.suspend.title', 'Suspend Tenant'),
      content: t(
        'superAdmin.tenants.suspend.confirm',
        `Are you sure you want to suspend "${tenant.name}"? Users will lose access immediately.`
      ),
      okText: t('superAdmin.tenants.suspend.confirm', 'Suspend'),
      okButtonProps: { danger: true },
      onOk: () => {
        message.success(
          t('superAdmin.tenants.suspend.success', `${tenant.name} has been suspended`)
        );
        navigate('/super-admin/tenants');
      },
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: t('superAdmin.tenants.delete.title', 'Delete Tenant'),
      content: t(
        'superAdmin.tenants.delete.confirm',
        `Are you sure you want to PERMANENTLY DELETE "${tenant.name}"? This action cannot be undone.`
      ),
      okText: t('superAdmin.tenants.delete.confirm', 'Delete'),
      okButtonProps: { danger: true },
      onOk: () => {
        message.success(
          t('superAdmin.tenants.delete.success', `${tenant.name} has been deleted`)
        );
        navigate('/super-admin/tenants');
      },
    });
  };

  // Usage percentage
  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0;
    return Math.round((current / max) * 100);
  };

  // Activity log mock data
  const activityLog = [
    {
      key: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      action: 'User invited',
      user: 'john@acme.com',
      details: 'Invited new user to Safety Team',
    },
    {
      key: '2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      action: 'Observation created',
      user: 'jane@acme.com',
      details: 'Created safety observation #123',
    },
    {
      key: '3',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      action: 'Plan upgraded',
      user: 'owner@acme.com',
      details: 'Upgraded from Free to Pro',
    },
  ];

  const activityColumns: ColumnsType<typeof activityLog[0]> = [
    {
      title: t('superAdmin.tenants.detail.activity.timestamp', 'Time'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: t('superAdmin.tenants.detail.activity.action', 'Action'),
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: t('superAdmin.tenants.detail.activity.user', 'User'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('superAdmin.tenants.detail.activity.details', 'Details'),
      dataIndex: 'details',
      key: 'details',
    },
  ];

  return (
    <div>
      <PageHeader>
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/super-admin/tenants')}
          style={{ marginBottom: 16 }}
        >
          {t('common.back', 'Back to Tenants')}
        </Button>

        <PageTitle>
          <TitleText>{tenant.name}</TitleText>
          <Space>
            <Button
              type="default"
              icon={<UserCog size={16} />}
              onClick={() => {
                /* TODO: Implement impersonation */
              }}
            >
              {t('superAdmin.tenants.actions.impersonate', 'Impersonate')}
            </Button>
            <Button
              type="default"
              icon={<Edit size={16} />}
              onClick={() => navigate(`/super-admin/tenants/${tenantId}/edit`)}
            >
              {t('superAdmin.tenants.actions.edit', 'Edit')}
            </Button>
            {tenant.status === 'suspended' ? (
              <Button type="primary" icon={<Power size={16} />}>
                {t('superAdmin.tenants.actions.reactivate', 'Reactivate')}
              </Button>
            ) : (
              <Button
                danger
                icon={<PowerOff size={16} />}
                onClick={handleSuspend}
              >
                {t('superAdmin.tenants.actions.suspend', 'Suspend')}
              </Button>
            )}
            <Button danger icon={<Trash2 size={16} />} onClick={handleDelete}>
              {t('superAdmin.tenants.actions.delete', 'Delete')}
            </Button>
          </Space>
        </PageTitle>
      </PageHeader>

      {/* Usage Stats */}
      <StatsRow gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.detail.users', 'Active Users')}
              value={usageMetrics.activeUsers}
              suffix={
                usageMetrics.maxUsers === -1
                  ? '/ ∞'
                  : `/ ${usageMetrics.maxUsers}`
              }
              prefix={<Users size={20} />}
              valueStyle={{
                color:
                  getUsagePercentage(
                    usageMetrics.activeUsers,
                    usageMetrics.maxUsers
                  ) > 80
                    ? '#f59e0b'
                    : '#10b981',
              }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.detail.observations', 'Observations')}
              value={usageMetrics.totalObservations}
              suffix={
                usageMetrics.maxObservations === -1
                  ? '/ ∞'
                  : `/ ${usageMetrics.maxObservations}`
              }
              prefix={<Database size={20} />}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.detail.storage', 'Storage Used')}
              value={usageMetrics.storageUsedMB}
              suffix={`MB / ${usageMetrics.maxStorageMB}MB`}
              prefix={<HardDrive size={20} />}
              valueStyle={{
                color:
                  getUsagePercentage(
                    usageMetrics.storageUsedMB,
                    usageMetrics.maxStorageMB
                  ) > 80
                    ? '#ef4444'
                    : '#3b82f6',
              }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.detail.apiCalls', 'API Calls Today')}
              value={usageMetrics.apiCallsToday}
              prefix={<TrendingUp size={20} />}
            />
          </StatsCard>
        </Col>
      </StatsRow>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: t('superAdmin.tenants.detail.tabs.overview', 'Overview'),
            children: (
              <Card>
                <Descriptions column={2} bordered>
                  <Descriptions.Item
                    label={t('superAdmin.tenants.detail.status', 'Status')}
                  >
                    <Badge
                      status={
                        tenant.status === 'active'
                          ? 'success'
                          : tenant.status === 'trial'
                          ? 'warning'
                          : 'error'
                      }
                      text={tenant.status.toUpperCase()}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t('superAdmin.tenants.detail.plan', 'Plan')}
                  >
                    <Tag color={plan?.tier === 'enterprise' ? 'purple' : 'blue'}>
                      {plan?.displayName.en}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t('superAdmin.tenants.detail.owner', 'Owner')}
                  >
                    {tenant.ownerEmail}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t('superAdmin.tenants.detail.created', 'Created')}
                  >
                    {new Date(tenant.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t('superAdmin.tenants.detail.slug', 'Tenant Slug')}
                  >
                    <code>/t/{tenant.slug}</code>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t('superAdmin.tenants.detail.locale', 'Default Locale')}
                  >
                    {tenant.defaultLocale.toUpperCase()}
                  </Descriptions.Item>
                  {tenant.isInTrial && (
                    <Descriptions.Item
                      label={t('superAdmin.tenants.detail.trialEnds', 'Trial Ends')}
                      span={2}
                    >
                      {tenant.trialEndsAt
                        ? new Date(tenant.trialEndsAt).toLocaleDateString()
                        : 'N/A'}
                    </Descriptions.Item>
                  )}
                  {tenant.customDomain && (
                    <Descriptions.Item
                      label={t(
                        'superAdmin.tenants.detail.customDomain',
                        'Custom Domain'
                      )}
                      span={2}
                    >
                      {tenant.customDomain}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            ),
          },
          {
            key: 'activity',
            label: t('superAdmin.tenants.detail.tabs.activity', 'Activity Log'),
            children: (
              <Card>
                <Table
                  columns={activityColumns}
                  dataSource={activityLog}
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'billing',
            label: t('superAdmin.tenants.detail.tabs.billing', 'Billing'),
            children: (
              <Card>
                <p>
                  {t(
                    'superAdmin.tenants.detail.billing.placeholder',
                    'Billing information and invoice history will be displayed here.'
                  )}
                </p>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
