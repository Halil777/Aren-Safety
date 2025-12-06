import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export function CTA() {
  const { t } = useTranslation()
  return (
    <section className="section-sm">
      <div className="container card" style={{ padding: 24, display: 'grid', gap: 12, alignItems: 'center' }}>
        <motion.h3
          style={{ margin: 0, fontSize: 24 }}
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          {t('cta.title')}
        </motion.h3>
        <p style={{ margin: 0, opacity: .8 }}>{t('cta.subtitle')}</p>
        <div><Link to="/contact"><Button>{t('cta.action')}</Button></Link></div>
      </div>
    </section>
  )
}

