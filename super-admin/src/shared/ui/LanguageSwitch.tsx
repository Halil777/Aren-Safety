import { type ChangeEvent } from 'react'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { LANGUAGE_STORAGE_KEY, supportedLanguages } from '@/shared/i18n/config'

export function LanguageSwitch() {
  const { i18n, t } = useTranslation()

  const normalizedLanguage =
    supportedLanguages.find(language =>
      i18n.language?.startsWith(language.code)
    )?.code ?? supportedLanguages[0]?.code

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value
    void i18n.changeLanguage(nextLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    }
  }

  return (
    <Wrapper>
      <Label>{t('language.label')}</Label>
      <Control>
        <Languages size={16} aria-hidden color="currentColor" />
        <Select value={normalizedLanguage} onChange={handleChange}>
          {supportedLanguages.map(language => (
            <option key={language.code} value={language.code}>
              {language.shortLabel}
            </option>
          ))}
        </Select>
      </Control>
    </Wrapper>
  )
}

const Wrapper = styled.label`
  display: inline-flex;
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

const Control = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 6px ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const Select = styled.select`
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  option {
    color: #0f172a;
  }
`
