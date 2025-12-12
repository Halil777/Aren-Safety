import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createType, deleteType, fetchTypes, updateType } from './types'
import type { TypeInput, TypeItem } from '../types/type'

export function useTypesQuery() {
  return useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
  })
}

export function useCreateTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createType,
    onSuccess: created => {
      queryClient.setQueryData<TypeItem[]>(['types'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TypeInput }) => updateType(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<TypeItem[]>(['types'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteType,
    onSuccess: (_, id) => {
      queryClient.setQueryData<TypeItem[]>(['types'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
