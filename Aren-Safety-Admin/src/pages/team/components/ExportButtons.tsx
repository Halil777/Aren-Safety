import React from 'react';
import { Button, Space } from 'antd';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';
import type { ExportType } from '../types';

interface ExportButtonsProps {
  onExport: (type: ExportType) => void;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ onExport }) => {
  return (
    <Space>
      <Button
        icon={<FileSpreadsheet size={16} />}
        onClick={() => onExport('excel')}
        style={{ color: '#52c41a' }}
      >
        Excel
      </Button>
      <Button
        icon={<FileText size={16} />}
        onClick={() => onExport('pdf')}
        style={{ color: '#ff4d4f' }}
      >
        PDF
      </Button>
      <Button icon={<Printer size={16} />} onClick={() => onExport('print')}>
        Print
      </Button>
    </Space>
  );
};
