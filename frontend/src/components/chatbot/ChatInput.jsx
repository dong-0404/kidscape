import { useState } from 'react'

const MAX_LEN = 500

// Free-text input. Enter submits, Shift+Enter inserts a newline. While the bot
// is streaming the send button becomes a "Dừng" (stop) button.
export default function ChatInput({ onSend, onStop, isStreaming }) {
  const [value, setValue] = useState('')

  function submit() {
    const q = value.trim()
    if (!q || isStreaming) return
    onSend(q)
    setValue('')
  }

  function handleKeyDown(e) {
    // Ignore Enter while an IME (e.g. Vietnamese telex) is still composing —
    // otherwise the last syllable commits AFTER we clear the field and reappears.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      className="chat-input"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <textarea
        className="chat-input__field"
        placeholder="Nhập câu hỏi của bạn…"
        value={value}
        maxLength={MAX_LEN}
        rows={1}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Câu hỏi"
      />
      {isStreaming ? (
        <button type="button" className="chat-input__btn chat-input__btn--stop" onClick={onStop}>
          Dừng
        </button>
      ) : (
        <button type="submit" className="chat-input__btn" disabled={!value.trim()} aria-label="Gửi">
          ➤
        </button>
      )}
    </form>
  )
}
