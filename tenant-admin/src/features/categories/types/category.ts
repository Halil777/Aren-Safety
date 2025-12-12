export type CategoryType = 'observation' | 'task'

export type Category = {
  id: string
  categoryName: string
  projectId: string
  type: CategoryType
  project?: {
    id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export type CategoryInput = {
  projectId: string
  categoryName: string
}
