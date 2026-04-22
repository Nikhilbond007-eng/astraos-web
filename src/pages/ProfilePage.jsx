import { useState, useEffect } from 'react'
import { useStore } from '../utils/store'
import { supabase } from '../utils/supabase'
import { generateChart } from '../utils/api'
import { saveChart } from '../utils/supabase'
import { Link } from 'react-router-dom'

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

export default function ProfilePage() {
  const { user, chart, userName, setChart, system } = useStore()
  const [form, setForm] = useState({
    name: '', dob: '', tob: '', city: 'Mumbai', lat: 19.076, lon: 72.877
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [err, setErr] = useState('')
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: userName || user.email?.split('@')[0] || '',
        dob: chart ? '' : '',
      }))
    }
    if (chart) {
      const matchedCity = CITIES.find(c => c.name === chart.birthCity)
      setForm(f => ({
        ...f,
        name: userName || '',
        dob: '',
        tob: '',
        city: matchedCity?.name || 'Mumbai',
        lat: matchedCity?.lat || 19.076,
        lon: matchedCity?.lon || 72.877,
      }))
    }
  }, [user, chart, userName])

  const handleCity = (e) => {
    const city = CITIES.find(c => c.name === e.target.value)
    if (city) setForm(f => ({ ...f, city: city.name, lat: city.lat, lon: city.lon }))
  }

  const saveProfile = async () => {
    if (!form.name.trim()) { setErr('Please enter your name'); return }
    setSaving(true); setErr(''); setSuccess('')
    try {
      await supabase.from('profiles').update({ name: form.name }).eq('id', user.id)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setErr('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const regenerateChart = async () => {
    if (!form.dob) { setErr('Please enter your date of birth'); return }
    if (!form.tob) { setErr('Please enter your time of birth'); return }
    setLoading(true); setErr(''); setSuccess('')
    try {
      const result = await generateChart(
        form.dob, form.tob, form.lat, form.lon, system, form.name || userName
      )
      const saved = await saveChart(result, form, form.name || userName)
      setChart(result, form, form.name || userName, saved?.id)
      setSuccess('Birth chart updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setErr('Chart generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    try {
      await supabase.from('charts').delete().eq('user_id', user.id)
      await supabase.from('profiles').delete().eq('id', user.id)
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (e) {
      setErr('Failed to delete account. Please contact support.')
    }
  }

  if (!user) return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>👤</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 16 }}>Sign In Required</h1>
        <Link to="/chart" className="btn-primary">✦ Sign In</Link>
      </div>
    </main>
  )

  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="section-wrap-sm">

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="label" style={{ marginBottom: 10 }}>✦ Your Account</div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: 8 }}>Profile Settings</h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, fontStyle: 'italic' }}>
            Manage your account details and birth information.
          </p>
        </div>

        {/* Success / Error */}
        {success && (
          <div style={{ background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: 'var(--green)', fontSize: 15 }}>
            ✓ {success}
          </div>
        )}
        {err && (
          <div style={{ background: 'rgba(240,98,146,.1)', border: '1px solid rgba(240,98,146,.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: 'var(--rose)', fontSize: 15 }}>
            {err}
          </div>
        )}

        {/* Section tabs */}
        <div className="tabs" style={{ marginBottom: 32 }}>
          {['profile', 'birth', 'account'].map(s => (
            <button
              key={s}
              className={`tab-btn ${activeSection === s ? 'active' : ''}`}
              onClick={() => setActiveSection(s)}
            >
              {s === 'profile' ? '👤 Profile' : s === 'birth' ? '🔮 Birth Details' : '⚙ Account'}
            </button>
          ))}
        </div>

        {/* ── PROFILE SECTION ── */}
        {activeSection === 'profile' && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--gold2)' }}>
              Personal Information
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: 20, background: 'rgba(255,255,255,.02)', borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(212,168,83,.2),rgba(124,92,252,.15))', border: '1px solid rgba(212,168,83,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', flexShrink: 0 }}>
                {(form.name || user.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                  {form.name || user.email?.split('@')[0]}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--muted2)' }}>
                  {user.email}
                </div>
                {chart && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1, color: 'var(--gold)', marginTop: 4 }}>
                    {chart.sunSign} Sun · {chart.moonSign} Moon · {chart.lagnaName} Rising
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={user.email}
                  disabled
                  style={{ opacity: 0.5 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)', letterSpacing: 1 }}>
                  Email cannot be changed
                </span>
              </div>
              <button
                className="btn-primary"
                onClick={saveProfile}
                disabled={saving}
                style={{ alignSelf: 'flex-start' }}
              >
                {saving ? 'Saving...' : '✦ Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* ── BIRTH DETAILS SECTION ── */}
        {activeSection === 'birth' && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--gold2)' }}>
              Update Birth Details
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 14, fontStyle: 'italic', marginBottom: 28 }}>
              Updating your birth details will regenerate your chart with the new information.
            </p>

            {chart && (
              <div style={{ background: 'rgba(212,168,83,.05)', border: '1px solid rgba(212,168,83,.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--gold)', marginBottom: 8 }}>CURRENT CHART</div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Sun', val: chart.sunSign },
                    { label: 'Moon', val: chart.moonSign },
                    { label: 'Ascendant', val: chart.lagnaName },
                    { label: 'Nakshatra', val: chart.moonNakshatra.name },
                    { label: 'Dasha', val: chart.currentDasha.planet },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted2)', letterSpacing: 2, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--gold)' }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.dob}
                  onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Time of Birth <span style={{ color: 'var(--teal)', fontSize: 11 }}>(exact time = accurate results)</span>
                </label>
                <input
                  className="form-input"
                  type="time"
                  value={form.tob}
                  onChange={e => setForm(f => ({ ...f, tob: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Birth City</label>
                <select className="form-input" value={form.city} onChange={handleCity}>
                  {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <button
                className="btn-primary"
                onClick={regenerateChart}
                disabled={loading}
                style={{ alignSelf: 'flex-start' }}
              >
                {loading ? 'Generating...' : '✦ Update & Regenerate Chart'}
              </button>
            </div>
          </div>
        )}

        {/* ── ACCOUNT SECTION ── */}
        {activeSection === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Account info */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, marginBottom: 20, color: 'var(--gold2)' }}>
                Account Information
              </div>
              {[
                { label: 'Email', val: user.email },
                { label: 'Account Created', val: new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Plan', val: 'Free' },
                { label: 'Charts Generated', val: chart ? '1' : '0' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 15 }}>
                  <span style={{ color: 'var(--muted)' }}>{item.label}</span>
                  <span style={{ fontFamily: item.label === 'Plan' ? 'var(--font-mono)' : 'inherit', fontSize: item.label === 'Plan' ? 11 : 15, color: item.label === 'Plan' ? 'var(--green)' : 'var(--text)' }}>{item.val}</span>
                </div>
              ))}
            </div>

            {/* Change password */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                Change Password
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
                We'll send a password reset link to your email address.
              </p>
              <button
                className="btn-secondary"
                onClick={async () => {
                  await supabase.auth.resetPasswordForEmail(user.email)
                  setSuccess('Password reset email sent! Check your inbox.')
                }}
              >
                Send Reset Email
              </button>
            </div>

            {/* Upgrade */}
            <div className="card" style={{ padding: 28, background: 'linear-gradient(135deg,rgba(212,168,83,.06),rgba(124,92,252,.05))', borderColor: 'rgba(212,168,83,.2)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--gold2)' }}>
                Upgrade to Premium
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>
                Unlock unlimited AI chat, detailed PDF reports, and full Dasha analysis.
              </p>
              <Link to="/pricing" className="btn-primary" style={{ display: 'inline-block', fontSize: 14 }}>
                ✦ See Plans
              </Link>
            </div>

            {/* Delete account */}
            <div className="card" style={{ padding: 28, borderColor: 'rgba(240,98,146,.2)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--rose)' }}>
                Delete Account
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
                Permanently delete your account and all chart data. This cannot be undone.
              </p>
              <button
                onClick={deleteAccount}
                style={{ padding: '10px 20px', borderRadius: 100, border: '1px solid rgba(240,98,146,.3)', background: 'rgba(240,98,146,.08)', color: 'var(--rose)', fontFamily: 'var(--font-serif)', fontSize: 13, cursor: 'pointer' }}
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
