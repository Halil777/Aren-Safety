import { Form, Row, Col, Select, DatePicker, Button, Switch } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import type { TrainingFiltersType } from '../types';

const { RangePicker } = DatePicker;

const FiltersContainer = styled.div`
  padding: 20px;
`;

const FilterActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
`;

interface TrainingFiltersProps {
  onFilterChange: (filters: TrainingFiltersType) => void;
}

export function TrainingFilters({ onFilterChange }: TrainingFiltersProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleApplyFilters = () => {
    const values = form.getFieldsValue();
    const filters: TrainingFiltersType = {
      dateRange: values.dateRange
        ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')]
        : undefined,
      type: values.type,
      status: values.status,
      department: values.department,
      mandatory: values.mandatory,
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFilterChange({});
  };

  const trainingTypes = [
    { value: 'safety-induction', label: 'Safety Induction' },
    { value: 'equipment-training', label: 'Equipment Training' },
    { value: 'emergency-response', label: 'Emergency Response' },
    { value: 'compliance-training', label: 'Compliance Training' },
    { value: 'skill-development', label: 'Skill Development' },
    { value: 'refresher-course', label: 'Refresher Course' },
  ];

  const trainingStatuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const departments = [
    { value: 'construction', label: t('observations.filtersOptions.departments.construction', 'Construction') },
    { value: 'logistics', label: t('observations.filtersOptions.departments.logistics', 'Logistics') },
    { value: 'manufacturing', label: t('observations.filtersOptions.departments.manufacturing', 'Manufacturing') },
    { value: 'warehouse', label: t('observations.filtersOptions.departments.warehouse', 'Warehouse') },
    { value: 'engineering', label: t('observations.filtersOptions.departments.engineering', 'Engineering') },
    { value: 'maintenance', label: t('observations.filtersOptions.departments.maintenance', 'Maintenance') },
  ];

  return (
    <FiltersContainer>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="dateRange" label="Date Range">
              <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder={['Start Date', 'End Date']} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="type" label="Training Type">
              <Select placeholder="Select type" allowClear options={trainingTypes} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select status" allowClear options={trainingStatuses} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="department" label="Department">
              <Select placeholder="Select department" allowClear options={departments} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="mandatory" label="Mandatory Only" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <FilterActions>
          <Button icon={<ClearOutlined />} onClick={handleReset}>
            Clear Filters
          </Button>
          <Button type="primary" icon={<FilterOutlined />} onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </FilterActions>
      </Form>
    </FiltersContainer>
  );
}
