import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Branch, BranchInput } from '../types/branch'

export async function fetchBranches(): Promise<Branch[]> {
  return apiClient.get<Branch[]>(ROUTES.BRANCHES.LIST)
}

export async function createBranch(data: BranchInput) {
  return apiClient.post<Branch>(ROUTES.BRANCHES.LIST, data)
}

export async function updateBranch(id: string, data: BranchInput) {
  return apiClient.patch<Branch>(ROUTES.BRANCHES.DETAIL(id), data)
}

export async function deleteBranch(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.BRANCHES.DETAIL(id))
}
