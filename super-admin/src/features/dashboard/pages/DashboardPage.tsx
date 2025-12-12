import { useTranslation } from 'react-i18next'
import { Activity, Shield, ShieldOff, TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import styled, { useTheme } from 'styled-components'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useStatistics } from '../api/useStatistics'

export function DashboardPage() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { data: statistics, isLoading } = useStatistics()

  if (isLoading) {
    return (
      <PageStack>
        <PageHeader
          title={t('pages.dashboard.title')}
          description={t('pages.dashboard.description')}
        />
        <Grid>
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <SkeletonHeader />
              <CardContent>
                <SkeletonBox />
              </CardContent>
            </Card>
          ))}
        </Grid>
      </PageStack>
    )
  }

  if (!statistics) {
    return (
      <PageStack>
        <PageHeader
          title={t('pages.dashboard.title')}
          description={t('pages.dashboard.description')}
        />
        <Card>
          <Centered>{t('common.noData')}</Centered>
        </Card>
      </PageStack>
    )
  }

  const chartData = statistics.growthData.map(growth => {
    const activeData = statistics.statusData.find(
      s => s.month === growth.month && s.status === 'active'
    )
    const offlineData = statistics.statusData.find(
      s => s.month === growth.month && s.status === 'offline'
    )

    return {
      month: growth.month,
      total: growth.count,
      active: activeData?.count || 0,
      offline: offlineData?.count || 0,
    }
  })

  return (
    <PageStack>
      <PageHeader
        title={t('pages.dashboard.title')}
        description={t('pages.dashboard.description')}
      />

      <Grid>
        <Card>
          <CardHeaderRow>
            <CardTitleSmall>{t('dashboard.totalTenants')}</CardTitleSmall>
            <Activity size={18} color={theme.colors.text} />
          </CardHeaderRow>
          <CardContent>
            <StatValue>{statistics.total}</StatValue>
            <StatHelper>{t('dashboard.allTenantAdmins')}</StatHelper>
          </CardContent>
        </Card>

        <Card>
          <CardHeaderRow>
            <CardTitleSmall>{t('dashboard.activeTenants')}</CardTitleSmall>
            <Shield size={18} color={theme.colors.success} />
          </CardHeaderRow>
          <CardContent>
            <StatValue style={{ color: theme.colors.success }}>
              {statistics.active}
            </StatValue>
            <StatHelper>
              {statistics.total > 0
                ? `${Math.round((statistics.active / statistics.total) * 100)}% ${t('dashboard.ofTotal')}`
                : '0% of total'}
            </StatHelper>
          </CardContent>
        </Card>

        <Card>
          <CardHeaderRow>
            <CardTitleSmall>{t('dashboard.offlineTenants')}</CardTitleSmall>
            <ShieldOff size={18} color={theme.colors.destructive} />
          </CardHeaderRow>
          <CardContent>
            <StatValue style={{ color: theme.colors.destructive }}>
              {statistics.offline}
            </StatValue>
            <StatHelper>
              {statistics.total > 0
                ? `${Math.round((statistics.offline / statistics.total) * 100)}% ${t('dashboard.ofTotal')}`
                : '0% of total'}
            </StatHelper>
          </CardContent>
        </Card>
      </Grid>

      <ChartGrid>
        <Card>
          <CardHeader>
            <CardTitleRow>
              <TrendingUp size={18} />
              {t('dashboard.tenantGrowth')}
            </CardTitleRow>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.colors.border}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme.colors.muted, fontSize: 12 }}
                />
                <YAxis tick={{ fill: theme.colors.muted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: 10,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={theme.colors.primary}
                  strokeWidth={2}
                  name={t('dashboard.totalTenants')}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.statusDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.colors.border}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme.colors.muted, fontSize: 12 }}
                />
                <YAxis tick={{ fill: theme.colors.muted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: 10,
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="active"
                  stackId="1"
                  stroke={theme.colors.success}
                  fill={theme.colors.success}
                  fillOpacity={0.6}
                  name={t('dashboard.activeTenants')}
                />
                <Area
                  type="monotone"
                  dataKey="offline"
                  stackId="1"
                  stroke={theme.colors.destructive}
                  fill={theme.colors.destructive}
                  fillOpacity={0.6}
                  name={t('dashboard.offlineTenants')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <WideCard>
          <CardHeader>
            <CardTitle>{t('dashboard.monthlyComparison')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.colors.border}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme.colors.muted, fontSize: 12 }}
                />
                <YAxis tick={{ fill: theme.colors.muted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: 10,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="active"
                  fill={theme.colors.success}
                  name={t('dashboard.activeTenants')}
                />
                <Bar
                  dataKey="offline"
                  fill={theme.colors.destructive}
                  name={t('dashboard.offlineTenants')}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </WideCard>
      </ChartGrid>
    </PageStack>
  )
}

const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const ChartGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const WideCard = styled(Card)`
  @media (min-width: 768px) {
    grid-column: span 2;
  }
`

const CardHeaderRow = styled(CardHeader)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`

const CardTitleSmall = styled(CardTitle)`
  font-size: 14px;
  font-weight: 700;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`

const StatHelper = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`

const CardTitleRow = styled(CardTitle)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const SkeletonHeader = styled(CardHeader)`
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(
    90deg,
    rgba(226, 232, 240, 0.4),
    rgba(226, 232, 240, 0.2)
  );
  height: 46px;
`

const SkeletonBox = styled.div`
  width: 72px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(
    90deg,
    rgba(226, 232, 240, 0.4),
    rgba(226, 232, 240, 0.2)
  );
`

const Centered = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  font-size: 14px;
`
