import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { footerInfo, footerColumns } from '../data.js'
import { useChatWidget } from './chatbot/ChatWidgetContext.jsx'
import { socialIcons, PhoneIcon, MailIcon, PinIcon, FacebookIcon } from './home/Icons.jsx'

// Footer xanh với dải đồi cỏ ở mép trên — khu "lặng", không reveal/stagger.
export default function Footer() {
  const { open: openChat } = useChatWidget()
  const reduce = useReducedMotion()
  const isHome = useLocation().pathname === '/'
  const hashHref = (hash) => (isHome ? `#${hash}` : `/#${hash}`)

  const renderLink = (l) => {
    if (l.widget) {
      return (
        <button type="button" className="k-footer__linkbtn" onClick={openChat}>
          {l.label}
        </button>
      )
    }
    if (l.hash) return <a href={hashHref(l.hash)}>{l.label}</a>
    return <Link to={l.to}>{l.label}</Link>
  }

  return (
    <footer className="k-footer">
      <div className="k-footer__hills" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#7CC24A" d="M0 78c150-46 300-58 470-32s330 44 500 16 320-52 470-30v88H0z" />
          <path fill="#4FA83A" d="M0 96c170-34 330-40 500-16s340 34 500 8 290-38 440-18v50H0z" />
        </svg>
      </div>

      <div className="container k-footer__inner">
        <div className="k-footer__brand">
          <p className="k-footer__logo">KIDSCAPE</p>
          <p className="k-footer__tagline">{footerInfo.tagline}</p>
          <div className="k-footer__socials">
            {footerInfo.socials.map((s) => {
              const Icon = socialIcons[s.icon]
              return (
                <motion.a
                  key={s.label}
                  href={s.href}
                  className="k-social"
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={reduce ? undefined : { scale: 0.9 }}
                >
                  {Icon && <Icon />}
                </motion.a>
              )
            })}
          </div>
        </div>

        {footerColumns.map((col) => (
          <nav className="k-footer__col" key={col.heading} aria-label={col.heading}>
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>{renderLink(l)}</li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="k-footer__col k-footer__col--contact">
          <h4>Liên hệ</h4>
          <ul>
            <li>
              <PhoneIcon />
              <a href={`tel:${footerInfo.phone.replace(/\s/g, '')}`}>{footerInfo.phone}</a>
            </li>
            <li>
              <MailIcon />
              <a href={`mailto:${footerInfo.email}`}>{footerInfo.email}</a>
            </li>
            <li>
              <FacebookIcon width="16" height="16" />
              <a href={`https://${footerInfo.facebook}`} target="_blank" rel="noreferrer">
                {footerInfo.facebook}
              </a>
            </li>
            <li>
              <PinIcon />
              <span>{footerInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="k-footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} KidScape. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  )
}
