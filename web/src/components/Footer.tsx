export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="section-sm" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ opacity: .8 }}>© {year} Aren Safety</div>
        <div style={{ display: 'flex', gap: 16, opacity: .75 }}>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  )
}

