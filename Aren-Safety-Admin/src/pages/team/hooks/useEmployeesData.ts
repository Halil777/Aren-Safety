import { useMemo } from 'react';
import { useEmployees } from '@/features/employees/api';
import type { EmployeeFilters } from '../types';

export const useEmployeesData = (filters: EmployeeFilters) => {
  // Fetch employees from API (filtering by type 'employee')
  const { data: employees = [], isLoading } = useEmployees({ type: 'employee' });

  // Get unique values for filter dropdowns
  const departments = useMemo(
    () => Array.from(new Set(employees.map((emp: any) => emp.department))),
    [employees]
  );

  const locations = useMemo(
    () => Array.from(new Set(employees.map((emp: any) => emp.workLocation || 'Unknown'))),
    [employees]
  );

  // Filter employees based on current filters (client-side filtering)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: any) => {
      const matchesSearch =
        (emp.fullName || '').toLowerCase().includes(filters.searchText.toLowerCase()) ||
        (emp.email || '').toLowerCase().includes(filters.searchText.toLowerCase()) ||
        (emp.id || '').toLowerCase().includes(filters.searchText.toLowerCase());

      const matchesDepartment = filters.department === 'all' || emp.department === filters.department;

      // Note: 'status' and 'location' filtering depends on your data structure
      // Adjust as needed based on actual employee data shape

      return matchesSearch && matchesDepartment;
    });
  }, [filters, employees]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e: any) => e.isActive !== false).length;

    return {
      total,
      active,
      onLeave: 0, // Add this field to your employee data if needed
      expiredTraining: 0, // Add this field to your employee data if needed
    };
  }, [employees]);

  return {
    employees,
    filteredEmployees,
    departments,
    locations,
    stats,
    isLoading,
  };
};
