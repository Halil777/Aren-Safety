import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Department, DepartmentInput } from '../types/department'

export async function fetchDepartments(): Promise<Department[]> {
  return apiClient.get<Department[]>(ROUTES.DEPARTMENTS.LIST)
}

export async function createDepartment(data: DepartmentInput) {
  return apiClient.post<Department>(ROUTES.DEPARTMENTS.LIST, data)
}

export async function updateDepartment(id: string, data: DepartmentInput) {
  return apiClient.patch<Department>(ROUTES.DEPARTMENTS.DETAIL(id), data)
}

export async function deleteDepartment(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.DEPARTMENTS.DETAIL(id))
}
