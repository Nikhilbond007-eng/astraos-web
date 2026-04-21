import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../utils/store'
import styles from './Navbar.module.css'

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/chart', label: 'Birth Chart' },
  { path: '/daily', label: 'Daily' },
  { path: '/tarot', label: 'Tarot' },
  { path: '/compatibility', label: 'Compatibility' },
  { path: '/moon', label: 'Moon' },
  { path: '/numerology', label: 'Numerology' },
  { path: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const isPremium = useStore(s => s.isPremium)
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>AstraOS</span>
        </Link>

        <div className={styles.links}>
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`${styles.link} ${pathname === n.path ? styles.active : ''}`}>
              {n.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          {isPremium ? (
            <span className={styles.premiumBadge}>✦ Premium</span>
          ) : (
            <Link to="/pricing" className="btn-primary" style={{ padding: '9px 22px', fontSize: '12px' }}>
              Get Premium
            </Link>
          )}
          <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.mobile}>
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={styles.mobileLink} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
