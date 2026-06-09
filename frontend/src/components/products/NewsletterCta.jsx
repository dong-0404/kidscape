import { useState } from 'react'
import { useChatWidget } from '../chatbot/ChatWidgetContext.jsx'
import { subscribe } from '../../api/subscribers.js'

// "Get notified about new products" + a CTA to open the chatbot.
// The email is persisted via POST /api/subscribers (admin can view/export it).
export default function NewsletterCta() {
  const { open: openChat } = useChatWidget()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valid) {
      setError('Email chưa hợp lệ, bạn kiểm tra lại nhé.')
      return
    }
    setSubmitting(true)
    try {
      const res = await subscribe(email.trim())
      setMessage(res?.message || 'Cảm ơn bạn! Mình sẽ báo ngay khi có sản phẩm mới nhé. 💛')
      setDone(true)
    } catch (err) {
      setError(err.message || 'Đăng ký chưa thành công, bạn thử lại sau nhé.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="newsletter">
          <div className="newsletter__text">
            <h2 className="newsletter__title">Nhận tin khi có sản phẩm mới 🎉</h2>
            <p className="newsletter__sub">
              Để lại email để KidScape báo cho bạn ngay khi có sản phẩm mới, hoặc hỏi trợ lý của tụi
              mình bất cứ lúc nào.
            </p>
          </div>

          {done ? (
            <p className="newsletter__done" role="status">
              {message}
            </p>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                className="newsletter__input"
                placeholder="email@cuaban.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email của bạn"
                required
              />
              <button type="submit" className="btn btn--light" disabled={submitting}>
                {submitting ? 'Đang gửi…' : 'Đăng ký'}
              </button>
            </form>
          )}
          {error && (
            <p className="newsletter__error" role="alert">
              {error}
            </p>
          )}

          <button type="button" className="btn btn--outline-light newsletter__chat" onClick={openChat}>
            💬 Hỏi trợ lý KidScape
          </button>
        </div>
      </div>
    </section>
  )
}
