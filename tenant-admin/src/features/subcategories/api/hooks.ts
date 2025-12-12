import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CategoryType } from '@/features/categories/types/category'
import type { Subcategory, SubcategoryInput } from '../types/subcategory'
import {
  createSubcategory,
  deleteSubcategory,
  fetchSubcategories,
  updateSubcategory,
} from './subcategories'

const queryKey = (type: CategoryType) => ['subcategories', type]

export function useSubcategoriesQuery(type: CategoryType) {
  return useQuery({
    queryKey: queryKey(type),
    queryFn: () => fetchSubcategories(type),
  })
}

export function useCreateSubcategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      data,
    }: {
      type: CategoryType
      data: SubcategoryInput
    }) => createSubcategory(type, data),
    onSuccess: (created, { type }) => {
      queryClient.setQueryData<Subcategory[]>(queryKey(type), old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateSubcategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      id,
      data,
    }: {
      type: CategoryType
      id: string
      data: SubcategoryInput
    }) => updateSubcategory(type, id, data),
    onSuccess: (updated, { type }) => {
      queryClient.setQueryData<Subcategory[]>(queryKey(type), old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteSubcategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, id }: { type: CategoryType; id: string }) =>
      deleteSubcategory(type, id),
    onSuccess: (_, { type, id }) => {
      queryClient.setQueryData<Subcategory[]>(queryKey(type), old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
