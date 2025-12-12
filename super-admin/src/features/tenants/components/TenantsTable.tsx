import { CreditCard, Edit, ShieldOff, Trash2, Wallet } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui/Badge'
import { type Tenant } from '../types/tenant'

type TenantsTableProps = {
  tenants?: Tenant[]
  isLoading?: boolean
  statusUpdatingId?: string | null
  onEdit: (tenant: Tenant) => void
  onDelete: (tenant: Tenant) => void
  onToggleStatus: (tenant: Tenant) => void
  onBillingOpen: (tenant: Tenant) => void
}

const statusColor: Record<
  Tenant['status'],
  'success' | 'secondary' | 'destructive' | 'default'
> = {
  active: 'success',
  trial: 'secondary',
  suspended: 'destructive',
  disabled: 'destructive',
}

export function TenantsTable({
  tenants,
  isLoading,
  statusUpdatingId,
  onEdit,
  onDelete,
  onToggleStatus,
  onBillingOpen,
}: TenantsTableProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return <StateBlock>{t('common.loading')}</StateBlock>
  }

  if (!tenants || tenants.length === 0) {
    return <StateBlock dashed>{t('tenant.table.empty')}</StateBlock>
  }

  return (
    <TableCard>
      <ScrollArea>
        <StyledTable>
          <thead>
            <tr>
              <HeaderCell>{t('tenant.table.fullname')}</HeaderCell>
              <HeaderCell>{t('tenant.table.email')}</HeaderCell>
              <HeaderCell>{t('tenant.table.status')}</HeaderCell>
              <HeaderCell>{t('tenant.table.actions')}</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <Row key={tenant.id}>
                <Cell>
                  <Name>{tenant.fullname}</Name>
                  <Subtle>Plan: {tenant.plan}</Subtle>
                </Cell>
                <Cell>
                  <Subtle>{tenant.email}</Subtle>
                </Cell>
                <Cell>
                  <Badge variant={statusColor[tenant.status]}>
                    {tenant.status.toUpperCase()}
                  </Badge>
                  {statusUpdatingId === tenant.id ? (
                    <Spinner aria-label="Updating status" />
                  ) : null}
                </Cell>
                <Cell>
                  <Actions>
                    <IconButton
                      type="button"
                      aria-label="Billing"
                      onClick={() => onBillingOpen(tenant)}
                    >
                      {tenant.billingStatus === 'paid' ? (
                        <CreditCard size={18} />
                      ) : (
                        <Wallet size={18} />
                      )}
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label={t('tenant.table.edit')}
                      onClick={() => onEdit(tenant)}
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label={t('tenant.table.delete')}
                      onClick={() => onDelete(tenant)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label={t('tenant.table.toggle')}
                      onClick={() => onToggleStatus(tenant)}
                      disabled={statusUpdatingId === tenant.id}
                    >
                      <ShieldOff size={18} />
                    </IconButton>
                  </Actions>
                </Cell>
              </Row>
            ))}
          </tbody>
        </StyledTable>
      </ScrollArea>
    </TableCard>
  )
}

export default TenantsTable

const TableCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: ${({ theme }) => theme.spacing.sm};
`

const ScrollArea = styled.div`
  width: 100%;
  overflow-x: auto;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;

  thead {
    background: ${({ theme }) => theme.colors.secondary};
  }
`

const HeaderCell = styled.th`
  text-align: left;
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.muted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-transform: uppercase;
`

const Row = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`

const Cell = styled.td`
  padding: 12px 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  vertical-align: middle;
`

const Name = styled.div`
  font-weight: 700;
`

const Subtle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Spinner = styled.div`
  display: inline-flex;
  margin-left: ${({ theme }) => theme.spacing.xs};
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;
`

const IconButton = styled.button<{ disabled?: boolean }>`
  height: 36px;
  width: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 120ms ease;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StateBlock = styled.div<{ dashed?: boolean }>`
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ dashed, theme }) =>
    dashed ? `1px dashed ${theme.colors.border}` : 'none'};
`
