export type { Employee } from '@/shared/config/mock-employees';
export type { SafetyStaffMember, Inspector } from '@/features/employees/types';

export type ExportType = 'excel' | 'pdf' | 'print';

export interface EmployeeFilters {
  searchText: string;
  status: string;
  department: string;
  location: string;
}
