// DailyPage.jsx
import { useState, useEffect } from 'react'
import { useStore } from '../utils/store'
import { MOON_PHASES } from '../utils/astrology'
import { getDailyHoroscope, getFallbackResponse } from '../utils/claude'
import AstroChat from '../components/AstroChat'
import { Link } from 'react-router-dom'

export function DailyPage() {
  const { chart, userName } = useStore()
  const [reading, setReading] = useState('')
  const [loading, setLoading] = useState(false)

  const today = new Date()
  const todayStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    if (!chart) return
    setLoading(true)
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
    const generate = async () => {
      try {
        if (apiKey && apiKey.length > 10) {
          const res = await getDailyHoroscope(chart, userName)
          setReading(res)
        } else {
          await new Promise(r => setTimeout(r, 1000))
          const fn = (userName || 'dear soul').split(' ')[0]
          const sun = chart.planets[0].sign, moon = chart.planets[1].sign
          const mp = MOON_PHASES[chart.moonPhaseIndex]
          setReading(`The cosmos aligns beautifully for you today, ${fn}. With your ${sun} Sun awakened by Jupiter's expansive influence, this is a powerful day to pursue what truly matters to your heart.\n\nThe ${mp.name} ${mp.emoji} amplifies your ${moon} Moon energy — your intuition is sharper than usual. Trust the quiet knowing beneath the noise, especially in any decision made before noon.\n\nAn unexpected conversation today carries seeds of something lasting. Be open to who reaches out. Your ${chart.lagnaName} Ascendant is drawing the right people toward you.\n\nPrecaution: Saturn's current position advises caution in financial matters — avoid impulsive spending or signing agreements today.\n\nLucky window: ${['Morning (6–9 AM)', 'Late morning (10 AM–12 PM)', 'Afternoon (2–5 PM)', 'Evening (6–8 PM)'][today.getDate() % 4]}\n\nAffirmation: "I trust the cosmic timing of my life. Everything is unfolding exactly as it should."`)
        }
      } catch {
        setReading(getFallbackResponse('daily horoscope', chart, userName))
      } finally { setLoading(false) }
    }
    generate()
  }, [chart])

  if (!chart) return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap-sm" style={{ textAlign: 'center', paddingTop: 120 }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>🌙</div>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Your Daily Cosmic Reading</h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', marginBottom: 32 }}>Generate your birth chart first to receive your personalised daily reading.</p>
        <Link to="/chart" className="btn-primary">✦ Generate My Chart First</Link>
      </div>
    </main>
  )

  const mp = MOON_PHASES[chart.moonPhaseIndex]
  const transits = [
    { planet: '☉', text: `Sun in ${chart.planets[0].sign} — Your core identity is highlighted today`, type: 'good' },
    { planet: '☽', text: `Moon in ${chart.planets[1].sign} — Emotional sensitivity is heightened`, type: 'mindful' },
    { planet: '♃', text: 'Jupiter aspects your 5th house — Creative energy flows freely', type: 'good' },
    { planet: '♄', text: 'Saturn advises patience in family and financial matters today', type: 'caution' },
    { planet: '♀', text: `Venus activates your 7th house — A beautiful day for relationships`, type: 'good' },
    { planet: '☿', text: 'Mercury sharpens communication — Ideal for important conversations', type: 'good' },
  ]
  const typeColor = { good: 'var(--green)', mindful: 'var(--gold)', caution: 'var(--rose)' }
  const typeLabel = { good: 'Favourable', mindful: 'Mindful', caution: 'Challenging' }

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap">
        <div className="label" style={{ marginBottom: 10 }}>✦ Daily Reading</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: 8 }}>Your Cosmic Day</h1>
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2, marginBottom: 40 }}>{todayStr.toUpperCase()}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Main reading */}
            <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg,rgba(212,168,83,.06),rgba(124,92,252,.04))', borderColor: 'rgba(212,168,83,.2)' }}>
              <div className="label" style={{ marginBottom: 12 }}>✦ Your Personalised Reading</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div className="spinner" /><p style={{ marginTop: 16, color: 'var(--muted)', fontStyle: 'italic', animation: 'pulse 1.5s infinite' }}>Consulting the stars...</p>
                </div>
              ) : (
                <div style={{ fontSize: 17, lineHeight: 1.9, color: 'var(--muted)', fontStyle: 'italic' }}>
                  {reading.split('\n').map((line, i) => line ? <p key={i} style={{ marginBottom: 14 }}>{line}</p> : null)}
                </div>
              )}
            </div>

            {/* Transits */}
            <div className="card">
              <div className="label" style={{ marginBottom: 16 }}>Today's Planetary Transits</div>
              {transits.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < transits.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{t.planet}</span>
                  <span style={{ flex: 1, fontSize: 14, color: 'var(--muted)' }}>{t.text}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 8px', borderRadius: 6, background: `${typeColor[t.type]}18`, border: `1px solid ${typeColor[t.type]}40`, color: typeColor[t.type], whiteSpace: 'nowrap' }}>{typeLabel[t.type]}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Moon */}
            <div className="card" style={{ textAlign: 'center', padding: 28 }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{mp.emoji}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{mp.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--muted2)', marginBottom: 14 }}>{mp.pct}% Illuminated</div>
              <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${mp.pct}%`, height: '100%', background: 'linear-gradient(90deg,rgba(212,168,83,.4),var(--gold))', borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14 }}>{mp.energy}</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--gold)', opacity: .6, marginBottom: 8 }}>TONIGHT'S RITUAL</div>
              <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6 }}>{mp.ritual}</p>
            </div>

            {/* Lucky */}
            <div className="card">
              <div className="label" style={{ marginBottom: 14 }}>Today's Lucky Numbers</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {chart.luckyNums.map(n => (
                  <div key={n} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(212,168,83,.3)', background: 'rgba(212,168,83,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--gold)' }}>{n}</div>
                ))}
              </div>
              <div className="label" style={{ marginBottom: 10 }}>Lucky Colours</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['#d4a853','Gold'],['#7c5cfc','Indigo'],['#2dd4c0','Teal']].map(([c, name]) => (
                  <div key={name} style={{ flex: 1, height: 32, borderRadius: 8, background: c, opacity: .75, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, color: c === '#d4a853' ? '#000' : '#fff' }}>{name}</div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="card" style={{ padding: 20 }}>
              <div className="label" style={{ marginBottom: 10 }}>Ask About Today</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 14 }}>Have a specific question about today's energies? Ask the AI.</p>
              <Link to="/chart" onClick={() => setTimeout(() => document.querySelector('[data-tab="chat"]')?.click(), 100)} className="btn-secondary" style={{ display: 'block', textAlign: 'center', width: '100%' }}>Open Astro Chat →</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
