export type TrainingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type TrainingType = 'safety-induction' | 'equipment-training' | 'emergency-response' | 'compliance-training' | 'skill-development' | 'refresher-course';
export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface TrainingSession {
  [key: string]: unknown;
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  status: TrainingStatus;
  instructor: string;
  department?: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number; // in hours
  capacity: number;
  enrolled: number;
  attendees: TrainingAttendee[];
  materials: string[];
  certificate: boolean;
  mandatory: boolean;
  completionRate: number;
}

export interface TrainingAttendee {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  status: AttendanceStatus;
  score?: number;
  certificateIssued: boolean;
  completedDate?: string;
}

export interface TrainingFiltersType {
  dateRange?: [string, string];
  type?: TrainingType;
  status?: TrainingStatus;
  department?: string;
  mandatory?: boolean;
}
