import { useState } from 'react'
import { useStore } from '../utils/store'
import { sendChatMessage } from '../utils/api'
import { getFallbackResponse } from '../utils/claude'

export default function FloatingChat() {
  const { chart, userName, incrementChat } = useStore()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!chart) return null

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    const allowed = incrementChat()
    if (!allowed) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }))
      const response = await sendChatMessage(q, chart, userName, history, 'general')
      setMessages(prev => [...prev, { role: 'assistant', text: response }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: getFallbackResponse(q, chart, userName)
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 500,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,rgba(212,168,83,.2),rgba(124,92,252,.15))',
          border: '1px solid rgba(212,168,83,.4)',
          color: 'var(--gold)', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(212,168,83,.2)',
          cursor: 'pointer', transition: 'transform .2s',
          transform: open ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {open ? '✕' : '✦'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 500,
          width: 340, height: 480,
          background: 'rgba(8,6,26,.97)',
          border: '1px solid rgba(212,168,83,.25)',
          borderRadius: 20, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 48px rgba(0,0,0,.5)',
          animation: 'fadeUp .3s ease both'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,.07)',
            background: 'rgba(255,255,255,.02)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--teal)',
              boxShadow: '0 0 8px var(--teal)'
            }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600 }}>
              Astro Chat AI
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted2)', marginLeft: 'auto', letterSpacing: 1 }}>
              {chart.sunSign} · {chart.lagnaName} Rising
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
            {messages.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
                Ask me anything about your chart, today's energy, or what lies ahead ✦
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <div style={{
                  padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.7,
                  background: m.role === 'user'
                    ? 'rgba(212,168,83,.1)'
                    : 'rgba(255,255,255,.04)',
                  border: m.role === 'user'
                    ? '1px solid rgba(212,168,83,.2)'
                    : '1px solid rgba(255,255,255,.07)',
                  color: m.role === 'user' ? 'var(--text)' : 'var(--muted)',
                  borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--muted2)',
                      animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask the stars..."
              style={{
                flex: 1, background: 'rgba(255,255,255,.03)',
                border: 'none', padding: '13px 16px',
                color: 'var(--text)', fontFamily: 'var(--font-body)',
                fontSize: 14, outline: 'none'
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                padding: '13px 18px',
                background: 'rgba(212,168,83,.1)',
                border: 'none', borderLeft: '1px solid rgba(255,255,255,.07)',
                color: 'var(--gold)', fontFamily: 'var(--font-serif)',
                fontSize: 12, cursor: 'pointer'
              }}
            >
              Ask ✦
            </button>
          </div>
        </div>
      )}
    </>
  )
}
