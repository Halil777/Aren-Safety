import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSupervisor, fetchSupervisors, updateSupervisor } from './supervisors'
import type { Supervisor, SupervisorInput } from '../types/supervisor'

export function useSupervisorsQuery() {
  return useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisors,
  })
}

export function useCreateSupervisorMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupervisor,
    onSuccess: created => {
      queryClient.setQueryData<Supervisor[]>(['supervisors'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateSupervisorMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupervisorInput }) =>
      updateSupervisor(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Supervisor[]>(['supervisors'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}
