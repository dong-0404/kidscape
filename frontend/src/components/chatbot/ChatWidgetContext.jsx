import { createContext, useContext, useState, useCallback, useMemo } from 'react'

// Controls the floating chat widget's open/closed state so any component
// (e.g. the "Chatbot" nav item) can open it.
const ChatWidgetContext = createContext(null)

export function ChatWidgetProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle])

  return <ChatWidgetContext.Provider value={value}>{children}</ChatWidgetContext.Provider>
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext)
  if (!ctx) throw new Error('useChatWidget phải dùng bên trong <ChatWidgetProvider>')
  return ctx
}

export default ChatWidgetContext
