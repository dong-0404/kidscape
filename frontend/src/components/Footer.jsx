import { footerInfo, navLinks } from '../data.js'
import { useChatWidget } from './chatbot/ChatWidgetContext.jsx'

export default function Footer() {
  const { open: openChat } = useChatWidget()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#home" className="logo logo--light">
            <span className="logo__mark" aria-hidden="true">
              <span className="logo__dot logo__dot--y" />
              <span className="logo__dot logo__dot--t" />
            </span>
            <span className="logo__text">KidScape</span>
          </a>
          <p className="footer__tagline">
            Đồ chơi giáo dục đa giác quan giúp trẻ 3-6 tuổi khám phá thế giới.
          </p>
          <div className="footer__socials">
            {footerInfo.socials.map((s) => (
              <a key={s.label} href={s.href} className="social" aria-label={s.label} title={s.label}>
                {s.short}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Điều hướng</h4>
          <ul className="footer__list">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.widget ? (
                  <button type="button" className="footer__linkbtn" onClick={openChat}>
                    {l.label}
                  </button>
                ) : (
                  <a href={l.href}>{l.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Liên hệ</h4>
          <ul className="footer__list footer__list--contact">
            <li><span aria-hidden="true">📍</span> {footerInfo.address}</li>
            <li>
              <span aria-hidden="true">✉️</span>{' '}
              <a href={`mailto:${footerInfo.email}`}>{footerInfo.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} KidScape. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  )
}
