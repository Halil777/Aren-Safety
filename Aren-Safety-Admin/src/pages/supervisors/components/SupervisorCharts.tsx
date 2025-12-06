import React, { useMemo } from 'react';
import { Card, Row, Col, Empty } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/theme-provider';
import type { Observation } from '@/features/observations/types';

interface SupervisorStat {
  id: string;
  firstName: string;
  lastName: string;
  totalObservations: number;
  respondedCount: number;
  pendingCount: number;
}

interface SupervisorChartsProps {
  supervisors: SupervisorStat[];
  observations: Observation[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const SupervisorCharts: React.FC<SupervisorChartsProps> = ({ supervisors, observations }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Chart 1: Observations by Supervisor
  const observationsBySupervisor = useMemo(() => {
    return supervisors
      .filter((sup) => sup.totalObservations > 0)
      .map((sup) => ({
        name: `${sup.firstName} ${sup.lastName}`,
        observations: sup.totalObservations,
      }))
      .sort((a, b) => b.observations - a.observations)
      .slice(0, 10); // Top 10
  }, [supervisors]);

  // Chart 2: Response Status Distribution
  const responseStatusData = useMemo(() => {
    const totalResponded = supervisors.reduce((sum, sup) => sum + sup.respondedCount, 0);
    const totalPending = supervisors.reduce((sum, sup) => sum + sup.pendingCount, 0);

    return [
      { name: t('supervisors.charts.responded'), value: totalResponded },
      { name: t('supervisors.charts.pending'), value: totalPending },
    ];
  }, [supervisors, t]);

  // Chart 3: Supervisor Performance
  const supervisorPerformance = useMemo(() => {
    return supervisors
      .filter((sup) => sup.totalObservations > 0)
      .map((sup) => ({
        name: `${sup.firstName} ${sup.lastName}`,
        responded: sup.respondedCount,
        pending: sup.pendingCount,
      }))
      .sort((a, b) => (b.responded + b.pending) - (a.responded + a.pending))
      .slice(0, 10); // Top 10
  }, [supervisors]);

  // Chart 4: Supervisors with Pending Observations
  const pendingBySupervisor = useMemo(() => {
    return supervisors
      .filter((sup) => sup.pendingCount > 0)
      .map((sup) => ({
        name: `${sup.firstName} ${sup.lastName}`,
        pending: sup.pendingCount,
      }))
      .sort((a, b) => b.pending - a.pending)
      .slice(0, 10); // Top 10
  }, [supervisors]);

  const chartTextColor = isDark ? '#ffffff' : '#000000';
  const chartGridColor = isDark ? '#404040' : '#f0f0f0';

  if (!observations.length || !supervisors.length) {
    return (
      <Card>
        <Empty description={t('supervisors.charts.noData')} />
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {/* Chart 1: Total Observations by Supervisor */}
      <Col xs={24} lg={12}>
        <Card title={t('supervisors.charts.observationsBySupervisor')}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={observationsBySupervisor}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: chartTextColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fill: chartTextColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: `1px solid ${isDark ? '#404040' : '#d9d9d9'}`,
                }}
              />
              <Legend />
              <Bar dataKey="observations" fill="#0088FE" name={t('supervisors.charts.observations')} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* Chart 2: Response Status Distribution */}
      <Col xs={24} lg={12}>
        <Card title={t('supervisors.charts.responseStatus')}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={responseStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {responseStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: `1px solid ${isDark ? '#404040' : '#d9d9d9'}`,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* Chart 3: Supervisor Performance (Responded vs Pending) */}
      <Col xs={24} lg={12}>
        <Card title={t('supervisors.charts.performance')}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supervisorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: chartTextColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fill: chartTextColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: `1px solid ${isDark ? '#404040' : '#d9d9d9'}`,
                }}
              />
              <Legend />
              <Bar dataKey="responded" stackId="a" fill="#00C49F" name={t('supervisors.charts.responded')} />
              <Bar dataKey="pending" stackId="a" fill="#FF8042" name={t('supervisors.charts.pending')} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* Chart 4: Pending Observations by Supervisor */}
      <Col xs={24} lg={12}>
        <Card title={t('supervisors.charts.pendingBySupervisor')}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pendingBySupervisor}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: chartTextColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fill: chartTextColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: `1px solid ${isDark ? '#404040' : '#d9d9d9'}`,
                }}
              />
              <Legend />
              <Bar dataKey="pending" fill="#FFBB28" name={t('supervisors.charts.pending')} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};
