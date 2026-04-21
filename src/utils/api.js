const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function generateChart(date, time, lat, lon, system, name) {
  const res = await fetch(`${API_URL}/api/chart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time, lat, lon, system, name })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data.chart
}

export async function sendChatMessage(message, chart, userName, history, pageContext) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, chart, userName, history, pageContext })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data.response
}

export async function getDailyReading(chart, userName) {
  const res = await fetch(`${API_URL}/api/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chart, userName })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data.reading
}

export async function getCompatibility(chart1, chart2, name1, name2, type) {
  const res = await fetch(`${API_URL}/api/compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chart1, chart2, name1, name2, relationshipType: type })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data
}

export async function getTarotReading(cards, chart, userName) {
  const res = await fetch(`${API_URL}/api/tarot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards, chart, userName })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data.reading
}

export async function getMoonPhase() {
  const res = await fetch(`${API_URL}/api/moon`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data
}

export async function getNumerology(name, dob) {
  const res = await fetch(`${API_URL}/api/numerology`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, dob })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data
}
