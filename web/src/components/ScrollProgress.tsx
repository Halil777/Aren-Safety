import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = (h.scrollHeight - h.clientHeight) || 1
      const sc = h.scrollTop || document.body.scrollTop
      setP(Math.min(100, Math.max(0, (sc / max) * 100)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div aria-hidden style={{ position: 'fixed', top: 0, left: 0, height: 3, width: '100%', zIndex: 60, background: 'transparent' }}>
      <div style={{ height: '100%', width: p + '%', background: 'linear-gradient(90deg, var(--primary), var(--primary-600))' }} />
    </div>
  )
}

