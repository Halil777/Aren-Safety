import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/theme-provider';
import {
  ObservationFilters,
  ObservationTable,
  PageHeader as ObservationPageHeader,
} from '@/features/observations/components';
import {
  PageContainer,
  FilterSection,
  TableContainer,
} from '@/features/observations/components/ObservationsPage.styles';
import { ObservationCharts } from '@/features/observations/components/ObservationCharts';
import { useObservations, useCreateObservation, useUpdateObservation, useDeleteObservation } from '@/features/observations/api';
import type { Observation, ObservationFilterParams } from '@/features/observations';
import { exportToExcel, exportToPDF, printTable } from '@/shared/utils/export-utils';
import { Drawer, Form, Input, Select, DatePicker, InputNumber, notification, Modal } from 'antd';
const { TextArea } = Input;
import { useProjectCodesQuery } from '@/features/tenant/api/project-codes';
import { useDepartmentsQuery } from '@/features/tenant/api/departments';
import dayjs from 'dayjs';

const TASKS = ['production', 'inspection', 'maintenance_repair', 'management'];
const UPPER_CATEGORIES = ['hse', 'quality', 'equipment', 'environment'];
const LOWER_CATEGORIES = ['ppe', 'documentation', 'machinery', 'procedure'];
const NONCONFORMITY_TYPES = ['safety', 'procedure', 'equipment', 'environment'];
const STATUS_OPTIONS = ['open', 'closed'];
const DEADLINE_OPTIONS = ['on_time', 'delayed'];

export function ObservationsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ObservationFilterParams | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';

  const { data = [], isLoading } = useObservations(filters);
  const createObservation = useCreateObservation();
  const updateObservation = useUpdateObservation();
  const deleteObservation = useDeleteObservation();
  const { data: projectCodes = [] } = useProjectCodesQuery();
  const { data: departments = [] } = useDepartmentsQuery();

  const currentLang = i18n.language || 'en';

  const handleFilterChange = (newFilters: ObservationFilterParams) => {
    setFilters(newFilters);
  };

  const handleNewObservation = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createObservation.mutateAsync({
        ...values,
        observationDate: values.observationDate ? dayjs(values.observationDate).format('YYYY-MM-DD') : undefined,
      });
      notification.success({ message: t('observations.messages.createSuccess'), placement: 'topRight' });
      handleDrawerClose();
    } catch (error) {
      console.error('Failed to create observation:', error);
      notification.error({ message: t('observations.messages.createError'), placement: 'topRight' });
    }
  };

  const handleView = (record: Observation) => {
    setSelectedObservation(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: Observation) => {
    setSelectedObservation(record);
    editForm.setFieldsValue({
      ...record,
      observationDate: record.observationDate ? dayjs(record.observationDate) : null,
    });
    setEditDrawerOpen(true);
  };

  const handleDelete = (record: Observation) => {
    Modal.confirm({
      title: t('observations.messages.deleteConfirmTitle'),
      content: t('observations.messages.deleteConfirmContent', { id: record.id }),
      okText: t('observations.buttons.delete'),
      okType: 'danger',
      cancelText: t('observations.buttons.cancel'),
      onOk: async () => {
        try {
          await deleteObservation.mutateAsync(record.id);
          notification.success({ message: t('observations.messages.deleteSuccess'), placement: 'topRight' });
        } catch (error) {
          notification.error({ message: t('observations.messages.deleteError'), placement: 'topRight' });
        }
      },
    });
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selectedObservation) return;
      // Exclude id from the update payload
      const { id, ...updateData } = values;
      await updateObservation.mutateAsync({
        id: selectedObservation.id,
        observationData: {
          ...updateData,
          observationDate: updateData.observationDate ? dayjs(updateData.observationDate).format('YYYY-MM-DD') : undefined,
        },
      });
      notification.success({ message: t('observations.messages.updateSuccess'), placement: 'topRight' });
      setEditDrawerOpen(false);
      editForm.resetFields();
      setSelectedObservation(null);
    } catch (error) {
      console.error('Failed to update observation:', error);
      notification.error({ message: t('observations.messages.updateError'), placement: 'topRight' });
    }
  };

  const exportColumns = useMemo(
    () => [
      { header: t('observations.table.columns.id'), dataIndex: 'id' },
      { header: t('observations.table.columns.projectCode'), dataIndex: 'projectCode' },
      { header: t('observations.table.columns.nameSurname'), dataIndex: 'nameSurname' },
      {
        header: t('observations.table.columns.department'),
        dataIndex: 'department',
        render: (value: unknown) =>
          t(`observations.filtersOptions.departments.${(value as Observation['department']) ?? 'other'}`),
      },
      {
        header: t('observations.table.columns.nonconformityType'),
        dataIndex: 'nonconformityType',
        render: (value: unknown) =>
          t(`observations.filtersOptions.nonconformity.${(value as Observation['nonconformityType']) ?? 'other'}`),
      },
      { header: t('observations.table.columns.observationDate'), dataIndex: 'observationDate' },
      { header: t('observations.table.columns.riskLevel'), dataIndex: 'riskLevel' },
      {
        header: t('observations.table.columns.status'),
        dataIndex: 'status',
        render: (value: unknown) => t(`observations.status.${value as Observation['status']}`),
      },
      {
        header: t('observations.table.columns.deadline'),
        dataIndex: 'deadline',
        render: (value: unknown) => t(`observations.deadline.${value as Observation['deadline']}`),
      },
    ],
    [t],
  );

  const exportConfig = {
    filename: 'observations',
    title: t('observations.export.title'),
    columns: exportColumns,
    data,
  };

  const handleExportExcel = () => {
    exportToExcel({ ...exportConfig, data: data as unknown as Record<string, unknown>[] });
  };

  const handleExportPDF = () => {
    exportToPDF({ ...exportConfig, data: data as unknown as Record<string, unknown>[] });
  };

  const handlePrint = () => {
    printTable({ ...exportConfig, data: data as unknown as Record<string, unknown>[] });
  };

  return (
    <PageContainer $isDark={isDark}>
      <ObservationPageHeader
        isDark={isDark}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onNewObservation={handleNewObservation}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
      />

      {showFilters && (
        <FilterSection $isDark={isDark}>
          <ObservationFilters onFilterChange={handleFilterChange} />
        </FilterSection>
      )}

      <TableContainer $isDark={isDark} $showFilters={showFilters}>
        <ObservationTable
          data={data}
          loading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TableContainer>

      <ObservationCharts data={data} isDark={isDark} />

      {/* Create Observation Drawer */}
      <Drawer
        title={t('observations.drawers.create')}
        placement="right"
        width={600}
        onClose={handleDrawerClose}
        open={drawerOpen}
        footer={
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={handleDrawerClose}
              style={{
                marginRight: 8,
                padding: '8px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {t('observations.buttons.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: '#1890ff',
                color: 'white',
                cursor: 'pointer',
              }}
              disabled={createObservation.isPending}
            >
              {createObservation.isPending ? t('observations.buttons.creating') : t('observations.buttons.create')}
            </button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label={t('observations.form.labels.workerId')}
            rules={[
              { required: true, message: t('observations.form.validation.workerIdRequired') },
              { pattern: /^\d{10}$/, message: t('observations.form.validation.workerIdPattern') }
            ]}
          >
            <Input placeholder={t('observations.form.placeholders.workerId')} maxLength={10} />
          </Form.Item>

          <Form.Item
            name="projectCode"
            label={t('observations.form.labels.projectCode')}
            rules={[{ required: true, message: t('observations.form.validation.projectCodeRequired') }]}
          >
            <Select
              placeholder={t('observations.form.placeholders.projectCode')}
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {projectCodes.map((project) => (
                <Select.Option key={project.id} value={project.code}>
                  {project.code} - {
                    currentLang === 'ru' ? project.title_ru :
                    currentLang === 'tr' ? project.title_tr :
                    project.title_en
                  }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nameSurname"
            label={t('observations.form.labels.nameSurname')}
            rules={[{ required: true, message: t('observations.form.validation.nameSurnameRequired') }]}
          >
            <Input placeholder={t('observations.form.placeholders.nameSurname')} />
          </Form.Item>

          <Form.Item
            name="department"
            label={t('observations.form.labels.department')}
            rules={[{ required: true, message: t('observations.form.validation.departmentRequired') }]}
          >
            <Select placeholder={t('observations.form.placeholders.department')}>
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.title_en}>
                  {
                    currentLang === 'ru' ? dept.title_ru :
                    currentLang === 'tr' ? dept.title_tr :
                    dept.title_en
                  }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nonconformityType"
            label={t('observations.form.labels.nonconformityType')}
            rules={[{ required: true, message: t('observations.form.validation.nonconformityTypeRequired') }]}
          >
            <Select placeholder={t('observations.form.placeholders.nonconformityType')}>
              {NONCONFORMITY_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {t(`observations.filtersOptions.nonconformity.${type}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="observationDate"
            label={t('observations.form.labels.observationDate')}
            rules={[{ required: true, message: t('observations.form.validation.observationDateRequired') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="riskLevel"
            label={t('observations.form.labels.riskLevel')}
            rules={[{ required: true, message: t('observations.form.validation.riskLevelRequired') }]}
          >
            <Select placeholder={t('observations.form.placeholders.riskLevel')}>
              <Select.Option value={1}>{t('observations.form.riskLevels.level1')}</Select.Option>
              <Select.Option value={2}>{t('observations.form.riskLevels.level2')}</Select.Option>
              <Select.Option value={3}>{t('observations.form.riskLevels.level3')}</Select.Option>
              <Select.Option value={4}>{t('observations.form.riskLevels.level4')}</Select.Option>
              <Select.Option value={5}>{t('observations.form.riskLevels.level5')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={t('observations.form.labels.status')}
            rules={[{ required: true, message: t('observations.form.validation.statusRequired') }]}
            initialValue="open"
          >
            <Select placeholder="Select status">
              {STATUS_OPTIONS.map((status) => (
                <Select.Option key={status} value={status}>
                  {t(`observations.status.${status}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label={t('observations.form.labels.deadline')}
            rules={[{ required: true, message: t('observations.form.validation.deadlineRequired') }]}
            initialValue="on_time"
          >
            <Select placeholder="Select deadline">
              {DEADLINE_OPTIONS.map((deadline) => (
                <Select.Option key={deadline} value={deadline}>
                  {t(`observations.deadline.${deadline}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="task" label={t('observations.filters.task')}>
            <Select placeholder="Select task (optional)" allowClear>
              {TASKS.map((task) => (
                <Select.Option key={task} value={task}>
                  {t(`observations.filtersOptions.tasks.${task}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="upperCategory" label={t('observations.filters.upperCategory')}>
            <Select placeholder="Select upper category (optional)" allowClear>
              {UPPER_CATEGORIES.map((category) => (
                <Select.Option key={category} value={category}>
                  {t(`observations.filtersOptions.upperCategories.${category}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="lowerCategory" label={t('observations.filters.lowerCategory')}>
            <Select placeholder="Select lower category (optional)" allowClear>
              {LOWER_CATEGORIES.map((category) => (
                <Select.Option key={category} value={category}>
                  {t(`observations.filtersOptions.lowerCategories.${category}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description_en" label={t('observations.form.labels.descriptionEn')}>
            <TextArea
              rows={4}
              placeholder={t('observations.form.placeholders.descriptionEn')}
            />
          </Form.Item>

          <Form.Item name="description_ru" label={t('observations.form.labels.descriptionRu')}>
            <TextArea
              rows={4}
              placeholder={t('observations.form.placeholders.descriptionRu')}
            />
          </Form.Item>

          <Form.Item name="description_tr" label={t('observations.form.labels.descriptionTr')}>
            <TextArea
              rows={4}
              placeholder={t('observations.form.placeholders.descriptionTr')}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Edit Observation Drawer */}
      <Drawer
        title={t('observations.drawers.edit')}
        placement="right"
        width={600}
        onClose={() => {
          setEditDrawerOpen(false);
          editForm.resetFields();
          setSelectedObservation(null);
        }}
        open={editDrawerOpen}
        footer={
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => {
                setEditDrawerOpen(false);
                editForm.resetFields();
                setSelectedObservation(null);
              }}
              style={{
                marginRight: 8,
                padding: '8px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {t('observations.buttons.cancel')}
            </button>
            <button
              onClick={handleEditSubmit}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: '#1890ff',
                color: 'white',
                cursor: 'pointer',
              }}
              disabled={updateObservation.isPending}
            >
              {updateObservation.isPending ? t('observations.buttons.updating') : t('observations.buttons.update')}
            </button>
          </div>
        }
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="id" label={t('observations.form.labels.workerId')}>
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="projectCode"
            label="Project Code"
            rules={[{ required: true, message: 'Please select a project code' }]}
          >
            <Select
              placeholder="Select project code"
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {projectCodes.map((project) => (
                <Select.Option key={project.id} value={project.code}>
                  {project.code} - {
                    currentLang === 'ru' ? project.title_ru :
                    currentLang === 'tr' ? project.title_tr :
                    project.title_en
                  }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nameSurname"
            label={t('observations.form.labels.nameSurname')}
            rules={[{ required: true, message: t('observations.form.validation.nameSurnameRequired') }]}
          >
            <Input placeholder={t('observations.form.placeholders.nameSurname')} />
          </Form.Item>

          <Form.Item
            name="department"
            label={t('observations.form.labels.department')}
            rules={[{ required: true, message: t('observations.form.validation.departmentRequired') }]}
          >
            <Select placeholder={t('observations.form.placeholders.department')}>
              {departments.map((dept) => (
                <Select.Option key={dept.id} value={dept.title_en}>
                  {
                    currentLang === 'ru' ? dept.title_ru :
                    currentLang === 'tr' ? dept.title_tr :
                    dept.title_en
                  }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nonconformityType"
            label={t('observations.form.labels.nonconformityType')}
            rules={[{ required: true, message: t('observations.form.validation.nonconformityTypeRequired') }]}
          >
            <Select placeholder={t('observations.form.placeholders.nonconformityType')}>
              {NONCONFORMITY_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {t(`observations.filtersOptions.nonconformity.${type}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="observationDate"
            label={t('observations.form.labels.observationDate')}
            rules={[{ required: true, message: t('observations.form.validation.observationDateRequired') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="riskLevel"
            label="Risk Level"
            rules={[{ required: true, message: 'Please select risk level' }]}
          >
            <Select placeholder="Select risk level">
              <Select.Option value={1}>1 - Low</Select.Option>
              <Select.Option value={2}>2 - Medium Low</Select.Option>
              <Select.Option value={3}>3 - Medium</Select.Option>
              <Select.Option value={4}>4 - Medium High</Select.Option>
              <Select.Option value={5}>5 - High</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              {STATUS_OPTIONS.map((status) => (
                <Select.Option key={status} value={status}>
                  {t(`observations.status.${status}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: 'Please select deadline status' }]}
          >
            <Select placeholder="Select deadline">
              {DEADLINE_OPTIONS.map((deadline) => (
                <Select.Option key={deadline} value={deadline}>
                  {t(`observations.deadline.${deadline}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="task" label={t('observations.filters.task')}>
            <Select placeholder="Select task (optional)" allowClear>
              {TASKS.map((task) => (
                <Select.Option key={task} value={task}>
                  {t(`observations.filtersOptions.tasks.${task}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="upperCategory" label={t('observations.filters.upperCategory')}>
            <Select placeholder="Select upper category (optional)" allowClear>
              {UPPER_CATEGORIES.map((category) => (
                <Select.Option key={category} value={category}>
                  {t(`observations.filtersOptions.upperCategories.${category}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="lowerCategory" label={t('observations.filters.lowerCategory')}>
            <Select placeholder="Select lower category (optional)" allowClear>
              {LOWER_CATEGORIES.map((category) => (
                <Select.Option key={category} value={category}>
                  {t(`observations.filtersOptions.lowerCategories.${category}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description_en" label={t('observations.form.labels.descriptionEn')}>
            <TextArea
              rows={4}
              placeholder={t('observations.form.placeholders.descriptionEn')}
            />
          </Form.Item>

          <Form.Item name="description_ru" label={t('observations.form.labels.descriptionRu')}>
            <TextArea
              rows={4}
              placeholder={t('observations.form.placeholders.descriptionRu')}
            />
          </Form.Item>

          <Form.Item name="description_tr" label={t('observations.form.labels.descriptionTr')}>
            <TextArea
              rows={4}
              placeholder={t('observations.form.placeholders.descriptionTr')}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* View Observation Drawer */}
      <Drawer
        title={t('observations.drawers.view')}
        placement="right"
        width={600}
        onClose={() => {
          setViewDrawerOpen(false);
          setSelectedObservation(null);
        }}
        open={viewDrawerOpen}
      >
        {selectedObservation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <strong>{t('observations.form.labels.workerId')}:</strong> {selectedObservation.id}
            </div>
            <div>
              <strong>{t('observations.form.labels.projectCode')}:</strong> {selectedObservation.projectCode}
            </div>
            <div>
              <strong>{t('observations.form.labels.nameSurname')}:</strong> {selectedObservation.nameSurname}
            </div>
            <div>
              <strong>{t('observations.form.labels.department')}:</strong> {
                currentLang === 'ru' ? (departments.find(d => d.title_en === selectedObservation.department)?.title_ru || selectedObservation.department) :
                currentLang === 'tr' ? (departments.find(d => d.title_en === selectedObservation.department)?.title_tr || selectedObservation.department) :
                selectedObservation.department
              }
            </div>
            <div>
              <strong>{t('observations.form.labels.nonconformityType')}:</strong> {t(`observations.filtersOptions.nonconformity.${selectedObservation.nonconformityType}`)}
            </div>
            <div>
              <strong>{t('observations.form.labels.observationDate')}:</strong> {selectedObservation.observationDate}
            </div>
            <div>
              <strong>{t('observations.form.labels.riskLevel')}:</strong> {selectedObservation.riskLevel}
            </div>
            <div>
              <strong>{t('observations.form.labels.status')}:</strong> {t(`observations.status.${selectedObservation.status}`)}
            </div>
            <div>
              <strong>{t('observations.form.labels.deadline')}:</strong> {t(`observations.deadline.${selectedObservation.deadline}`)}
            </div>
            {selectedObservation.task && (
              <div>
                <strong>{t('observations.form.labels.task')}:</strong> {t(`observations.filtersOptions.tasks.${selectedObservation.task}`)}
              </div>
            )}
            {selectedObservation.upperCategory && (
              <div>
                <strong>{t('observations.form.labels.upperCategory')}:</strong> {t(`observations.filtersOptions.upperCategories.${selectedObservation.upperCategory}`)}
              </div>
            )}
            {selectedObservation.lowerCategory && (
              <div>
                <strong>{t('observations.form.labels.lowerCategory')}:</strong> {t(`observations.filtersOptions.lowerCategories.${selectedObservation.lowerCategory}`)}
              </div>
            )}
            {selectedObservation.description_en && (
              <div>
                <strong>{t('observations.form.labels.descriptionEn')}:</strong> {selectedObservation.description_en}
              </div>
            )}
            {selectedObservation.description_ru && (
              <div>
                <strong>{t('observations.form.labels.descriptionRu')}:</strong> {selectedObservation.description_ru}
              </div>
            )}
            {selectedObservation.description_tr && (
              <div>
                <strong>{t('observations.form.labels.descriptionTr')}:</strong> {selectedObservation.description_tr}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
}





