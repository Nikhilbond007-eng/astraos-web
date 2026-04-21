import { useStore } from '../utils/store'
import { Link } from 'react-router-dom'

export default function PaywallModal() {
  const { showPaywall, setShowPaywall, setPremium } = useStore()
  if (!showPaywall) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,2,11,0.92)', backdropFilter: 'blur(12px)' }}>
      <div style={{ background: 'linear-gradient(135deg,rgba(212,168,83,.08),rgba(124,92,252,.06))', border: '1px solid rgba(212,168,83,.25)', borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '90%', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => setShowPaywall(false)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, lineHeight: 1 }}>×</button>

        <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold2)', marginBottom: 12 }}>You've Used 3 Free Messages</h2>
        <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28, fontStyle: 'italic' }}>
          Your cosmic journey has just begun. Unlock unlimited AI conversations, detailed PDF reports, and your complete life forecast.
        </p>

        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 4, color: 'var(--gold)', marginBottom: 12 }}>PREMIUM INCLUDES</div>
          {['Unlimited AI Astro Chat', 'Full Dasha + Transit Reports', 'Monthly PDF Forecasts', 'Compatibility Deep Reports', 'Priority cosmic alerts'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 14, color: 'var(--muted)', borderBottom: i < 4 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
              <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span> {f}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pricing" onClick={() => setShowPaywall(false)} className="btn-primary" style={{ fontSize: 15 }}>
            ✦ See Plans — from ₹299/mo
          </Link>
          <button onClick={() => setShowPaywall(false)} className="btn-secondary" style={{ fontSize: 13 }}>
            Continue Free
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--muted2)', marginTop: 20 }}>
          Cancel anytime · Secure payment via Razorpay
        </p>
      </div>
    </div>
  )
}
