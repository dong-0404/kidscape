import { motion, useReducedMotion } from 'framer-motion'
import { pageVariants } from './variants'

// Wrapper cho mỗi route public. Opacity-only crossfade (KHÔNG y-drift) để
// không tạo `transform` trên ancestor — tránh phá `position:sticky` của Header
// và `position:fixed` của ChatWidget.
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}
