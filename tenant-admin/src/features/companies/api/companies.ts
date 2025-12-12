import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Company, CompanyInput } from '../types/company'

export async function fetchCompanies(): Promise<Company[]> {
  return apiClient.get<Company[]>(ROUTES.COMPANIES.LIST)
}

export async function createCompany(data: CompanyInput) {
  return apiClient.post<Company>(ROUTES.COMPANIES.LIST, data)
}

export async function updateCompany(id: string, data: CompanyInput) {
  return apiClient.patch<Company>(ROUTES.COMPANIES.DETAIL(id), data)
}

export async function deleteCompany(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.COMPANIES.DETAIL(id))
}
