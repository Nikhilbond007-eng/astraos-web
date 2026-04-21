import jsPDF from 'jspdf'

export async function downloadChartPDF(chart, userName, birthData) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, H = 297
  const gold = [212, 168, 83]
  const dark = [8, 6, 26]
  const muted = [150, 140, 180]

  // Background
  pdf.setFillColor(...dark)
  pdf.rect(0, 0, W, H, 'F')

  // Header band
  pdf.setFillColor(20, 15, 50)
  pdf.rect(0, 0, W, 45, 'F')

  // Gold top line
  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.8)
  pdf.line(15, 2, W - 15, 2)

  // Logo / Title
  pdf.setTextColor(...gold)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(28)
  pdf.text('ASTRAOS', W / 2, 18, { align: 'center' })

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...muted)
  pdf.text('COSMIC INTELLIGENCE PLATFORM', W / 2, 25, { align: 'center' })

  pdf.setFontSize(11)
  pdf.setTextColor(...gold)
  pdf.text('YOUR BIRTH CHART REPORT', W / 2, 34, { align: 'center' })

  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.3)
  pdf.line(15, 43, W - 15, 43)

  // User name and birth details
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(240, 201, 110)
  pdf.text(userName || 'Your Cosmic Blueprint', W / 2, 56, { align: 'center' })

  const dobFormatted = birthData?.dob
    ? new Date(birthData.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...muted)
  pdf.text(
    `${dobFormatted}  ·  ${birthData?.tob || ''}  ·  ${birthData?.city || ''}`,
    W / 2, 63, { align: 'center' }
  )
  pdf.text(
    `${chart.system === 'vedic' ? 'Vedic · Lahiri Ayanamsha' : 'Western · Tropical Zodiac'}  ·  Engine: Swiss Ephemeris`,
    W / 2, 69, { align: 'center' }
  )

  // ── Big 4 signs ──
  let y = 78
  pdf.setFillColor(25, 20, 55)
  pdf.roundedRect(15, y, W - 30, 28, 3, 3, 'F')
  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(15, y, W - 30, 28, 3, 3, 'S')

  const big4 = [
    { label: 'SUN SIGN', val: `${chart.sunSign}` },
    { label: 'MOON SIGN', val: `${chart.moonSign}` },
    { label: 'ASCENDANT', val: `${chart.lagnaName}` },
    { label: 'NAKSHATRA', val: `${chart.moonNakshatra.name}` },
  ]

  big4.forEach((item, i) => {
    const x = 15 + (i * (W - 30) / 4) + (W - 30) / 8
    pdf.setFontSize(7)
    pdf.setTextColor(...muted)
    pdf.setFont('helvetica', 'normal')
    pdf.text(item.label, x, y + 9, { align: 'center' })
    pdf.setFontSize(13)
    pdf.setTextColor(...gold)
    pdf.setFont('helvetica', 'bold')
    pdf.text(item.val, x, y + 19, { align: 'center' })
  })

  // ── Planetary Positions ──
  y = 115
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...gold)
  pdf.text('PLANETARY POSITIONS', 15, y)
  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.3)
  pdf.line(15, y + 2, W - 15, y + 2)

  y += 10
  const headers = ['Planet', 'Vedic Name', 'Degree', 'Sign', 'House', 'Nakshatra']
  const colW = [28, 28, 22, 28, 16, 38]
  let xPos = 15

  // Table header
  pdf.setFillColor(35, 25, 70)
  pdf.rect(15, y - 4, W - 30, 8, 'F')
  headers.forEach((h, i) => {
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...gold)
    pdf.text(h, xPos + 2, y, { align: 'left' })
    xPos += colW[i]
  })

  y += 6
  chart.planets.forEach((p, idx) => {
    if (idx % 2 === 0) {
      pdf.setFillColor(15, 12, 38)
      pdf.rect(15, y - 3, W - 30, 7, 'F')
    }
    xPos = 15
    const row = [
      p.name,
      p.vedic,
      `${p.degInSign}°`,
      p.sign,
      `H${p.house}`,
      p.nakshatra.name
    ]
    row.forEach((val, i) => {
      pdf.setFontSize(8)
      pdf.setFont('helvetica', i === 0 ? 'bold' : 'normal')
      pdf.setTextColor(i === 0 ? 240 : 200, i === 0 ? 201 : 190, i === 0 ? 110 : 220)
      pdf.text(val, xPos + 2, y + 1, { align: 'left' })
      xPos += colW[i]
    })
    y += 7
  })

  // ── Dasha Timeline ──
  y += 8
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...gold)
  pdf.text('VIMSHOTTARI DASHA TIMELINE', 15, y)
  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.3)
  pdf.line(15, y + 2, W - 15, y + 2)
  y += 10

  const now = new Date().getFullYear() + new Date().getMonth() / 12
  chart.dashaTimeline.forEach((d, idx) => {
    const isActive = now >= d.startYear && now < d.endYear
    if (isActive) {
      pdf.setFillColor(35, 30, 10)
      pdf.rect(15, y - 3, W - 30, 7, 'F')
      pdf.setDrawColor(...gold)
      pdf.setLineWidth(0.2)
      pdf.rect(15, y - 3, W - 30, 7, 'S')
    }
    pdf.setFontSize(8)
    pdf.setFont('helvetica', isActive ? 'bold' : 'normal')
    pdf.setTextColor(isActive ? 212 : 150, isActive ? 168 : 140, isActive ? 83 : 180)
    pdf.text(`${d.planet} Dasha`, 20, y + 1)
    pdf.setTextColor(...muted)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${Math.floor(d.startYear)} — ${Math.floor(d.endYear)}`, 75, y + 1)
    pdf.text(`${d.years} years`, 125, y + 1)
    if (isActive) {
      pdf.setTextColor(...gold)
      pdf.setFont('helvetica', 'bold')
      pdf.text('← CURRENT', 155, y + 1)
    }
    y += 7
  })

  // ── Current Dasha insight ──
  y += 6
  pdf.setFillColor(20, 15, 50)
  pdf.roundedRect(15, y, W - 30, 22, 3, 3, 'F')
  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(15, y, W - 30, 22, 3, 3, 'S')
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...gold)
  pdf.text(`Current Mahadasha: ${chart.currentDasha.planet}`, 22, y + 8)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...muted)
  pdf.setFontSize(7)
  const dashaDesc = `Until ${Math.floor(chart.currentDasha.endYear)} · ${chart.currentDasha.years} year period`
  pdf.text(dashaDesc, 22, y + 15)

  // ── Lucky Numbers ──
  y += 30
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...gold)
  pdf.text('LUCKY NUMBERS', 15, y)
  y += 6
  chart.luckyNums.forEach((n, i) => {
    const cx = 22 + i * 18
    pdf.setFillColor(35, 25, 10)
    pdf.circle(cx, y + 3, 6, 'F')
    pdf.setDrawColor(...gold)
    pdf.setLineWidth(0.3)
    pdf.circle(cx, y + 3, 6, 'S')
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...gold)
    pdf.text(String(n), cx, y + 4, { align: 'center' })
  })

  // ── Footer ──
  pdf.setDrawColor(...gold)
  pdf.setLineWidth(0.3)
  pdf.line(15, H - 15, W - 15, H - 15)
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...muted)
  pdf.text('Generated by AstraOS · astraos-web.vercel.app · Powered by Swiss Ephemeris + Claude AI', W / 2, H - 9, { align: 'center' })
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, W / 2, H - 5, { align: 'center' })

  // Save
  const fileName = `${(userName || 'AstraOS').replace(/\s+/g, '_')}_Birth_Chart.pdf`
  pdf.save(fileName)
}
