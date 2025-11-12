import { useMemo } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import type { Observation } from '../types';
import { getObservationColumns } from '../config/table-columns';

const TableWrapper = styled.div`
  .ant-table-wrapper {
    border-radius: 16px;
  }
`;

interface ObservationTableProps {
  data: Observation[];
  loading?: boolean;
  onView?: (record: Observation) => void;
  onEdit?: (record: Observation) => void;
  onDelete?: (record: Observation) => void;
}

export function ObservationTable({ data, loading = false, onView, onEdit, onDelete }: ObservationTableProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const columns = useMemo(() => getObservationColumns(t, onView, onEdit, onDelete, currentLang), [t, onView, onEdit, onDelete, currentLang]);

  return (
    <TableWrapper>
      <Table<Observation>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => t('observations.table.total', { count: total }),
          position: ['bottomCenter'],
        }}
      />
    </TableWrapper>
  );
}

