import { create } from 'zustand'
import type { TenantProfile } from '@/shared/types/auth'

const STORAGE_KEY = 'tenant-admin-auth'
const isBrowser = typeof window !== 'undefined'

type AuthState = {
  token: string | null
  tenant: TenantProfile | null
  login: (payload: { token: string; tenant: TenantProfile }) => void
  logout: () => void
  setTenant: (tenant: TenantProfile | null) => void
}

type StoredAuth = {
  token: string
  tenant: TenantProfile
}

const getStoredAuth = (): StoredAuth | null => {
  if (!isBrowser) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

const persistAuth = (payload: StoredAuth | null) => {
  if (!isBrowser) return
  if (payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

const stored = getStoredAuth()

export const useAuthStore = create<AuthState>((set) => ({
  token: stored?.token ?? null,
  tenant: stored?.tenant ?? null,
  login: ({ token, tenant }) => {
    set({ token, tenant })
    persistAuth({ token, tenant })
  },
  logout: () => {
    set({ token: null, tenant: null })
    persistAuth(null)
  },
  setTenant: (tenant) => {
    set((state) => {
      const updatedTenant = tenant ?? null
      if (state.token && updatedTenant) {
        persistAuth({ token: state.token, tenant: updatedTenant })
      } else if (!updatedTenant) {
        persistAuth(null)
      }
      return { tenant: updatedTenant, token: updatedTenant ? state.token : null }
    })
  },
}))
