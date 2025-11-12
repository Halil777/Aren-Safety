import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs } from 'antd';
import { Settings as SettingsIcon, Palette, User, Lock, Bell } from 'lucide-react';
import { useTheme } from '@/app/providers/theme-provider';
import { BrandingSettings } from './components/BrandingSettings';
import { GeneralSettings } from './components/GeneralSettings';
import { ProfileSettings } from './components/ProfileSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { NotificationSettings } from './components/NotificationSettings';

const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();

  const tabItems = [
    {
      key: 'general',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={16} />
          General
        </span>
      ),
      children: <GeneralSettings />,
    },
    {
      key: 'branding',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={16} />
          Branding
        </span>
      ),
      children: <BrandingSettings />,
    },
    {
      key: 'profile',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} />
          Profile
        </span>
      ),
      children: <ProfileSettings />,
    },
    {
      key: 'security',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} />
          Security
        </span>
      ),
      children: <SecuritySettings />,
    },
    {
      key: 'notifications',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} />
          Notifications
        </span>
      ),
      children: <NotificationSettings />,
    },
  ];

  const tabKeys = tabItems.map((tab) => tab.key as string);
  const requestedTab = searchParams.get('tab') ?? 'general';
  const activeTab = tabKeys.includes(requestedTab) ? requestedTab : 'general';

  const handleTabChange = (key: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', key);
      return params;
    }, { replace: true });
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: isDarkMode ? '#a0a0a0' : '#666', marginBottom: 0 }}>
          Manage your organization settings, branding, and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        size="large"
        style={{
          background: isDarkMode ? '#1f1f1f' : '#fff',
          padding: '16px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default SettingsPage;
