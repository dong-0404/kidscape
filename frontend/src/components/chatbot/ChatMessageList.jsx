import { useEffect, useRef } from 'react'

// Renders the conversation. Bot text is rendered as PLAIN TEXT (no HTML) so a
// crafted answer can't inject markup — white-space:pre-wrap keeps line breaks.
export default function ChatMessageList({ messages }) {
  const endRef = useRef(null)

  // Auto-scroll to the newest content as it streams in.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className="chat-messages" role="log" aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} className={`chat-bubble chat-bubble--${m.role}`}>
          {m.role === 'bot' && m.status === 'streaming' && !m.text ? (
            <span className="chat-typing" aria-label="Đang soạn câu trả lời">
              <span />
              <span />
              <span />
            </span>
          ) : (
            <span className="chat-bubble__text">
              {m.text}
              {m.role === 'bot' && m.status === 'streaming' && <span className="chat-caret" />}
            </span>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
