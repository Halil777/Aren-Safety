import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTenant,
  deleteTenant,
  fetchTenant,
  fetchTenants,
  TENANTS_QUERY_KEY,
  updateTenant,
} from './tenants'
import { type CreateTenantInput, type UpdateTenantInput } from '../types/tenant'

export function useTenantsQuery() {
  return useQuery({
    queryKey: [TENANTS_QUERY_KEY],
    queryFn: fetchTenants,
  })
}

export function useTenantQuery(id: string) {
  return useQuery({
    queryKey: [TENANTS_QUERY_KEY, id],
    queryFn: () => fetchTenant(id),
    enabled: Boolean(id),
  })
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTenantInput) => createTenant(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TENANTS_QUERY_KEY] })
    },
  })
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTenantInput }) =>
      updateTenant(id, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [TENANTS_QUERY_KEY] })
      void queryClient.invalidateQueries({
        queryKey: [TENANTS_QUERY_KEY, variables.id],
      })
    },
  })
}

export function useDeleteTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TENANTS_QUERY_KEY] })
    },
  })
}
