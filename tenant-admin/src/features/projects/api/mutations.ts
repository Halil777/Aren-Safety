import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Project } from '../types/project'

type ProjectInput = Omit<Project, 'id' | 'createdAt'>

export async function createProject(input: ProjectInput): Promise<Project> {
  return apiClient.post<Project>(ROUTES.PROJECTS.LIST, input)
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<Project> {
  return apiClient.patch<Project>(`${ROUTES.PROJECTS.LIST}/${id}`, input)
}
