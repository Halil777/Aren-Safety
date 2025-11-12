import React, { useMemo, useCallback } from 'react';
import { InspectorsManager } from '@/features/employees/components/InspectorsManager';
import { useEmployees, useCreateEmployee } from '@/features/employees/api';
import type { InspectorInput, Inspector } from '@/features/employees/types';
import { Card, Alert, Spin, message } from 'antd';

const InspectorsTabComponent: React.FC = () => {
  // Fetch all employees and filter inspectors
  const { data: allEmployees = [], isLoading, isError, error } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();

  // Filter inspectors
  const inspectors = useMemo(
    () => allEmployees.filter((emp) => emp.safetyRole === 'inspector') as Inspector[],
    [allEmployees]
  );

  const summary = useMemo(() => {
    const count = inspectors.length;
    const totalSites = inspectors.reduce((sum, i) => sum + (i.assignedSites || 0), 0);
    const regions = new Set(inspectors.map((i) => i.region)).size;

    return {
      count,
      totalSites,
      regions,
    };
  }, [inspectors]);

  const handleAddInspector = useCallback((input: InspectorInput) => {
    const newInspector = {
      employeeNumber: `INS-${Date.now()}`,
      firstName: input.fullName?.split(' ')[0] || 'Unknown',
      lastName: input.fullName?.split(' ').slice(1).join(' ') || '',
      department: input.department || 'Inspections',
      position: input.position || 'Inspector',
      email: input.email || '',
      phone: input.phone || '',
      hireDate: new Date().toISOString(),
      status: 'active' as const,
      safetyRole: 'inspector' as const,
      certifications: [],
      incidentCount: 0,
      observationsSubmitted: 0,
      workLocation: 'Main Office',
      licenseId: input.licenseId,
      region: input.region,
      assignedSites: input.assignedSites,
      lastAuditDate: input.lastAuditDate,
      avatar: input.avatarUrl,
    };

    createEmployeeMutation.mutate(newInspector, {
      onSuccess: () => {
        message.success('Inspector added successfully');
      },
      onError: (err) => {
        message.error('Failed to add inspector: ' + (err instanceof Error ? err.message : 'Unknown error'));
      },
    });
  }, [createEmployeeMutation]);

  // Show error state
  if (isError) {
    return (
      <Card>
        <Alert
          message="Error Loading Inspectors"
          description={error instanceof Error ? error.message : 'Failed to load inspectors'}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Spin spinning={isLoading || createEmployeeMutation.isPending} tip="Loading inspectors...">
      <InspectorsManager inspectors={inspectors} summary={summary} onAdd={handleAddInspector} />
    </Spin>
  );
};

InspectorsTabComponent.displayName = 'InspectorsTab';

export const InspectorsTab = React.memo(InspectorsTabComponent);
