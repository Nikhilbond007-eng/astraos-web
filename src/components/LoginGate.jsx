import { Link } from 'react-router-dom'
import { useStore } from '../utils/store'
import { useState } from 'react'
import AuthModal from './AuthModal'

export default function LoginGate({ children, message = 'Sign in to access this feature.' }) {
  const { user, chart } = useStore()
  const [showAuth, setShowAuth] = useState(false)

  if (!user) return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>✦</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 14, color: 'var(--gold2)' }}>
          Sign In Required
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', marginBottom: 32, lineHeight: 1.8 }}>
          {message}
        </p>
        <button className="btn-primary" style={{ fontSize: 15, margin: '0 auto' }} onClick={() => setShowAuth(true)}>
          ✦ Sign In to Continue
        </button>
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setShowAuth(true)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'var(--font-serif)', fontSize: 14, cursor: 'pointer' }}
          >
            Don't have an account? Sign up free
          </button>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </main>
  )

  if (!chart) return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>🔮</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 14, color: 'var(--gold2)' }}>
          Generate Your Chart First
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', marginBottom: 32, lineHeight: 1.8 }}>
          Your birth chart is the foundation of everything. Generate it once and all features unlock automatically.
        </p>
        <Link to="/chart" className="btn-primary" style={{ fontSize: 15 }}>
          ✦ Generate My Birth Chart
        </Link>
      </div>
    </main>
  )

  return children
}
