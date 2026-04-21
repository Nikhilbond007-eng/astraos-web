import { useState } from 'react'
import { signIn, signUp } from '../utils/supabase'
import { useStore } from '../utils/store'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async () => {
    setErr(''); setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(form.email, form.password, form.name)
        setSuccess('Check your email to confirm your account, then sign in.')
        setMode('signin')
      } else {
        await signIn(form.email, form.password)
        onClose()
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(3,2,11,0.92)', backdropFilter: 'blur(12px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg,rgba(212,168,83,.08),rgba(124,92,252,.06))',
        border: '1px solid rgba(212,168,83,.25)',
        borderRadius: 24, padding: '48px 40px',
        maxWidth: 440, width: '90%', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 20,
          background: 'none', border: 'none',
          color: 'var(--muted)', fontSize: 22, cursor: 'pointer'
        }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22,
            color: 'var(--gold2)', marginBottom: 8
          }}>
            {mode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, fontStyle: 'italic' }}>
            {mode === 'signin'
              ? 'Sign in to access your saved chart'
              : 'Create your account to save your cosmic blueprint'}
          </p>
        </div>

        {success && (
          <div style={{
            background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.25)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: 'var(--green)', fontSize: 14
          }}>{success}</div>
        )}

        {err && (
          <div style={{
            background: 'rgba(240,98,146,.1)', border: '1px solid rgba(240,98,146,.25)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: 'var(--rose)', fontSize: 14
          }}>{err}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handle()}
            />
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', textAlign: 'center', fontSize: 15 }}
          onClick={handle}
          disabled={loading}
        >
          {loading ? 'Please wait...' : mode === 'signin' ? '✦ Sign In' : '✦ Create Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErr(''); setSuccess('') }}
            style={{
              background: 'none', border: 'none',
              color: 'var(--gold)', fontFamily: 'var(--font-serif)',
              fontSize: 14, cursor: 'pointer'
            }}
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
