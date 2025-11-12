export interface EmployeeBase {
  [key: string]: unknown;
  id: string;
  fullName: string;
  department: string;
  position: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
}

export interface SafetyStaffMember extends EmployeeBase {
  [key: string]: unknown;
  expertise: string;
  shift: 'day' | 'night';
  certificationLevel: 'basic' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

export interface WarningEmployee extends EmployeeBase {
  [key: string]: unknown;
  warningCount: number;
  lastWarningDate: string;
  activeCorrectiveAction: boolean;
  totalFineAmount: number;
}

export interface Inspector extends EmployeeBase {
  [key: string]: unknown;
  licenseId: string;
  region: string;
  assignedSites: number;
  lastAuditDate: string;
}

export type InspectorInput = Omit<Inspector, 'id'> & { position?: string };
