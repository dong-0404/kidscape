import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce } from './variants'

// Scroll-reveal: phần tử fade-up một lần khi vào tầm nhìn.
// Gating reduced-motion tập trung ở đây — component KHÔNG tự branch.
export default function Reveal({ as = 'div', variants = fadeUp, className, children, ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  if (reduce) return <M className={className} {...rest}>{children}</M>
  return (
    <M
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </M>
  )
}
