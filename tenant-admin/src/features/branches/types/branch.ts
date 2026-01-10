export type Branch = {
  id: string
  typeName: string
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
  typeName: string
  projectId: string
}
