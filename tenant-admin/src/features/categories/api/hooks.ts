import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category, CategoryInput, CategoryType } from '../types/category'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from './categories'

const queryKey = (type: CategoryType) => ['categories', type]

export function useCategoriesQuery(type: CategoryType) {
  return useQuery({
    queryKey: queryKey(type),
    queryFn: () => fetchCategories(type),
  })
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, data }: { type: CategoryType; data: CategoryInput }) =>
      createCategory(type, data),
    onSuccess: (created, { type }) => {
      queryClient.setQueryData<Category[]>(queryKey(type), old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      type,
      id,
      data,
    }: {
      type: CategoryType
      id: string
      data: CategoryInput
    }) => updateCategory(type, id, data),
    onSuccess: (updated, { type }) => {
      queryClient.setQueryData<Category[]>(queryKey(type), old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, id }: { type: CategoryType; id: string }) =>
      deleteCategory(type, id),
    onSuccess: (_, { type, id }) => {
      queryClient.setQueryData<Category[]>(queryKey(type), old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
