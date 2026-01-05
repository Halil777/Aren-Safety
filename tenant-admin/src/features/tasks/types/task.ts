export type TaskStatus =
  | "OPEN"
  | "SEEN_BY_SUPERVISOR"
  | "IN_PROGRESS"
  | "FIXED_PENDING_CHECK"
  | "REJECTED"
  | "CLOSED";

export type Task = {
  id: string;
  tenantId: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  locationId?: string | null;
  createdByUserId: string;
  supervisorId: string;
  companyId?: string | null;
  description: string;
  deadline: string;
  status: TaskStatus;
  supervisorSeenAt?: string | null;
  fixedAt?: string | null;
  closedAt?: string | null;
  project?: { id: string; name: string };
  department?: { id: string; name: string };
  category?: { id: string; categoryName: string };
  location?: { id: string; name: string; projectId?: string };
  createdBy?: { id: string; fullName: string };
  supervisor?: { id: string; fullName: string };
  company?: { id: string; companyName: string } | null;
  createdAt?: string;
};

export type TaskInput = {
  createdByUserId: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  supervisorId: string;
  companyId?: string | null;
  description: string;
  deadline: string;
  status?: TaskStatus;
};
