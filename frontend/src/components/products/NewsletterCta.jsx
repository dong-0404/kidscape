import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { subscribe } from '../../api/subscribers.js'
import Reveal from '../../motion/Reveal.jsx'
import { EASE_SOFT } from '../../motion/variants'

// Dải đăng ký nhận tin: bé thám hiểm + tiêu đề + ô email.
// Email được lưu qua POST /api/subscribers (admin xem/xuất được).
export default function NewsletterCta() {
  const reduce = useReducedMotion()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [errorCount, setErrorCount] = useState(0) // đổi mỗi lần lỗi để re-shake kể cả cùng nội dung
  const [submitting, setSubmitting] = useState(false)

  function fail(msg) {
    setError(msg)
    setErrorCount((c) => c + 1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      fail('Email chưa hợp lệ, bạn kiểm tra lại nhé.')
      return
    }
    setSubmitting(true)
    try {
      const res = await subscribe(email.trim())
      setMessage(res?.message || 'Cảm ơn bạn! Mình sẽ báo ngay khi có bộ sưu tập mới nhé. 💛')
      setDone(true)
    } catch (err) {
      fail(err.message || 'Đăng ký chưa thành công, bạn thử lại sau nhé.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="k-section pnews" id="dang-ky-tin">
      <div className="container">
        <Reveal className="pnews__box">
          <img className="pnews__boy" src="/assets/product/newsletter-boy.webp" alt="" width="560" height="395" />

          <div className="pnews__text">
            <h2 className="pnews__title">
              Không bỏ lỡ hành trình khám phá đầy thú vị của{' '}
              <span className="k-brand">Kid<b>Scape</b></span>!
            </h2>
            <p className="pnews__sub">
              Đăng ký ngay để nhận thông tin khi các bộ sưu tập mới sắp ra mắt nhé!
            </p>
          </div>

          <div className="pnews__form-wrap">
            {done ? (
              <motion.p
                className="pnews__done"
                role="status"
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={reduce ? undefined : { duration: 0.3, ease: EASE_SOFT }}
              >
                <span aria-hidden="true">🎉</span> {message}
              </motion.p>
            ) : (
              <form className="pnews__form" onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  className="pnews__input"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email của bạn"
                  aria-invalid={error ? 'true' : undefined}
                  required
                />
                <button type="submit" className="pnews__submit" disabled={submitting}>
                  {submitting ? 'Đang gửi…' : 'Đăng ký ngay'}
                  <img src="/assets/product/icon-send.png" alt="" width="85" height="76" />
                </button>
              </form>
            )}

            {error && (
              <motion.p
                key={errorCount}
                className="pnews__error"
                role="alert"
                initial={reduce ? false : { x: 0 }}
                animate={reduce ? undefined : { x: [0, -5, 5, -4, 4, 0] }}
                transition={reduce ? undefined : { duration: 0.35 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
