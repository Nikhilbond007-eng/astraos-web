import { useState } from 'react'
import { useStore } from '../utils/store'
import { Link } from 'react-router-dom'

// ─── NUMEROLOGY PAGE ───
function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0)
  }
  return n
}

function letterValue(c) {
  const val = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 }
  return val[c.toLowerCase()] || 0
}
const VOWELS = 'aeiou'

const NUM_MEANINGS = {
  1: { name: 'The Leader', desc: 'Independent, ambitious, pioneering. You are a natural born leader with enormous creative potential and the drive to manifest your vision.', traits: ['Leadership','Independence','Innovation','Courage','Originality'] },
  2: { name: 'The Peacemaker', desc: 'Diplomatic, intuitive, cooperative. You excel in partnerships and have a gift for creating harmony wherever you go.', traits: ['Diplomacy','Intuition','Cooperation','Sensitivity','Balance'] },
  3: { name: 'The Creator', desc: 'Creative, expressive, joyful. You carry the gift of communication and artistic expression — your words and creations uplift all who receive them.', traits: ['Creativity','Expression','Joy','Optimism','Charisma'] },
  4: { name: 'The Builder', desc: 'Practical, disciplined, dependable. You build the foundations that others stand upon. Your greatest strength is sustained, focused effort.', traits: ['Discipline','Reliability','Practicality','Hard work','Order'] },
  5: { name: 'The Freedom Seeker', desc: 'Adventurous, versatile, magnetic. You thrive on change, travel, and new experiences. Your gift is your adaptability and magnetic presence.', traits: ['Freedom','Adventure','Versatility','Wit','Magnetism'] },
  6: { name: 'The Nurturer', desc: 'Compassionate, responsible, loving. You are a natural caregiver and healer. Beauty, home, and family are your deepest sources of meaning.', traits: ['Compassion','Responsibility','Love','Healing','Beauty'] },
  7: { name: 'The Seeker', desc: 'Analytical, spiritual, wise. You are a seeker of truth and hidden knowledge. Your inner wisdom and deep intellect are your greatest gifts.', traits: ['Wisdom','Analysis','Spirituality','Intuition','Research'] },
  8: { name: 'The Achiever', desc: 'Powerful, ambitious, abundant. You are destined for material success and leadership. Your gift is your ability to manifest abundance and authority.', traits: ['Power','Abundance','Leadership','Ambition','Achievement'] },
  9: { name: 'The Humanitarian', desc: 'Compassionate, idealistic, wise. You carry old soul wisdom and a deep commitment to making the world better. Your gift is universal love.', traits: ['Compassion','Idealism','Wisdom','Universal love','Completion'] },
  11: { name: 'The Illuminator', desc: 'Intuitive, visionary, inspired. Master Number 11 — you are a spiritual messenger with extraordinary intuitive gifts and the ability to illuminate others.', traits: ['Intuition','Vision','Inspiration','Spirituality','Illumination'] },
  22: { name: 'The Master Builder', desc: 'Visionary, powerful, practical. Master Number 22 — you have the rare gift of making great visions into concrete reality. A life of extraordinary impact awaits.', traits: ['Vision','Mastery','Power','Manifestation','Legacy'] },
  33: { name: 'The Master Teacher', desc: 'Compassionate, selfless, healing. Master Number 33 — you are here to uplift humanity through love, healing, and the wisdom of pure compassion.', traits: ['Healing','Compassion','Teaching','Love','Selflessness'] },
}

export function NumerologyPage() {
  const { chart } = useStore()
  const [form, setForm] = useState({ name: '', dob: '' })
  const [result, setResult] = useState(null)

  const calculate = () => {
    if (!form.dob) return
    const [y, m, d] = form.dob.split('-').map(Number)
    const lifePath = reduceNum(reduceNum(y) + reduceNum(m) + reduceNum(d))

    const nameNums = form.name.toLowerCase().replace(/[^a-z]/g, '').split('').map(letterValue)
    const destiny = form.name ? reduceNum(nameNums.reduce((a, b) => a + b, 0)) : null
    const vowelNums = form.name.toLowerCase().split('').filter(c => VOWELS.includes(c)).map(letterValue)
    const soulUrge = vowelNums.length ? reduceNum(vowelNums.reduce((a, b) => a + b, 0)) : null
    const consNums = form.name.toLowerCase().split('').filter(c => /[a-z]/.test(c) && !VOWELS.includes(c)).map(letterValue)
    const personality = consNums.length ? reduceNum(consNums.reduce((a, b) => a + b, 0)) : null
    const personal = reduceNum(d + m)
    const luckyYr = new Date().getFullYear(); const luckyNum = reduceNum(d + m + reduceNum(luckyYr))

    setResult({ lifePath, destiny, soulUrge, personality, personal, luckyNum, luckyNums: [lifePath, destiny || personal, (lifePath + (destiny || personal)) % 9 || 9].filter(Boolean).slice(0, 3) })
  }

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap-sm">
        <div className="label" style={{ marginBottom: 10 }}>✦ Numerology</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,42px)', marginBottom: 12 }}>Your Numbers Reveal All</h1>
        <p style={{ color: 'var(--muted)', fontSize: 17, fontStyle: 'italic', marginBottom: 40 }}>
          Every number carries a cosmic vibration. Your birth date and name encode the blueprint of your soul's journey.
        </p>

        <div className="card" style={{ padding: 32, marginBottom: 36 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label">Full Birth Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="As written on birth certificate" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={calculate}>
            ✦ Calculate My Numbers
          </button>
        </div>

        {result && (
          <div style={{ animation: 'fadeUp .6s ease both' }}>
            {/* Life Path */}
            <div className="card" style={{ padding: 36, marginBottom: 20, background: 'linear-gradient(135deg,rgba(212,168,83,.07),rgba(124,92,252,.05))', borderColor: 'rgba(212,168,83,.2)' }}>
              <div className="label" style={{ marginBottom: 10 }}>Life Path Number</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--gold)', flexShrink: 0 }}>{result.lifePath}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: 'var(--gold2)', marginBottom: 4 }}>{NUM_MEANINGS[result.lifePath]?.name}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {NUM_MEANINGS[result.lifePath]?.traits.map(t => (
                      <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 10px', borderRadius: 100, background: 'rgba(212,168,83,.1)', border: '1px solid rgba(212,168,83,.2)', color: 'var(--gold)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.85, fontStyle: 'italic' }}>{NUM_MEANINGS[result.lifePath]?.desc}</p>
            </div>

            {/* Other numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Destiny Number', val: result.destiny, desc: NUM_MEANINGS[result.destiny]?.name, color: 'var(--violet)' },
                { label: 'Soul Urge Number', val: result.soulUrge, desc: NUM_MEANINGS[result.soulUrge]?.name, color: 'var(--teal)' },
                { label: 'Personality Number', val: result.personality, desc: NUM_MEANINGS[result.personality]?.name, color: 'var(--rose)' },
                { label: 'Personal Year Number', val: result.personal, desc: NUM_MEANINGS[result.personal]?.name, color: 'var(--sky)' },
              ].filter(n => n.val).map(n => (
                <div key={n.label} className="card" style={{ padding: 22 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', border: `1.5px solid ${n.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 22, color: n.color, flexShrink: 0 }}>{n.val}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, color: 'var(--muted2)', marginBottom: 3 }}>{n.label.toUpperCase()}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: n.color }}>{n.desc}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{NUM_MEANINGS[n.val]?.desc.split('.')[0]}.</p>
                </div>
              ))}
            </div>

            {/* Lucky numbers */}
            <div className="card" style={{ padding: 24 }}>
              <div className="label" style={{ marginBottom: 14 }}>Your Lucky Numbers</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {result.luckyNums.map(n => (
                  <div key={n} style={{ width: 56, height: 56, borderRadius: '50%', border: '1.5px solid rgba(212,168,83,.4)', background: 'rgba(212,168,83,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)' }}>{n}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// ─── PRICING PAGE ───
const PLANS = [
  {
    name: 'Free', price: '₹0', period: 'forever', color: 'var(--teal)', border: 'rgba(45,212,192,.2)',
    features: ['Complete Birth Chart (Vedic + Western)', 'Basic Nakshatra reading', '3 AI Chat messages / day', 'Daily horoscope (basic)', 'Tarot card draw', 'Compatibility score', 'Moon phase calendar', 'Basic numerology'],
    cta: 'Start Free', ctaPath: '/chart', recommended: false,
  },
  {
    name: 'Premium', price: '₹299', period: '/month', color: 'var(--gold)', border: 'rgba(212,168,83,.4)',
    features: ['Everything in Free', 'Unlimited AI Astro Chat', 'Full Dasha + Antardasha analysis', 'Live planetary transit alerts', 'Monthly PDF forecast report', 'Detailed compatibility reports', 'Astrocartography map', 'Muhurat (auspicious timing)', 'All divisional charts (D9, D10)', 'Priority support'],
    cta: '✦ Get Premium', ctaPath: '/chart', recommended: true,
  },
  {
    name: 'Annual', price: '₹1,999', period: '/year', color: 'var(--violet)', border: 'rgba(124,92,252,.3)',
    features: ['Everything in Premium', '5 PDF Deep-Dive Reports / year', 'Year Ahead full forecast', 'Relationship synastry report', 'Career & Finance report', 'Health & Wellness report', 'Personalised remedies (Vedic)', 'Direct astrologer consultation (1 session)'],
    cta: 'Get Annual', ctaPath: '/chart', recommended: false,
  },
]

export function PricingPage() {
  const { setPremium } = useStore()
  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="label" style={{ marginBottom: 12 }}>✦ Pricing</div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,48px)', marginBottom: 14 }}>Simple, Transparent Plans</h1>
          <p style={{ color: 'var(--muted)', fontSize: 18, fontStyle: 'italic', maxWidth: 480, margin: '0 auto' }}>
            Start completely free. Upgrade when you are ready to go deeper into your cosmic story.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
          {PLANS.map(p => (
            <div key={p.name} style={{ background: p.recommended ? `linear-gradient(135deg,rgba(212,168,83,.07),rgba(124,92,252,.05))` : 'rgba(255,255,255,.03)', border: `${p.recommended ? '2px' : '1px'} solid ${p.border}`, borderRadius: 24, padding: 32, position: 'relative' }}>
              {p.recommended && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, padding: '4px 16px', borderRadius: 100, background: 'var(--gold)', color: '#000' }}>MOST POPULAR</div>
              )}
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 6, color: p.color }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text)', marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--muted2)', marginBottom: 28 }}>{p.period}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--muted)', alignItems: 'flex-start' }}>
                    <span style={{ color: p.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link to={p.ctaPath} className={p.recommended ? 'btn-primary' : 'btn-secondary'} style={{ display: 'block', textAlign: 'center', width: '100%' }}
                onClick={p.recommended ? () => setPremium() : undefined}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--muted2)' }}>
            All payments secured by Razorpay · Cancel anytime · UPI, Cards, Net Banking accepted
          </p>
        </div>
      </div>
    </main>
  )
}
