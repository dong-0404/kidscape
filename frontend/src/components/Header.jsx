import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { navLinks } from '../data.js'
import { CartIcon } from './home/Icons.jsx'
import { EASE, DUR } from '../motion/variants'

const MotionLink = motion(Link)

// Thanh điều hướng "viên thuốc" trắng nổi trên nền trời — logo đứng riêng bên trái.
// Link dạng hash trỏ tới section trang chủ; ở trang khác thì quay về "/" trước.
export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: tô sáng mục đang xem (chỉ chạy trên trang chủ).
  useEffect(() => {
    if (!isHome) return undefined
    const ids = ['home', ...navLinks.filter((l) => l.hash).map((l) => l.hash)]
    const sections = [...new Set(ids)].map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [isHome])

  const close = () => setOpen(false)

  // Khoá cuộn nền khi mở drawer mobile.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (link) => {
    if (link.hash) return isHome && active === link.hash
    if (link.to === '/') return isHome && active === 'home'
    return pathname.startsWith(link.to)
  }

  const renderLink = (link, i) => {
    const cls = `k-nav__link ${isActive(link) ? 'is-active' : ''}`
    const anim = reduce
      ? {}
      : {
          initial: { opacity: 0, y: -6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.fast, ease: EASE, delay: 0.06 + i * 0.04 },
        }

    if (link.hash) {
      return (
        <motion.a
          key={link.label}
          href={isHome ? `#${link.hash}` : `/#${link.hash}`}
          className={cls}
          onClick={close}
          {...anim}
        >
          {link.label}
        </motion.a>
      )
    }
    return (
      <MotionLink key={link.label} to={link.to} className={cls} onClick={close} {...anim}>
        {link.label}
      </MotionLink>
    )
  }

  return (
    <header className={`k-header ${scrolled ? 'k-header--scrolled' : ''}`}>
      <div className="container k-header__inner">
        <Link to="/" className="k-logo" onClick={close} aria-label="KidScape — về trang chủ">
          <img src="/assets/home/logo.png" alt="KidScape" width="246" height="134" />
        </Link>

        <div className={`k-header__bar ${open ? 'is-open' : ''}`}>
          <nav className="k-nav" aria-label="Điều hướng chính">
            {navLinks.map(renderLink)}
          </nav>

          <div className="k-header__actions">
            <Link to="/products" className="k-cart" aria-label="Giỏ hàng" onClick={close}>
              <CartIcon />
              <span className="k-cart__count">0</span>
            </Link>
            <MotionLink
              to="/products"
              className="k-btn k-btn--red k-header__cta"
              onClick={close}
              whileTap={reduce ? undefined : { scale: 0.96 }}
            >
              Đặt mua ngay
            </MotionLink>
          </div>
        </div>

        <button
          className={`k-burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && <button className="k-header__scrim" aria-label="Đóng menu" onClick={close} />}
    </header>
  )
}
