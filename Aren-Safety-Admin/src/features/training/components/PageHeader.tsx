import { Space, Button, Upload, message } from 'antd';
import {
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  UploadOutlined,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import type { UploadProps } from 'antd';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
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
      ? 'linear-gradient(135deg, #a5b4fc 0%, #67e8f9 100%)'
      : 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p<{ $isDark: boolean }>`
  margin: 0;
  font-size: 14px;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : '#64748b')};
`;

const StyledButton = styled(Button)`
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

const StyledUpload = styled(Upload)`
  .ant-btn {
    border-radius: 10px !important;
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
  }
`;

interface PageHeaderProps {
  isDark: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onNewTraining: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onUploadExcel: (file: File) => void;
}

export function PageHeader({
  isDark,
  showFilters,
  onToggleFilters,
  onNewTraining,
  onExportExcel,
  onExportPDF,
  onPrint,
  onUploadExcel,
}: PageHeaderProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xlsx,.xls,.csv',
    showUploadList: false,
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/csv';

      if (!isExcel) {
        message.error('You can only upload Excel or CSV files!');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }

      onUploadExcel(file);
      message.success(`${file.name} uploaded successfully`);
      return false; // Prevent auto upload
    },
  };

  return (
    <Header>
      <HeaderLeft>
        <PageTitle $isDark={isDark}>Training Management</PageTitle>
        <PageSubtitle $isDark={isDark}>
          Manage safety training programs and track employee certifications
        </PageSubtitle>
      </HeaderLeft>
      <Space size={12} wrap>
        <StyledUpload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Excel</Button>
        </StyledUpload>
        <StyledButton icon={<FileExcelOutlined />} onClick={onExportExcel}>
          Excel
        </StyledButton>
        <StyledButton icon={<FilePdfOutlined />} onClick={onExportPDF}>
          PDF
        </StyledButton>
        <StyledButton icon={<PrinterOutlined />} onClick={onPrint}>
          Print
        </StyledButton>
        <StyledButton icon={<FilterOutlined />} onClick={onToggleFilters}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </StyledButton>
        <StyledButton type="primary" icon={<PlusOutlined />} onClick={onNewTraining}>
          New Training
        </StyledButton>
      </Space>
    </Header>
  );
}
