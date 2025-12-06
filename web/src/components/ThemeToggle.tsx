import { useTheme } from '../theme/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      style={{
        padding: '8px 10px',
        borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

