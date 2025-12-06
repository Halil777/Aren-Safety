export interface Supervisor {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  email?: string;
  position: string;
  projectIds: string[];
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupervisorDto {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  email?: string;
  position: string;
  projectIds: string[];
  phone?: string;
  department?: string;
}

export interface UpdateSupervisorDto {
  firstName?: string;
  lastName?: string;
  login?: string;
  password?: string;
  email?: string;
  position?: string;
  projectIds?: string[];
  phone?: string;
  department?: string;
}

export interface SupervisorResponse {
  description?: string;
  images?: string[];
  videos?: string[];
  respondedAt?: string;
}
