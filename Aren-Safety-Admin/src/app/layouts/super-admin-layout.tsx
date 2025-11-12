/**
 * Super Admin Console Layout
 *
 * Dedicated layout for platform administration
 * Separate from tenant admin panels
 */

import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Package,
  Settings,
  BarChart3,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { useTheme } from '@/app/providers/theme-provider';

const { Sider, Content } = Layout;

const StyledLayout = styled(Layout)<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${({ $isDark }) => ($isDark ? '#0a0f1e' : '#fafbfc')};
`;

const StyledSider = styled(Sider)<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')} !important;
  border-right: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  box-shadow: ${({ $isDark }) => ($isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(15, 23, 42, 0.04)')};

  .ant-layout-sider-trigger {
    background: ${({ $isDark }) => ($isDark ? '#0f172a' : '#f8fafc')} !important;
    border-top: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  }
`;

const LogoSection = styled.div<{ $isDark: boolean }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  margin-bottom: 16px;
`;

const LogoText = styled.h1`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PlatformBadge = styled.div<{ $isDark: boolean }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : '#64748b')};
  margin-top: 2px;
  text-align: center;
  font-weight: 600;
`;

const StyledContent = styled(Content)<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#0a0f1e' : '#fafbfc')};
  min-height: calc(100vh - 64px);
  overflow-y: auto;
`;

const ContentInner = styled.div`
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
`;

export function SuperAdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [collapsed, setCollapsed] = useState(false);

  // Determine active menu key from current route
  const getActiveKey = () => {
    const path = location.pathname;
    if (path.includes('/tenants')) return 'tenants';
    if (path.includes('/plans')) return 'plans';
    if (path.includes('/billing')) return 'billing';
    if (path.includes('/users')) return 'users';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={18} />,
      label: t('superAdmin.nav.dashboard', 'Dashboard'),
      onClick: () => navigate('/super-admin'),
    },
    {
      type: 'divider',
    },
    {
      key: 'tenants',
      icon: <Building2 size={18} />,
      label: t('superAdmin.nav.tenants', 'Tenants'),
      onClick: () => navigate('/super-admin/tenants'),
    },
    {
      key: 'plans',
      icon: <Package size={18} />,
      label: t('superAdmin.nav.plans', 'Plans & Pricing'),
      onClick: () => navigate('/super-admin/plans'),
    },
    {
      key: 'billing',
      icon: <CreditCard size={18} />,
      label: t('superAdmin.nav.billing', 'Billing'),
      onClick: () => navigate('/super-admin/billing'),
    },
    {
      type: 'divider',
    },
    {
      key: 'users',
      icon: <Users size={18} />,
      label: t('superAdmin.nav.users', 'Platform Users'),
      onClick: () => navigate('/super-admin/users'),
    },
    {
      key: 'analytics',
      icon: <BarChart3 size={18} />,
      label: t('superAdmin.nav.analytics', 'Analytics'),
      onClick: () => navigate('/super-admin/analytics'),
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <Settings size={18} />,
      label: t('superAdmin.nav.settings', 'Settings'),
      onClick: () => navigate('/super-admin/settings'),
    },
  ];

  return (
    <StyledLayout $isDark={isDark}>
      <StyledSider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        $isDark={isDark}
      >
        <LogoSection $isDark={isDark}>
          <div>
            <LogoText>
              {collapsed ? 'SA' : t('superAdmin.title', 'Super Admin')}
            </LogoText>
            {!collapsed && (
              <PlatformBadge $isDark={isDark}>
                {t('superAdmin.platform', 'Platform Control')}
              </PlatformBadge>
            )}
          </div>
        </LogoSection>

        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          theme={isDark ? 'dark' : 'light'}
          style={{ border: 'none' }}
        />
      </StyledSider>

      <Layout>
        <StyledContent $isDark={isDark}>
          <ContentInner>
            <Outlet />
          </ContentInner>
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
}
