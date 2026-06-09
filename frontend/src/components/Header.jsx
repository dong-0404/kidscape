import { useState, useEffect } from 'react'
import { navLinks } from '../data.js'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#home" className="logo" onClick={() => setOpen(false)}>
          <span className="logo__mark" aria-hidden="true">
            <span className="logo__dot logo__dot--y" />
            <span className="logo__dot logo__dot--t" />
          </span>
          <span className="logo__text">KidScape</span>
        </a>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {/* The chatbot is reachable via the floating launcher, so it's omitted from the nav. */}
          {navLinks
            .filter((link) => !link.widget)
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav__link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          <a href="#products" className="btn btn--primary nav__cta" onClick={() => setOpen(false)}>
            Khám phá
          </a>
        </nav>

        <button
          className={`burger ${open ? 'burger--open' : ''}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
