export interface Department {
  [key: string]: unknown;
  key: string;
  department: string;
  nonconformityType: string;
  observationDate: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  status: 'AÇIK' | 'KAPALI';
  deadline: 'ZAMANINDA' | 'GECIKMELI';
  task?: string;
  upperCategory?: string;
  lowerCategory?: string;
}

export interface DepartmentFilterParams {
  department?: string;
  task?: string;
  upperCategory?: string;
  lowerCategory?: string;
  startDate?: string;
  endDate?: string;
}

export type RiskLevel = 1 | 2 | 3 | 4 | 5;
export type DepartmentStatus = 'AÇIK' | 'KAPALI';
export type DeadlineStatus = 'ZAMANINDA' | 'GECIKMELI';
