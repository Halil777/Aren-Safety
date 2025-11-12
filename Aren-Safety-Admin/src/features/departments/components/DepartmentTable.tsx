import { Table } from 'antd';
import styled from 'styled-components';
import type { Department } from '../types';
import { getDepartmentColumns } from '../config/table-columns';

const TableWrapper = styled.div`
  .ant-table-wrapper {
    border-radius: 16px;
  }
`;

interface DepartmentTableProps {
  data: Department[];
  loading?: boolean;
}

export function DepartmentTable({ data, loading = false }: DepartmentTableProps) {
  const columns = getDepartmentColumns();

  return (
    <TableWrapper>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} departments`,
          position: ['bottomCenter'],
        }}
      />
    </TableWrapper>
  );
}
