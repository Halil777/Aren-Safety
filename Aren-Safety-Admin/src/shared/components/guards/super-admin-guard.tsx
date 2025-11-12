/**
 * Super Admin Route Guard
 *
 * Protects Super Admin routes from non-super-admin users
 * Redirects to unauthorized page if user is not a super admin
 */

import { Navigate, Outlet } from 'react-router';
import { useIsSuperAdmin, useIsAuthenticated } from '../../stores/auth-store';
import { Result, Button } from 'antd';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const UnauthorizedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors[theme.mode].background};
  padding: 24px;
`;

function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <UnauthorizedContainer>
      <Result
        status="403"
        icon={<ShieldAlert size={64} color="#ef4444" />}
        title={t('errors.unauthorized.title', 'Unauthorized Access')}
        subTitle={t(
          'errors.unauthorized.description',
          'You do not have permission to access the Super Admin Console. This area is restricted to platform administrators only.'
        )}
        extra={
          <Button type="primary" href="/">
            {t('errors.unauthorized.goHome', 'Go to Dashboard')}
          </Button>
        }
      />
    </UnauthorizedContainer>
  );
}

export function SuperAdminGuard() {
  const isAuthenticated = useIsAuthenticated();
  const isSuperAdmin = useIsSuperAdmin();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but not super admin - show unauthorized
  if (!isSuperAdmin) {
    return <UnauthorizedPage />;
  }

  // Super admin - allow access
  return <Outlet />;
}
