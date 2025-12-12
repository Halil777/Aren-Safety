import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Project } from '../types/project'

export async function fetchProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>(ROUTES.PROJECTS.LIST)
}
