import { ClipboardList, ShieldCheck, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/page-header'

const metrics = [
  {
    label: 'Active users',
    value: '128',
    helper: 'Up 8% vs last week',
    icon: Users,
  },
  {
    label: 'Open observations',
    value: '42',
    helper: '12 require attention',
    icon: ClipboardList,
  },
  {
    label: 'Assigned supervisors',
    value: '9',
    helper: 'Covering 14 projects',
    icon: ShieldCheck,
  },
]

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.dashboard.title')}
        description={t('pages.dashboard.description')}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold text-foreground">
                  {metric.value}
                </CardTitle>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <metric.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant activity</CardTitle>
          <CardDescription>{t('pages.placeholder')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            Charts and summaries will live here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
