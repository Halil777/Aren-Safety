import { type ChangeEvent } from 'react'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY, supportedLanguages } from '@/shared/i18n/config'
import { cn } from '@/shared/lib/cn'

export function LanguageSwitch() {
  const { i18n, t } = useTranslation()

  const normalizedLanguage =
    supportedLanguages.find((language) => i18n.language?.startsWith(language.code))?.code ??
    supportedLanguages[0]?.code

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value
    void i18n.changeLanguage(nextLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    }
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">{t('language.label')}</span>
      <span
        className={cn(
          'flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-foreground shadow-sm',
        )}
      >
        <Languages className="h-4 w-4 text-muted-foreground" aria-hidden />
        <select
          className="bg-transparent text-sm font-medium outline-none"
          value={normalizedLanguage}
          onChange={handleChange}
        >
          {supportedLanguages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.shortLabel}
            </option>
          ))}
        </select>
      </span>
    </label>
  )
}
