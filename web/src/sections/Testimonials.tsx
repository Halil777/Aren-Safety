import { motion } from 'framer-motion'

const testimonials = [
  { name: 'Project Director, EPC', quote: 'Aren Safety became our single source of truth for permits and training. Adoption was instant.' },
  { name: 'HSE Manager, Construction', quote: 'We cut incident investigation time in half and improved audits across all sites.' },
  { name: 'Operations Lead, Manufacturing', quote: 'Beautiful UX, accurate data, and support that actually understands our workflows.' }
]

export function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ margin: '0 0 16px 0', fontSize: 28 }}>What customers say</h2>
        <div className="grid-4">
          {testimonials.map((t, i) => (
            <motion.blockquote key={i} className="card shadow-hover" style={{ padding: 18 }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>“{t.quote}”</p>
              <footer style={{ opacity: .75, marginTop: 10 }}>— {t.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

