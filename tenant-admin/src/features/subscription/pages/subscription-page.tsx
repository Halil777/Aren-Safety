import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from '@/shared/ui/button'
import { useAuthStore } from '@/shared/store/auth-store'

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export function SubscriptionPage() {
  const { t } = useTranslation()
  const tenant = useAuthStore((state) => state.tenant)

  const daysLeft = tenant?.trialEndsAt
    ? Math.max(
        Math.ceil(
          (new Date(tenant.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : null

  const statusLabel =
    tenant?.status === 'active' || tenant?.status === 'trial'
      ? t('subscription.active')
      : t('subscription.suspended')

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('subscription.title')}
        description={t('subscription.description')}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              {t('subscription.payOnline')}
            </Button>
            <Button variant="secondary">{t('subscription.contactSupport')}</Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('subscription.plan', { plan: tenant?.plan ?? 'basic' })}</CardTitle>
          <CardDescription>{statusLabel}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label={t('subscription.billingStatus')} value={tenant?.billingStatus} />
            <InfoRow label={t('subscription.status')} value={tenant?.status} />
            <InfoRow label={t('subscription.trialEnds')} value={formatDate(tenant?.trialEndsAt)} />
            <InfoRow label={t('subscription.paidUntil')} value={formatDate(tenant?.paidUntil)} />
            {daysLeft !== null ? (
              <InfoRow label={t('subscription.daysLeft')} value={`${daysLeft} ${t('subscription.days')}`} />
            ) : null}
          </div>
          <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            {t('subscription.payPlaceholder')}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card/50 p-3">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value ?? '—'}</span>
    </div>
  )
}
