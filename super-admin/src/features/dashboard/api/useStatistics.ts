import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { Statistics } from '../types'

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => apiClient.get<Statistics>('/tenants/statistics'),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
