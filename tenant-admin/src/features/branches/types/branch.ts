export type Branch = {
  id: string
  name: string
  description?: string | null
  projectId: string
  tenantId: string
  createdAt: string
  updatedAt: string
  project?: {
    id: string
    name: string
  }
}

export type BranchInput = {
  name: string
  projectId: string
  description?: string
}
