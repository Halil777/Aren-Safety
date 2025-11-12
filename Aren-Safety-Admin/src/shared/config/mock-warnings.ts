/**
 * Mock Warnings & Fines Data
 *
 * Safety violations, warnings, and fines for tenant admin panel
 */

export interface Warning {
  id: string;
  employeeId: string;
  employeeName: string;
  violationType: 'safety' | 'policy' | 'equipment' | 'ppe' | 'procedure' | 'other';
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  location: string;
  dateIssued: string;
  issuedBy: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'appealed';

  // Fine details
  fineAmount?: number;
  fineCurrency?: string;
  finePaid?: boolean;
  finePaymentDate?: string;

  // Resolution
  actionTaken?: string;
  resolvedDate?: string;
  resolvedBy?: string;
  notes?: string;

  // Related items
  observationId?: string;
  incidentId?: string;

  createdAt: string;
  updatedAt: string;
}

export const MOCK_WARNINGS: Warning[] = [
  {
    id: 'warn_001',
    employeeId: 'emp_005',
    employeeName: 'David Rodriguez',
    violationType: 'ppe',
    severity: 'moderate',
    description: 'Employee observed working at height without proper fall protection harness',
    location: 'Site A - Building 3, 3rd Floor',
    dateIssued: '2025-10-10',
    issuedBy: 'Sarah Johnson',
    status: 'resolved',
    fineAmount: 150,
    fineCurrency: 'USD',
    finePaid: true,
    finePaymentDate: '2025-10-12',
    actionTaken: 'Employee completed fall protection refresher training. Reviewed safety procedures.',
    resolvedDate: '2025-10-15',
    resolvedBy: 'John Smith',
    notes: 'First-time violation. Employee was cooperative and completed training immediately.',
    observationId: 'obs_042',
    createdAt: '2025-10-10T14:30:00Z',
    updatedAt: '2025-10-15T16:00:00Z',
  },
  {
    id: 'warn_002',
    employeeId: 'emp_008',
    employeeName: 'Linda Anderson',
    violationType: 'safety',
    severity: 'serious',
    description: 'Entered confined space without proper ventilation testing and monitoring equipment',
    location: 'Site A - Basement Level',
    dateIssued: '2025-10-05',
    issuedBy: 'Emily Davis',
    status: 'resolved',
    fineAmount: 300,
    fineCurrency: 'USD',
    finePaid: true,
    finePaymentDate: '2025-10-07',
    actionTaken: 'Mandatory confined space training. 3-day suspension. Re-certification required.',
    resolvedDate: '2025-10-14',
    resolvedBy: 'John Smith',
    notes: 'Serious safety violation. Employee showed good understanding after retraining.',
    createdAt: '2025-10-05T11:20:00Z',
    updatedAt: '2025-10-14T10:00:00Z',
  },
  {
    id: 'warn_003',
    employeeId: 'emp_016',
    employeeName: 'Patricia Lewis',
    violationType: 'equipment',
    severity: 'moderate',
    description: 'Using damaged scaffolding without reporting to supervisor',
    location: 'Site B - East Wing',
    dateIssued: '2025-09-28',
    issuedBy: 'Sarah Johnson',
    status: 'resolved',
    fineAmount: 200,
    fineCurrency: 'USD',
    finePaid: true,
    finePaymentDate: '2025-09-30',
    actionTaken: 'Equipment safety training completed. Reviewed reporting procedures.',
    resolvedDate: '2025-10-02',
    resolvedBy: 'John Smith',
    createdAt: '2025-09-28T09:15:00Z',
    updatedAt: '2025-10-02T14:30:00Z',
  },
  {
    id: 'warn_004',
    employeeId: 'emp_017',
    employeeName: 'Steven Walker',
    violationType: 'ppe',
    severity: 'minor',
    description: 'Not wearing safety goggles while operating power tools',
    location: 'Site A - Workshop',
    dateIssued: '2025-10-12',
    issuedBy: 'Michael Chen',
    status: 'acknowledged',
    fineAmount: 50,
    fineCurrency: 'USD',
    finePaid: false,
    actionTaken: 'Verbal warning issued. Employee acknowledged violation.',
    notes: 'First minor violation. Employee immediately complied when reminded.',
    createdAt: '2025-10-12T13:45:00Z',
    updatedAt: '2025-10-12T14:00:00Z',
  },
  {
    id: 'warn_005',
    employeeId: 'emp_011',
    employeeName: 'Christopher Garcia',
    violationType: 'procedure',
    severity: 'minor',
    description: 'Failed to complete daily equipment inspection checklist',
    location: 'Site A - Equipment Yard',
    dateIssued: '2025-10-14',
    issuedBy: 'Emily Davis',
    status: 'acknowledged',
    fineAmount: 75,
    fineCurrency: 'USD',
    finePaid: false,
    actionTaken: 'Reminded of daily inspection requirements. Will be monitored for compliance.',
    notes: 'Employee was busy with urgent task and forgot. Committed to compliance.',
    createdAt: '2025-10-14T08:00:00Z',
    updatedAt: '2025-10-14T09:30:00Z',
  },
  {
    id: 'warn_006',
    employeeId: 'emp_007',
    employeeName: 'Robert Martinez',
    violationType: 'safety',
    severity: 'critical',
    description: 'Working on live electrical panel without lockout/tagout procedure',
    location: 'Site B - Electrical Room',
    dateIssued: '2025-09-20',
    issuedBy: 'Sarah Johnson',
    status: 'resolved',
    fineAmount: 500,
    fineCurrency: 'USD',
    finePaid: true,
    finePaymentDate: '2025-09-22',
    actionTaken: '1-week suspension. Mandatory LOTO retraining. Written warning on file for 1 year.',
    resolvedDate: '2025-10-01',
    resolvedBy: 'John Smith',
    notes: 'Critical safety violation. Could have resulted in serious injury or death. Employee took full responsibility.',
    incidentId: 'inc_018',
    createdAt: '2025-09-20T15:30:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'warn_007',
    employeeId: 'emp_010',
    employeeName: 'Jessica Thomas',
    violationType: 'ppe',
    severity: 'moderate',
    description: 'Welding without proper respiratory protection in confined area',
    location: 'Site A - Fabrication Shop',
    dateIssued: '2025-10-08',
    issuedBy: 'Michael Chen',
    status: 'resolved',
    fineAmount: 175,
    fineCurrency: 'USD',
    finePaid: true,
    finePaymentDate: '2025-10-10',
    actionTaken: 'Respiratory protection training completed. Reviewed welding safety procedures.',
    resolvedDate: '2025-10-13',
    resolvedBy: 'Emily Davis',
    createdAt: '2025-10-08T11:00:00Z',
    updatedAt: '2025-10-13T16:00:00Z',
  },
  {
    id: 'warn_008',
    employeeId: 'emp_006',
    employeeName: 'James Wilson',
    violationType: 'policy',
    severity: 'minor',
    description: 'Late submission of weekly safety report',
    location: 'Site A',
    dateIssued: '2025-10-16',
    issuedBy: 'John Smith',
    status: 'open',
    fineAmount: 25,
    fineCurrency: 'USD',
    finePaid: false,
    notes: 'Reminder sent. Waiting for acknowledgment.',
    createdAt: '2025-10-16T17:00:00Z',
    updatedAt: '2025-10-16T17:00:00Z',
  },
  {
    id: 'warn_009',
    employeeId: 'emp_009',
    employeeName: 'William Taylor',
    violationType: 'equipment',
    severity: 'serious',
    description: 'Operating heavy equipment with expired certification',
    location: 'Site B - Construction Zone',
    dateIssued: '2025-10-03',
    issuedBy: 'Sarah Johnson',
    status: 'resolved',
    fineAmount: 400,
    fineCurrency: 'USD',
    finePaid: true,
    finePaymentDate: '2025-10-05',
    actionTaken: 'Equipment operation suspended until re-certification. Completed renewal training.',
    resolvedDate: '2025-10-12',
    resolvedBy: 'John Smith',
    notes: 'Certification expiry was overlooked. HR to implement better tracking.',
    createdAt: '2025-10-03T10:30:00Z',
    updatedAt: '2025-10-12T14:00:00Z',
  },
  {
    id: 'warn_010',
    employeeId: 'emp_012',
    employeeName: 'Amanda Lee',
    violationType: 'ppe',
    severity: 'minor',
    description: 'Painting without adequate respiratory protection',
    location: 'Site B - Interior Room 205',
    dateIssued: '2025-10-15',
    issuedBy: 'Emily Davis',
    status: 'acknowledged',
    fineAmount: 100,
    fineCurrency: 'USD',
    finePaid: false,
    actionTaken: 'Verbal warning. Provided with proper respirator and training on use.',
    notes: 'New employee, first week. Additional safety orientation scheduled.',
    createdAt: '2025-10-15T14:20:00Z',
    updatedAt: '2025-10-15T15:00:00Z',
  },
];

// Statistics functions
export function getTotalFinesAmount(): number {
  return MOCK_WARNINGS.reduce((sum, warning) => sum + (warning.fineAmount || 0), 0);
}

export function getPaidFinesAmount(): number {
  return MOCK_WARNINGS.filter((w) => w.finePaid)
    .reduce((sum, warning) => sum + (warning.fineAmount || 0), 0);
}

export function getUnpaidFinesAmount(): number {
  return MOCK_WARNINGS.filter((w) => !w.finePaid)
    .reduce((sum, warning) => sum + (warning.fineAmount || 0), 0);
}

export function getWarningsBySeverity(severity: Warning['severity']): Warning[] {
  return MOCK_WARNINGS.filter((w) => w.severity === severity);
}

export function getWarningsByStatus(status: Warning['status']): Warning[] {
  return MOCK_WARNINGS.filter((w) => w.status === status);
}

export function getWarningsByEmployee(employeeId: string): Warning[] {
  return MOCK_WARNINGS.filter((w) => w.employeeId === employeeId);
}

export function getOpenWarnings(): Warning[] {
  return MOCK_WARNINGS.filter((w) => w.status === 'open' || w.status === 'acknowledged');
}

export function getRecentWarnings(days: number = 30): Warning[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return MOCK_WARNINGS.filter((w) => new Date(w.dateIssued) >= cutoffDate);
}

export const VIOLATION_TYPES: Warning['violationType'][] = [
  'safety',
  'policy',
  'equipment',
  'ppe',
  'procedure',
  'other',
];

export const SEVERITY_LEVELS: Warning['severity'][] = [
  'minor',
  'moderate',
  'serious',
  'critical',
];
