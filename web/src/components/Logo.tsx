export function Logo({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-600)" />
          </linearGradient>
        </defs>
        <path d="M12 2l7 4v12l-7 4-7-4V6l7-4z" fill="url(#g1)" opacity="0.9" />
        <path d="M12 6l3.5 2v4L12 14l-3.5-2V8L12 6z" fill="currentColor" opacity="0.8" />
      </svg>
      <span style={{ letterSpacing: .3 }}>Aren Safety</span>
    </div>
  )
}

