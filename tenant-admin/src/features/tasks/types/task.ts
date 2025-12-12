export type TaskItem = {
  id: string
  taskName: string
  description?: string | null
  deadline: string
  projectId: string
  departmentId: string
  categoryId: string
  project?: {
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
  }
  category?: {
    id: string
    categoryName: string
  }
  createdAt?: string
  updatedAt?: string
}

export type TaskInput = {
  taskName: string
  description?: string
  deadline: string
  projectId: string
  departmentId: string
  categoryId: string
}
