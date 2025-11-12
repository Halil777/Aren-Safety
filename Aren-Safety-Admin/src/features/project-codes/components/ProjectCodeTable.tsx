import { Table } from 'antd';
import styled from 'styled-components';
import type { ProjectCode } from '../types';
import { getProjectCodeColumns } from '../config/table-columns';

const TableWrapper = styled.div`
  .ant-table-wrapper {
    border-radius: 16px;
  }
`;

interface ProjectCodeTableProps {
  data: ProjectCode[];
  loading?: boolean;
}

export function ProjectCodeTable({ data, loading = false }: ProjectCodeTableProps) {
  const columns = getProjectCodeColumns();

  return (
    <TableWrapper>
      <Table<ProjectCode>
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} project codes`,
          position: ['bottomCenter'],
        }}
      />
    </TableWrapper>
  );
}
