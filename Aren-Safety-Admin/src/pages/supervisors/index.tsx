import React, { useState, useMemo } from 'react';
import { Card, Table, Space, Button, Popconfirm, message, Input, Typography, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/theme-provider';
import { useSupervisors, useDeleteSupervisor } from '@/features/supervisors/api';
import { useProjectCodesAPI } from '@/features/project-codes/api';
import { useObservations } from '@/features/observations/api';
import type { Supervisor } from '@/shared/types/supervisor';
import { CreateSupervisorModal } from './components/CreateSupervisorModal';
import { EditSupervisorModal } from './components/EditSupervisorModal';
import { SupervisorCharts } from './components/SupervisorCharts';
import { ExportButtons } from '@/shared/components/ExportButtons';
import { exportToExcel, exportToPDF, printTable, prepareDataForExport } from '@/shared/utils/exportUtils';
import type { ExportType } from '@/shared/components/ExportButtons';

const { Title, Text } = Typography;
const { Search } = Input;

const SupervisorsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [searchText, setSearchText] = useState('');

  const { data: supervisors = [], isLoading } = useSupervisors();
  const { data: projectCodes = [] } = useProjectCodesAPI();
  const { data: observations = [] } = useObservations();
  const deleteMutation = useDeleteSupervisor();

  // Get project title by code
  const getProjectTitle = (code: string) => {
    const project = projectCodes.find((pc) => pc.code === code);
    if (!project) return code;

    return i18n.language === 'ru'
      ? project.title_ru
      : i18n.language === 'tr'
      ? project.title_tr
      : project.title_en;
  };

  // Calculate supervisor statistics
  const supervisorStats = useMemo(() => {
    return supervisors.map((supervisor) => {
      const supervisorObservations = observations.filter(
        (obs) => obs.supervisorId === supervisor.id
      );
      const respondedObservations = supervisorObservations.filter(
        (obs) => obs.supervisorResponse
      );
      const pendingObservations = supervisorObservations.filter(
        (obs) => !obs.supervisorResponse
      );

      return {
        ...supervisor,
        totalObservations: supervisorObservations.length,
        respondedCount: respondedObservations.length,
        pendingCount: pendingObservations.length,
      };
    });
  }, [supervisors, observations]);

  // Filter supervisors by search
  const filteredSupervisors = useMemo(() => {
    if (!searchText) return supervisorStats;

    const searchLower = searchText.toLowerCase();
    return supervisorStats.filter(
      (supervisor) =>
        supervisor.firstName?.toLowerCase().includes(searchLower) ||
        supervisor.lastName?.toLowerCase().includes(searchLower) ||
        supervisor.login?.toLowerCase().includes(searchLower) ||
        supervisor.email?.toLowerCase().includes(searchLower) ||
        supervisor.position?.toLowerCase().includes(searchLower) ||
        supervisor.department?.toLowerCase().includes(searchLower)
    );
  }, [supervisorStats, searchText]);

  const handleEdit = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success(t('supervisors.deleteSuccess'));
    } catch (error) {
      message.error(t('supervisors.deleteError'));
    }
  };

  const handleExport = (type: ExportType) => {
    const exportData = prepareDataForExport(
      filteredSupervisors.map((sup) => ({
        [t('supervisors.table.fullName')]: `${sup.firstName} ${sup.lastName}`,
        [t('supervisors.table.login')]: sup.login,
        [t('supervisors.table.email')]: sup.email || '-',
        [t('supervisors.table.position')]: sup.position,
        [t('supervisors.table.department')]: sup.department || '-',
        [t('supervisors.table.phone')]: sup.phone || '-',
        [t('supervisors.table.projects')]: sup.projectIds
          .map((code) => getProjectTitle(code))
          .join(', '),
        [t('supervisors.export.totalObservations')]: sup.totalObservations,
        [t('supervisors.export.responded')]: sup.respondedCount,
        [t('supervisors.export.pending')]: sup.pendingCount,
      })),
      []
    );

    switch (type) {
      case 'excel':
        exportToExcel(exportData, 'supervisors', 'Supervisors');
        break;
      case 'pdf':
        exportToPDF('supervisors-table', 'supervisors');
        break;
      case 'print':
        printTable('supervisors-table');
        break;
    }
  };

  const columns = [
    {
      title: t('supervisors.table.fullName'),
      key: 'fullName',
      fixed: 'left' as const,
      width: 200,
      render: (_: unknown, record: Supervisor) => (
        <Text strong>{`${record.firstName} ${record.lastName}`}</Text>
      ),
    },
    {
      title: t('supervisors.table.login'),
      dataIndex: 'login',
      key: 'login',
      width: 150,
    },
    {
      title: t('supervisors.table.email'),
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email: string) => email || '-',
    },
    {
      title: t('supervisors.table.position'),
      dataIndex: 'position',
      key: 'position',
      width: 180,
    },
    {
      title: t('supervisors.table.department'),
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (department: string) => department || '-',
    },
    {
      title: t('supervisors.table.phone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone: string) => phone || '-',
    },
    {
      title: t('supervisors.table.projects'),
      key: 'projects',
      width: 300,
      render: (_: unknown, record: Supervisor) => (
        <Text ellipsis={{ tooltip: true }}>
          {record.projectIds.map((code) => getProjectTitle(code)).join(', ')}
        </Text>
      ),
    },
    {
      title: t('supervisors.table.totalObservations'),
      key: 'totalObservations',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: any) => (
        <Text>{record.totalObservations || 0}</Text>
      ),
    },
    {
      title: t('supervisors.table.responded'),
      key: 'respondedCount',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: any) => (
        <Text type="success">{record.respondedCount || 0}</Text>
      ),
    },
    {
      title: t('supervisors.table.pending'),
      key: 'pendingCount',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: any) => (
        <Text type="warning">{record.pendingCount || 0}</Text>
      ),
    },
    {
      title: t('supervisors.table.actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: unknown, record: Supervisor) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('supervisors.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ marginBottom: '8px' }}>
              {t('supervisors.title')}
            </Title>
            <Text style={{ color: isDarkMode ? '#a0a0a0' : '#666' }}>
              {t('supervisors.subtitle')}
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
                size="large"
              >
                {t('supervisors.createSupervisor')}
              </Button>
              <ExportButtons onExport={handleExport} disabled={isLoading} />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: '24px' }}>
        <Search
          placeholder={t('supervisors.searchPlaceholder')}
          prefix={<SearchOutlined />}
          allowClear
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 500 }}
        />
      </Card>

      {/* Supervisors Table */}
      <Card id="supervisors-table" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={filteredSupervisors}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => t('supervisors.table.total', { total }),
          }}
        />
      </Card>

      {/* Charts */}
      <SupervisorCharts supervisors={supervisorStats} observations={observations} />

      {/* Create Supervisor Modal */}
      <CreateSupervisorModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
        }}
      />

      {/* Edit Supervisor Modal */}
      {selectedSupervisor && (
        <EditSupervisorModal
          open={isEditModalOpen}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedSupervisor(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedSupervisor(null);
          }}
          supervisor={selectedSupervisor}
        />
      )}
    </div>
  );
};

export default SupervisorsPage;
