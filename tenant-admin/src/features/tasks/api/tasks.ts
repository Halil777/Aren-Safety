import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Task, TaskInput } from '../types/task'

// Temporary mapping: Frontend uses "OPEN", Backend uses "NEW"
function mapStatusToBackend(status: string | undefined): string | undefined {
  if (status === 'OPEN') return 'NEW'
  return status
}

function mapStatusFromBackend(status: string): string {
  if (status === 'NEW') return 'OPEN'
  return status
}

function mapTaskFromBackend(task: Task): Task {
  return {
    ...task,
    status: mapStatusFromBackend(task.status) as Task['status']
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const tasks = await apiClient.get<Task[]>(ROUTES.TASKS.LIST)
  return tasks.map(mapTaskFromBackend)
}

export async function createTask(data: TaskInput) {
  const backendData = {
    ...data,
    status: mapStatusToBackend(data.status) as TaskInput['status']
  }
  const task = await apiClient.post<Task>(ROUTES.TASKS.LIST, backendData)
  return mapTaskFromBackend(task)
}

export async function updateTask(id: string, data: Partial<TaskInput>) {
  const backendData = {
    ...data,
    status: data.status ? mapStatusToBackend(data.status) as TaskInput['status'] : undefined
  }
  const task = await apiClient.patch<Task>(ROUTES.TASKS.DETAIL(id), backendData)
  return mapTaskFromBackend(task)
}

export async function deleteTask(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.TASKS.DETAIL(id))
}

export type TaskMediaPayload = {
  type: 'IMAGE' | 'VIDEO' | 'FILE'
  url: string
  uploadedByUserId: string
  isCorrective: boolean
}

export async function addTaskMedia(taskId: string, data: TaskMediaPayload) {
  return apiClient.post<unknown>(`${ROUTES.TASKS.DETAIL(taskId)}/media`, data)
}
