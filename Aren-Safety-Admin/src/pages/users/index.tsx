import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Space, Tag, Drawer, Descriptions, Tooltip, Popconfirm, message, Row, Col, Statistic, Typography, Input } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useUsers, useUserStats, useDeleteUser, type User } from '@/features/users/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/app/providers/theme-provider';
import styled from 'styled-components';
import { CreateUserDrawer, EditUserDrawer } from './components';

const { Text, Title } = Typography;
const { Search } = Input;

// Styled Components
const PageContainer = styled.div<{ $isDark: boolean }>`
  padding: 32px;
  min-height: calc(100vh - 72px);
  background: ${({ $isDark }) => ($isDark ? '#0a0f1e' : '#fafbfc')};
  transition: all 0.3s ease;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const PageTitle = styled(Title)<{ $isDark: boolean }>`
  font-size: 28px !important;
  font-weight: 700 !important;
  margin: 0 !important;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, #a5b4fc 0%, #67e8f9 100%)'
      : 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const StatsCard = styled(Card)<{ $isDark: boolean }>`
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(15, 23, 42, 0.04)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(15, 23, 42, 0.08)'};
  }
`;

const ChartCard = styled(Card)<{ $isDark: boolean }>`
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(15, 23, 42, 0.04)')};
  margin-bottom: 24px;
`;

const COLORS = ['#4f46e5', '#0891b2', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

const UsersPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);

  // Fetch data
  const { data: users = [], isLoading } = useUsers({ search: searchText });
  const { data: stats } = useUserStats();
  const deleteUserMutation = useDeleteUser();

  // Handle delete
  const handleDelete = (user: User) => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        message.success('User deleted successfully');
      },
      onError: (err) => {
        message.error('Failed to delete user: ' + (err instanceof Error ? err.message : 'Unknown error'));
      },
    });
  };

  // Prepare chart data
  const roleChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.roleDistribution).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: count,
    }));
  }, [stats]);

  const departmentChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.departmentDistribution).map(([dept, count]) => ({
      name: dept,
      count: count,
    }));
  }, [stats]);

  // Table columns
  const columns = [
    {
      title: 'User',
      key: 'user',
      fixed: 'left' as const,
      width: 250,
      render: (_: any, record: User) => (
        <Space>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {record.firstName[0]}{record.lastName[0]}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.firstName} {record.lastName}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>@{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => {
        const colors: Record<string, string> = {
          admin: 'red',
          manager: 'orange',
          user: 'blue',
          viewer: 'default',
        };
        return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (dept?: string) => dept ? <Tag color="purple">{dept}</Tag> : '-',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 150,
      render: (date?: string) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: User) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedUser(record);
                setIsViewDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedUser(record);
                setIsEditDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete user"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deleteUserMutation.isPending}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer $isDark={isDark}>
      <PageHeader>
        <PageTitle level={1} $isDark={isDark}>
          User Management
        </PageTitle>
        <Space>
          <Search
            placeholder="Search users..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsCreateDrawerVisible(true)}
          >
            Add User
          </Button>
        </Space>
      </PageHeader>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#4f46e5' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Active Users"
              value={stats?.activeUsers || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Inactive Users"
              value={stats?.inactiveUsers || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ef4444' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard $isDark={isDark}>
            <Statistic
              title="Recently Active"
              value={stats?.recentlyActive || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#0891b2' }}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ChartCard $isDark={isDark} title={<Text strong>Role Distribution</Text>}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard $isDark={isDark} title={<Text strong>Department Distribution</Text>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
      </Row>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      {/* Create User Drawer */}
      <CreateUserDrawer
        open={isCreateDrawerVisible}
        onCancel={() => setIsCreateDrawerVisible(false)}
        onSuccess={() => {
          // Drawer closes automatically on success
        }}
      />

      {/* Edit User Drawer */}
      <EditUserDrawer
        open={isEditDrawerVisible}
        user={selectedUser}
        onCancel={() => setIsEditDrawerVisible(false)}
        onSuccess={() => {
          // Drawer closes automatically on success
        }}
      />

      {/* User Details Drawer */}
      <Drawer
        title={
          <Space>
            <EyeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <span style={{ fontSize: '18px', fontWeight: 600 }}>User Details</span>
          </Space>
        }
        placement="right"
        width="70%"
        onClose={() => setIsViewDrawerVisible(false)}
        open={isViewDrawerVisible}
        styles={{
          body: { paddingBottom: 80, background: '#f5f5f5' }
        }}
      >
        {selectedUser && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header Card */}
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '32px',
                    margin: '0 auto',
                  }}
                >
                  {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  @{selectedUser.username}
                </Tag>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ID: {selectedUser.id}
                </Text>
              </Space>
            </Card>

            {/* Basic Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Basic Information</Text>} bordered={false}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label={<Text strong>Email</Text>}>
                  <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Phone</Text>}>
                  {selectedUser.phone ? <a href={`tel:${selectedUser.phone}`}>{selectedUser.phone}</a> : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Role</Text>}>
                  <Tag color="blue">{selectedUser.role.toUpperCase()}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Status</Text>}>
                  <Tag color={selectedUser.isActive ? 'success' : 'error'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Department</Text>}>
                  {selectedUser.department ? <Tag color="purple">{selectedUser.department}</Tag> : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Position</Text>}>
                  {selectedUser.position || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Last Login</Text>}>
                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Created At</Text>}>
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UsersPage;
