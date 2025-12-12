import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCompany, deleteCompany, fetchCompanies, updateCompany } from './companies'
import type { Company, CompanyInput } from '../types/company'

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSuccess: created => {
      queryClient.setQueryData<Company[]>(['companies'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompanyInput }) => updateCompany(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Company[]>(['companies'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Company[]>(['companies'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
