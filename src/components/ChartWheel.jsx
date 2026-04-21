import { useEffect, useRef } from 'react'
import { SIGN_SYMBOLS, SIGN_COLORS } from '../utils/astrology'

export default function ChartWheel({ chart, size = 420 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!chart || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const W = size, H = size, cx = W / 2, cy = H / 2

    ctx.clearRect(0, 0, W, H)

    // Background circle
    ctx.fillStyle = 'rgba(8,6,26,0.97)'
    ctx.beginPath(); ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2); ctx.fill()

    // Ring borders
    ;[0.95, 0.75, 0.52, 0.28].forEach((r, i) => {
      ctx.beginPath(); ctx.arc(cx, cy, cx * r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(212,168,83,${0.07 + i * 0.04})`; ctx.lineWidth = 1; ctx.stroke()
    })

    // House division lines
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * cx * 0.28, cy + Math.sin(angle) * cx * 0.28)
      ctx.lineTo(cx + Math.cos(angle) * cx * 0.95, cy + Math.sin(angle) * cx * 0.95)
      ctx.strokeStyle = 'rgba(212,168,83,0.1)'; ctx.lineWidth = 0.8; ctx.stroke()
    }

    // Zodiac signs (outer ring)
    for (let i = 0; i < 12; i++) {
      const mid = ((i * 30 + 15) - 90) * Math.PI / 180
      const r = cx * 0.855
      const signIdx = (i + chart.lagnaSign) % 12
      ctx.font = `${cx * 0.072}px serif`
      ctx.fillStyle = SIGN_COLORS[signIdx]
      ctx.globalAlpha = 0.85
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(SIGN_SYMBOLS[signIdx], cx + Math.cos(mid) * r, cy + Math.sin(mid) * r)
      ctx.globalAlpha = 1
    }

    // House numbers
    for (let i = 0; i < 12; i++) {
      const mid = ((i * 30 + 15) - 90) * Math.PI / 180
      ctx.font = `bold ${cx * 0.05}px Cinzel, serif`
      ctx.fillStyle = 'rgba(212,168,83,0.3)'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(i + 1, cx + Math.cos(mid) * cx * 0.635, cy + Math.sin(mid) * cx * 0.635)
    }

    // Planets
    const houseCount = {}
    chart.planets.forEach(p => {
      const offset = houseCount[p.house] || 0
      houseCount[p.house] = offset + 1
      const deg = ((p.signIdx - chart.lagnaSign + 12) % 12) * 30 + p.degInSign
      const adjustedDeg = deg + offset * 8
      const angle = (adjustedDeg - 90) * Math.PI / 180
      const r = cx * 0.42

      ctx.font = `${cx * 0.06}px serif`
      ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.9
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(p.symbol, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
      ctx.globalAlpha = 1
    })

    // Lagna center
    ctx.beginPath(); ctx.arc(cx, cy, cx * 0.13, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(212,168,83,0.06)'; ctx.fill()
    ctx.strokeStyle = 'rgba(212,168,83,0.35)'; ctx.lineWidth = 1.5; ctx.stroke()

    ctx.font = `bold ${cx * 0.065}px Cinzel, serif`
    ctx.fillStyle = SIGN_COLORS[chart.lagnaSign]
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(SIGN_SYMBOLS[chart.lagnaSign], cx, cy)

    ctx.font = `${cx * 0.034}px Space Mono, monospace`
    ctx.fillStyle = 'rgba(212,168,83,0.45)'
    ctx.fillText('LAGNA', cx, cy + cx * 0.17)

    // Ascendant line
    const ascAngle = (chart.ascDeg % 30 - 90) * Math.PI / 180
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(ascAngle) * cx * 0.28, cy + Math.sin(ascAngle) * cx * 0.28)
    ctx.lineTo(cx + Math.cos(ascAngle) * cx * 0.52, cy + Math.sin(ascAngle) * cx * 0.52)
    ctx.strokeStyle = 'rgba(212,168,83,0.5)'; ctx.lineWidth = 1.5; ctx.stroke()

  }, [chart, size])

  return (
    <canvas ref={ref} width={size} height={size} style={{ width: '100%', maxWidth: size, height: 'auto', display: 'block' }} />
  )
}
