import { Laptop2, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type ThemeMode, useThemeStore } from '@/shared/store/theme-store'
import { Button } from './Button'
import styled from 'styled-components'

const themeOptions: Array<{
  value: ThemeMode
  icon: typeof Sun
  translationKey: string
}> = [
  { value: 'light', icon: Sun, translationKey: 'theme.light' },
  { value: 'dark', icon: Moon, translationKey: 'theme.dark' },
  { value: 'system', icon: Laptop2, translationKey: 'theme.system' },
]

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore(state => state.theme)
  const setTheme = useThemeStore(state => state.setTheme)

  return (
    <Container>
      <Label>{t('theme.label')}</Label>
      <SwitchGroup>
        {themeOptions.map(({ value, icon: Icon, translationKey }) => (
          <Button
            key={value}
            type="button"
            size="icon"
            variant={theme === value ? 'secondary' : 'ghost'}
            aria-label={t(translationKey)}
            onClick={() => setTheme(value)}
          >
            <Icon size={16} strokeWidth={value === 'system' ? 1.75 : 2} />
          </Button>
        ))}
      </SwitchGroup>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`

const Label = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
`

const SwitchGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`
