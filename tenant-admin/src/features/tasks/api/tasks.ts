import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { TaskInput, TaskItem } from '../types/task'

export async function fetchTasks(): Promise<TaskItem[]> {
  return apiClient.get<TaskItem[]>(ROUTES.TASKS.LIST)
}

export async function createTask(data: TaskInput) {
  return apiClient.post<TaskItem>(ROUTES.TASKS.LIST, data)
}

export async function updateTask(id: string, data: TaskInput) {
  return apiClient.patch<TaskItem>(ROUTES.TASKS.DETAIL(id), data)
}

export async function deleteTask(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.TASKS.DETAIL(id))
}
