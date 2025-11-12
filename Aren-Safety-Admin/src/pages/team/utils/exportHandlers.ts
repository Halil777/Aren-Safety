import { exportToExcel, exportToPDF, printTable } from '@/shared/utils/export-utils';
import type { ExportColumn } from '@/shared/utils/export-utils';
import type { Employee, SafetyStaffMember, Inspector, ExportType } from '../types';

// Employee export columns definition
const employeeExportColumns: ExportColumn<Employee>[] = [
  { header: 'Employee Number', dataIndex: 'employeeNumber' },
  { header: 'First Name', dataIndex: 'firstName' },
  { header: 'Last Name', dataIndex: 'lastName' },
  { header: 'Email', dataIndex: 'email' },
  { header: 'Phone', dataIndex: 'phone' },
  { header: 'Position', dataIndex: 'position' },
  { header: 'Department', dataIndex: 'department' },
  { header: 'Location', dataIndex: 'workLocation' },
  { header: 'Status', dataIndex: 'status' },
  {
    header: 'Safety Role',
    dataIndex: 'safetyRole',
    render: (val: unknown): string => (val as string | undefined) || '-',
  },
  {
    header: 'Certifications',
    dataIndex: 'certifications',
    render: (val) => (val as string[]).length.toString(),
  },
  {
    header: 'Incidents',
    dataIndex: 'incidentCount',
    render: (val) => String(val),
  },
];

// Safety staff export columns definition
const safetyStaffExportColumns: ExportColumn<SafetyStaffMember>[] = [
  { header: 'Full Name', dataIndex: 'fullName' },
  { header: 'Position', dataIndex: 'position' },
  { header: 'Department', dataIndex: 'department' },
  {
    header: 'Email',
    dataIndex: 'email',
    render: (val) => (val as string | undefined) || '-',
  },
  {
    header: 'Phone',
    dataIndex: 'phone',
    render: (val) => (val as string | undefined) || '-',
  },
  { header: 'Expertise', dataIndex: 'expertise' },
  { header: 'Shift', dataIndex: 'shift' },
  { header: 'Certification Level', dataIndex: 'certificationLevel' },
  {
    header: 'Years of Experience',
    dataIndex: 'yearsOfExperience',
    render: (val) => String(val),
  },
];

// Inspectors export columns definition
const inspectorsExportColumns: ExportColumn<Inspector>[] = [
  { header: 'Full Name', dataIndex: 'fullName' },
  { header: 'Position', dataIndex: 'position' },
  { header: 'Department', dataIndex: 'department' },
  { header: 'License ID', dataIndex: 'licenseId' },
  { header: 'Region', dataIndex: 'region' },
  {
    header: 'Assigned Sites',
    dataIndex: 'assignedSites',
    render: (val) => String(val),
  },
  { header: 'Last Audit', dataIndex: 'lastAuditDate' },
  {
    header: 'Email',
    dataIndex: 'email',
    render: (val) => (val as string | undefined) || '-',
  },
  {
    header: 'Phone',
    dataIndex: 'phone',
    render: (val) => (val as string | undefined) || '-',
  },
];

// Export handler for employees
export const handleEmployeesExport = (type: ExportType, data: Employee[]) => {
  const options = {
    filename: 'team-employees',
    title: 'Team - Employees',
    columns: employeeExportColumns,
    data,
  };

  if (type === 'excel') exportToExcel(options);
  else if (type === 'pdf') exportToPDF(options);
  else if (type === 'print') printTable(options);
};

// Export handler for safety staff
export const handleSafetyStaffExport = (type: ExportType, data: SafetyStaffMember[]) => {
  const options = {
    filename: 'team-safety-staff',
    title: 'Team - Safety Staff',
    columns: safetyStaffExportColumns,
    data,
  };

  if (type === 'excel') exportToExcel(options);
  else if (type === 'pdf') exportToPDF(options);
  else if (type === 'print') printTable(options);
};

// Export handler for inspectors
export const handleInspectorsExport = (type: ExportType, data: Inspector[]) => {
  const options = {
    filename: 'team-inspectors',
    title: 'Team - Inspectors',
    columns: inspectorsExportColumns,
    data,
  };

  if (type === 'excel') exportToExcel(options);
  else if (type === 'pdf') exportToPDF(options);
  else if (type === 'print') printTable(options);
};
