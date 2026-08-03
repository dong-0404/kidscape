import { createContext, useContext, useState, useCallback, useMemo } from 'react'

// Controls the floating chat widget's open/closed state so any component
// (e.g. the "Chatbot" nav item) can open it.
const ChatWidgetContext = createContext(null)

export function ChatWidgetProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  // Nội dung soạn sẵn (vd. nút "Đặt mua ngay") sẽ được đổ vào ô nhập khi mở.
  const [draft, setDraft] = useState('')

  // `open` hay được gán thẳng làm onClick nên tham số đầu có thể là event —
  // chỉ nhận prefill khi nó thực sự là chuỗi.
  const open = useCallback((prefill) => {
    setDraft(typeof prefill === 'string' ? prefill : '')
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  const clearDraft = useCallback(() => setDraft(''), [])

  const value = useMemo(
    () => ({ isOpen, open, close, toggle, draft, clearDraft }),
    [isOpen, open, close, toggle, draft, clearDraft]
  )

  return <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext)
  if (!ctx) throw new Error('useChatWidget phải dùng bên trong <ChatWidgetProvider>')
  return ctx
}

export default ChatWidgetContext
