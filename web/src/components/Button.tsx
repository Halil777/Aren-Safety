import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function Button({ children }: { children: ReactNode }) {
  return (
    <motion.button
      whileHover={{ y: -1, boxShadow: '0 10px 24px rgba(0,0,0,.18)' }}
      whileTap={{ scale: .98 }}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid color-mix(in oklab, var(--primary) 50%, var(--border))',
        background: 'linear-gradient(180deg, color-mix(in oklab, var(--primary) 12%, var(--surface)), var(--surface))',
        color: 'var(--text)',
        cursor: 'pointer'
      }}
    >
      {children}
    </motion.button>
  )
}

