export type ObservationStatus =
  | 'NEW'
  | 'SEEN_BY_SUPERVISOR'
  | 'IN_PROGRESS'
  | 'FIXED_PENDING_CHECK'
  | 'REJECTED'
  | 'CLOSED'

export type Observation = {
  id: string
  tenantId: string
  locationId: string
  projectId: string
  departmentId: string
  categoryId: string
  subcategoryId: string
  branchId?: string | null
  createdByUserId: string
  supervisorId: string
  companyId?: string | null
  workerFullName: string
  workerProfession: string
  riskLevel: number
  description: string
  deadline: string
  status: ObservationStatus
  supervisorSeenAt?: string | null
  fixedAt?: string | null
  closedAt?: string | null
  project?: { id: string; name: string }
  department?: { id: string; name: string }
  category?: { id: string; categoryName: string }
  subcategory?: { id: string; subcategoryName: string }
  branch?: { id: string; typeName: string }
  createdBy?: { id: string; fullName: string }
  supervisor?: { id: string; fullName: string }
  company?: { id: string; companyName: string } | null
  location?: { id: string; name: string; projectId: string }
  createdAt?: string
}

export type ObservationInput = {
  createdByUserId: string
  projectId: string
  locationId?: string
  departmentId: string
  categoryId: string
  subcategoryId: string
  branchId?: string | null
  supervisorId: string
  companyId?: string | null
  workerFullName: string
  workerProfession: string
  riskLevel: number
  description: string
  deadline: string
  status?: ObservationStatus
}
