import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMobileUser, fetchMobileUsers, updateMobileUser } from './users'
import type { MobileUser, MobileUserInput } from '../types/mobile-user'

export function useMobileUsersQuery() {
  return useQuery({
    queryKey: ['mobile-users'],
    queryFn: fetchMobileUsers,
  })
}

export function useCreateMobileUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMobileUser,
    onSuccess: created => {
      queryClient.setQueryData<MobileUser[]>(['mobile-users'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateMobileUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MobileUserInput }) =>
      updateMobileUser(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<MobileUser[]>(['mobile-users'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}
