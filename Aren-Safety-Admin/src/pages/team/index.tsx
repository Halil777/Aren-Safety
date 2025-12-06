import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/theme-provider';
import { ExportButtons } from '@/shared/components/ExportButtons';
import { exportToExcel, exportToPDF, printTable, prepareDataForExport } from '@/shared/utils/exportUtils';
import { UsersTab, CreateUserModal } from './components';
import { UserRoleDrawer } from './components/UserRoleDrawer';
import { useUsers } from '@/features/users/api';
import type { ExportType } from '@/shared/components/ExportButtons';

const TeamPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUserRoleDrawerOpen, setIsUserRoleDrawerOpen] = useState(false);

  // Fetch users data for export
  const { data: users = [], isLoading } = useUsers();

  const handleExport = (type: ExportType) => {
    const exportData = prepareDataForExport(users.map(user => ({
      'Username': user.username,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Phone': user.phone || '-',
      'Department': user.department || '-',
      'Position': user.position || '-',
      'Status': user.isActive ? 'Active' : 'Inactive',
      'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
    })), []);

    switch (type) {
      case 'excel':
        exportToExcel(exportData, 'users', 'Team Users');
        break;
      case 'pdf':
        exportToPDF('users-table', 'users');
        break;
      case 'print':
        printTable('users-table');
        break;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
            {t('team.title')}
          </h1>
          <p style={{ color: isDarkMode ? '#a0a0a0' : '#666', marginBottom: 0 }}>
            {t('team.subtitle')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            icon={<TeamOutlined />}
            onClick={() => setIsUserRoleDrawerOpen(true)}
            size="large"
          >
            {t('team.userRolesButton')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
            size="large"
          >
            {t('team.createUser')}
          </Button>
          <ExportButtons onExport={handleExport} disabled={isLoading} />
        </div>
      </div>

      {/* Users Table */}
      <div id="users-table">
        <UsersTab />
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Modal will close automatically
        }}
      />

      {/* User Role Drawer */}
      <UserRoleDrawer
        open={isUserRoleDrawerOpen}
        onClose={() => setIsUserRoleDrawerOpen(false)}
      />
    </div>
  );
};

export default TeamPage;
