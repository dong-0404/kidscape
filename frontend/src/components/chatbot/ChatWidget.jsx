import { useEffect, useRef, useState } from 'react'
import { useChatWidget } from './ChatWidgetContext.jsx'
import { getSuggestions, streamAsk } from '../../api/chatbot.js'
import SuggestedQuestions from './SuggestedQuestions.jsx'
import ChatMessageList from './ChatMessageList.jsx'
import ChatInput from './ChatInput.jsx'

const GREETING =
  'Xin chào! Mình là trợ lý của KidScape 🧸 Bạn muốn biết gì về KidScape, các bạn động vật hay sản phẩm của tụi mình nào?'

export default function ChatWidget() {
  const { isOpen, toggle, close } = useChatWidget()

  const [messages, setMessages] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [loadedSuggestions, setLoadedSuggestions] = useState(false)

  const idRef = useRef(0)
  const abortRef = useRef(null)
  const nextId = () => `m${++idRef.current}`

  // Load suggestions + greeting the first time the widget opens.
  useEffect(() => {
    if (!isOpen || loadedSuggestions) return
    setLoadedSuggestions(true)
    setMessages([{ id: nextId(), role: 'bot', text: GREETING, status: 'done' }])
    getSuggestions()
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
  }, [isOpen, loadedSuggestions])

  // Stop any in-flight stream when the widget closes / unmounts.
  useEffect(() => {
    if (!isOpen) stopStreaming()
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  function stopStreaming() {
    abortRef.current?.abort()
    abortRef.current = null
    setIsStreaming(false)
    // Finalize any bubble still marked streaming.
    setMessages((prev) =>
      prev.map((m) => (m.status === 'streaming' ? { ...m, status: 'done' } : m))
    )
  }

  // Chip click → show the canned answer instantly, no AI call.
  function handlePick(suggestion) {
    if (isStreaming) return
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text: suggestion.question, status: 'done' },
      { id: nextId(), role: 'bot', text: suggestion.answer, status: 'done' },
    ])
  }

  // Free-text question → stream the answer from Gemini.
  function handleSend(question) {
    const botId = nextId()
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text: question, status: 'done' },
      { id: botId, role: 'bot', text: '', status: 'streaming' },
    ])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    const update = (fn) =>
      setMessages((prev) => prev.map((m) => (m.id === botId ? fn(m) : m)))

    streamAsk(question, {
      signal: controller.signal,
      onDelta: (delta) => update((m) => ({ ...m, text: m.text + delta })),
      onDone: () => {
        update((m) => ({ ...m, status: 'done' }))
        setIsStreaming(false)
        abortRef.current = null
      },
      onError: (msg) => {
        update((m) => ({ ...m, text: m.text || msg, status: 'done' }))
        setIsStreaming(false)
        abortRef.current = null
      },
    })
  }

  return (
    <>
      <button
        type="button"
        className={`chat-launcher${isOpen ? ' chat-launcher--open' : ''}`}
        onClick={toggle}
        aria-label={isOpen ? 'Đóng trò chuyện' : 'Mở trò chuyện với KidScape'}
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">{isOpen ? '✕' : '💬'}</span>
      </button>

      {isOpen && (
        <section className="chat-panel" role="dialog" aria-label="Trợ lý KidScape">
          <header className="chat-panel__head">
            <span className="chat-panel__avatar" aria-hidden="true">
              🧸
            </span>
            <div className="chat-panel__title">
              <strong>Trợ lý KidScape</strong>
              <span>Luôn sẵn sàng hỗ trợ bạn</span>
            </div>
            <button type="button" className="chat-panel__close" onClick={close} aria-label="Đóng">
              ✕
            </button>
          </header>

          <ChatMessageList messages={messages} />

          <SuggestedQuestions suggestions={suggestions} onPick={handlePick} disabled={isStreaming} />

          <ChatInput onSend={handleSend} onStop={stopStreaming} isStreaming={isStreaming} />
        </section>
      )}
    </>
  )
}
