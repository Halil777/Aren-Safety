import React from 'react';
import { Button, Space, Dropdown } from 'antd';
import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import type { MenuProps } from 'antd';

export type ExportType = 'excel' | 'pdf' | 'print';

interface ExportButtonsProps {
  onExport: (type: ExportType) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExport,
  loading = false,
  disabled = false,
}) => {
  return (
    <Space size="small">
      <Button
        icon={<FileSpreadsheet size={18} />}
        onClick={() => onExport('excel')}
        loading={loading}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          borderRadius: '6px',
        }}
      >
        Excel
      </Button>
      <Button
        icon={<FileText size={18} />}
        onClick={() => onExport('pdf')}
        loading={loading}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          borderRadius: '6px',
        }}
      >
        PDF
      </Button>
      <Button
        icon={<Printer size={18} />}
        onClick={() => onExport('print')}
        loading={loading}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          borderRadius: '6px',
        }}
      >
        Print
      </Button>
    </Space>
  );
};

// Compact version with dropdown
export const ExportButtonsCompact: React.FC<ExportButtonsProps> = ({
  onExport,
  loading = false,
  disabled = false,
}) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'excel',
      icon: <FileSpreadsheet size={16} />,
      label: 'Export to Excel',
      onClick: () => onExport('excel'),
    },
    {
      key: 'pdf',
      icon: <FileText size={16} />,
      label: 'Export to PDF',
      onClick: () => onExport('pdf'),
    },
    {
      key: 'print',
      icon: <Printer size={16} />,
      label: 'Print',
      onClick: () => onExport('print'),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button
        icon={<Download size={18} />}
        loading={loading}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '36px',
          borderRadius: '6px',
        }}
      >
        Export
      </Button>
    </Dropdown>
  );
};
