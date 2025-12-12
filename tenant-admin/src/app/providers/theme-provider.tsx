import { useEffect, type ReactNode } from 'react'
import {
  getStoredTheme,
  persistTheme,
  resolveTheme,
  type ThemeMode,
  useThemeStore,
} from '@/shared/store/theme-store'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    const applyTheme = (mode: ThemeMode) => {
      const resolved = resolveTheme(mode)
      const root = document.documentElement
      root.classList.toggle('dark', resolved === 'dark')
      root.dataset.theme = resolved
    }

    const stored = getStoredTheme()
    const initial = stored ?? useThemeStore.getState().theme

    setTheme(initial)
    applyTheme(initial)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      if (useThemeStore.getState().theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    const unsubscribe = useThemeStore.subscribe((state) => {
      persistTheme(state.theme)
      applyTheme(state.theme)
    })

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
      unsubscribe()
    }
  }, [setTheme])

  return <>{children}</>
}
