import { Table, Tag, Space, Typography, Statistic, Card } from 'antd';
import styled from 'styled-components';
import type { ColumnsType } from 'antd/es/table';
import type { WarningEmployee } from '../types';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
`;

interface WarningEmployeesTableProps {
  data: WarningEmployee[];
  loading?: boolean;
  summary: {
    count: number;
    totalFines: number;
    activeActions: number;
  };
}

const columns: ColumnsType<WarningEmployee> = [
  {
    title: 'Employee',
    dataIndex: 'fullName',
    key: 'fullName',
    width: 200,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <Typography.Text strong>{record.fullName}</Typography.Text>
        <Typography.Text type="secondary">{record.position}</Typography.Text>
      </Space>
    ),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 160,
  },
  {
    title: 'Warnings',
    dataIndex: 'warningCount',
    key: 'warningCount',
    width: 120,
    sorter: (a, b) => a.warningCount - b.warningCount,
  },
  {
    title: 'Last Warning',
    dataIndex: 'lastWarningDate',
    key: 'lastWarningDate',
    width: 150,
  },
  {
    title: 'Corrective Action',
    dataIndex: 'activeCorrectiveAction',
    key: 'activeCorrectiveAction',
    width: 160,
    render: (value: boolean) => (
      <Tag color={value ? 'orange' : 'green'}>{value ? 'Active' : 'Closed'}</Tag>
    ),
    filters: [
      { text: 'Active', value: true },
      { text: 'Closed', value: false },
    ],
    onFilter: (value, record) => record.activeCorrectiveAction === value,
  },
  {
    title: 'Total Fines (TMT)',
    dataIndex: 'totalFineAmount',
    key: 'totalFineAmount',
    width: 150,
    render: (value: number) => value.toLocaleString('tk-TM', { minimumFractionDigits: 0 }),
    sorter: (a, b) => a.totalFineAmount - b.totalFineAmount,
  },
];

export function WarningEmployeesTable({ data, loading, summary }: WarningEmployeesTableProps) {
  return (
    <TableWrapper>
      <div className="summary-cards">
        <Card>
          <Statistic title="Employees with Records" value={summary.count} />
        </Card>
        <Card>
          <Statistic title="Active Corrective Actions" value={summary.activeActions} />
        </Card>
        <Card>
          <Statistic
            title="Total Fines (TMT)"
            value={summary.totalFines}
            precision={0}
          />
        </Card>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
        scroll={{ x: 900 }}
      />
    </TableWrapper>
  );
}
