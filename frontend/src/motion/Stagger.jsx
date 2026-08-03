import { motion, useReducedMotion } from 'framer-motion'
import { stagger, viewportOnce } from './variants'

// Container điều phối stagger cho con (StaggerItem).
// animateNow=true => chạy ngay khi mount (dùng cho hero above-the-fold).
// animateNow=false => chờ whileInView (scroll-reveal grid).
export default function Stagger({
  as = 'div',
  gap = 0.08,
  delay = 0,
  animateNow = false,
  className,
  children,
  ...rest
}) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  if (reduce) return <M className={className} {...rest}>{children}</M>
  const trigger = animateNow
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: viewportOnce }
  return (
    <M className={className} variants={stagger(gap, delay)} {...trigger} {...rest}>
      {children}
    </M>
  )
}
