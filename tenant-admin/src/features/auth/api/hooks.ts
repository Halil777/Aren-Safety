import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login, fetchProfile } from './auth'
import type { LoginInput } from '../types/auth'
import type { TenantProfile } from '@/shared/types/auth'
import { useAuthStore } from '@/shared/store/auth-store'

export function useLoginMutation() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      loginStore({ token: data.access_token, tenant: data.tenant })
      navigate('/', { replace: true })
    },
  })
}

export function useProfileQuery(enabled: boolean) {
  const setTenant = useAuthStore((state) => state.setTenant)
  const logout = useAuthStore((state) => state.logout)

  const query = useQuery<TenantProfile>({
    queryKey: ['me'],
    queryFn: fetchProfile,
    enabled,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: enabled ? 5000 : false,
    refetchIntervalInBackground: true,
    staleTime: 1000 * 5,
    retry: false,
  })

  useEffect(() => {
    if (query.data) {
      setTenant(query.data)
    }
  }, [query.data, setTenant])

  useEffect(() => {
    if (query.isError) {
      logout()
    }
  }, [logout, query.isError])

  return query
}
