import { Select, DatePicker, Row, Col } from 'antd';
import styled from 'styled-components';

const FilterContainer = styled.div`
  width: 100%;
`;

interface DepartmentFiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
}

export function DepartmentFilters({ onFilterChange }: DepartmentFiltersProps) {
  return (
    <FilterContainer>
      <Row gutter={[16, 16]}>
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
            placeholder="Görevi"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange?.({ task: value })}
          >
            <Select.Option value="uretim">Üretim</Select.Option>
            <Select.Option value="kontrol">Kontrol</Select.Option>
            <Select.Option value="bakim-onarim">Bakım Onarım</Select.Option>
            <Select.Option value="yonetim">Yönetim</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder="Uygunsuzluk Üst Kategorisi"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange?.({ upperCategory: value })}
          >
            <Select.Option value="isg">İSG</Select.Option>
            <Select.Option value="kalite">Kalite</Select.Option>
            <Select.Option value="ekipman">Ekipman</Select.Option>
            <Select.Option value="cevre">Çevre</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Select
            placeholder="Uygunsuzluk Alt Kategorisi"
            style={{ width: '100%' }}
            allowClear
            onChange={(value) => onFilterChange?.({ lowerCategory: value })}
          >
            <Select.Option value="kkd">KKD</Select.Option>
            <Select.Option value="dokumantasyon">Dokümantasyon</Select.Option>
            <Select.Option value="makine">Makine</Select.Option>
            <Select.Option value="prosedur">Prosedür</Select.Option>
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
