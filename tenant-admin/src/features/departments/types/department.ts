export type Department = {
  id: string
  name: string
  projectId: string
  project?: {
    id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export type DepartmentInput = {
  name: string
  projectId: string
}
