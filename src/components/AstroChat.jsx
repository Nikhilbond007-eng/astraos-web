import { useState, useRef, useEffect } from 'react'
import { useStore } from '../utils/store'
import { sendChatMessage } from '../utils/api'
import { getFallbackResponse } from '../utils/claude'
import styles from './AstroChat.module.css'

const SUGGESTIONS = [
  'What does my current Dasha mean?',
  'Is love coming for me this year?',
  'Best career path for my chart?',
  'What precautions should I take?',
  'How is my health this year?',
  'When is my luckiest time period?',
  'Tell me about my Nakshatra',
  'What are my lucky numbers today?',
]

export default function AstroChat({ chart, userName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { incrementChat, chatCount, isPremium } = useStore()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!chart) return
    const fn = (userName || 'dear soul').split(' ')[0]
    setMessages([{
      role: 'assistant',
      text: `Namaste, ${fn} ✦\n\nI have read your complete birth chart. Your ${chart.planets[0].sign} Sun, ${chart.planets[1].sign} Moon, and ${chart.lagnaName} Ascendant paint a portrait of a truly unique soul.\n\nYou are currently in your ${chart.currentDasha.planet} Mahadasha — a period of ${chart.currentDasha.planet === 'Jupiter' ? 'expansion and great blessing' : chart.currentDasha.planet === 'Saturn' ? 'discipline and karmic lessons' : chart.currentDasha.planet === 'Venus' ? 'beauty, love, and abundance' : chart.currentDasha.planet === 'Moon' ? 'emotional depth and intuition' : 'powerful transformation and growth'}.\n\nWhat would you like to know about your cosmic blueprint?`,
      time: new Date()
    }])
  }, [chart, userName])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || !chart || loading) return

    const allowed = incrementChat()
    if (!allowed) return

    setInput('')
    const userMsg = { role: 'user', text: q, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }))
      const response = await sendChatMessage(q, chart, userName, history, 'chart')
      setMessages(prev => [...prev, { role: 'assistant', text: response, time: new Date() }])
    } catch (err) {
      const fallback = getFallbackResponse(q, chart, userName)
      setMessages(prev => [...prev, { role: 'assistant', text: fallback, time: new Date() }])
    } finally {
      setLoading(false)
    }
  }
  

  const remaining = isPremium ? '∞' : Math.max(0, 3 - chatCount)

  return (
    <div className={styles.chatWrap}>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>
          <span className={styles.chatOrb} />
          Astro Chat AI
        </div>
        <div className={styles.chatMeta}>
          {isPremium
            ? <span className="free-badge">∞ Unlimited</span>
            : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: remaining > 0 ? 'var(--teal)' : 'var(--rose)', letterSpacing: 2 }}>
                {remaining} free {remaining === 1 ? 'message' : 'messages'} left
              </span>
          }
        </div>
      </div>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map(s => (
          <button key={s} className={styles.suggBtn} onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgAI}`}>
            {m.role === 'assistant' && <div className={styles.msgName}>ASTRAOS AI</div>}
            {m.role === 'user' && <div className={`${styles.msgName} ${styles.msgNameRight}`}>YOU</div>}
            <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleAI}`}>
              {m.text.split('\n').map((line, j) => <p key={j} style={{ margin: j > 0 && line ? '6px 0 0' : 0 }}>{line}</p>)}
            </div>
            <div className={`${styles.msgTime} ${m.role === 'user' ? styles.msgTimeRight : ''}`}>
              {m.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.msg} ${styles.msgAI}`}>
            <div className={styles.msgName}>ASTRAOS AI</div>
            <div className={`${styles.bubble} ${styles.bubbleAI}`}>
              <div className={styles.typing}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          className={styles.chatInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={remaining === 0 && !isPremium ? 'Upgrade to continue chatting...' : 'Ask anything about your chart, life, or destiny...'}
          disabled={remaining === 0 && !isPremium}
        />
        <button
          className={styles.sendBtn}
          onClick={() => send()}
          disabled={!input.trim() || loading || (remaining === 0 && !isPremium)}
        >
          Ask ✦
        </button>
      </div>
    </div>
  )
}
