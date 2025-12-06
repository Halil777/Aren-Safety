import { motion } from 'framer-motion'
import { Button } from '../components/Button'

const tiers = [
  { name: 'Starter', price: '$0', features: ['Up to 5 users', 'Basic HSE modules', 'Email support'] },
  { name: 'Growth', price: '$149', features: ['Up to 50 users', 'Full modules', 'Priority support'] },
  { name: 'Enterprise', price: 'Custom', features: ['Unlimited users', 'SLA & SSO', 'Dedicated success'] }
]

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <h2 style={{ margin: '0 0 16px 0', fontSize: 28 }}>Pricing</h2>
        <div className="grid-4">
          {tiers.map((t, i) => (
            <motion.div key={i} className="card shadow-hover" style={{ padding: 18, display: 'grid', gap: 12 }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{t.name}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{t.price}<span style={{ fontSize: 14, opacity: .75 }}>/mo</span></div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {t.features.map((f, j) => (<li key={j} style={{ marginBottom: 6 }}>{f}</li>))}
              </ul>
              <div><Button>Choose</Button></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

