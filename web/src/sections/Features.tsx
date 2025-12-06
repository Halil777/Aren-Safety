import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function Features() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true }) as { title: string; desc: string }[]
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ margin: '0 0 16px 0', fontSize: 28 }}>{t('features.title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
          {items.map((it, i) => (
            <motion.div
              key={i}
              className="card shadow-hover"
              style={{ padding: 18 }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{it.title}</div>
              <div style={{ opacity: .8, lineHeight: 1.6 }}>{it.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

