import { motion } from 'framer-motion'

const items = [
  { title: 'Construction', desc: 'Site safety, PTW and audits' },
  { title: 'Manufacturing', desc: 'Training, incidents, SOPs' },
  { title: 'Energy', desc: 'LOTO, work at height' },
  { title: 'Logistics', desc: 'Fleet and warehouse HSE' },
  { title: 'Healthcare', desc: 'Compliance and reporting' },
  { title: 'Mining', desc: 'Hazard tracking, inspections' }
]

export function Industries() {
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ margin: '0 0 16px 0', fontSize: 28 }}>Industries</h2>
        <div className="grid-4">
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

