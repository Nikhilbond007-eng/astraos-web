import { Routes, Route } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import StarCanvas from './components/StarCanvas'
import HomePage from './pages/HomePage'
import ChartPage from './pages/ChartPage'
import { DailyPage } from './pages/DailyPage'
import { TarotPage, CompatPage, MoonPage } from './pages/CompatMoonTarot'
import { NumerologyPage, PricingPage } from './pages/NumerologyPricing'
import PaywallModal from './components/PaywallModal'

export default function App() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

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
      <PaywallModal />
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#0f0e1c', color: '#ede8f8', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'EB Garamond, serif', fontSize: '16px' } }} />
    </>
  )
}
