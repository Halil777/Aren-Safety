import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from '@tanstack/react-query'
import { fetchProfile, loginRequest, type LoginResponse, type MobileProfile } from '../services/api'
import { clearPersistedQueryCache } from '../query/persist'
import { setSyncAuthToken } from '../offline'

type AuthContextType = {
  token: string | null
  user: (LoginResponse['user'] & Partial<MobileProfile>) | null
  role: LoginResponse['role'] | null
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const TOKEN_KEY = 'safety-mobile-token'
const USER_KEY = 'safety-mobile-user'
const PROFILE_KEY = 'safety-mobile-profile'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<(LoginResponse['user'] & Partial<MobileProfile>) | null>(null)
  const [role, setRole] = useState<LoginResponse['role'] | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedToken, storedUser, storedProfile] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
        ])
        if (storedToken && storedUser) {
          setToken(storedToken)
          const parsed = JSON.parse(storedUser) as LoginResponse
          const profile = storedProfile ? JSON.parse(storedProfile) : null
          setUser(profile ?? parsed.user)
          setRole(parsed.role)
        }
      } finally {
        setLoading(false)
      }
    }
    void hydrate()
  }, [])

  const login = useCallback(async (login: string, password: string) => {
    const res = await loginRequest(login, password)
    const profile = await fetchProfile(res.access_token)
    const combined = {
      ...res.user,
      ...profile,
    }
    queryClient.clear()
    setToken(res.access_token)
    setUser(combined)
    setRole(res.role)
    setSyncAuthToken(res.access_token)
    await AsyncStorage.multiSet([
      [TOKEN_KEY, res.access_token],
      [USER_KEY, JSON.stringify(res)],
      [PROFILE_KEY, JSON.stringify(combined)],
    ])
  }, [queryClient])

  const logout = useCallback(async () => {
    queryClient.clear()
    setToken(null)
    setUser(null)
    setRole(null)
    setSyncAuthToken(null)
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, PROFILE_KEY])
    await clearPersistedQueryCache()
  }, [queryClient])

  useEffect(() => {
    if (!token || loading) return
    let cancelled = false

    const refreshProfile = async () => {
      try {
        const profile = await fetchProfile(token)
        if (cancelled) return
        setUser(prev => {
          const merged = { ...(prev ?? {}), ...profile } as any
          AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(merged)).catch(() => {})
          return merged
        })
        setRole(prev => prev ?? profile.role)
      } catch (err) {
        if (cancelled) return
        const status = (err as any)?.status as number | undefined
        const message = (err as Error)?.message?.toLowerCase?.() ?? ''
        if (status === 401 || message.includes('invalid token') || message.includes('unauthorized')) {
          await logout()
        }
      }
    }

    void refreshProfile()
    return () => {
      cancelled = true
    }
  }, [token, loading, logout])

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
