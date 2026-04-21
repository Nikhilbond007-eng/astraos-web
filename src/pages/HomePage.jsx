import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import styles from './HomePage.module.css'

const FEATURES = [
  { icon: '🔮', title: 'Birth Chart', desc: 'Vedic Kundali & Western natal chart with real planetary calculations. Lahiri Ayanamsha applied.', path: '/chart', badge: 'FREE', color: 'var(--gold)' },
  { icon: '🌙', title: 'Daily Horoscope', desc: 'AI-generated personalised daily reading based on your actual chart and live planetary transits.', path: '/daily', badge: 'FREE', color: 'var(--violet)' },
  { icon: '🤖', title: 'Astro Chat AI', desc: 'Ask anything about your chart, life, future. 3 free messages per day — powered by Claude AI.', path: '/chart', badge: '3 FREE', color: 'var(--teal)' },
  { icon: '🃏', title: 'Tarot Reading', desc: 'Three-card spread with AI interpretation personalised to your current Dasha period.', path: '/tarot', badge: 'FREE', color: 'var(--rose)' },
  { icon: '💞', title: 'Compatibility', desc: 'Deep Vedic Guna Milan + Western synastry. Love, business, friendship — all relationship types.', path: '/compatibility', badge: 'FREE', color: 'var(--sky)' },
  { icon: '🌕', title: 'Moon Calendar', desc: 'Live moon phase tracking with rituals, journal prompts, and cosmic timing for every lunar event.', path: '/moon', badge: 'FREE', color: '#c4a8f5' },
  { icon: '🔢', title: 'Numerology', desc: 'Life path number, destiny number, soul urge, and personalised lucky timing calculations.', path: '/numerology', badge: 'FREE', color: 'var(--green)' },
  { icon: '📄', title: 'PDF Reports', desc: 'Full year-ahead forecast, complete Kundali, relationship report — beautifully designed PDFs.', path: '/pricing', badge: 'PREMIUM', color: 'var(--gold)' },
]

const STEPS = [
  { n: '01', title: 'Enter Birth Details', desc: 'Date, exact time, and birth city. The cosmos needs precision to speak your truth.' },
  { n: '02', title: 'Chart Generated', desc: 'Real planetary positions calculated using Jean Meeus algorithms with Lahiri Ayanamsha.' },
  { n: '03', title: 'AI Reads Your Chart', desc: 'Claude AI receives your complete chart as context and speaks directly to your cosmic blueprint.' },
  { n: '04', title: 'Ask Anything', desc: 'Chat freely about love, career, health, timing. The AI knows your chart like a lifelong astrologer.' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', sign: '♍', text: 'The Dasha reading predicted my career shift 3 months before it happened. Genuinely shocked at the accuracy.' },
  { name: 'Arjun Mehta', city: 'Bengaluru', sign: '♒', text: 'Finally an astrology app that explains WHY, not just what. The AI chat is like talking to a real Jyotishi.' },
  { name: 'Divya Nair', city: 'Chennai', sign: '♋', text: 'My mother uses paper Kundali, I use AstraOS. The results match — but AstraOS explains so much more.' },
  { name: 'Rohit Verma', city: 'Delhi', sign: '♈', text: 'Asked about my business timing. The Saturn transit warning it gave me saved me from a terrible decision.' },
]

export default function HomePage() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  return (
    <main style={{ position: 'relative', zIndex: 2 }}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div ref={heroRef} className={styles.heroInner}>
          <div className={styles.emblem}>
            <div className={`${styles.ring} ${styles.r1}`} />
            <div className={`${styles.ring} ${styles.r2}`} />
            <div className={`${styles.ring} ${styles.r3}`} />
            <div className={styles.emblemCenter}>✦</div>
          </div>

          <div className="label" style={{ marginBottom: 18, display: 'block', animationDelay: '0.2s' }}>
            Cosmic Intelligence Platform · India
          </div>

          <h1 className={`${styles.title} gradient-text`}>AstraOS</h1>
          <div className={styles.tagline}>YOUR PERSONAL COSMIC BLUEPRINT</div>

          <p className={styles.desc}>
            The world's first AI-native astrology platform that reads the stars as personally as a lifelong guru.
            Real planetary calculations. Chart-aware AI. Built for India, designed for the world.
          </p>

          <div className={styles.badges}>
            {['✦ Vedic + Western', '✦ Claude AI', '✦ Real Calculations', '✦ Free to Start'].map(b => (
              <span key={b} className={styles.badge}>{b}</span>
            ))}
          </div>

          <div className={styles.heroCta}>
            <Link to="/chart" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
              ✦ &nbsp; Generate My Birth Chart
            </Link>
            <Link to="/pricing" className="btn-secondary">
              See Plans
            </Link>
          </div>

          <div className={styles.freeNote}>
            Chart generation is always free · First 3 AI messages free · No account required
          </div>
        </div>

        <div className={styles.scrollCue}>
          <span className={styles.scrollText}>Scroll to Explore</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-wrap">
        <div className="label" style={{ marginBottom: 12 }}>✦ Everything You Need</div>
        <h2 style={{ fontSize: 'clamp(24px,4vw,42px)', marginBottom: 12 }}>
          Eight cosmic tools.<br />One platform.
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 18, fontStyle: 'italic', marginBottom: 48, maxWidth: 560 }}>
          Every feature is built to be deeply personal, culturally resonant, and technically world-class.
        </p>

        <div className={styles.featGrid}>
          {FEATURES.map((f, i) => (
            <Link key={f.title} to={f.path} className={`card ${styles.featCard}`} style={{ animationDelay: `${i * 0.07}s`, textDecoration: 'none' }}>
              <div className={styles.featCardTop}>
                <span style={{ fontSize: 32 }}>{f.icon}</span>
                <span className={f.badge === 'PREMIUM' ? 'paid-badge' : 'free-badge'}>{f.badge}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>{f.title}</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
              <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: f.color, opacity: 0.8 }}>Explore →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="sep"><div className="sep-line" /><span className="sep-star">✦</span><div className="sep-line r" /></div>
        <div style={{ textAlign: 'center', marginBottom: 56, marginTop: 40 }}>
          <div className="label" style={{ marginBottom: 12 }}>✦ How It Works</div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)' }}>From birth details to cosmic clarity<br />in under 30 seconds.</h2>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <div key={s.n} className={`card ${styles.stepCard}`}>
              <div className={styles.stepNum}>{s.n}</div>
              {i < 3 && <div className={styles.stepArrow}>→</div>}
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VEDIC vs WESTERN ── */}
      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className={styles.dualSystem}>
          <div className={styles.dsLeft}>
            <div className="label" style={{ marginBottom: 12 }}>✦ Vedic System</div>
            <h3 style={{ fontSize: 26, marginBottom: 14 }}>Jyotish — The Eye of the Vedas</h3>
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              Uses Lahiri Ayanamsha (Government of India standard) for precise sidereal calculations. Includes complete Kundali, all 27 Nakshatras, Vimshottari Dasha system, Guna Milan compatibility, and divisional charts.
            </p>
            {['Lahiri Ayanamsha correction', '27 Nakshatras with Pada', 'Vimshottari Dasha timeline', 'Guna Milan (36-point matching)', 'Yoga detection'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 14, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <span style={{ color: 'var(--gold)' }}>✦</span> {f}
              </div>
            ))}
          </div>
          <div className={styles.dsMiddle}>
            <div className={styles.togglePill}>
              <span>Vedic</span>
              <span className={styles.toggleDivider}>✦</span>
              <span>Western</span>
            </div>
          </div>
          <div className={styles.dsRight}>
            <div className="label" style={{ marginBottom: 12 }}>✦ Western System</div>
            <h3 style={{ fontSize: 26, marginBottom: 14 }}>Tropical — The Modern Lens</h3>
            <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
              Tropical zodiac without ayanamsha correction. Full natal chart with aspects, stelliums, chart patterns, and Placidus house system. Synastry and composite charts for relationship analysis.
            </p>
            {['Placidus house system', 'Major & minor aspects', 'Chart patterns (Grand Trine etc)', 'Synastry overlay', 'Progressed chart'].map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 14, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <span style={{ color: 'var(--violet)' }}>✦</span> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="sep"><div className="sep-line" /><span className="sep-star">✦</span><div className="sep-line r" /></div>
        <div style={{ textAlign: 'center', margin: '40px 0 48px' }}>
          <div className="label" style={{ marginBottom: 12 }}>✦ What People Say</div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)' }}>Trusted by thousands across India</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className={`card ${styles.tCard}`}>
              <div className={styles.tTop}>
                <div className={styles.tAvatar}>{t.sign}</div>
                <div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600 }}>{t.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted2)', letterSpacing: 2 }}>{t.city}</div></div>
              </div>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', gap: 2, marginTop: 12 }}>
                {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: 'var(--gold)', fontSize: 14 }}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-wrap" style={{ paddingTop: 0, paddingBottom: 120 }}>
        <div className={styles.ctaBox}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3.5vw,36px)', color: 'var(--gold2)', marginBottom: 14 }}>
            The Stars Have Always Known.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 18, fontStyle: 'italic', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.8 }}>
            Your birth chart is waiting. Enter your details and let the cosmos reveal what has always been written for you.
          </p>
          <Link to="/chart" className="btn-primary" style={{ fontSize: 16, padding: '16px 48px' }}>
            ✦ &nbsp; Begin My Journey — Free
          </Link>
        </div>
      </section>

    </main>
  )
}
