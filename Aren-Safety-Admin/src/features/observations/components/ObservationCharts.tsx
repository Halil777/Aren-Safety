import { useMemo, useRef, type RefObject } from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import type { Observation } from '../types';
import { exportToPDF, printTable, exportChartAsImage } from '@/shared/utils/export-utils';
import { ChartActions } from '@/shared/components/ChartActions';

const ChartsContainer = styled.div`
  margin-top: 24px;
`;

const ChartCard = styled(Card)<{ $isDark: boolean }>`
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 4px 16px rgba(0, 0, 0, 0.3)'
      : '0 4px 16px rgba(15, 23, 42, 0.04)'};

  .ant-card-head {
    border-bottom: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  }

  .ant-card-head-title {
    color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : '#0f172a')};
    font-weight: 600;
    font-size: 16px;
  }
`;

const ChartContent = styled.div`
  width: 100%;
  height: 300px;
`;

type ChartColumn = { header: string; dataIndex: string };

type ChartRow = Record<string, string | number>;

const createChartActions = (
  filename: string,
  title: string,
  columns: ChartColumn[],
  rows: ChartRow[],
  ref: RefObject<HTMLDivElement | null>,
  backgroundColor: string,
) => ({
  onExportPDF: () =>
    exportToPDF({
      filename,
      title,
      columns,
      data: rows,
    }),
  onExportImage: () =>
    exportChartAsImage({
      element: ref.current,
      filename,
      format: 'jpeg',
      backgroundColor,
    }),
  onPrint: () =>
    printTable({
      filename,
      title,
      columns,
      data: rows,
    }),
});

interface ObservationChartsProps {
  data: Observation[];
  isDark: boolean;
}

export function ObservationCharts({ data, isDark }: ObservationChartsProps) {
  const { t } = useTranslation();

  const backgroundColor = isDark ? '#1e293b' : '#ffffff';

  const riskLevelChartRef = useRef<HTMLDivElement>(null);
  const statusChartRef = useRef<HTMLDivElement>(null);
  const departmentChartRef = useRef<HTMLDivElement>(null);
  const deadlineChartRef = useRef<HTMLDivElement>(null);

  const chartColumns = useMemo(() => ({
    riskLevel: [
      { header: t('observations.table.columns.riskLevel'), dataIndex: 'name' },
      { header: t('observations.charts.labels.observations'), dataIndex: 'value' },
    ],
    status: [
      { header: t('observations.table.columns.status'), dataIndex: 'name' },
      { header: t('observations.charts.labels.observations'), dataIndex: 'value' },
    ],
    department: [
      { header: t('observations.table.columns.department'), dataIndex: 'name' },
      { header: t('observations.charts.labels.observations'), dataIndex: 'observations' },
    ],
    deadline: [
      { header: t('observations.table.columns.deadline'), dataIndex: 'name' },
      { header: t('observations.charts.labels.observations'), dataIndex: 'value' },
    ],
  }), [t]);

  const riskLevelData = [
    { name: t('observations.charts.riskLevel.level1'), value: data.filter((d) => d.riskLevel === 1).length, color: '#10b981' },
    { name: t('observations.charts.riskLevel.level2'), value: data.filter((d) => d.riskLevel === 2).length, color: '#3b82f6' },
    { name: t('observations.charts.riskLevel.level3'), value: data.filter((d) => d.riskLevel === 3).length, color: '#fbbf24' },
    { name: t('observations.charts.riskLevel.level4'), value: data.filter((d) => d.riskLevel === 4).length, color: '#f97316' },
    { name: t('observations.charts.riskLevel.level5'), value: data.filter((d) => d.riskLevel === 5).length, color: '#ef4444' },
  ];

  const statusData = [
    { name: t('observations.status.open'), value: data.filter((d) => d.status === 'open').length, color: '#ef4444' },
    { name: t('observations.status.closed'), value: data.filter((d) => d.status === 'closed').length, color: '#10b981' },
  ];

  const departmentCounts = data.reduce<Record<string, number>>((acc, curr) => {
    const key = curr.department ?? 'other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(([key, value]) => ({
    key,
    name: t(`observations.filtersOptions.departments.${key}`),
    observations: value,
  }));

  const deadlineData = [
    { name: t('observations.deadline.on_time'), value: data.filter((d) => d.deadline === 'on_time').length, color: '#10b981' },
    { name: t('observations.deadline.delayed'), value: data.filter((d) => d.deadline === 'delayed').length, color: '#f97316' },
  ];

  const riskLevelActions = createChartActions(
    'observations-risk-level-distribution',
    t('observations.charts.riskLevel.title'),
    chartColumns.riskLevel,
    riskLevelData,
    riskLevelChartRef,
    backgroundColor,
  );

  const statusActions = createChartActions(
    'observations-status-distribution',
    t('observations.charts.status.title'),
    chartColumns.status,
    statusData,
    statusChartRef,
    backgroundColor,
  );

  const departmentActions = createChartActions(
    'observations-by-department',
    t('observations.charts.department.title'),
    chartColumns.department,
    departmentData,
    departmentChartRef,
    backgroundColor,
  );

  const deadlineActions = createChartActions(
    'observations-deadline-status',
    t('observations.charts.deadline.title'),
    chartColumns.deadline,
    deadlineData,
    deadlineChartRef,
    backgroundColor,
  );

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';

  // Don't render charts if there's no data
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <ChartsContainer>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title={t('observations.charts.riskLevel.title')}
            extra={<ChartActions {...riskLevelActions} />}
          >
            <ChartContent ref={riskLevelChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskLevelData.map((entry, index) => (
                      <Cell key={`risk-level-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
                      borderRadius: '8px',
                      color: textColor,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title={t('observations.charts.status.title')}
            extra={<ChartActions {...statusActions} />}
          >
            <ChartContent ref={statusChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`status-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
                      borderRadius: '8px',
                      color: textColor,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title={t('observations.charts.department.title')}
            extra={<ChartActions {...departmentActions} />}
          >
            <ChartContent ref={departmentChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
                      borderRadius: '8px',
                      color: textColor,
                    }}
                  />
                  <Legend wrapperStyle={{ color: textColor }} />
                  <Bar dataKey="observations" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title={t('observations.charts.deadline.title')}
            extra={<ChartActions {...deadlineActions} />}
          >
            <ChartContent ref={deadlineChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deadlineData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis type="number" stroke={textColor} />
                  <YAxis dataKey="name" type="category" stroke={textColor} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
                      borderRadius: '8px',
                      color: textColor,
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {deadlineData.map((entry, index) => (
                      <Cell key={`deadline-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>
      </Row>
    </ChartsContainer>
  );
}
