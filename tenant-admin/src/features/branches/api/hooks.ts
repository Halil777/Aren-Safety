import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBranch, deleteBranch, fetchBranches, updateBranch } from './branches'
import type { Branch, BranchInput } from '../types/branch'

export function useBranchesQuery() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  })
}

export function useCreateBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBranch,
    onSuccess: created => {
      queryClient.setQueryData<Branch[]>(['branches'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BranchInput }) => updateBranch(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Branch[]>(['branches'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteBranchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Branch[]>(['branches'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
