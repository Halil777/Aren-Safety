import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { CategoryType } from '@/features/categories/types/category'
import type { Subcategory, SubcategoryInput } from '../types/subcategory'

const routeByType = (type: CategoryType) =>
  type === 'observation' ? ROUTES.SUBCATEGORIES.OBSERVATION : ROUTES.SUBCATEGORIES.TASK

export async function fetchSubcategories(type: CategoryType): Promise<Subcategory[]> {
  const route = routeByType(type)
  return apiClient.get<Subcategory[]>(route.LIST)
}

export async function createSubcategory(type: CategoryType, data: SubcategoryInput) {
  const route = routeByType(type)
  return apiClient.post<Subcategory>(route.LIST, data)
}

export async function updateSubcategory(
  type: CategoryType,
  id: string,
  data: SubcategoryInput,
) {
  const route = routeByType(type)
  return apiClient.patch<Subcategory>(route.DETAIL(id), data)
}

export async function deleteSubcategory(type: CategoryType, id: string) {
  const route = routeByType(type)
  return apiClient.delete<{ success: boolean }>(route.DETAIL(id))
}
