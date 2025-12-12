import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { TypeInput, TypeItem } from '../types/type'

export async function fetchTypes(): Promise<TypeItem[]> {
  return apiClient.get<TypeItem[]>(ROUTES.TYPES.LIST)
}

export async function createType(data: TypeInput) {
  return apiClient.post<TypeItem>(ROUTES.TYPES.LIST, data)
}

export async function updateType(id: string, data: TypeInput) {
  return apiClient.patch<TypeItem>(ROUTES.TYPES.DETAIL(id), data)
}

export async function deleteType(id: string) {
  return apiClient.delete<{ success: boolean }>(ROUTES.TYPES.DETAIL(id))
}
