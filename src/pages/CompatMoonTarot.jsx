import { useState } from 'react'
import { TAROT_CARDS, SIGNS, SIGN_SYMBOLS, SIGN_ELEMENTS, MOON_PHASES, computeCompatibility } from '../utils/astrology'
import { useStore } from '../utils/store'
import { getCompatibility } from '../utils/api'
import styles from './Pages.module.css'

// ─── TAROT PAGE ───
export function TarotPage() {
  const { chart, userName } = useStore()
  const [cards, setCards] = useState([])
  const [revealed, setRevealed] = useState([false, false, false])
  const [drawn, setDrawn] = useState(false)

  const draw = () => {
    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5).slice(0, 3)
    setCards(shuffled)
    setRevealed([false, false, false])
    setDrawn(true)
  }

  const reveal = (i) => {
    const next = [...revealed]
    next[i] = true
    setRevealed(next)
  }

  const allRevealed = revealed.every(Boolean) && cards.length === 3
  const positions = ['Past', 'Present', 'Future']

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap-sm">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="label" style={{ marginBottom: 10 }}>✦ Tarot Reading</div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', marginBottom: 16 }}>The Cards Speak</h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Draw your three cards — Past, Present, and Future. The cosmos reveals what the rational mind cannot see.
            {chart && <span style={{ color: 'var(--teal)' }}> Reading personalised for your {chart.currentDasha.planet} Dasha.</span>}
          </p>
          <button className="btn-primary" onClick={draw} style={{ fontSize: 15 }}>
            {drawn ? '↺  Draw Again' : '✦  Draw My Cards'}
          </button>
        </div>

        {drawn && (
          <>
            <div className={styles.tarotSpread}>
              {cards.map((card, i) => (
                <div key={i} className={styles.tarotCard} onClick={() => reveal(i)}>
                  <div className={`${styles.tarotInner} ${revealed[i] ? styles.tarotRevealed : ''}`}>
                    <div className={styles.tarotBack}>
                      <div className={styles.tarotBackPattern} />
                      <div style={{ fontSize: 36, opacity: .3 }}>✦</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,.2)', marginTop: 8 }}>TAP TO REVEAL</div>
                    </div>
                    <div className={styles.tarotFace}>
                      <div style={{ fontSize: 42, marginBottom: 10 }}>{card.emoji}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--gold2)', textAlign: 'center', marginBottom: 6 }}>{card.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2, color: 'var(--teal)' }}>UPRIGHT</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--muted2)' }}>{positions[i]}</div>
                </div>
              ))}
            </div>

            {allRevealed && (
              <div className="card" style={{ marginTop: 36, padding: 32, animation: 'fadeUp .6s ease both' }}>
                <div className="label" style={{ marginBottom: 16 }}>✦ Your Three-Card Reading</div>
                {cards.map((card, i) => (
                  <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: 28 }}>{card.emoji}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--gold2)' }}>{card.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--muted2)' }}>{positions[i].toUpperCase()}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8, fontStyle: 'italic' }}>{card.meaning}</p>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: 20, background: 'rgba(212,168,83,.05)', border: '1px solid rgba(212,168,83,.15)', borderRadius: 14 }}>
                  <p style={{ fontSize: 16, color: 'var(--muted2)', lineHeight: 1.8, fontStyle: 'italic' }}>
                    Together, {cards[0].name} in the Past, {cards[1].name} in the Present, and {cards[2].name} in the Future tell a story of transition and the deepening of your cosmic purpose.
                    {chart ? ` During your ${chart.currentDasha.planet} Dasha, these cards carry particular significance — trust their guidance.` : ' The universe speaks clearly — are you listening?'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

// ─── COMPATIBILITY PAGE ───
export function CompatPage() {
  const { chart } = useStore()
  const [s1, setS1] = useState(chart ? chart.planets[0].signIdx : 0)
  const [s2, setS2] = useState(1)
  const [name2, setName2] = useState('')
  const [type, setType] = useState('love')
  const [result, setResult] = useState(null)
  const [aiReading, setAiReading] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  const checkCompat = async () => {
    const scores = computeCompatibility(s1, s2)
    setResult(scores)
    if (chart) {
      setLoadingAI(true)
      try {
        const data = await getCompatibility(
          chart,
          { signIdx: s2, planets: [{ sign: SIGNS[s2] }, { sign: SIGNS[s2] }], lagnaName: SIGNS[s2], currentDasha: chart.currentDasha },
          chart.sunSign,
          name2 || SIGNS[s2],
          type
        )
        if (data.aiReading) setAiReading(data.aiReading)
      } catch (e) {
        console.log('AI reading unavailable')
      } finally {
        setLoadingAI(false)
      }
    }
  }

  const typeVerdicts = (scores) => ({
    love: `${SIGNS[s1]} and ${SIGNS[s2]} create a ${scores.overall > 75 ? 'deeply magnetic and harmonious' : 'complex but growth-filled'} romantic pairing. Your ${SIGN_ELEMENTS[s1]} and ${SIGN_ELEMENTS[s2]} elemental natures ${scores.overall > 75 ? 'complement each other beautifully' : 'challenge each other to grow in profound ways'}. ${scores.overall > 80 ? 'This connection has real, lasting potential.' : 'The friction between you becomes your greatest teacher.'}`,
    friend: `As friends, ${SIGNS[s1]} and ${SIGNS[s2]} offer ${scores.overall > 75 ? 'enriching, loyal companionship' : 'a fascinating dynamic that deepens both of you'}. Your elemental natures create a friendship that ${scores.overall > 75 ? 'is naturally balanced and uplifting' : 'always surprises and teaches'}.`,
    business: `${SIGNS[s1]} and ${SIGNS[s2]} as business partners bring ${scores.overall > 70 ? 'complementary strengths that create a powerful team' : 'interesting contrasts that produce innovative outcomes'}. Your energies ${scores.overall > 70 ? 'balance practical and visionary beautifully' : 'push each other outside comfort zones'}.`,
    family: `Family bonds between ${SIGNS[s1]} and ${SIGNS[s2]} carry ${scores.overall > 70 ? 'deep intuitive understanding and warmth' : 'both depth and occasional friction — the hallmark of bonds that truly matter'}. This connection ${scores.overall > 70 ? 'creates a naturally supportive dynamic' : 'teaches the most important life lessons'}.`,
  })

  const scoreColor = (s) => s > 80 ? 'var(--green)' : s > 60 ? 'var(--gold)' : 'var(--rose)'
  const cats = result ? [
    { label: 'Emotional', score: result.emotional },
    { label: 'Intellectual', score: result.intellectual },
    { label: 'Physical', score: result.physical },
    { label: 'Spiritual', score: result.spiritual },
    { label: 'Long-term', score: result.longTerm },
  ] : []

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap-sm">
        <div className="label" style={{ marginBottom: 10 }}>✦ Compatibility</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', marginBottom: 12 }}>Cosmic Compatibility</h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', marginBottom: 40 }}>
          Vedic Guna Milan + Western synastry combined. Check compatibility for love, friendship, business, or family.
        </p>

        <div className="card" style={{ padding: 32, marginBottom: 28 }}>
          <div className={styles.compatRow}>
            <div style={{ flex: 1 }}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Your Sign</label>
                <select className="form-input" value={s1} onChange={e => setS1(Number(e.target.value))}>
                  {SIGNS.map((s, i) => <option key={s} value={i}>{SIGN_SYMBOLS[i]} {s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--gold)', padding: '20px 12px 0', flexShrink: 0 }}>✦</div>
            <div style={{ flex: 1 }}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Partner's Sign</label>
                <select className="form-input" value={s2} onChange={e => setS2(Number(e.target.value))}>
                  {SIGNS.map((s, i) => <option key={s} value={i}>{SIGN_SYMBOLS[i]} {s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.compatRow} style={{ marginBottom: 24 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Partner's Name (optional)</label>
              <input className="form-input" value={name2} onChange={e => setName2(e.target.value)} placeholder="Their name" />
            </div>
            <div style={{ width: 32, flexShrink: 0 }} />
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Relationship Type</label>
              <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                <option value="love">💞 Romantic Partner</option>
                <option value="friend">🤝 Best Friend</option>
                <option value="business">💼 Business Partner</option>
                <option value="family">🏠 Family</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={checkCompat}>
            ✦ Reveal Compatibility
          </button>
        </div>

        {result && (
          <div style={{ animation: 'fadeUp .6s ease both' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--muted)', marginBottom: 24 }}>
                {SIGN_SYMBOLS[s1]} {SIGNS[s1]} &nbsp;✦&nbsp; {SIGN_SYMBOLS[s2]} {SIGNS[s2]}
              </div>
              <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>
                <svg width="160" height="160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="12" />
                  <circle cx="80" cy="80" r="68" fill="none" stroke={scoreColor(result.overall)} strokeWidth="12"
                    strokeDasharray={`${result.overall * 4.27} 427`} strokeDashoffset="107" strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.5s ease' }} />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 700, color: scoreColor(result.overall) }}>{result.overall}%</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--muted2)' }}>MATCH</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="label" style={{ marginBottom: 16 }}>Compatibility Breakdown</div>
              {cats.map(c => (
                <div key={c.label} className="score-bar-wrap" style={{ marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 100, flexShrink: 0 }}>{c.label}</span>
                  <div className="score-bar-track"><div className="score-bar-fill" style={{ width: `${c.score}%`, background: scoreColor(c.score) }} /></div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text)', width: 36, textAlign: 'right', flexShrink: 0 }}>{c.score}%</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg,rgba(45,212,192,.05),rgba(124,92,252,.05))', borderColor: 'rgba(45,212,192,.15)', marginBottom: 20 }}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--muted)', fontStyle: 'italic' }}>
                {aiReading || typeVerdicts(result)[type]}
              </p>
              {loadingAI && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', marginTop: 12, animation: 'pulse 1.5s infinite' }}>✦ AI is reading the stars...</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// ─── MOON PAGE ───
export function MoonPage() {
  const { chart } = useStore()
  const today = new Date()
  const moonPhaseIndex = chart ? chart.moonPhaseIndex : Math.floor(((today.getDate() % 29.5) / 29.5) * 8) % 8
  const mp = MOON_PHASES[moonPhaseIndex]

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap">
        <div className="label" style={{ marginBottom: 10 }}>✦ Moon Phase</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', marginBottom: 12 }}>The Lunar Calendar</h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', marginBottom: 48 }}>
          Track the moon's energy and align your actions with the cosmic tides.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div className="card" style={{ textAlign: 'center', padding: 40, background: 'linear-gradient(135deg,rgba(124,92,252,.07),rgba(45,212,192,.04))', borderColor: 'rgba(124,92,252,.2)' }}>
            <div style={{ fontSize: 80, marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(255,255,255,.2))' }}>{mp.emoji}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{mp.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--muted2)', marginBottom: 20 }}>{mp.pct}% Illumination</div>
            <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ width: `${mp.pct}%`, height: '100%', background: 'linear-gradient(90deg,rgba(212,168,83,.4),var(--gold))', borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 24 }}>{mp.energy}</p>
            <div className="label" style={{ marginBottom: 10 }}>Tonight's Ritual</div>
            <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.7 }}>{mp.ritual}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card">
              <div className="label" style={{ marginBottom: 16 }}>Lunar Calendar</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {MOON_PHASES.map((p, i) => {
                  const daysAhead = ((i - moonPhaseIndex + 8) % 8) * 3 - 1
                  const d = new Date(today)
                  d.setDate(d.getDate() + daysAhead)
                  const isNow = i === moonPhaseIndex
                  return (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: `1px solid ${isNow ? 'rgba(212,168,83,.3)' : 'var(--border)'}`, background: isNow ? 'rgba(212,168,83,.06)' : 'transparent', textAlign: 'center' }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{p.emoji}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 11 }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)', marginTop: 2 }}>
                        {isNow ? 'TODAY' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {chart && (
              <div className="card">
                <div className="label" style={{ marginBottom: 10 }}>Your Moon Sign Energy</div>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)' }}>
                  Your natal Moon in <strong style={{ color: 'var(--text)' }}>{chart.moonSign}</strong> is {mp.name === 'Full Moon' ? 'fully activated' : mp.name === 'New Moon' ? 'ready to plant new seeds' : 'building in energy'}. {chart.planets[1].signIdx < 4 ? 'Express your emotions through action and creativity today.' : chart.planets[1].signIdx < 8 ? 'Your mind and heart are particularly aligned today.' : 'Deep intuition guides you — trust your inner knowing.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 20 }}>All Moon Phases — Energy & Guidance</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {MOON_PHASES.map((p, i) => (
              <div key={i} className={`card ${i === moonPhaseIndex ? styles.activeMoon : ''}`}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{p.emoji}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{p.name}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{p.energy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
