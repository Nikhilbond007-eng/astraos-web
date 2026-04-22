const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// ── In-memory cache ──
const cache = new Map()
function getCached(key) {
  const item = cache.get(key)
  if (!item) return null
  if (Date.now() > item.expiry) { cache.delete(key); return null }
  return item.data
}
function setCache(key, data, ttlMs) {
  cache.set(key, { data, expiry: Date.now() + ttlMs })
}

// ── Client-side question validator ──
const GIBBERISH_PATTERN = /^[^aeiou\s]{5,}$/i

export function validateQuestion(message) {
  const trimmed = message.trim()

  // Too short
  if (trimmed.length < 4) {
    return { valid: false, reason: 'too_short' }
  }

  // Pure gibberish — no vowels
  if (GIBBERISH_PATTERN.test(trimmed.replace(/\s/g, ''))) {
    return { valid: false, reason: 'gibberish' }
  }

  // Only numbers
  if (/^\d+$/.test(trimmed)) {
    return { valid: false, reason: 'numbers_only' }
  }

  // Only special characters
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
    return { valid: false, reason: 'special_chars' }
  }

  return { valid: true }
}

export async function generateChart(date, time, lat, lon, system, name) {
  const cacheKey = `chart-${date}-${time}-${lat}-${lon}-${system}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${API_URL}/api/chart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time, lat, lon, system, name })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  setCache(cacheKey, data.chart, 60 * 60 * 1000)
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
  const cacheKey = `daily-${chart.sunSign}-${chart.moonSign}-${chart.lagnaName}-${new Date().toDateString()}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${API_URL}/api/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chart, userName })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  setCache(cacheKey, data.reading, 6 * 60 * 60 * 1000)
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
  const cacheKey = `moon-${new Date().toDateString()}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${API_URL}/api/moon`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  setCache(cacheKey, data, 60 * 60 * 1000)
  return data
}

export async function getNumerology(name, dob) {
  const cacheKey = `num-${name}-${dob}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${API_URL}/api/numerology`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, dob })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  setCache(cacheKey, data, 24 * 60 * 60 * 1000)
  return data
}
