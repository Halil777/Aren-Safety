import { motion } from 'framer-motion'

const stats = [
  { k: '99.9%', v: 'Uptime' },
  { k: '10k+', v: 'Permits processed' },
  { k: '50%', v: 'Audit time saved' },
  { k: '25+', v: 'Integrations' }
]

export function Stats() {
  return (
    <section className="section-sm">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map((s, i) => (
          <motion.div key={i} className="card" style={{ padding: 18, textAlign: 'center' }}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{s.k}</div>
            <div style={{ opacity: .75 }}>{s.v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

