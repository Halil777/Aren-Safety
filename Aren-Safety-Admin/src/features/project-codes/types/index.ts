export interface ProjectCode {
  [key: string]: unknown;
  key: string;
  code: string;
  projectName: string;
  client: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  manager?: string;
  department?: string;
}

export interface ProjectCodeFilterParams {
  code?: string;
  client?: string;
  status?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
}
