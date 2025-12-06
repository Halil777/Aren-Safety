import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: 16, maxWidth: 860 }}>
        <h1 style={{ fontSize: 40, margin: 0 }}>{t('about.title')}</h1>
        <p style={{ fontSize: 18, lineHeight: 1.75, opacity: .85 }}>{t('about.body')}</p>
      </div>
    </section>
  )
}

