import { useState } from 'react'
import { useStore } from '../utils/store'
import { computeChart, SIGNS, SIGN_SYMBOLS, SIGN_COLORS, NAKSHATRAS, DASHAS, DASHA_DESC, MOON_PHASES } from '../utils/astrology'
import ChartWheel from '../components/ChartWheel'
import AstroChat from '../components/AstroChat'
import styles from './ChartPage.module.css'

const PLANET_DESCS = [
  'Your core identity, vitality, and soul purpose',
  'Your mind, emotions, and intuitive nature',
  'Your intelligence, communication style',
  'Love, relationships, beauty, and pleasure',
  'Drive, courage, energy, and assertion',
  'Wisdom, expansion, luck, and dharma',
  'Karma, discipline, lessons, and longevity',
  'Desire, illusion, foreign connections, and ambition',
  'Spirituality, liberation, past lives, and moksha',
]

const CITIES = [
  { name: 'Mumbai', lat: 19.076, lon: 72.877 },
  { name: 'Delhi', lat: 28.614, lon: 77.209 },
  { name: 'Bengaluru', lat: 12.972, lon: 77.593 },
  { name: 'Chennai', lat: 13.083, lon: 80.270 },
  { name: 'Kolkata', lat: 22.573, lon: 88.364 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.487 },
  { name: 'Pune', lat: 18.520, lon: 73.856 },
  { name: 'Ahmedabad', lat: 23.023, lon: 72.572 },
  { name: 'Jaipur', lat: 26.912, lon: 75.787 },
  { name: 'Surat', lat: 21.170, lon: 72.831 },
  { name: 'Lucknow', lat: 26.847, lon: 80.947 },
  { name: 'Nagpur', lat: 21.145, lon: 79.089 },
  { name: 'Indore', lat: 22.719, lon: 75.858 },
  { name: 'Bhopal', lat: 23.259, lon: 77.413 },
  { name: 'Chandigarh', lat: 30.733, lon: 76.779 },
  { name: 'Kochi', lat: 9.939, lon: 76.270 },
  { name: 'Other (International)', lat: 28.614, lon: 77.209 },
]

const LOAD_TEXTS = [
  'Reading the celestial positions...',
  'Applying Lahiri Ayanamsha...',
  'Calculating your Lagna...',
  'Mapping the 27 Nakshatras...',
  'Computing Vimshottari Dasha...',
  'Weaving your cosmic blueprint...',
]

export default function ChartPage() {
  const { chart, userName, setChart, system, setSystem } = useStore()
  const [form, setForm] = useState({ name: '', dob: '', tob: '12:00', city: 'Mumbai', lat: 19.076, lon: 72.877, gender: '' })
  const [loading, setLoading] = useState(false)
  const [loadText, setLoadText] = useState('')
  const [activeTab, setActiveTab] = useState('chart')
  const [err, setErr] = useState('')

  const handleCity = (e) => {
    const city = CITIES.find(c => c.name === e.target.value)
    if (city) setForm(f => ({ ...f, city: city.name, lat: city.lat, lon: city.lon }))
  }

  const generate = async () => {
    if (!form.dob) { setErr('Please enter your date of birth'); return }
    if (!form.tob) { setErr('Please enter your time of birth for accurate results'); return }
    setErr(''); setLoading(true)
    let i = 0
    setLoadText(LOAD_TEXTS[0])
    const intv = setInterval(() => { i = (i + 1) % LOAD_TEXTS.length; setLoadText(LOAD_TEXTS[i]) }, 650)
    await new Promise(r => setTimeout(r, 3500))
    clearInterval(intv)
    const result = computeChart(form.dob, form.tob, form.lat, form.lon, system)
    setChart(result, form, form.name)
    setLoading(false)
    setActiveTab('chart')
  }

  const mp = chart ? MOON_PHASES[chart.moonPhaseIndex] : null

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap">

        {/* HEADER */}
        <div className={styles.header}>
          <div className="label" style={{ marginBottom: 10 }}>✦ Birth Chart</div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,44px)', marginBottom: 12 }}>Your Cosmic Blueprint</h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', maxWidth: 520 }}>
            Real planetary positions calculated using Jean Meeus astronomical algorithms. Lahiri Ayanamsha applied for Vedic charts.
          </p>
        </div>

        {/* FORM */}
        <div className={`card ${styles.formCard}`}>
          <div className={styles.systemToggle}>
            <button className={`${styles.sysBtn} ${system === 'vedic' ? styles.sysBtnActive : ''}`} onClick={() => setSystem('vedic')}>
              🕉 Vedic (Sidereal)
            </button>
            <button className={`${styles.sysBtn} ${system === 'western' ? styles.sysBtnActive : ''}`} onClick={() => setSystem('western')}>
              ☀ Western (Tropical)
            </button>
          </div>

          <div className={styles.formGrid}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Time of Birth <span style={{ color: 'var(--teal)', fontSize: 11 }}>(exact time = accurate results)</span></label>
              <input className="form-input" type="time" value={form.tob} onChange={e => setForm(f => ({ ...f, tob: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Birth City</label>
              <select className="form-input" value={form.city} onChange={handleCity}>
                {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              {err && <p style={{ color: 'var(--rose)', fontSize: 13, marginBottom: 8 }}>{err}</p>}
              <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={generate} disabled={loading}>
                {loading ? loadText : '✦  Generate My Chart'}
              </button>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ marginBottom: 24 }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }}>{loadText}</p>
          </div>
        )}

        {/* RESULTS */}
        {chart && !loading && (
          <div className={styles.results}>
            {/* Identity strip */}
            <div className={styles.identityStrip}>
              <div className={styles.idMain}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,3vw,28px)', color: 'var(--gold2)', marginBottom: 6 }}>
                  {userName || 'Your'}'s Cosmic Blueprint
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--muted2)' }}>
                  {system === 'vedic' ? 'Vedic · Lahiri Ayanamsha' : 'Western · Tropical Zodiac'} · {new Date(form.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {form.tob} · {form.city}
                </div>
              </div>
              <div className={styles.idSigns}>
                {[
                  { label: 'Sun Sign', val: `${SIGN_SYMBOLS[chart.planets[0].signIdx]} ${chart.sunSign}` },
                  { label: 'Moon Sign', val: `${SIGN_SYMBOLS[chart.planets[1].signIdx]} ${chart.moonSign}` },
                  { label: 'Ascendant', val: `${chart.lagnaSymbol} ${chart.lagnaName}` },
                  { label: 'Nakshatra', val: `${chart.moonNakshatra.symbol} ${chart.moonNakshatra.name}` },
                ].map(s => (
                  <div key={s.label} className={styles.idSign}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--muted2)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--gold)' }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {['chart', 'planets', 'dasha', 'nakshatra', 'chat'].map(t => (
                <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t === 'chart' ? '🔮 Birth Chart' : t === 'planets' ? '🪐 Planets' : t === 'dasha' ? '📅 Dasha' : t === 'nakshatra' ? '⭐ Nakshatra' : '🤖 Astro Chat'}
                </button>
              ))}
            </div>

            {/* CHART TAB */}
            {activeTab === 'chart' && (
              <div className={styles.chartTab}>
                <div className={styles.chartLeft}>
                  <div className="card" style={{ padding: 24 }}>
                    <ChartWheel chart={chart} size={420} />
                  </div>
                  <div className={styles.chartLegend}>
                    {chart.planets.map(p => (
                      <div key={p.id} className={styles.legendItem}>
                        <span style={{ fontSize: 18 }}>{p.symbol}</span>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13 }}>{p.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', marginLeft: 'auto' }}>H{p.house}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chartRight}>
                  <div className={styles.quickStats}>
                    <div className={styles.qs}>
                      <div className={styles.qsLabel}>Current Dasha</div>
                      <div className={styles.qsVal}>{chart.currentDasha.planet}</div>
                      <div className={styles.qsSub}>Until {Math.floor(chart.currentDasha.endYear)}</div>
                    </div>
                    <div className={styles.qs}>
                      <div className={styles.qsLabel}>Moon Phase</div>
                      <div className={styles.qsVal}>{mp?.emoji}</div>
                      <div className={styles.qsSub}>{mp?.name}</div>
                    </div>
                    <div className={styles.qs}>
                      <div className={styles.qsLabel}>Lucky Numbers</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        {chart.luckyNums.map(n => (
                          <span key={n} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--gold)' }}>{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.lifeAreas}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Life Area Strengths</div>
                    {[
                      { label: 'Love & Relations', score: 60 + ((chart.planets[0].signIdx * 7 + chart.planets[1].signIdx * 11) % 32), color: 'var(--rose)' },
                      { label: 'Career & Purpose', score: 65 + ((chart.planets[0].signIdx * 5 + chart.lagnaSign * 9) % 28), color: 'var(--gold)' },
                      { label: 'Health & Energy', score: 68 + (chart.planets[1].signIdx * 6 % 24), color: 'var(--teal)' },
                      { label: 'Wealth & Abundance', score: 62 + (chart.planets[5].signIdx * 7 % 30), color: 'var(--green)' },
                      { label: 'Spiritual Growth', score: 70 + (chart.moonNakshatra.name.length % 22), color: 'var(--violet)' },
                    ].map(a => (
                      <div key={a.label} className="score-bar-wrap" style={{ marginBottom: 12 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 130, flexShrink: 0 }}>{a.label}</span>
                        <div className="score-bar-track">
                          <div className="score-bar-fill" style={{ width: `${a.score}%`, background: a.color }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text)', width: 36, textAlign: 'right', flexShrink: 0 }}>{a.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PLANETS TAB */}
            {activeTab === 'planets' && (
              <div className={styles.planetsGrid}>
                {chart.planets.map((p, i) => (
                  <div key={p.id} className={`card ${styles.planetCard}`}>
                    <div className={styles.pcTop}>
                      <span style={{ fontSize: 28 }}>{p.symbol}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)', letterSpacing: 2 }}>{p.vedic}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 6, background: 'rgba(212,168,83,.1)', border: '1px solid rgba(212,168,83,.2)', color: 'var(--gold)', marginLeft: 'auto' }}>H{p.house}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', marginBottom: 8 }}>
                      {p.degInSign}° {p.sign} {p.signSymbol}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--teal)', marginBottom: 10 }}>
                      {p.nakshatra.name} · Pada {p.pada}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{PLANET_DESCS[i]}</p>
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted2)', fontStyle: 'italic' }}>
                      {p.name} in {p.sign}: {p.sign === 'Aries' || p.sign === 'Leo' || p.sign === 'Sagittarius' ? 'Energised and expressive' : p.sign === 'Taurus' || p.sign === 'Virgo' || p.sign === 'Capricorn' ? 'Grounded and productive' : p.sign === 'Gemini' || p.sign === 'Libra' || p.sign === 'Aquarius' ? 'Intellectual and communicative' : 'Intuitive and emotionally deep'}.
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DASHA TAB */}
            {activeTab === 'dasha' && (
              <div>
                <div className={styles.dashaMain}>
                  <div className="label" style={{ marginBottom: 8 }}>Current Mahadasha</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', color: 'var(--gold2)', marginBottom: 6 }}>{chart.currentDasha.planet} Dasha</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>{Math.floor(chart.currentDasha.startYear)} — {Math.floor(chart.currentDasha.endYear)} · {chart.currentDasha.years} year period</div>
                  <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.85, fontStyle: 'italic', maxWidth: 680 }}>{DASHA_DESC[chart.currentDasha.planet]}</p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <div className="label" style={{ marginBottom: 16 }}>Complete Dasha Timeline</div>
                  {chart.dashaTimeline.map((d, i) => {
                    const now = new Date().getFullYear() + new Date().getMonth() / 12
                    const isActive = now >= d.startYear && now < d.endYear
                    const isPast = now >= d.endYear
                    const pct = isActive ? Math.min(100, ((now - d.startYear) / d.years) * 100) : isPast ? 100 : 0
                    return (
                      <div key={i} className={`${styles.dashaItem} ${isActive ? styles.dashaActive : ''}`}>
                        <div className={`${styles.dashaDot} ${isActive ? styles.dashaDotActive : ''}`} />
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, width: 90, color: isActive ? 'var(--gold)' : 'var(--text)' }}>{d.planet}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', flex: 1 }}>{Math.floor(d.startYear)} — {Math.floor(d.endYear)} · {d.years}yr</div>
                        <div style={{ width: 80, height: 4, borderRadius: 99, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: isActive ? 'var(--gold)' : 'rgba(212,168,83,.3)', borderRadius: 99 }} />
                        </div>
                        {isActive && <span className="free-badge" style={{ marginLeft: 8 }}>NOW</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* NAKSHATRA TAB */}
            {activeTab === 'nakshatra' && (
              <div>
                <div className={styles.nkCard}>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>{chart.moonNakshatra.symbol}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>{chart.moonNakshatra.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, color: 'var(--muted2)', marginBottom: 16 }}>Ruled by {chart.moonNakshatra.ruler} · Pada {chart.planets[1].pada} · Moon in {chart.moonSign}</div>
                  <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--muted)', fontStyle: 'italic', maxWidth: 640 }}>{chart.moonNakshatra.desc}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
                    {['Ruling Planet', 'Element', 'Quality', 'Deity'].map((t, i) => {
                      const vals = [chart.moonNakshatra.ruler, 'Lunar', 'Fixed', 'Cosmic Intelligence']
                      return (
                        <div key={t} style={{ background: 'rgba(45,212,192,.06)', border: '1px solid rgba(45,212,192,.2)', borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2, color: 'var(--muted2)', marginBottom: 4 }}>{t}</div>
                          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--teal)' }}>{vals[i]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={{ marginTop: 28 }}>
                  <div className="label" style={{ marginBottom: 16 }}>All Planetary Nakshatras</div>
                  <div className={styles.nkGrid}>
                    {chart.planets.map(p => (
                      <div key={p.id} className="card" style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 18 }}>{p.symbol}</span>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 3 }}>{p.nakshatra.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)' }}>Pada {p.pada} · {p.nakshatra.ruler}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Chart-Aware AI Astrologer</div>
                  <p style={{ fontSize: 15, color: 'var(--muted)' }}>Every response is personalised using your actual planetary positions. First 3 messages free — then upgrade for unlimited access.</p>
                </div>
                <AstroChat chart={chart} userName={userName} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
