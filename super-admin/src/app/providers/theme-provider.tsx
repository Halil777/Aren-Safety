import { useEffect, useState, type ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import {
  getStoredTheme,
  persistTheme,
  resolveTheme,
  useThemeStore,
} from '@/shared/store/theme-store'
import { GlobalStyle } from '@/shared/styles/global'
import { darkTheme, lightTheme } from '@/shared/styles/theme'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(useThemeStore.getState().theme)
  )
  const setTheme = useThemeStore(state => state.setTheme)

  useEffect(() => {
    const stored = getStoredTheme()
    if (stored) {
      setTheme(stored)
    }

    const apply = () => {
      const next = resolveTheme(useThemeStore.getState().theme)
      setResolvedTheme(next)
      persistTheme(useThemeStore.getState().theme)
    }

    apply()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      if (useThemeStore.getState().theme === 'system') {
        apply()
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    const unsubscribe = useThemeStore.subscribe(() => {
      apply()
    })

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
      unsubscribe()
    }
  }, [setTheme])

  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  )
}
