import React, { useState, useMemo } from 'react';
import { Card, Button, Space, Statistic, Row, Col, message, Spin } from 'antd';
import { UserPlus, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { ExportButtons } from '@/shared/components/ExportButtons';
import { exportToExcel, exportToPDF, printTable, prepareDataForExport } from '@/shared/utils/exportUtils';
import { UsersTable } from './components/UsersTable';
import { UserModal } from './components/UserModal';
import { useAdminUsers, useCreateAdminUser, useUpdateAdminUser, useDeleteAdminUser } from './api';
import type { AdminUser } from './types';
import type { ExportType } from '@/shared/components/ExportButtons';

const AdminPage: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // TanStack Query hooks
  const { data: users = [], isLoading, isError } = useAdminUsers();
  const createUserMutation = useCreateAdminUser();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();

  // Calculate statistics
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => ['tenant_owner', 'tenant_admin'].includes(u.role)).length,
    inactive: users.filter(u => !u.isActive).length,
  }), [users]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleSaveUser = async (user: AdminUser) => {
    try {
      if (selectedUser) {
        // Update existing user
        await updateUserMutation.mutateAsync({
          id: user.id,
          userData: user,
        });
        message.success('User updated successfully');
      } else {
        // Create new user
        await createUserMutation.mutateAsync(user);
        message.success('User created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error(selectedUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        userData: { isActive: !user.isActive },
      });
      message.success('User status updated');
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const handleExport = (type: ExportType) => {
    const exportData = prepareDataForExport(users.map(u => ({
      'First Name': u.firstName,
      'Last Name': u.lastName,
      'Email': u.email,
      'Role': u.role,
      'Department': u.department || '-',
      'Position': u.position || '-',
      'Status': u.isActive ? 'Active' : 'Inactive',
      'Last Login': u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never',
      'Created': new Date(u.createdAt).toLocaleString(),
    })), []);

    switch (type) {
      case 'excel':
        exportToExcel(exportData, 'users', 'Users');
        break;
      case 'pdf':
        exportToPDF('users-table', 'users');
        break;
      case 'print':
        printTable('users-table');
        break;
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ color: '#ff4d4f', textAlign: 'center' }}>
          Failed to load users. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
            User Management
          </h1>
          <p style={{ color: isDarkMode ? '#a0a0a0' : '#666', marginBottom: 0 }}>
            Manage users, roles, and permissions for your organization
          </p>
        </div>
        <Space>
          <ExportButtons onExport={handleExport} />
          <Button
            type="primary"
            icon={<UserPlus size={20} />}
            size="large"
            onClick={handleCreateUser}
            style={{ height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Add User
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.total}
              prefix={<Users size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.active}
              prefix={<UserCheck size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Admins"
              value={stats.admins}
              prefix={<Shield size={20} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive Users"
              value={stats.inactive}
              prefix={<UserX size={20} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <div id="users-table">
        <UsersTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* User Modal */}
      <UserModal
        visible={isModalVisible}
        user={selectedUser}
        onSave={handleSaveUser}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default AdminPage;
