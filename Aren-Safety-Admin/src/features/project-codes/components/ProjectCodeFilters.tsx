import { Select, DatePicker, Row, Col, Input } from 'antd';
import styled from 'styled-components';

const FilterContainer = styled.div`
  width: 100%;
`;

interface ProjectCodeFiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
}

export function ProjectCodeFilters({ onFilterChange }: ProjectCodeFiltersProps) {
  return (
    <FilterContainer>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Input
            placeholder="Proje Kodu"
            allowClear
            onChange={(e) => onFilterChange?.({ code: e.target.value })}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Input
            placeholder="Müşteri"
            allowClear
            onChange={(e) => onFilterChange?.({ client: e.target.value })}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder="Departman"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange?.({ department: value })}
          >
            <Select.Option value="imalat">İmalat</Select.Option>
            <Select.Option value="kalite">Kalite</Select.Option>
            <Select.Option value="bakim">Bakım</Select.Option>
            <Select.Option value="yonetim">Yönetim</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder="Durum"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange?.({ status: value })}
          >
            <Select.Option value="ACTIVE">Aktif</Select.Option>
            <Select.Option value="COMPLETED">Tamamlandı</Select.Option>
            <Select.Option value="ON_HOLD">Beklemede</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={6}>
          <DatePicker.RangePicker
            placeholder={['Başlangıç Tarihi', 'Bitiş Tarihi']}
            style={{ width: '100%' }}
            onChange={(_, dateStrings) => onFilterChange?.({
              startDate: dateStrings[0],
              endDate: dateStrings[1]
            })}
          />
        </Col>
      </Row>
    </FilterContainer>
  );
}
