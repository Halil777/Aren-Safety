import { Tag, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ProjectCode } from '../types';

export const getProjectCodeColumns = (): ColumnsType<ProjectCode> => [
  {
    title: 'PROJE KODU',
    dataIndex: 'code',
    key: 'code',
    width: 150,
    fixed: 'left',
    align: 'center',
  },
  {
    title: 'PROJE ADI',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 200,
  },
  {
    title: 'MÜŞTERİ',
    dataIndex: 'client',
    key: 'client',
    width: 180,
  },
  {
    title: 'DEPARTMAN',
    dataIndex: 'department',
    key: 'department',
    width: 150,
  },
  {
    title: 'BAŞLANGIÇ TARİHİ',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 150,
  },
  {
    title: 'BİTİŞ TARİHİ',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 150,
    render: (date: string) => date || '-',
  },
  {
    title: 'YÖNETİCİ',
    dataIndex: 'manager',
    key: 'manager',
    width: 150,
    render: (manager: string) => manager || '-',
  },
  {
    title: 'DURUM',
    dataIndex: 'status',
    key: 'status',
    width: 130,
    align: 'center',
    render: (status: string) => {
      let color = 'default';
      let text = status;

      if (status === 'ACTIVE') {
        color = 'green';
        text = 'AKTIF';
      } else if (status === 'COMPLETED') {
        color = 'blue';
        text = 'TAMAMLANDI';
      } else if (status === 'ON_HOLD') {
        color = 'orange';
        text = 'BEKLEMEDE';
      }

      return <Tag color={color}>{text}</Tag>;
    },
    filters: [
      { text: 'AKTIF', value: 'ACTIVE' },
      { text: 'TAMAMLANDI', value: 'COMPLETED' },
      { text: 'BEKLEMEDE', value: 'ON_HOLD' },
    ],
    onFilter: (value, record) => record.status === value,
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
