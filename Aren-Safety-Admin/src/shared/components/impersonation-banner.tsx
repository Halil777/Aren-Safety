/**
 * Impersonation Banner Component
 *
 * Displays when a Super Admin is impersonating a tenant
 * Shows clear warning and provides exit control
 */

import { Alert, Button } from 'antd';
import { LogOut, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useImpersonation, useTenantStore } from '../stores/tenant-store';

const BannerWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const StyledAlert = styled(Alert)`
  border-radius: 0 !important;
  border-left: none;
  border-right: none;
  border-top: none;

  .ant-alert-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }

  .ant-alert-message {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
`;

const ImpersonationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const TenantName = styled.strong`
  font-size: 14px;
`;

const ImpersonatorInfo = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

const ReadOnlyBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export function ImpersonationBanner() {
  const { t } = useTranslation();
  const impersonation = useImpersonation();
  const { exitImpersonation } = useTenantStore();

  if (!impersonation.isImpersonating) {
    return null;
  }

  const handleExit = () => {
    if (window.confirm(t('impersonation.confirmExit', 'Are you sure you want to exit impersonation mode?'))) {
      exitImpersonation();
      // Redirect to Super Admin Console
      window.location.href = '/super-admin/tenants';
    }
  };

  return (
    <BannerWrapper>
      <StyledAlert
        type="warning"
        banner
        message={
          <ImpersonationInfo>
            <Shield size={18} />
            <div style={{ flex: 1 }}>
              <div>
                <span>{t('impersonation.viewing', 'Impersonating tenant:')}</span>{' '}
                <TenantName>{impersonation.impersonatedTenantName}</TenantName>
              </div>
              <ImpersonatorInfo>
                {t('impersonation.as', 'As:')}{' '}
                {impersonation.impersonatorEmail}
                {impersonation.isReadOnly && (
                  <>
                    {' • '}
                    <ReadOnlyBadge>
                      {t('impersonation.readOnly', 'Read-Only')}
                    </ReadOnlyBadge>
                  </>
                )}
              </ImpersonatorInfo>
            </div>
            <Button
              type="primary"
              danger
              size="small"
              icon={<LogOut size={14} />}
              onClick={handleExit}
            >
              {t('impersonation.exit', 'Exit Impersonation')}
            </Button>
          </ImpersonationInfo>
        }
      />
    </BannerWrapper>
  );
}
