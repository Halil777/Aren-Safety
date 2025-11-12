import { Button, Space } from 'antd';
import { FilePdfOutlined, FileImageOutlined, PrinterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface ChartActionsProps {
  onExportPDF: () => void;
  onExportImage?: () => void;
  onPrint: () => void;
}

export function ChartActions({ onExportPDF, onExportImage, onPrint }: ChartActionsProps) {
  const { t } = useTranslation();

  return (
    <Space size={8}>
      <Button size="small" icon={<FilePdfOutlined />} onClick={onExportPDF}>
        {t('common.buttons.pdf')}
      </Button>
      {onExportImage && (
        <Button size="small" icon={<FileImageOutlined />} onClick={onExportImage}>
          {t('common.buttons.jpg')}
        </Button>
      )}
      <Button size="small" icon={<PrinterOutlined />} onClick={onPrint}>
        {t('common.buttons.print')}
      </Button>
    </Space>
  );
}
