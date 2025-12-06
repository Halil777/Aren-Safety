import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './Button'
import { Logo } from './Logo'
import { useState } from 'react'

export function Navbar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  return (
    <header className="nav-blur" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
        <Link to="/" aria-label="Aren Safety home"><Logo /></Link>
        <nav className="nav-desktop" style={{ display: 'flex', gap: 14, marginLeft: 24 }}>
          <NavLink to="/" className={({ isActive }) => linkCls(isActive || pathname === '/')}>{t('nav.home')}</NavLink>
          <NavLink to="/about" className={({ isActive }) => linkCls(isActive)}>{t('nav.about')}</NavLink>
          <NavLink to="/contact" className={({ isActive }) => linkCls(isActive)}>{t('nav.contact')}</NavLink>
        </nav>
        <div className="nav-desktop" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <LanguageSwitcher />
          <ThemeToggle />
          <Link to="/contact"><Button>{t('nav.demo')}</Button></Link>
        </div>
        <button className="nav-mobile-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu" style={{ marginLeft: 'auto', display: 'none', padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)' }}>
          ☰
        </button>
      </div>
      {open && (
        <div className="nav-mobile" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'grid', gap: 12, padding: '12px 20px' }}>
            <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => linkCls(isActive || pathname === '/')}>{t('nav.home')}</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className={({ isActive }) => linkCls(isActive)}>{t('nav.about')}</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className={({ isActive }) => linkCls(isActive)}>{t('nav.contact')}</NavLink>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <LanguageSwitcher />
              <ThemeToggle />
              <Link to="/contact" onClick={() => setOpen(false)}><Button>{t('nav.demo')}</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
function linkCls(active: boolean) {
  return [
    'nav-link',
    active ? 'active' : ''
  ].join(' ')
}
