export type Company = {
  id: string
  companyName: string
  description?: string | null
  projectId: string
  project?: {
    id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export type CompanyInput = {
  companyName: string
  description?: string
  projectId: string
}
