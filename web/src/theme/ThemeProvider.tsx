import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Theme = 'light' | 'dark'
type ThemeContextType = { theme: Theme; toggle: () => void; set: (t: Theme) => void }
const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const [theme, setTheme] = useLocalStorage<Theme>('theme', prefersDark ? 'dark' : 'light')

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({ theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'), set: setTheme }),
    [theme, setTheme]
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

