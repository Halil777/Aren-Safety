import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Category, CategoryInput, CategoryType } from '../types/category'

const routeByType = (type: CategoryType) =>
  type === 'observation' ? ROUTES.CATEGORIES.OBSERVATION : ROUTES.CATEGORIES.TASK

export async function fetchCategories(type: CategoryType): Promise<Category[]> {
  const route = routeByType(type)
  return apiClient.get<Category[]>(route.LIST)
}

export async function createCategory(type: CategoryType, data: CategoryInput) {
  const route = routeByType(type)
  return apiClient.post<Category>(route.LIST, data)
}

export async function updateCategory(
  type: CategoryType,
  id: string,
  data: CategoryInput,
) {
  const route = routeByType(type)
  return apiClient.patch<Category>(route.DETAIL(id), data)
}

export async function deleteCategory(type: CategoryType, id: string) {
  const route = routeByType(type)
  return apiClient.delete<{ success: boolean }>(route.DETAIL(id))
}
