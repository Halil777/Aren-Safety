import { Laptop2, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type ThemeMode, useThemeStore } from '@/shared/store/theme-store'
import { Button } from './button'

const themeOptions: Array<{ value: ThemeMode; icon: typeof Sun; translationKey: string }> = [
  { value: 'light', icon: Sun, translationKey: 'theme.light' },
  { value: 'dark', icon: Moon, translationKey: 'theme.dark' },
  { value: 'system', icon: Laptop2, translationKey: 'theme.system' },
]

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">{t('theme.label')}</span>
      <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1 shadow-sm">
        {themeOptions.map(({ value, icon: Icon, translationKey }) => (
          <Button
            key={value}
            type="button"
            size="icon"
            variant={theme === value ? 'secondary' : 'ghost'}
            aria-label={t(translationKey)}
            onClick={() => setTheme(value)}
          >
            <Icon
              className="h-4 w-4"
              strokeWidth={value === 'system' ? 1.75 : 2}
            />
          </Button>
        ))}
      </div>
    </div>
  )
}
