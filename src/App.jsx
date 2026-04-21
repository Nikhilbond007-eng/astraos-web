import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useStore } from './utils/store'
import Navbar from './components/Navbar'
import StarCanvas from './components/StarCanvas'
import PaywallModal from './components/PaywallModal'
import FloatingChat from './components/FloatingChat'

// ── Lazy load all pages ──
const HomePage = lazy(() => import('./pages/HomePage'))
const ChartPage = lazy(() => import('./pages/ChartPage'))
const DailyPage = lazy(() => import('./pages/DailyPage').then(m => ({ default: m.DailyPage })))
const TarotPage = lazy(() => import('./pages/CompatMoonTarot').then(m => ({ default: m.TarotPage })))
const CompatPage = lazy(() => import('./pages/CompatMoonTarot').then(m => ({ default: m.CompatPage })))
const MoonPage = lazy(() => import('./pages/CompatMoonTarot').then(m => ({ default: m.MoonPage })))
const NumerologyPage = lazy(() => import('./pages/NumerologyPricing').then(m => ({ default: m.NumerologyPage })))
const PricingPage = lazy(() => import('./pages/NumerologyPricing').then(m => ({ default: m.PricingPage })))

// ── Page loading fallback ──
function PageLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--void)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ marginBottom: 16 }} />
        <p style={{
          fontFamily: 'var(--font-serif)', fontSize: 16,
          color: 'var(--muted)', animation: 'pulse 1.5s infinite'
        }}>
          Loading...
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const initAuth = useStore(s => s.initAuth)

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const move = (e) => {
      if (dot) { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px' }
      if (ring) { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px' }
    }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
      <StarCanvas />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/tarot" element={<TarotPage />} />
          <Route path="/compatibility" element={<CompatPage />} />
          <Route path="/moon" element={<MoonPage />} />
          <Route path="/numerology" element={<NumerologyPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </Suspense>
      <PaywallModal />
      <FloatingChat />
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#0f0e1c',
          color: '#ede8f8',
          border: '1px solid rgba(255,255,255,0.07)',
          fontFamily: 'EB Garamond, serif',
          fontSize: '16px'
        }
      }} />
    </>
  )
}
