import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from './departments'
import type { Department, DepartmentInput } from '../types/department'

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  })
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: created => {
      queryClient.setQueryData<Department[]>(['departments'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentInput }) =>
      updateDepartment(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Department[]>(['departments'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Department[]>(['departments'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
