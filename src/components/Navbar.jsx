import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../utils/store'
import { signOut } from '../utils/supabase'
import AuthModal from './AuthModal'
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
  const { user, isPremium } = useStore()
  const [open, setOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            <span className={styles.logoText}>AstraOS</span>
          </Link>

          {/* Desktop nav links */}
          <div className={styles.links}>
            {NAV.map(n => (
              <Link
                key={n.path}
                to={n.path}
                className={`${styles.link} ${pathname === n.path ? styles.active : ''}`}
              >
                {n.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className={styles.actions}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isPremium && (
                  <span className={styles.premiumBadge}>✦ Premium</span>
                )}
                <Link
                  to="/profile"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--gold)',
                    letterSpacing: 1,
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: 100,
                    border: '1px solid rgba(212,168,83,.25)',
                    background: 'rgba(212,168,83,.06)',
                    transition: 'all .2s'
                  }}
                >
                  {user.email?.split('@')[0]} ✦
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary"
                  style={{ padding: '7px 16px', fontSize: 12 }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowAuth(true)}
                  className="btn-secondary"
                  style={{ padding: '9px 20px', fontSize: 12 }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  className="btn-primary"
                  style={{ padding: '9px 20px', fontSize: 12 }}
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className={styles.burger}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className={styles.mobile}>
            {NAV.map(n => (
              <Link
                key={n.path}
                to={n.path}
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            {user ? (
              <div className={styles.mobileActions}>
                <Link
                  to="/profile"
                  className={styles.mobileLink}
                  onClick={() => setOpen(false)}
                  style={{ color: 'var(--gold)' }}
                >
                  👤 My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'var(--font-serif)', fontSize: 16, padding: '13px 16px', cursor: 'pointer', textAlign: 'left' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className={styles.mobileActions}>
                <button
                  onClick={() => { setShowAuth(true); setOpen(false) }}
                  className="btn-primary"
                  style={{ width: '100%', textAlign: 'center', marginTop: 8 }}
                >
                  ✦ Sign In / Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
