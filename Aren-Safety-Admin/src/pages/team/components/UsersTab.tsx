import React, { useState, useMemo, useCallback } from 'react';
import { Card, Drawer, Space, Table, Tag, Alert, Spin, Button, Popconfirm, App, Tooltip, Descriptions, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUsers, useDeleteUser, type User } from '@/features/users/api';
import { useTheme } from '@/app/providers/theme-provider';

const { Text } = Typography;

const UsersTabComponent: React.FC = () => {
  const { message } = App.useApp();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Fetch users data
  const { data: users = [], isLoading, isError, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  // User details drawer
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Callbacks
  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDrawerVisible(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        message.success('User deleted successfully');
      },
      onError: (err) => {
        message.error('Failed to delete user: ' + (err instanceof Error ? err.message : 'Unknown error'));
      },
    });
  }, [deleteUserMutation, message]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerVisible(false);
    setSelectedUser(null);
  }, []);

  // Table columns
  const columns = useMemo(() => [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
    },
    {
      title: 'Full Name',
      key: 'fullName',
      width: 200,
      render: (_: any, record: User) => `${record.firstName} ${record.lastName}`,
      sorter: (a: User, b: User) => {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email: string) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone?: string) => phone ? <a href={`tel:${phone}`}>{phone}</a> : '-',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (dept?: string) => dept ? <Tag color="blue">{dept}</Tag> : '-',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 150,
      render: (position?: string) => position || '-',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: any, record: User) => record.isActive === value,
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
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete user"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record)}
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
  ], [handleViewUser, handleDeleteUser, deleteUserMutation.isPending]);

  // Show error state
  if (isError) {
    return (
      <Card>
        <Alert
          message="Error Loading Users"
          description={error instanceof Error ? error.message : 'Failed to load users'}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <>
      {/* Users Table */}
      <Card>
        <Spin spinning={isLoading} tip="Loading users...">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
          />
        </Spin>
      </Card>

      {/* User Details Drawer */}
      <Drawer
        title={
          <Space>
            <EyeOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <span style={{ fontSize: '18px', fontWeight: 600 }}>User Details</span>
          </Space>
        }
        placement="right"
        width={600}
        onClose={handleCloseDrawer}
        open={isDrawerVisible}
        styles={{
          body: { paddingBottom: 80, background: isDarkMode ? '#141414' : '#f5f5f5' }
        }}
      >
        {selectedUser && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header Card */}
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  @{selectedUser.username}
                </Tag>
                <Tag color={selectedUser.isActive ? 'success' : 'error'}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </Space>
            </Card>

            {/* Basic Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Contact Information</Text>} bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={<Text strong>Email</Text>}>
                  <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Phone</Text>}>
                  {selectedUser.phone ? (
                    <a href={`tel:${selectedUser.phone}`}>{selectedUser.phone}</a>
                  ) : '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Work Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Work Information</Text>} bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={<Text strong>Department</Text>}>
                  {selectedUser.department ? (
                    <Tag color="blue">{selectedUser.department}</Tag>
                  ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Position</Text>}>
                  {selectedUser.position || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Account Information */}
            <Card title={<Text strong style={{ fontSize: '16px' }}>Account Information</Text>} bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={<Text strong>User ID</Text>}>
                  <Text copyable={{ text: selectedUser.id }}>{selectedUser.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Created At</Text>}>
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Last Login</Text>}>
                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        )}
      </Drawer>
    </>
  );
};

UsersTabComponent.displayName = 'UsersTab';

export const UsersTab = React.memo(UsersTabComponent);
