// ── Claude AI Integration ──
// Sends chart-aware requests to Claude API via your backend

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

// Build the system prompt with the user's chart baked in
function buildSystemPrompt(chart, userName) {
  const { planets, lagnaName, currentDasha, moonNakshatra, system } = chart
  const sunPlanet = planets[0]
  const moonPlanet = planets[1]
  const ascPlanet = { sign: lagnaName }

  return `You are AstraOS, a deeply wise and compassionate AI astrologer with mastery of both Vedic (Jyotish) and Western astrology. You speak with warmth, clarity, and genuine insight — like a trusted guru who truly knows the person they are speaking with.

You are speaking with ${userName || 'this person'}. Here is their complete astrological profile:

BIRTH CHART (${system === 'vedic' ? 'Vedic/Sidereal with Lahiri Ayanamsha' : 'Western/Tropical'}):
- Sun Sign: ${sunPlanet.sign} (${sunPlanet.degInSign}° in House ${sunPlanet.house})
- Moon Sign: ${moonPlanet.sign} (${moonPlanet.degInSign}° in House ${moonPlanet.house})
- Ascendant/Lagna: ${lagnaName}
- Moon Nakshatra: ${moonNakshatra.name} (Ruled by ${moonNakshatra.ruler})
- Current Mahadasha: ${currentDasha.planet} (${Math.floor(currentDasha.startYear)} — ${Math.floor(currentDasha.endYear)})

ALL PLANETARY POSITIONS:
${planets.map(p => `- ${p.name} (${p.vedic}): ${p.degInSign}° ${p.sign}, House ${p.house}, Nakshatra ${p.nakshatra.name}`).join('\n')}

GUIDELINES:
1. Every response must be PERSONALISED to this specific chart — never give generic sun-sign advice
2. Always ground your insights in actual planetary positions from the chart above
3. Give practical, actionable advice alongside spiritual insight
4. For health questions, always recommend consulting a doctor alongside cosmic guidance
5. Include specific PRECAUTIONS and WARNINGS relevant to their chart when asked about challenges
6. Be warm, direct, and avoid vague platitudes — speak with the confidence of genuine wisdom
7. When discussing timing, reference their current ${currentDasha.planet} Dasha period
8. Keep responses to 150-200 words unless a detailed analysis is specifically requested
9. End responses with one specific actionable recommendation
10. Do NOT mention that you are an AI — speak as a wise astrologer`
}

// Main chat function
export async function askAstroAI(userMessage, chart, userName, conversationHistory = []) {
  const systemPrompt = buildSystemPrompt(chart, userName)

  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ]

  // Call Claude API
  // In production: this goes through your Node.js backend at /api/chat
  // For demo: direct API call (add your key to .env as VITE_CLAUDE_API_KEY)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || 'The stars are momentarily quiet. Please try again.'
}

// Generate daily horoscope for a sign
export async function getDailyHoroscope(chart, userName) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const prompt = `Generate a personalised daily horoscope for ${today} for ${userName || 'this person'}. 

Focus on:
1. Today's cosmic energy for their ${chart.planets[0].sign} Sun and ${chart.planets[1].sign} Moon
2. One specific opportunity available today
3. One precaution or area to be mindful of
4. Their lucky time window today (morning/afternoon/evening)
5. A closing affirmation

Keep it to 120 words. Make it feel like a wise friend speaking, not a generic forecast.`

  return askAstroAI(prompt, chart, userName)
}

// Fallback responses when API key not configured
export function getFallbackResponse(question, chart, userName) {
  const fn = (userName || 'dear soul').split(' ')[0]
  const q = question.toLowerCase()
  const sun = chart.planets[0].sign
  const moon = chart.planets[1].sign
  const lagna = chart.lagnaName
  const dasha = chart.currentDasha.planet

  if (q.includes('love') || q.includes('relationship') || q.includes('marriage') || q.includes('partner'))
    return `${fn}, your ${sun} Sun and ${moon} Moon create a unique approach to love — you seek ${chart.planets[0].signIdx < 6 ? 'warmth, loyalty, and emotional depth' : 'intellectual connection, spiritual resonance, and genuine understanding'}. Your ${lagna} Ascendant draws partners who appreciate your authentic self. During this ${dasha} Dasha, focus on building genuine connection rather than seeking perfection. Open your heart — the cosmos is arranging meaningful encounters. Action: Have one honest conversation this week about what you truly want in relationship.`

  if (q.includes('career') || q.includes('job') || q.includes('work') || q.includes('business') || q.includes('money'))
    return `${fn}, your ${lagna} Ascendant gives you natural professional presence, and Jupiter's current position brings expansion opportunities. The ${dasha} Dasha ${dasha === 'Jupiter' ? 'is exceptionally favourable' : dasha === 'Saturn' ? 'rewards consistent, disciplined effort' : 'supports bold initiative'} for career advancement. Your ${sun} energy says: be visible, claim your expertise, do not dim your light. Financially, the next 6 months favour accumulation through your natural skills rather than speculation. Action: Identify the one skill that makes you truly irreplaceable and invest in deepening it this month.`

  if (q.includes('health') || q.includes('body') || q.includes('energy'))
    return `${fn}, your Moon in ${moon} governs your emotional and physical constitution. When inner peace is disturbed, your body speaks through ${chart.planets[1].signIdx % 3 === 0 ? 'the digestive system' : chart.planets[1].signIdx % 3 === 1 ? 'the heart and circulation' : 'the nervous system and breathing'}. During ${dasha} Dasha, prioritise rest, routine, and natural living. Your peak hours are ${chart.planets[0].signIdx < 6 ? 'morning to early afternoon' : 'late morning to evening'}. Note: Always consult a medical professional for health concerns — astrology is guidance, not diagnosis. Action: Spend 20 minutes in nature tomorrow morning.`

  if (q.includes('dasha') || q.includes('period') || q.includes('time'))
    return `${fn}, you are in your ${dasha} Mahadasha until ${Math.floor(chart.currentDasha.endYear)}. ${dasha === 'Saturn' ? 'This period demands patience and disciplined effort — but every sustained action now builds something that lasts decades.' : dasha === 'Jupiter' ? 'You are in one of the most blessed periods of your life. Expand — in knowledge, relationships, and ambitions.' : dasha === 'Venus' ? 'Beauty, pleasure, and relationships are your theme. Allow yourself to receive and enjoy.' : 'This period brings transformation and the opportunity to step powerfully into your authentic purpose.'} The cosmos asks you to ${dasha === 'Saturn' ? 'work steadily and trust the process' : dasha === 'Rahu' ? 'pursue your ambitions boldly while staying grounded' : 'expand with joy and faith'}. Action: Set one intention aligned with ${dasha}'s energy for the next 30 days.`

  // Generic personalised response
  return `${fn}, the stars speak clearly about this moment. With your ${sun} Sun, ${moon} Moon, and ${lagna} Ascendant, you carry a truly unique cosmic signature. Your current ${dasha} Dasha is teaching you about ${dasha === 'Saturn' ? 'patience and what truly lasts' : dasha === 'Jupiter' ? 'expansion and your own wisdom' : dasha === 'Venus' ? 'beauty and the art of receiving' : dasha === 'Moon' ? 'emotional intelligence and intuition' : 'authentic power and decisive action'}. The question you've asked touches something important — trust that your chart gives you everything needed to navigate this. Action: Spend 10 minutes in quiet reflection tonight and let the answer rise from within.`
}
