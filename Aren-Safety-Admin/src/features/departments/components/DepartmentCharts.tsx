import { useRef, type RefObject } from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Department } from '../types';
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

const departmentColumns: ChartColumn[] = [
  { header: 'Department', dataIndex: 'name' },
  { header: 'Observations', dataIndex: 'count' },
];

const nonconformityColumns: ChartColumn[] = [
  { header: 'Nonconformity Type', dataIndex: 'name' },
  { header: 'Occurrences', dataIndex: 'value' },
];

const upperCategoryColumns: ChartColumn[] = [
  { header: 'Upper Category', dataIndex: 'subject' },
  { header: 'Occurrences', dataIndex: 'value' },
];

const riskLevelColumns: ChartColumn[] = [
  { header: 'Risk Level', dataIndex: 'name' },
  { header: 'Occurrences', dataIndex: 'value' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

interface DepartmentChartsProps {
  data: Department[];
  isDark: boolean;
}

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

export function DepartmentCharts({ data, isDark }: DepartmentChartsProps) {
  // Don't render charts if there's no data
  if (!data || data.length === 0) {
    return null;
  }

  const backgroundColor = isDark ? '#1e293b' : '#ffffff';

  const departmentChartRef = useRef<HTMLDivElement>(null);
  const nonconformityChartRef = useRef<HTMLDivElement>(null);
  const upperCategoryChartRef = useRef<HTMLDivElement>(null);
  const riskLevelChartRef = useRef<HTMLDivElement>(null);

  const departmentCounts = data.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    count: value,
  }));

  const departmentActions = createChartActions(
    'departments-department-distribution',
    'Department Distribution',
    departmentColumns,
    departmentData,
    departmentChartRef,
    backgroundColor,
  );

  const nonconformityCounts = data.reduce((acc, curr) => {
    acc[curr.nonconformityType] = (acc[curr.nonconformityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const nonconformityData = Object.entries(nonconformityCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const nonconformityActions = createChartActions(
    'departments-nonconformity-distribution',
    'Nonconformity Type Distribution',
    nonconformityColumns,
    nonconformityData,
    nonconformityChartRef,
    backgroundColor,
  );

  const upperCategoryCounts = data.reduce((acc, curr) => {
    if (curr.upperCategory) {
      acc[curr.upperCategory] = (acc[curr.upperCategory] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const upperCategoryData = Object.entries(upperCategoryCounts).map(([subject, value]) => ({
    subject,
    value,
  }));

  const upperCategoryActions = createChartActions(
    'departments-upper-category-analysis',
    'Upper Category Analysis',
    upperCategoryColumns,
    upperCategoryData,
    upperCategoryChartRef,
    backgroundColor,
  );

  const riskLevelData = [
    { name: 'Level 1', value: data.filter((d) => d.riskLevel === 1).length, color: '#10b981' },
    { name: 'Level 2', value: data.filter((d) => d.riskLevel === 2).length, color: '#3b82f6' },
    { name: 'Level 3', value: data.filter((d) => d.riskLevel === 3).length, color: '#fbbf24' },
    { name: 'Level 4', value: data.filter((d) => d.riskLevel === 4).length, color: '#f97316' },
    { name: 'Level 5', value: data.filter((d) => d.riskLevel === 5).length, color: '#ef4444' },
  ];

  const riskLevelActions = createChartActions(
    'departments-risk-level-distribution',
    'Risk Level Distribution',
    riskLevelColumns,
    riskLevelData,
    riskLevelChartRef,
    backgroundColor,
  );

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)';

  return (
    <ChartsContainer>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title="Department Distribution"
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
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title="Nonconformity Type Distribution"
            extra={<ChartActions {...nonconformityActions} />}
          >
            <ChartContent ref={nonconformityChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nonconformityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {nonconformityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            title="Upper Category Analysis"
            extra={<ChartActions {...upperCategoryActions} />}
          >
            <ChartContent ref={upperCategoryChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={upperCategoryData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="subject" stroke={textColor} />
                  <PolarRadiusAxis stroke={textColor} />
                  <Radar name="Occurrences" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
                      borderRadius: '8px',
                      color: textColor,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title="Risk Level Distribution"
            extra={<ChartActions {...riskLevelActions} />}
          >
            <ChartContent ref={riskLevelChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskLevelData}>
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
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {riskLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
