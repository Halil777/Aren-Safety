import { motion } from 'framer-motion'

const partners = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Wayne', 'Stark', 'Hooli']

export function Partners() {
  return (
    <section className="section-sm" aria-label="Partners">
      <div className="container" style={{ opacity: .8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
          {partners.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: .9, y: 0 }} viewport={{ once: true }}>
              <span style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)' }}>{p}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

