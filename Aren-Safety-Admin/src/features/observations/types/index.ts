export type ObservationStatus = 'open' | 'closed';
export type DeadlineStatus = 'on_time' | 'delayed';
export type ObservationDepartment = 'manufacturing' | 'quality' | 'maintenance' | 'management' | 'other';
export type ObservationTask = 'production' | 'inspection' | 'maintenance_repair' | 'management' | 'other';
export type ObservationUpperCategory = 'hse' | 'quality' | 'equipment' | 'environment' | 'other';
export type ObservationLowerCategory = 'ppe' | 'documentation' | 'machinery' | 'procedure' | 'other';
export type NonconformityType = 'safety' | 'procedure' | 'equipment' | 'environment' | 'other';

export interface Observation {
  key: string;
  id: string;
  projectCode: string;
  nameSurname: string;
  department: ObservationDepartment;
  nonconformityType: NonconformityType;
  observationDate: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  status: ObservationStatus;
  deadline: DeadlineStatus;
  task?: ObservationTask;
  upperCategory?: ObservationUpperCategory;
  lowerCategory?: ObservationLowerCategory;
  description_en?: string;
  description_ru?: string;
  description_tr?: string;
}

export interface ObservationFilterParams {
  projectCode?: string;
  department?: ObservationDepartment;
  nonconformityType?: NonconformityType;
  task?: ObservationTask;
  upperCategory?: ObservationUpperCategory;
  lowerCategory?: ObservationLowerCategory;
  startDate?: string;
  endDate?: string;
}

export type RiskLevel = 1 | 2 | 3 | 4 | 5;
