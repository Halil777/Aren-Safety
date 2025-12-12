import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/shared/lib/utils'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Input } from '@/shared/ui/Input'
import {
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useTenantsQuery,
  useUpdateTenantMutation,
} from '../api/hooks'
import {
  TenantForm,
  PASSWORD_PLACEHOLDER,
  type TenantFormValues,
} from '../components/TenantForm'
import { type Tenant } from '../types/tenant'
import { TenantsTable } from '../components/TenantsTable'

export function TenantsListPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
  const [billingTenant, setBillingTenant] = useState<Tenant | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: tenants, isLoading, error } = useTenantsQuery()
  const createMutation = useCreateTenantMutation()
  const updateMutation = useUpdateTenantMutation()
  const deleteMutation = useDeleteTenantMutation()

  const isSaving = createMutation.isPending || updateMutation.isPending

  const filteredTenants = useMemo(() => {
    if (!tenants) return []
    if (!searchQuery.trim()) return tenants

    return tenants.filter(tenant =>
      tenant.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tenants, searchQuery])

  const handleOpenCreate = () => {
    setEditingTenant(null)
    setIsFormOpen(true)
  }

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsFormOpen(true)
  }

  const handleDelete = (tenant: Tenant) => {
    const confirmed = window.confirm(
      t('tenant.table.confirmDelete', { name: tenant.fullname })
    )
    if (confirmed) {
      deleteMutation.mutate(tenant.id)
    }
  }

  const handleSubmit = (values: TenantFormValues) => {
    if (editingTenant) {
      const { password, id: _ignored, ...rest } = values
      const payload = {
        ...rest,
        ...(password && password !== PASSWORD_PLACEHOLDER ? { password } : {}),
      }
      updateMutation.mutate({ id: editingTenant.id, input: payload })
    } else {
      const { id: _ignored, password, ...rest } = values
      createMutation.mutate({ ...rest, password: password ?? '' })
    }
    setIsFormOpen(false)
    setEditingTenant(null)
  }

  const formTitle = useMemo(
    () =>
      editingTenant ? t('tenant.form.editTitle') : t('tenant.form.createTitle'),
    [editingTenant, t]
  )

  return (
    <PageStack>
      <PageHeader
        title={t('pages.tenants.title')}
        description={t('pages.tenants.description')}
        actions={
          <Button type="button" onClick={handleOpenCreate}>
            {t('actions.addTenant')}
          </Button>
        }
      />

      <Card>
        <HeaderRow>
          <HeaderContent>
            <div>
              <CardTitle>{t('pages.tenants.title')}</CardTitle>
              {error ? <ErrorText>{error.message}</ErrorText> : null}
            </div>
            <SearchInput
              type="text"
              placeholder={t('tenant.search.placeholder', 'Search by name...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </HeaderContent>
          {deleteMutation.error ? (
            <ErrorText>{deleteMutation.error.message}</ErrorText>
          ) : null}
        </HeaderRow>
        <CardContent>
          <TenantsTable
            tenants={filteredTenants}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={async tenant => {
              setStatusUpdatingId(tenant.id)
              const nextStatus =
                tenant.status === 'active' ? 'suspended' : 'active'
              try {
                await updateMutation.mutateAsync({
                  id: tenant.id,
                  input: { status: nextStatus },
                })
              } finally {
                setStatusUpdatingId(null)
              }
            }}
            onBillingOpen={tenant => setBillingTenant(tenant)}
            statusUpdatingId={statusUpdatingId}
          />
        </CardContent>
      </Card>

      {isFormOpen ? (
        <DrawerOverlay>
          <DrawerPanel>
            <DrawerCard>
              <DrawerHeader>
                <CardTitle>{formTitle}</CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsFormOpen(false)
                    setEditingTenant(null)
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </DrawerHeader>
              <DrawerContent>
                <TenantForm
                  mode={editingTenant ? 'edit' : 'create'}
                  initialData={editingTenant ?? undefined}
                  onCancel={() => {
                    setIsFormOpen(false)
                    setEditingTenant(null)
                  }}
                  onSubmit={handleSubmit}
                  isSubmitting={isSaving}
                />
                {createMutation.error ? (
                  <ErrorText>{createMutation.error.message}</ErrorText>
                ) : null}
                {updateMutation.error ? (
                  <ErrorText>{updateMutation.error.message}</ErrorText>
                ) : null}
              </DrawerContent>
            </DrawerCard>
          </DrawerPanel>
        </DrawerOverlay>
      ) : null}

      {billingTenant ? (
        <BillingOverlay>
          <BillingCard>
            <BillingHeader>
              <div>
                <BillingTitle>{billingTenant.fullname}</BillingTitle>
                <BillingSubtitle>{billingTenant.email}</BillingSubtitle>
              </div>
              <Button variant="ghost" onClick={() => setBillingTenant(null)}>
                {t('common.cancel')}
              </Button>
            </BillingHeader>
            <BillingContent>
              <BillingRow>
                <span>Status</span>
                <Badge variant="secondary">
                  {billingTenant.status.toUpperCase()}
                </Badge>
              </BillingRow>
              <BillingRow>
                <span>Billing</span>
                <Badge
                  variant={
                    billingTenant.billingStatus === 'paid'
                      ? 'success'
                      : 'secondary'
                  }
                >
                  {billingTenant.billingStatus}
                </Badge>
              </BillingRow>
              <BillingRow>
                <span>Trial ends</span>
                <span>
                  {billingTenant.trialEndsAt
                    ? formatDate(billingTenant.trialEndsAt)
                    : t('common.noData')}
                </span>
              </BillingRow>
              <BillingRow>
                <span>Paid until</span>
                <span>
                  {billingTenant.paidUntil
                    ? formatDate(billingTenant.paidUntil)
                    : t('common.noData')}
                </span>
              </BillingRow>
              <BillingActions>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onExtendTrialHandler(billingTenant)
                  }}
                >
                  Extend trial
                </Button>
                <Button
                  onClick={() => {
                    onMarkPaidHandler(billingTenant)
                  }}
                >
                  Mark paid
                </Button>
              </BillingActions>
            </BillingContent>
          </BillingCard>
        </BillingOverlay>
      ) : null}
    </PageStack>
  )

  async function onMarkPaidHandler(tenant: Tenant) {
    setStatusUpdatingId(tenant.id)
    const paidUntil = new Date()
    paidUntil.setDate(paidUntil.getDate() + 30)
    try {
      await updateMutation.mutateAsync({
        id: tenant.id,
        input: {
          billingStatus: 'paid',
          paidUntil: paidUntil.toISOString(),
          status: 'active',
        },
      })
    } finally {
      setStatusUpdatingId(null)
      setBillingTenant(null)
    }
  }

  async function onExtendTrialHandler(tenant: Tenant) {
    setStatusUpdatingId(tenant.id)
    const trialEndsAt = new Date(tenant.trialEndsAt ?? new Date())
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)
    try {
      await updateMutation.mutateAsync({
        id: tenant.id,
        input: {
          billingStatus: 'trial',
          trialEndsAt: trialEndsAt.toISOString(),
          status: 'trial',
        },
      })
    } finally {
      setStatusUpdatingId(null)
      setBillingTenant(null)
    }
  }
}

const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`

const HeaderRow = styled(CardHeader)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`

const HeaderContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  align-items: center;
`

const SearchInput = styled(Input)`
  width: 100%;
  max-width: 100%;
  outline: none;

  &:focus,
  &:focus-visible {
    outline: none;
    border-color: inherit;
    box-shadow: none;
  }
`

const ErrorText = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.destructive};
  font-size: 14px;
  font-weight: 600;
`

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(4px);
`

const DrawerPanel = styled.div`
  width: 100%;
  max-width: 900px;
  height: 100%;
  box-shadow: ${({ theme }) => theme.shadow.lg};

  @media (min-width: 768px) {
    width: 50%;
  }
`

const DrawerCard = styled(Card)`
  height: 100%;
  border-radius: 0;
`

const DrawerHeader = styled(CardHeader)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`

const DrawerContent = styled(CardContent)`
  height: calc(100% - 4rem);
  overflow-y: auto;
`

const BillingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`

const BillingCard = styled(Card)`
  width: min(960px, 100%);
  height: min(620px, 100%);
  display: flex;
  flex-direction: column;
`

const BillingHeader = styled(CardHeader)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const BillingTitle = styled(CardTitle)`
  font-size: 22px;
`

const BillingSubtitle = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`

const BillingContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const BillingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};

  span:first-child {
    color: ${({ theme }) => theme.colors.muted};
  }
`

const BillingActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
`
