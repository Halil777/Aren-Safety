import { useRef, type RefObject } from 'react';
import { Card, Row, Col } from 'antd';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ProjectCode } from '../types';
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

const statusColumns: ChartColumn[] = [
  { header: 'Status', dataIndex: 'name' },
  { header: 'Projects', dataIndex: 'value' },
];

const departmentColumns: ChartColumn[] = [
  { header: 'Department', dataIndex: 'name' },
  { header: 'Projects', dataIndex: 'projects' },
];

const clientColumns: ChartColumn[] = [
  { header: 'Client', dataIndex: 'name' },
  { header: 'Projects', dataIndex: 'value' },
];

const managerColumns: ChartColumn[] = [
  { header: 'Project Manager', dataIndex: 'name' },
  { header: 'Projects', dataIndex: 'projects' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

interface ProjectCodeChartsProps {
  data: ProjectCode[];
  isDark: boolean;
}

export function ProjectCodeCharts({ data, isDark }: ProjectCodeChartsProps) {
  // Don't render charts if there's no data
  if (!data || data.length === 0) {
    return null;
  }

  const backgroundColor = isDark ? '#1e293b' : '#ffffff';

  const statusChartRef = useRef<HTMLDivElement>(null);
  const departmentChartRef = useRef<HTMLDivElement>(null);
  const clientChartRef = useRef<HTMLDivElement>(null);
  const managerChartRef = useRef<HTMLDivElement>(null);

  const statusData = [
    { name: 'AKTIF', value: data.filter((d) => d.status === 'ACTIVE').length, color: '#10b981' },
    { name: 'TAMAMLANDI', value: data.filter((d) => d.status === 'COMPLETED').length, color: '#3b82f6' },
    { name: 'BEKLEMEDE', value: data.filter((d) => d.status === 'ON_HOLD').length, color: '#f97316' },
  ];

  const statusActions = createChartActions(
    'project-codes-status-distribution',
    'Project Status Distribution',
    statusColumns,
    statusData,
    statusChartRef,
    backgroundColor,
  );

  const departmentCounts = data.reduce((acc, curr) => {
    if (curr.department) {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentCounts).map(([name, projects]) => ({
    name,
    projects,
  }));

  const departmentActions = createChartActions(
    'project-codes-by-department',
    'Projects by Department',
    departmentColumns,
    departmentData,
    departmentChartRef,
    backgroundColor,
  );

  const clientCounts = data.reduce((acc, curr) => {
    acc[curr.client] = (acc[curr.client] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clientData = Object.entries(clientCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const clientActions = createChartActions(
    'project-codes-top-clients',
    'Top Clients by Project Count',
    clientColumns,
    clientData,
    clientChartRef,
    backgroundColor,
  );

  const managerCounts = data.reduce((acc, curr) => {
    if (curr.manager) {
      acc[curr.manager] = (acc[curr.manager] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const managerData = Object.entries(managerCounts).map(([name, projects]) => ({
    name,
    projects,
  }));

  const managerActions = createChartActions(
    'project-codes-by-manager',
    'Projects by Manager',
    managerColumns,
    managerData,
    managerChartRef,
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
            title="Project Status Distribution"
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
            title="Projects by Department"
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
                  <Bar dataKey="projects" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title="Top Clients by Project Count"
            extra={<ChartActions {...clientActions} />}
          >
            <ChartContent ref={clientChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientData} layout="horizontal">
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
                    {clientData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <ChartCard
            $isDark={isDark}
            title="Projects by Manager"
            extra={<ChartActions {...managerActions} />}
          >
            <ChartContent ref={managerChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={managerData}>
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
                  <Area
                    type="monotone"
                    dataKey="projects"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContent>
          </ChartCard>
        </Col>
      </Row>
    </ChartsContainer>
  );
}
