import { Tag, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Department } from '../types';

export const getDepartmentColumns = (): ColumnsType<Department> => [
  {
    title: 'DEPARTMAN',
    dataIndex: 'department',
    key: 'department',
    width: 150,
    fixed: 'left',
  },
  {
    title: 'UYGUNSUZLUK TIPI',
    dataIndex: 'nonconformityType',
    key: 'nonconformityType',
    width: 170,
  },
  {
    title: 'OBSERVATION DATE',
    dataIndex: 'observationDate',
    key: 'observationDate',
    width: 150,
  },
  {
    title: 'RISK SEVIYESI',
    dataIndex: 'riskLevel',
    key: 'riskLevel',
    width: 130,
    align: 'center',
    render: (level: number) => {
      let color = 'default';
      if (level === 5) color = 'red';
      else if (level === 4) color = 'orange';
      else if (level === 3) color = 'gold';
      else if (level === 2) color = 'blue';
      else if (level === 1) color = 'green';

      return <Tag color={color}>{level}</Tag>;
    },
    filters: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
    ],
    filterMode: 'tree',
    filterSearch: false,
    onFilter: (value, record) => record.riskLevel === value,
    sorter: (a, b) => a.riskLevel - b.riskLevel,
  },
  {
    title: 'DURUM',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    align: 'center',
    render: (status: string) => {
      const color = status === 'AÇIK' ? 'red' : 'green';
      return <Tag color={color}>{status}</Tag>;
    },
    filters: [
      { text: 'AÇIK', value: 'AÇIK' },
      { text: 'KAPALI', value: 'KAPALI' },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'TERMIN',
    dataIndex: 'deadline',
    key: 'deadline',
    width: 130,
    align: 'center',
    render: (deadline: string) => {
      const color = deadline === 'ZAMANINDA' ? 'green' : 'orange';
      return <Tag color={color}>{deadline}</Tag>;
    },
    filters: [
      { text: 'ZAMANINDA', value: 'ZAMANINDA' },
      { text: 'GECIKMELI', value: 'GECIKMELI' },
    ],
    onFilter: (value, record) => record.deadline === value,
  },
  {
    title: 'ACTION',
    key: 'action',
    width: 130,
    align: 'center',
    fixed: 'right',
    render: () => (
      <Space size="small">
        <Tooltip title="View">
          <Button type="text" size="small" icon={<EyeOutlined />} />
        </Tooltip>
        <Tooltip title="Edit">
          <Button type="text" size="small" icon={<EditOutlined />} />
        </Tooltip>
        <Tooltip title="Delete">
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Tooltip>
      </Space>
    ),
  },
];
