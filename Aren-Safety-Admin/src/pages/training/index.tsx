import { useState } from 'react';
import { Card, message } from 'antd';
import styled from 'styled-components';
import { useTheme } from '@/app/providers/theme-provider';
import {
  TrainingStats,
  TrainingTable,
  TrainingFilters,
  PageHeader,
} from '@/features/training';
import { useTrainingSessions } from '@/features/training/api';
import type { TrainingFiltersType } from '@/features/training/types';
import { exportToExcel, exportToPDF, printTable } from '@/shared/utils/export-utils';

const PageContainer = styled.div<{ $isDark: boolean }>`
  padding: 32px;
  min-height: calc(100vh - 72px);
  background: ${({ $isDark }) => ($isDark ? '#0a0f1e' : '#fafbfc')};
  transition: all 0.3s ease;
`;

const FilterSection = styled(Card)<{ $isDark: boolean }>`
  margin-bottom: 24px;
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(15, 23, 42, 0.04)'};
  transition: all 0.3s ease;

  .ant-card-body {
    padding: 0;
  }

  &:hover {
    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(15, 23, 42, 0.08)'};
  }
`;

const TableContainer = styled(Card)<{ $isDark: boolean }>`
  border-radius: 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(15, 23, 42, 0.04)'};
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  .ant-table-wrapper {
    border-radius: 16px;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : '#0f172a')};
`;

export function TrainingPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TrainingFiltersType | undefined>(undefined);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data = [], isLoading } = useTrainingSessions(filters);

  const handleFilterChange = (newFilters: TrainingFiltersType) => {
    setFilters(newFilters);
    message.info('Filters applied successfully');
  };

  const handleNewTraining = () => {
    message.info('Open new training session form');
    // In real app, open modal or navigate to form
  };

  const handleUploadExcel = (file: File) => {
    console.log('Uploading file:', file);
    message.success('Excel file processed successfully');
    // In real app, parse Excel and update data
  };

  // Export data columns
  const exportColumns = [
    { header: 'ID', dataIndex: 'id' },
    { header: 'Title', dataIndex: 'title' },
    { header: 'Type', dataIndex: 'type' },
    { header: 'Status', dataIndex: 'status' },
    { header: 'Instructor', dataIndex: 'instructor' },
    { header: 'Department', dataIndex: 'department' },
    { header: 'Location', dataIndex: 'location' },
    { header: 'Start Date', dataIndex: 'startDate' },
    { header: 'End Date', dataIndex: 'endDate' },
    { header: 'Duration (hours)', dataIndex: 'duration' },
    { header: 'Capacity', dataIndex: 'capacity' },
    { header: 'Enrolled', dataIndex: 'enrolled' },
    { header: 'Completion Rate (%)', dataIndex: 'completionRate' },
    { header: 'Certificate', dataIndex: 'certificate' },
    { header: 'Mandatory', dataIndex: 'mandatory' },
  ];

  const handleExportExcel = () => {
    exportToExcel({
      filename: 'training-sessions',
      title: 'Training Sessions Report',
      columns: exportColumns,
      data,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      filename: 'training-sessions',
      title: 'Training Sessions Report',
      columns: exportColumns,
      data,
    });
  };

  const handlePrint = () => {
    printTable({
      filename: 'training-sessions',
      title: 'Training Sessions Report',
      columns: exportColumns,
      data,
    });
  };

  return (
    <PageContainer $isDark={isDark}>
      <PageHeader
        isDark={isDark}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onNewTraining={handleNewTraining}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onUploadExcel={handleUploadExcel}
      />

      {showFilters && (
        <FilterSection $isDark={isDark}>
          <TrainingFilters onFilterChange={handleFilterChange} />
        </FilterSection>
      )}

      <Section>
        <SectionTitle $isDark={isDark}>Training Overview</SectionTitle>
        <TrainingStats data={data} isDark={isDark} />
      </Section>

      <Section>
        <SectionTitle $isDark={isDark}>Training Sessions</SectionTitle>
        <TableContainer $isDark={isDark}>
          <TrainingTable data={data} loading={isLoading} />
        </TableContainer>
      </Section>
    </PageContainer>
  );
}

export default TrainingPage;
