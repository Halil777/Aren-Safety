import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: 24, maxWidth: 760 }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>{t('contact.title')}</h1>
        <p style={{ opacity: .8, margin: 0 }}>{t('contact.subtitle')}</p>
        <motion.form
          className="card"
          style={{ padding: 20, display: 'grid', gap: 14 }}
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onSubmit={(e) => { e.preventDefault(); alert('Thanks! We will get back to you.'); }}
        >
          <label>
            <div style={{ marginBottom: 6, opacity: .8 }}>Name</div>
            <input required placeholder="Your name" style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: 6, opacity: .8 }}>Email</div>
            <input required type="email" placeholder="you@company.com" style={inputStyle} />
          </label>
          <label>
            <div style={{ marginBottom: 6, opacity: .8 }}>Message</div>
            <textarea required placeholder="Tell us about your goals…" rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </label>
          <div><Button>{t('contact.send')}</Button></div>
        </motion.form>
      </div>
    </section>
  )
}
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  outline: 'none'
}

