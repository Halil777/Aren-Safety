/**
 * Organization Switcher Component
 *
 * Allows users with multiple tenant memberships to switch between organizations
 * Displays in header for multi-tenant users
 */

import { Dropdown, Badge, Button } from 'antd';
import type { MenuProps } from 'antd';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useCurrentTenant, useUserTenants, useHasMultipleTenants, useTenantStore } from '../stores/tenant-store';

const SwitcherButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)')};
  }
`;

const TenantInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const TenantName = styled.span`
  font-size: 14px;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TenantRole = styled.span`
  font-size: 11px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

const MenuItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const MenuItemName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const MenuItemMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 6px;
    height: 6px;
  }
`;

export function OrgSwitcher() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentTenant = useCurrentTenant();
  const userTenants = useUserTenants();
  const hasMultipleTenants = useHasMultipleTenants();
  const { switchTenant } = useTenantStore();

  if (!hasMultipleTenants || !currentTenant) {
    return null;
  }

  const handleSwitchTenant = (tenantId: string, tenantSlug: string) => {
    if (tenantId === currentTenant.id) return;

    // Confirm switch if there might be unsaved work
    const hasUnsavedWork = false; // TODO: Implement unsaved work detection

    if (hasUnsavedWork) {
      const confirmed = window.confirm(
        t(
          'orgSwitcher.confirmSwitch',
          'You have unsaved changes. Switching organizations will discard them. Continue?'
        )
      );
      if (!confirmed) return;
    }

    // Switch tenant
    switchTenant(tenantId);

    // Navigate to new tenant's dashboard
    navigate(`/t/${tenantSlug}`);

    // Reload to ensure fresh data
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const formatRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      tenant_owner: t('roles.tenantOwner', 'Owner'),
      tenant_admin: t('roles.tenantAdmin', 'Admin'),
      head_of_safety: t('roles.headOfSafety', 'Head of Safety'),
      inspector: t('roles.inspector', 'Inspector'),
      department_supervisor: t('roles.supervisor', 'Supervisor'),
      manager: t('roles.manager', 'Manager'),
      viewer: t('roles.viewer', 'Viewer'),
    };
    return roleMap[role] || role;
  };

  const menuItems: MenuProps['items'] = userTenants.map((membership) => {
    const isActive = membership.tenantId === currentTenant.id;
    const isActiveStatus = membership.isActive;

    return {
      key: membership.tenantId,
      label: (
        <MenuItemContent>
          <MenuItemInfo>
            <MenuItemName>{membership.tenantName}</MenuItemName>
            <MenuItemMeta>
              {formatRole(membership.role)}
              {membership.department && ` • ${membership.department}`}
            </MenuItemMeta>
          </MenuItemInfo>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isActiveStatus && (
              <StatusBadge
                status="default"
                text={t('orgSwitcher.inactive', 'Inactive')}
              />
            )}
            {isActive && <Check size={16} color="var(--primary-color)" />}
          </div>
        </MenuItemContent>
      ),
      onClick: () => handleSwitchTenant(membership.tenantId, membership.tenantSlug),
      disabled: !isActiveStatus,
    };
  });

  const currentMembership = userTenants.find(
    (t) => t.tenantId === currentTenant.id
  );

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomLeft"
    >
      <SwitcherButton type="text">
        <Building2 size={18} />
        <TenantInfo>
          <TenantName>{currentTenant.name}</TenantName>
          {currentMembership && (
            <TenantRole>{formatRole(currentMembership.role)}</TenantRole>
          )}
        </TenantInfo>
        <ChevronDown size={16} />
      </SwitcherButton>
    </Dropdown>
  );
}

/**
 * Compact version for mobile/small screens
 */
export function OrgSwitcherCompact() {
  const currentTenant = useCurrentTenant();
  const hasMultipleTenants = useHasMultipleTenants();

  if (!hasMultipleTenants || !currentTenant) {
    return null;
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'current',
            label: currentTenant.name,
            disabled: true,
          },
        ],
      }}
      trigger={['click']}
    >
      <Button type="text" icon={<Building2 size={18} />} />
    </Dropdown>
  );
}
