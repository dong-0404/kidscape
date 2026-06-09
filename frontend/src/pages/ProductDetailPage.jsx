import { useParams, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { useChatWidget } from '../components/chatbot/ChatWidgetContext.jsx'
import { getProductBySlug } from '../api/products.js'
import { mediaUrl } from '../api/client.js'
import { footerInfo } from '../data.js'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { open: openChat } = useChatWidget()
  const [product, setProduct] = useState(null) // null = loading
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    window.scrollTo(0, 0)
    setProduct(null)
    setNotFound(false)
    getProductBySlug(slug)
      .then((p) => active && setProduct(p))
      .catch(() => active && setNotFound(true))
    return () => {
      active = false
    }
  }, [slug])

  // Unknown / inactive product → back to the list.
  if (notFound) return <Navigate to="/products" replace />

  if (product === null) {
    return (
      <>
        <Header />
        <main className="product-detail">
          <div className="container">
            <p className="admin-muted">Đang tải sản phẩm…</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const { name, tag, longDesc, desc, color, emoji, imagePath, ageRange, highlights = [], develops = [] } = product
  const img = mediaUrl(imagePath)

  return (
    <>
      <Header />
      <main className="product-detail" style={{ '--accent': color }}>
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/products">Sản phẩm</Link>
            <span aria-hidden="true">/</span>
            <span>{name}</span>
          </nav>

          <div className="product-detail__top">
            <div className="product-detail__media">
              {img ? (
                <img className="product-detail__img" src={img} alt={name} />
              ) : (
                <span className="product-detail__emoji" aria-hidden="true">
                  {emoji}
                </span>
              )}
            </div>

            <div className="product-detail__info">
              {tag && <span className="product-card__tag product-detail__tag">{tag}</span>}
              <h1 className="product-detail__title">{name}</h1>
              {ageRange && <p className="product-detail__age">👶 Phù hợp cho bé {ageRange}</p>}
              <p className="product-detail__desc">{longDesc || desc}</p>

              {develops.length > 0 && (
                <div className="product-develops">
                  <span className="product-develops__label">Phát triển:</span>
                  {develops.map((d) => (
                    <span className="chip" key={d}>
                      {d}
                    </span>
                  ))}
                </div>
              )}

              <div className="products-cta-row">
                <button type="button" className="btn btn--primary" onClick={openChat}>
                  💬 Hỏi trợ lý KidScape
                </button>
                <a href={`mailto:${footerInfo.email}`} className="btn btn--ghost">
                  Liên hệ đặt mua
                </a>
              </div>
            </div>
          </div>

          {highlights.length > 0 && (
            <section className="product-detail__highlights">
              <h2 className="section__title product-detail__h2">Điểm nổi bật</h2>
              <div className="product-highlights__grid">
                {highlights.map((h) => (
                  <article className="value-card" key={h.title}>
                    <span className="value-card__icon">{h.icon}</span>
                    <h3 className="why-card__title">{h.title}</h3>
                    {h.desc && <p className="why-card__desc">{h.desc}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="product-detail__back">
            <Link to="/products" className="link-arrow" style={{ color }}>
              <span aria-hidden="true">←</span> Tất cả sản phẩm
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
