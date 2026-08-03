import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion(Link)

// Một cảm giác nút duy nhất toàn site: lift nhẹ khi hover, ấn xuống khi tap.
// CSS .btn transition vẫn là fallback. Dùng `to` (router Link), `href` (anchor),
// hoặc onClick (button).
const HOVER = { y: -2, scale: 1.015 }
const TAP = { scale: 0.97 }

export default function MotionButton({ to, href, children, className, ...rest }) {
  const reduce = useReducedMotion()
  const motionProps = reduce
    ? {}
    : { whileHover: HOVER, whileTap: TAP }

  if (to) {
    return (
      <MotionLink to={to} className={className} {...motionProps} {...rest}>
        {children}
      </MotionLink>
    )
  }
  if (href) {
    return (
      <motion.a href={href} className={className} {...motionProps} {...rest}>
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button className={className} {...motionProps} {...rest}>
      {children}
    </motion.button>
  )
}
