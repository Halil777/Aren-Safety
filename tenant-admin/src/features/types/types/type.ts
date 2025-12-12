export type TypeItem = {
  id: string
  typeName: string
  description?: string | null
  projectId: string
  project?: {
    id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export type TypeInput = {
  typeName: string
  description?: string
  projectId: string
}
