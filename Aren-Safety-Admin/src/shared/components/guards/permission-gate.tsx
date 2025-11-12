/**
 * Permission Gate Component
 *
 * Conditionally renders children based on user permissions (RBAC)
 * Hides content user doesn't have permission to see
 */

import { type ReactNode } from 'react';
import { Alert, Tooltip } from 'antd';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHasPermission, useHasAnyPermission, useIsReadOnly } from '../../hooks/use-permissions';
import type { Permission } from '../../types/tenant';

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const hasPermission = useHasPermission(permission);

  if (hasPermission) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * Any Permission Gate (user needs at least one of the permissions)
 */
interface AnyPermissionGateProps {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AnyPermissionGate({ permissions, children, fallback }: AnyPermissionGateProps) {
  const hasPermission = useHasAnyPermission(permissions);

  if (hasPermission) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

/**
 * Read-Only Gate (blocks content in read-only mode)
 */
interface ReadOnlyGateProps {
  children: ReactNode;
  showMessage?: boolean;
}

export function ReadOnlyGate({ children, showMessage = false }: ReadOnlyGateProps) {
  const { t } = useTranslation();
  const isReadOnly = useIsReadOnly();

  if (isReadOnly) {
    if (showMessage) {
      return (
        <Alert
          type="info"
          icon={<ShieldAlert size={16} />}
          message={t('permissionGate.readOnly', 'Read-Only Mode')}
          description={t(
            'permissionGate.readOnlyDescription',
            'You are in read-only mode and cannot make changes.'
          )}
        />
      );
    }
    return null;
  }

  return <>{children}</>;
}

/**
 * Permission Tooltip (shows tooltip on disabled elements)
 */
interface PermissionTooltipProps {
  permission: Permission;
  children: ReactNode;
  message?: string;
}

export function PermissionTooltip({ permission, children, message }: PermissionTooltipProps) {
  const { t } = useTranslation();
  const hasPermission = useHasPermission(permission);

  if (hasPermission) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={message || t('permissionGate.noPermission', 'You do not have permission to perform this action')}
    >
      <span style={{ cursor: 'not-allowed', opacity: 0.5 }}>{children}</span>
    </Tooltip>
  );
}
