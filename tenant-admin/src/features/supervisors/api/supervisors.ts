import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Supervisor, SupervisorInput } from '../types/supervisor'

export async function fetchSupervisors(): Promise<Supervisor[]> {
  return apiClient.get<Supervisor[]>(ROUTES.SUPERVISORS.LIST)
}

export async function createSupervisor(data: SupervisorInput) {
  return apiClient.post<Supervisor>(ROUTES.SUPERVISORS.LIST, data)
}

export async function updateSupervisor(id: string, data: SupervisorInput) {
  return apiClient.patch<Supervisor>(ROUTES.SUPERVISORS.DETAIL(id), data)
}
