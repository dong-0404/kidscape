import { motion, useReducedMotion } from 'framer-motion'
import { popIn } from './variants'

// Con của Stagger. Variant mặc định popIn (card/media).
// Truyền variants={fadeUp} cho item dạng "danh sách/why-card" (không scale).
export default function StaggerItem({ as = 'div', variants = popIn, className, children, ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  if (reduce) return <M className={className} {...rest}>{children}</M>
  return (
    <M className={className} variants={variants} {...rest}>
      {children}
    </M>
  )
}
