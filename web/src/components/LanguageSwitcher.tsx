import i18n, { languages } from '../i18n'
import { useState } from 'react'

export function LanguageSwitcher() {
  const [lng, setLng] = useState(i18n.language.slice(0,2))
  function change(code: string) {
    i18n.changeLanguage(code)
    try { localStorage.setItem('lang', code) } catch {}
    setLng(code)
  }
  return (
    <div style={{ display: 'flex', gap: 6, padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: 'none',
            background: lng === l.code ? 'var(--primary)' : 'transparent',
            color: lng === l.code ? '#fff' : 'var(--text)',
            cursor: 'pointer'
          }}
          aria-pressed={lng === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

