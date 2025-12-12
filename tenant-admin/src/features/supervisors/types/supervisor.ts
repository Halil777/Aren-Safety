export type Supervisor = {
  id: string
  fullName: string
  phoneNumber: string
  email?: string | null
  login: string
  profession?: string | null
  departmentId?: string | null
  companyId?: string | null
  isActive: boolean
  projectIds: string[]
  projects?: { id: string; name: string }[]
  department?: { id: string; name: string }
  company?: { id: string; companyName: string }
  createdAt?: string
}

export type SupervisorInput = {
  fullName: string
  phoneNumber: string
  email?: string
  login: string
  password?: string
  profession?: string
  departmentId?: string
  companyId?: string
  isActive?: boolean
  projectIds: string[]
}
