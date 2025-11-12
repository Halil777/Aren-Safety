/**
 * Tenants List Page
 *
 * Super Admin page to view and manage all tenants
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Badge,
  Tooltip,
  Modal,
  message,
  Card,
  Statistic,
  Row,
  Col,
  Dropdown,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Power,
  PowerOff,
  Trash2,
  UserCog,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import styled from 'styled-components';
import { MOCK_TENANT_LIST } from '../../../shared/config/mock-tenants';
import type { TenantListItem, TenantStatus } from '../../../shared/types/tenant';
import { useTenantStore } from '../../../shared/stores/tenant-store';
import { useAuthStore } from '../../../shared/stores/auth-store';

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

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatsRow = styled(Row)`
  margin-bottom: 24px;
`;

const StatsCard = styled(Card)`
  .ant-card-body {
    padding: 16px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 8px;
    height: 8px;
  }
`;

export default function TenantsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const { startImpersonation } = useTenantStore();
  const user = useAuthStore((state) => state.user);

  // Filter tenants
  const filteredTenants = MOCK_TENANT_LIST.filter((tenant) => {
    const matchesSearch =
      !searchQuery ||
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;

    const matchesPlan =
      planFilter === 'all' || tenant.planTier === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Statistics
  const stats = {
    total: MOCK_TENANT_LIST.length,
    active: MOCK_TENANT_LIST.filter((t) => t.status === 'active').length,
    trial: MOCK_TENANT_LIST.filter((t) => t.isInTrial).length,
    pastDue: MOCK_TENANT_LIST.filter((t) => t.isPastDue).length,
  };

  // Handle impersonation
  const handleImpersonate = (tenant: TenantListItem) => {
    Modal.confirm({
      title: t('superAdmin.tenants.impersonate.title', 'Impersonate Tenant'),
      content: t(
        'superAdmin.tenants.impersonate.confirm',
        `Are you sure you want to impersonate "${tenant.name}"? You will enter read-only mode.`
      ),
      onOk: () => {
        // In real app, fetch full tenant data
        const fullTenant = {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          status: tenant.status,
          ownerId: 'owner_id',
          ownerEmail: tenant.ownerEmail,
          planId: tenant.planTier,
          subscriptionStatus: tenant.subscriptionStatus,
          isInTrial: tenant.isInTrial,
          trialEndsAt: tenant.trialEndsAt,
          paymentMethodOnFile: tenant.paymentMethodOnFile,
          defaultLocale: 'en' as const,
          defaultTheme: 'light' as const,
          createdAt: tenant.createdAt,
          updatedAt: new Date().toISOString(),
        };

        startImpersonation(
          fullTenant,
          user?.id || 'admin_1',
          user?.email || 'admin@platform.com',
          true // read-only
        );

        message.success(
          t('superAdmin.tenants.impersonate.success', `Now impersonating ${tenant.name}`)
        );

        // Navigate to tenant dashboard
        navigate(`/t/${tenant.slug}`);
      },
    });
  };

  // Handle suspend
  const handleSuspend = (tenant: TenantListItem) => {
    Modal.confirm({
      title: t('superAdmin.tenants.suspend.title', 'Suspend Tenant'),
      content: t(
        'superAdmin.tenants.suspend.confirm',
        `Are you sure you want to suspend "${tenant.name}"? Users will lose access immediately.`
      ),
      okText: t('superAdmin.tenants.suspend.confirm', 'Suspend'),
      okButtonProps: { danger: true },
      onOk: () => {
        // TODO: API call to suspend tenant
        message.success(
          t('superAdmin.tenants.suspend.success', `${tenant.name} has been suspended`)
        );
      },
    });
  };

  // Handle reactivate
  const handleReactivate = (tenant: TenantListItem) => {
    // TODO: API call to reactivate tenant
    message.success(
      t('superAdmin.tenants.reactivate.success', `${tenant.name} has been reactivated`)
    );
  };

  // Handle delete
  const handleDelete = (tenant: TenantListItem) => {
    Modal.confirm({
      title: t('superAdmin.tenants.delete.title', 'Delete Tenant'),
      content: t(
        'superAdmin.tenants.delete.confirm',
        `Are you sure you want to PERMANENTLY DELETE "${tenant.name}"? This action cannot be undone and all data will be lost.`
      ),
      okText: t('superAdmin.tenants.delete.confirm', 'Delete'),
      okButtonProps: { danger: true },
      onOk: () => {
        // TODO: API call to delete tenant
        message.success(
          t('superAdmin.tenants.delete.success', `${tenant.name} has been deleted`)
        );
      },
    });
  };

  // Actions menu
  const getActionsMenu = (tenant: TenantListItem): MenuProps['items'] => [
    {
      key: 'view',
      icon: <Eye size={16} />,
      label: t('superAdmin.tenants.actions.view', 'View Details'),
      onClick: () => navigate(`/super-admin/tenants/${tenant.id}`),
    },
    {
      key: 'edit',
      icon: <Edit size={16} />,
      label: t('superAdmin.tenants.actions.edit', 'Edit'),
      onClick: () => navigate(`/super-admin/tenants/${tenant.id}/edit`),
    },
    {
      key: 'impersonate',
      icon: <UserCog size={16} />,
      label: t('superAdmin.tenants.actions.impersonate', 'Impersonate'),
      onClick: () => handleImpersonate(tenant),
    },
    { type: 'divider' },
    tenant.status === 'suspended'
      ? {
          key: 'reactivate',
          icon: <Power size={16} />,
          label: t('superAdmin.tenants.actions.reactivate', 'Reactivate'),
          onClick: () => handleReactivate(tenant),
        }
      : {
          key: 'suspend',
          icon: <PowerOff size={16} />,
          label: t('superAdmin.tenants.actions.suspend', 'Suspend'),
          danger: true,
          onClick: () => handleSuspend(tenant),
        },
    {
      key: 'delete',
      icon: <Trash2 size={16} />,
      label: t('superAdmin.tenants.actions.delete', 'Delete'),
      danger: true,
      onClick: () => handleDelete(tenant),
    },
  ];

  // Table columns
  const columns: ColumnsType<TenantListItem> = [
    {
      title: t('superAdmin.tenants.table.name', 'Tenant Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: TenantListItem) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {record.ownerEmail}
          </div>
        </div>
      ),
    },
    {
      title: t('superAdmin.tenants.table.plan', 'Plan'),
      dataIndex: 'planTier',
      key: 'plan',
      filters: [
        { text: 'Free', value: 'free' },
        { text: 'Pro', value: 'pro' },
        { text: 'Enterprise', value: 'enterprise' },
      ],
      onFilter: (value, record) => record.planTier === value,
      render: (planTier: string) => {
        const colors = {
          free: 'default',
          pro: 'blue',
          enterprise: 'purple',
        };
        return (
          <Tag color={colors[planTier as keyof typeof colors]}>
            {planTier.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: t('superAdmin.tenants.table.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Trial', value: 'trial' },
        { text: 'Past Due', value: 'past_due' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: TenantStatus, record: TenantListItem) => {
        const statusConfig = {
          active: { color: 'success', text: 'Active' },
          trial: { color: 'warning', text: 'Trial' },
          past_due: { color: 'error', text: 'Past Due' },
          suspended: { color: 'default', text: 'Suspended' },
          canceled: { color: 'default', text: 'Canceled' },
        };

        const config = statusConfig[status];

        return (
          <Space direction="vertical" size={0}>
            <StatusBadge status={config.color as any} text={config.text} />
            {record.isInTrial && record.trialEndsAt && (
              <span style={{ fontSize: 11, opacity: 0.7 }}>
                Trial ends {new Date(record.trialEndsAt).toLocaleDateString()}
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: t('superAdmin.tenants.table.users', 'Users'),
      dataIndex: 'userCount',
      key: 'users',
      sorter: (a, b) => a.userCount - b.userCount,
      align: 'center',
    },
    {
      title: t('superAdmin.tenants.table.payment', 'Payment'),
      dataIndex: 'paymentMethodOnFile',
      key: 'payment',
      render: (hasPayment: boolean, record: TenantListItem) => (
        <Space>
          {hasPayment ? (
            <Tag color="success">✓ On file</Tag>
          ) : (
            <Tag color="warning">No method</Tag>
          )}
          {record.isPastDue && (
            <Tooltip title="Payment past due">
              <AlertCircle size={16} color="#ef4444" />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: t('superAdmin.tenants.table.created', 'Created'),
      dataIndex: 'createdAt',
      key: 'created',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('superAdmin.tenants.table.actions', 'Actions'),
      key: 'actions',
      align: 'center',
      width: 80,
      render: (_, record: TenantListItem) => (
        <Dropdown menu={{ items: getActionsMenu(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreVertical size={16} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>{t('superAdmin.tenants.title', 'Tenants')}</PageTitle>
        <PageDescription>
          {t(
            'superAdmin.tenants.description',
            'Manage all customer tenants, plans, and access'
          )}
        </PageDescription>

        <HeaderActions>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/super-admin/tenants/new')}
          >
            {t('superAdmin.tenants.createNew', 'Create New Tenant')}
          </Button>
        </HeaderActions>
      </PageHeader>

      {/* Statistics */}
      <StatsRow gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.stats.total', 'Total Tenants')}
              value={stats.total}
              prefix={<TrendingUp size={20} />}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.stats.active', 'Active')}
              value={stats.active}
              valueStyle={{ color: '#10b981' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.stats.trial', 'In Trial')}
              value={stats.trial}
              valueStyle={{ color: '#f59e0b' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard>
            <Statistic
              title={t('superAdmin.tenants.stats.pastDue', 'Past Due')}
              value={stats.pastDue}
              valueStyle={{ color: '#ef4444' }}
            />
          </StatsCard>
        </Col>
      </StatsRow>

      {/* Filters */}
      <FilterBar>
        <Input
          placeholder={t('superAdmin.tenants.search', 'Search by name or email...')}
          prefix={<Search size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">
            {t('superAdmin.tenants.filter.allStatuses', 'All Statuses')}
          </Select.Option>
          <Select.Option value="active">
            {t('superAdmin.tenants.filter.active', 'Active')}
          </Select.Option>
          <Select.Option value="trial">
            {t('superAdmin.tenants.filter.trial', 'Trial')}
          </Select.Option>
          <Select.Option value="past_due">
            {t('superAdmin.tenants.filter.pastDue', 'Past Due')}
          </Select.Option>
          <Select.Option value="suspended">
            {t('superAdmin.tenants.filter.suspended', 'Suspended')}
          </Select.Option>
        </Select>

        <Select value={planFilter} onChange={setPlanFilter} style={{ width: 150 }}>
          <Select.Option value="all">
            {t('superAdmin.tenants.filter.allPlans', 'All Plans')}
          </Select.Option>
          <Select.Option value="free">Free</Select.Option>
          <Select.Option value="pro">Pro</Select.Option>
          <Select.Option value="enterprise">Enterprise</Select.Option>
        </Select>
      </FilterBar>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredTenants}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) =>
            t('superAdmin.tenants.total', {
              defaultValue: 'Total {{total}} tenants',
              total,
            }),
        }}
      />
    </div>
  );
}
