import { Space, Button } from 'antd';
import { PlusOutlined, FilterOutlined, FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Header = styled.div`
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

interface PageHeaderProps {
  isDark: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onNewObservation: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}

export function PageHeader({
  isDark,
  showFilters,
  onToggleFilters,
  onNewObservation,
  onExportExcel,
  onExportPDF,
  onPrint,
}: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <Header>
      <HeaderLeft>
        <PageTitle $isDark={isDark}>{t('observations.page.title')}</PageTitle>
        <PageSubtitle $isDark={isDark}>{t('observations.page.subtitle')}</PageSubtitle>
      </HeaderLeft>
      <Space size={12}>
        <StyledButton icon={<FileExcelOutlined />} onClick={onExportExcel}>
          {t('common.buttons.excel')}
        </StyledButton>
        <StyledButton icon={<FilePdfOutlined />} onClick={onExportPDF}>
          {t('common.buttons.pdf')}
        </StyledButton>
        <StyledButton icon={<PrinterOutlined />} onClick={onPrint}>
          {t('common.buttons.print')}
        </StyledButton>
        <StyledButton icon={<FilterOutlined />} onClick={onToggleFilters}>
          {showFilters ? t('common.buttons.hideFilters') : t('common.buttons.showFilters')}
        </StyledButton>
        <StyledButton type="primary" icon={<PlusOutlined />} onClick={onNewObservation}>
          {t('common.buttons.newObservation')}
        </StyledButton>
      </Space>
    </Header>
  );
}
