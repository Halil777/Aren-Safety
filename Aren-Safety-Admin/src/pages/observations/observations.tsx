import { useState } from "react";
import { Table, Button, Space, Tag, Select, DatePicker, Card } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { useTheme } from "@/app/providers/theme-provider";

const PageContainer = styled.div<{ $isDark: boolean }>`
  padding: 32px;
  min-height: calc(100vh - 72px);
  background: ${({ $isDark }) => ($isDark ? "#0a0f1e" : "#fafbfc")};
  transition: all 0.3s ease;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #a5b4fc 0%, #67e8f9 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p<{ $isDark: boolean }>`
  margin: 0;
  font-size: 14px;
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#64748b")};
`;

const FilterSection = styled(Card)<{ $isDark: boolean }>`
  margin-bottom: 24px;
  border-radius: 16px;
  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#ffffff")};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 4px 16px rgba(15, 23, 42, 0.04)"};
  transition: all 0.3s ease;

  .ant-card-body {
    padding: 20px;
  }

  &:hover {
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? "0 8px 24px rgba(0, 0, 0, 0.4)"
        : "0 8px 24px rgba(15, 23, 42, 0.08)"};
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)<{ $isDark?: boolean }>`
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  height: 40px;
  padding: 0 20px;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled(Card)<{ $isDark: boolean; showFilters: boolean }>`
  border-radius: 16px;
  margin-top: ${({ showFilters }) => (showFilters ? "0" : "0")};
  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.8)"};
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#ffffff")};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 4px 16px rgba(15, 23, 42, 0.04)"};
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  .ant-table-wrapper {
    border-radius: 16px;
  }
`;

interface Observation {
  key: string;
  id: string;
  projectCode: string;
  nameSurname: string;
  department: string;
  nonconformityType: string;
  observationDate: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  status: "AÇIK" | "KAPALI";
  deadline: "ZAMANINDA" | "GECIKMELI";
  task?: string;
  upperCategory?: string;
  lowerCategory?: string;
}

export function ObservationsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Sample data
  const data: Observation[] = [
    {
      key: "1",
      id: "0007071232",
      projectCode: "PRJ-001",
      nameSurname: "Ahmet Yılmaz",
      department: "İmalat",
      nonconformityType: "Güvenlik",
      observationDate: "18.10.2025",
      riskLevel: 4,
      status: "AÇIK",
      deadline: "ZAMANINDA",
      task: "Üretim",
      upperCategory: "İSG",
      lowerCategory: "KKD",
    },
    {
      key: "2",
      id: "0001019876",
      projectCode: "PRJ-002",
      nameSurname: "Ayşe Demir",
      department: "Kalite",
      nonconformityType: "Prosedür",
      observationDate: "17.10.2025",
      riskLevel: 2,
      status: "KAPALI",
      deadline: "GECIKMELI",
      task: "Kontrol",
      upperCategory: "Kalite",
      lowerCategory: "Dokümantasyon",
    },
    {
      key: "3",
      id: "0008123456",
      projectCode: "PRJ-003",
      nameSurname: "Mehmet Kaya",
      department: "Bakım",
      nonconformityType: "Ekipman",
      observationDate: "19.10.2025",
      riskLevel: 5,
      status: "AÇIK",
      deadline: "ZAMANINDA",
      task: "Bakım Onarım",
      upperCategory: "Ekipman",
      lowerCategory: "Makine",
    },
  ];

  const columns: ColumnsType<Observation> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: "left",
      align: "center",
    },
    {
      title: "PROJE KODU",
      dataIndex: "projectCode",
      key: "projectCode",
      width: 130,
    },
    {
      title: "ADI SOYADI",
      dataIndex: "nameSurname",
      key: "nameSurname",
      width: 150,
    },
    {
      title: "DEPARTMAN",
      dataIndex: "department",
      key: "department",
      width: 130,
    },
    {
      title: "UYGUNSUZLUK TIPI",
      dataIndex: "nonconformityType",
      key: "nonconformityType",
      width: 170,
    },
    {
      title: "OBSERVATION DATE",
      dataIndex: "observationDate",
      key: "observationDate",
      width: 150,
    },
    {
      title: "RISK SEVIYESI",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 130,
      align: "center",
      render: (level: number) => {
        let color = "default";
        if (level === 5) color = "red";
        else if (level === 4) color = "orange";
        else if (level === 3) color = "gold";
        else if (level === 2) color = "blue";
        else if (level === 1) color = "green";

        return <Tag color={color}>{level}</Tag>;
      },
      filters: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
      ],
      filterMode: "tree",
      filterSearch: false,
      onFilter: (value, record) => record.riskLevel === value,
      sorter: (a, b) => a.riskLevel - b.riskLevel,
    },
    {
      title: "DURUM",
      dataIndex: "status",
      key: "status",
      width: 110,
      align: "center",
      render: (status: string) => {
        const color = status === "AÇIK" ? "red" : "green";
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: "AÇIK", value: "AÇIK" },
        { text: "KAPALI", value: "KAPALI" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "TERMIN",
      dataIndex: "deadline",
      key: "deadline",
      width: 130,
      align: "center",
      render: (deadline: string) => {
        const color = deadline === "ZAMANINDA" ? "green" : "orange";
        return <Tag color={color}>{deadline}</Tag>;
      },
      filters: [
        { text: "ZAMANINDA", value: "ZAMANINDA" },
        { text: "GECIKMELI", value: "GECIKMELI" },
      ],
      onFilter: (value, record) => record.deadline === value,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right",
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            View
          </Button>
          <Button type="link" size="small">
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer $isDark={isDark}>
      <PageHeader>
        <HeaderLeft>
          <PageTitle $isDark={isDark}>Observations</PageTitle>
          <PageSubtitle $isDark={isDark}>
            Manage and track safety observations across your organization
          </PageSubtitle>
        </HeaderLeft>
        <Space size={12}>
          <StyledButton
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </StyledButton>
          <StyledButton type="primary" icon={<PlusOutlined />}>
            New Observation
          </StyledButton>
        </Space>
      </PageHeader>

      {showFilters && (
        <FilterSection $isDark={isDark}>
          <FilterRow>
            <Select
              placeholder="Proje Kodu"
              style={{ width: 180 }}
              allowClear
              showSearch
            >
              <Select.Option value="PRJ-001">PRJ-001</Select.Option>
              <Select.Option value="PRJ-002">PRJ-002</Select.Option>
              <Select.Option value="PRJ-003">PRJ-003</Select.Option>
              <Select.Option value="PRJ-004">PRJ-004</Select.Option>
              <Select.Option value="PRJ-005">PRJ-005</Select.Option>
            </Select>
            <Select placeholder="Departman" style={{ width: 180 }} allowClear>
              <Select.Option value="imalat">İmalat</Select.Option>
              <Select.Option value="kalite">Kalite</Select.Option>
              <Select.Option value="bakim">Bakım</Select.Option>
              <Select.Option value="yonetim">Yönetim</Select.Option>
            </Select>
            <Select placeholder="Görevi" style={{ width: 180 }} allowClear>
              <Select.Option value="uretim">Üretim</Select.Option>
              <Select.Option value="kontrol">Kontrol</Select.Option>
              <Select.Option value="bakim-onarim">Bakım Onarım</Select.Option>
              <Select.Option value="yonetim">Yönetim</Select.Option>
            </Select>
            <Select
              placeholder="Uygunsuzluk Üst Kategorisi"
              style={{ width: 220 }}
              allowClear
            >
              <Select.Option value="isg">İSG</Select.Option>
              <Select.Option value="kalite">Kalite</Select.Option>
              <Select.Option value="ekipman">Ekipman</Select.Option>
              <Select.Option value="cevre">Çevre</Select.Option>
            </Select>
            <Select
              placeholder="Uygunsuzluk Alt Kategorisi"
              style={{ width: 220 }}
              allowClear
            >
              <Select.Option value="kkd">KKD</Select.Option>
              <Select.Option value="dokumantasyon">Dokümantasyon</Select.Option>
              <Select.Option value="makine">Makine</Select.Option>
              <Select.Option value="prosedur">Prosedür</Select.Option>
            </Select>
            <DatePicker
              placeholder="Gözlem Açma Tarihi"
              style={{ width: 200 }}
            />
          </FilterRow>
        </FilterSection>
      )}

      <TableContainer $isDark={isDark} showFilters={showFilters}>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} observations`,
            position: ["bottomCenter"],
          }}
        />
      </TableContainer>
    </PageContainer>
  );
}
