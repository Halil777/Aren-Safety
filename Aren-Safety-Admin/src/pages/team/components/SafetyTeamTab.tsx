import React, { useMemo } from 'react';
import { SafetyStaffGrid } from '@/features/employees/components/SafetyStaffGrid';
import { useEmployees } from '@/features/employees/api';
import { useTheme } from '@/app/providers/theme-provider';
import { Card, Alert, Spin } from 'antd';

const SafetyTeamTabComponent: React.FC = () => {
  const { theme } = useTheme();

  // Fetch all employees and filter safety team
  const { data: allEmployees = [], isLoading, isError, error } = useEmployees();

  // Filter safety team members
  const safetyStaffMembers = useMemo(
    () => allEmployees.filter((emp) => emp.safetyRole === 'safety_team'),
    [allEmployees]
  );

  const summary = useMemo(() => {
    const count = safetyStaffMembers.length;
    const averageExperience = count > 0
      ? safetyStaffMembers.reduce((sum, m) => sum + (m.yearsOfExperience || 0), 0) / count
      : 0;
    const experts = safetyStaffMembers.filter((m) => m.certificationLevel === 'expert').length;
    const dayShift = safetyStaffMembers.filter((m) => m.shift === 'day').length;

    return {
      count,
      averageExperience: Math.round(averageExperience * 10) / 10,
      experts,
      dayShift,
    };
  }, [safetyStaffMembers]);

  // Show error state
  if (isError) {
    return (
      <Card>
        <Alert
          message="Error Loading Safety Team"
          description={error instanceof Error ? error.message : 'Failed to load safety team members'}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Spin spinning={isLoading} tip="Loading safety team...">
      <SafetyStaffGrid members={safetyStaffMembers} summary={summary} isDark={theme === 'dark'} />
    </Spin>
  );
};

SafetyTeamTabComponent.displayName = 'SafetyTeamTab';

export const SafetyTeamTab = React.memo(SafetyTeamTabComponent);
