import { Table, Tag, Progress, Badge, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import type { TrainingSession, TrainingStatus, TrainingType } from '../types';

interface TrainingTableProps {
  data: TrainingSession[];
  loading?: boolean;
}

export function TrainingTable({ data, loading = false }: TrainingTableProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: TrainingStatus): string => {
    const colorMap: Record<TrainingStatus, string> = {
      'scheduled': 'blue',
      'in-progress': 'orange',
      'completed': 'green',
      'cancelled': 'red',
    };
    return colorMap[status] || 'default';
  };

  const getTypeColor = (type: TrainingType): string => {
    const colorMap: Record<TrainingType, string> = {
      'safety-induction': 'red',
      'equipment-training': 'orange',
      'emergency-response': 'volcano',
      'compliance-training': 'blue',
      'skill-development': 'purple',
      'refresher-course': 'cyan',
    };
    return colorMap[type] || 'default';
  };

  const getTypeLabel = (type: TrainingType): string => {
    const labelMap: Record<TrainingType, string> = {
      'safety-induction': 'Safety Induction',
      'equipment-training': 'Equipment Training',
      'emergency-response': 'Emergency Response',
      'compliance-training': 'Compliance',
      'skill-development': 'Skill Development',
      'refresher-course': 'Refresher',
    };
    return labelMap[type] || type;
  };

  const columns: ColumnsType<TrainingSession> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
      render: (id: string) => <span style={{ fontWeight: 600 }}>{id}</span>,
    },
    {
      title: 'Training Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      fixed: 'left',
      render: (title: string, record: TrainingSession) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {record.instructor}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      render: (type: TrainingType) => (
        <Tag color={getTypeColor(type)}>{getTypeLabel(type)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: TrainingStatus) => {
        const statusLabels: Record<TrainingStatus, string> = {
          'scheduled': 'Scheduled',
          'in-progress': 'In Progress',
          'completed': 'Completed',
          'cancelled': 'Cancelled',
        };
        return (
          <Badge
            status={status === 'completed' ? 'success' : status === 'in-progress' ? 'processing' : 'default'}
            text={<Tag color={getStatusColor(status)}>{statusLabels[status]}</Tag>}
          />
        );
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 130,
      render: (dept: string | undefined) =>
        dept ? t(`observations.filtersOptions.departments.${dept}`, dept) : <span style={{ opacity: 0.5 }}>All</span>,
    },
    {
      title: 'Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (startDate: string, record: TrainingSession) => (
        <div>
          <div>{startDate}</div>
          {record.startDate !== record.endDate && (
            <div style={{ fontSize: 11, opacity: 0.7 }}>to {record.endDate}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => `${duration}h`,
    },
    {
      title: 'Enrollment',
      key: 'enrollment',
      width: 140,
      render: (_: any, record: TrainingSession) => {
        const percentage = (record.enrolled / record.capacity) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              {record.enrolled} / {record.capacity}
            </div>
            <Progress
              percent={percentage}
              size="small"
              strokeColor={percentage >= 80 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#6366f1'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'Completion',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 120,
      render: (rate: number) =>
        rate > 0 ? (
          <Progress
            percent={rate}
            size="small"
            strokeColor="#10b981"
            format={(percent) => `${percent}%`}
          />
        ) : (
          <span style={{ opacity: 0.5 }}>-</span>
        ),
    },
    {
      title: 'Certificate',
      dataIndex: 'certificate',
      key: 'certificate',
      width: 100,
      align: 'center',
      render: (certificate: boolean) =>
        certificate ? <Tag color="gold">Yes</Tag> : <span style={{ opacity: 0.5 }}>No</span>,
    },
    {
      title: 'Mandatory',
      dataIndex: 'mandatory',
      key: 'mandatory',
      width: 100,
      align: 'center',
      render: (mandatory: boolean) =>
        mandatory ? <Tag color="red">Yes</Tag> : <Tag>No</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_: any, _record: TrainingSession) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Attendees">
            <Button type="text" size="small" icon={<UserOutlined />} />
          </Tooltip>
          <Tooltip title="Materials">
            <Button type="text" size="small" icon={<FileTextOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} training sessions`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 1800 }}
    />
  );
}
