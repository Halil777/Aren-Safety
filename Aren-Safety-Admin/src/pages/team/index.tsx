import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/theme-provider';
import { ExportButtons } from '@/shared/components/ExportButtons';
import { exportToExcel, exportToPDF, printTable, prepareDataForExport } from '@/shared/utils/exportUtils';
import { EmployeesTab, CreateEmployeeModal } from './components';
import { useEmployees } from '@/features/employees/api';
import type { ExportType } from '@/shared/components/ExportButtons';

const TeamPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch employees data for export
  const { data: employees = [], isLoading } = useEmployees();

  const handleExport = (type: ExportType) => {
    const exportData = prepareDataForExport(employees.map(emp => ({
      [t('team.export.employeeNumber')]: emp.employeeNumber,
      [t('team.export.firstName')]: emp.firstName,
      [t('team.export.lastName')]: emp.lastName,
      [t('team.export.email')]: emp.email,
      [t('team.export.phone')]: emp.phone,
      [t('team.export.position')]: emp.position,
      [t('team.export.department')]: emp.department,
      [t('team.export.location')]: emp.workLocation,
      [t('team.export.status')]: emp.status,
      [t('team.export.safetyRole')]: emp.safetyRole || '-',
      [t('team.export.hireDate')]: new Date(emp.hireDate).toLocaleDateString(),
      [t('team.export.certifications')]: emp.certifications.join(', '),
      [t('team.export.incidents')]: emp.incidentCount,
    })), []);

    switch (type) {
      case 'excel':
        exportToExcel(exportData, 'employees', 'Employees');
        break;
      case 'pdf':
        exportToPDF('employees-table', 'employees');
        break;
      case 'print':
        printTable('employees-table');
        break;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
            {t('team.title')}
          </h1>
          <p style={{ color: isDarkMode ? '#a0a0a0' : '#666', marginBottom: 0 }}>
            {t('team.subtitle')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
            size="large"
          >
            {t('team.createEmployee')}
          </Button>
          <ExportButtons onExport={handleExport} disabled={isLoading} />
        </div>
      </div>

      {/* Employees Table */}
      <div id="employees-table">
        <EmployeesTab />
      </div>

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Modal will close automatically
        }}
      />
    </div>
  );
};

export default TeamPage;
