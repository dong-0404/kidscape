import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Reset cuộn khi đổi pathname. Việc reset chính khi có page transition được làm
// qua AnimatePresence onExitComplete trong App.jsx (đợi page cũ fade-out xong).
// Component này là fallback cho lần mount đầu / khi reduced-motion (không có exit).
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}
