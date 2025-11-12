import { Select, DatePicker, Row, Col } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useProjectCodesQuery } from '@/features/tenant/api/project-codes';
import { useDepartmentsQuery } from '@/features/tenant/api/departments';
import type {
  ObservationFilterParams,
  ObservationTask,
  ObservationUpperCategory,
  ObservationLowerCategory,
  NonconformityType,
} from '../types';

const FilterContainer = styled.div`
  width: 100%;
`;

const TASKS: ObservationTask[] = ['production', 'inspection', 'maintenance_repair', 'management'];
const UPPER_CATEGORIES: ObservationUpperCategory[] = ['hse', 'quality', 'equipment', 'environment'];
const LOWER_CATEGORIES: ObservationLowerCategory[] = ['ppe', 'documentation', 'machinery', 'procedure'];
const NONCONFORMITY_TYPES: NonconformityType[] = ['safety', 'procedure', 'equipment', 'environment'];

interface ObservationFiltersProps {
  onFilterChange?: (filters: Partial<ObservationFilterParams>) => void;
}

export function ObservationFilters({ onFilterChange }: ObservationFiltersProps) {
  const { t, i18n } = useTranslation();
  const [currentFilters, setCurrentFilters] = useState<Partial<ObservationFilterParams>>({});

  // Fetch dynamic project codes and departments
  const { data: projectCodes = [] } = useProjectCodesQuery();
  const { data: departments = [] } = useDepartmentsQuery();

  // Get current language for multilingual display
  const currentLang = i18n.language || 'en';

  const updateFilter = <K extends keyof ObservationFilterParams>(key: K, value?: ObservationFilterParams[K]) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <FilterContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder={t('observations.filters.projectCode')}
            style={{ width: '100%' }}
            allowClear
            showSearch
            value={currentFilters.projectCode}
            onChange={(value) => updateFilter('projectCode', value)}
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
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder={t('observations.filters.department')}
            style={{ width: '100%' }}
            allowClear
            value={currentFilters.department}
            onChange={(value) => updateFilter('department', value)}
          >
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
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder={t('observations.filters.task')}
            style={{ width: '100%' }}
            allowClear
            value={currentFilters.task}
            onChange={(value) => updateFilter('task', value)}
          >
            {TASKS.map((task) => (
              <Select.Option key={task} value={task}>
                {t(`observations.filtersOptions.tasks.${task}`)}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder={t('observations.filters.upperCategory')}
            style={{ width: '100%' }}
            allowClear
            value={currentFilters.upperCategory}
            onChange={(value) => updateFilter('upperCategory', value)}
          >
            {UPPER_CATEGORIES.map((category) => (
              <Select.Option key={category} value={category}>
                {t(`observations.filtersOptions.upperCategories.${category}`)}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder={t('observations.filters.lowerCategory')}
            style={{ width: '100%' }}
            allowClear
            value={currentFilters.lowerCategory}
            onChange={(value) => updateFilter('lowerCategory', value)}
          >
            {LOWER_CATEGORIES.map((category) => (
              <Select.Option key={category} value={category}>
                {t(`observations.filtersOptions.lowerCategories.${category}`)}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder={t('observations.filters.nonconformityType')}
            style={{ width: '100%' }}
            allowClear
            value={currentFilters.nonconformityType}
            onChange={(value) => updateFilter('nonconformityType', value)}
          >
            {NONCONFORMITY_TYPES.map((type) => (
              <Select.Option key={type} value={type}>
                {t(`observations.filtersOptions.nonconformity.${type}`)}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={6}>
          <DatePicker.RangePicker
            placeholder={[t('observations.filters.dateRangeStart'), t('observations.filters.dateRangeEnd')]}
            style={{ width: '100%' }}
            onChange={(_, dateStrings) => {
              const [start, end] = dateStrings;
              const newFilters = {
                ...currentFilters,
                startDate: start || undefined,
                endDate: end || undefined
              };
              setCurrentFilters(newFilters);
              onFilterChange?.(newFilters);
            }}
          />
        </Col>
      </Row>
    </FilterContainer>
  );
}
