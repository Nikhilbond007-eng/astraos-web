import { useEffect, useRef } from 'react'

export default function StarCanvas() {
  const bgRef = useRef(null)
  const icRef = useRef(null)

  useEffect(() => {
    // Background stars
    const bg = bgRef.current
    const bgCtx = bg.getContext('2d')
    let W, H, stars = [], shooters = []

    function resize() {
      W = bg.width = window.innerWidth
      H = bg.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 240; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.3 + 0.2,
        a: Math.random(),
        da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
        c: Math.random() < 0.78 ? '#fff' : (Math.random() < 0.5 ? '#d4a853' : '#a98bff')
      })
    }

    setInterval(() => {
      shooters.push({ x: Math.random() * W * 0.7, y: Math.random() * H * 0.3, len: Math.random() * 100 + 50, speed: Math.random() * 5 + 3, a: 1, ang: Math.PI / 4 + (Math.random() - 0.5) * 0.4 })
    }, 3500)

    let bgRaf
    function bgLoop() {
      bgCtx.clearRect(0, 0, W, H)
      // Nebula
      ;[{ x: W * 0.1, y: H * 0.15, r: 280, c: 'rgba(50,15,110,.12)' }, { x: W * 0.85, y: H * 0.7, r: 240, c: 'rgba(15,35,90,.1)' }, { x: W * 0.5, y: H * 0.5, r: 160, c: 'rgba(90,15,50,.07)' }].forEach(n => {
        const g = bgCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        g.addColorStop(0, n.c); g.addColorStop(1, 'transparent')
        bgCtx.fillStyle = g; bgCtx.beginPath(); bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2); bgCtx.fill()
      })
      stars.forEach(s => {
        bgCtx.save(); bgCtx.globalAlpha = Math.max(0.05, Math.abs(s.a))
        bgCtx.beginPath(); bgCtx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        bgCtx.fillStyle = s.c; bgCtx.fill(); bgCtx.restore()
        s.a += s.da; if (Math.abs(s.a) > 1) s.da *= -1
      })
      shooters = shooters.filter(s => {
        bgCtx.save(); bgCtx.globalAlpha = s.a; bgCtx.strokeStyle = '#d4a853'; bgCtx.lineWidth = 1.2
        bgCtx.beginPath(); bgCtx.moveTo(s.x, s.y); bgCtx.lineTo(s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len); bgCtx.stroke(); bgCtx.restore()
        s.x += Math.cos(s.ang) * s.speed; s.y += Math.sin(s.ang) * s.speed; s.a -= 0.014
        return s.a > 0 && s.x < W && s.y < H
      })
      bgRaf = requestAnimationFrame(bgLoop)
    }
    bgLoop()

    // Interactive constellation
    const ic = icRef.current
    const icCtx = ic.getContext('2d')
    let icW, icH, nodes = [], mX = -999, mY = -999

    function icResize() { icW = ic.width = window.innerWidth; icH = ic.height = window.innerHeight }
    icResize(); window.addEventListener('resize', icResize)

    class Node {
      constructor(x, y) {
        this.x = x || Math.random() * icW; this.y = y || Math.random() * icH
        this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3
        this.r = Math.random() * 1.4 + 0.5; this.life = 700 + Math.random() * 500; this.ml = this.life
        this.c = Math.random() < 0.7 ? '#d4a853' : (Math.random() < 0.5 ? '#7c5cfc' : '#2dd4c0')
      }
      update() {
        const dx = mX - this.x, dy = mY - this.y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 180 && d > 0) { const f = (1 - d / 180) * 0.01; this.vx += dx / d * f; this.vy += dy / d * f }
        this.vx *= 0.99; this.vy *= 0.99; this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > icW) this.vx *= -1; if (this.y < 0 || this.y > icH) this.vy *= -1
        this.life--
      }
      draw() {
        const a = Math.min(1, this.life / 60) * Math.min(1, (this.ml - this.life) / 60)
        icCtx.save(); icCtx.globalAlpha = a * 0.75; icCtx.beginPath(); icCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2); icCtx.fillStyle = this.c; icCtx.fill(); icCtx.restore()
      }
      get dead() { return this.life <= 0 }
    }

    for (let i = 0; i < 60; i++) nodes.push(new Node())
    document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY })
    document.addEventListener('click', e => {
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2, n = new Node(e.clientX + Math.cos(a) * 15, e.clientY + Math.sin(a) * 15)
        n.vx = Math.cos(a) * 1.2; n.vy = Math.sin(a) * 1.2; nodes.push(n)
      }
    })

    let icRaf
    function icLoop() {
      icCtx.clearRect(0, 0, icW, icH)
      while (nodes.length < 60) nodes.push(new Node())
      nodes = nodes.filter(n => !n.dead)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy)
          if (d < 145) {
            icCtx.save(); icCtx.globalAlpha = (1 - d / 145) * 0.18
            const g = icCtx.createLinearGradient(a.x, a.y, b.x, b.y); g.addColorStop(0, a.c); g.addColorStop(1, b.c)
            icCtx.strokeStyle = g; icCtx.lineWidth = 0.5; icCtx.beginPath(); icCtx.moveTo(a.x, a.y); icCtx.lineTo(b.x, b.y); icCtx.stroke(); icCtx.restore()
          }
        }
        const dx = mX - nodes[i].x, dy = mY - nodes[i].y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 150) {
          icCtx.save(); icCtx.globalAlpha = (1 - d / 150) * 0.28; icCtx.strokeStyle = '#d4a853'; icCtx.lineWidth = 0.6
          icCtx.beginPath(); icCtx.moveTo(nodes[i].x, nodes[i].y); icCtx.lineTo(mX, mY); icCtx.stroke(); icCtx.restore()
        }
      }
      nodes.forEach(n => { n.update(); n.draw() })
      if (mX > 0) {
        icCtx.save(); icCtx.globalAlpha = 0.9; icCtx.beginPath(); icCtx.arc(mX, mY, 3, 0, Math.PI * 2)
        icCtx.fillStyle = '#d4a853'; icCtx.shadowColor = '#d4a853'; icCtx.shadowBlur = 10; icCtx.fill(); icCtx.restore()
      }
      icRaf = requestAnimationFrame(icLoop)
    }
    icLoop()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', icResize)
      cancelAnimationFrame(bgRaf)
      cancelAnimationFrame(icRaf)
    }
  }, [])

  return (
    <>
      <canvas ref={bgRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <canvas ref={icRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
    </>
  )
}
