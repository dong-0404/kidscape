import { Link } from 'react-router-dom'
import { useChatWidget } from '../chatbot/ChatWidgetContext.jsx'
import { mediaUrl } from '../../api/client.js'

// Large featured banner for the flagship product — fills the top of the page
// nicely even when there are few products.
export default function ProductSpotlight({ product }) {
  const { open: openChat } = useChatWidget()
  if (!product) return null

  const { slug, name, tag, longDesc, desc, color, emoji, ageRange, develops = [], imagePath } = product
  const img = mediaUrl(imagePath)

  return (
    <section className="product-spotlight" style={{ '--accent': color }}>
      <div className="product-spotlight__media">
        {img ? (
          <img className="product-spotlight__img" src={img} alt={name} />
        ) : (
          <span className="product-spotlight__emoji" aria-hidden="true">
            {emoji}
          </span>
        )}
      </div>

      <div className="product-spotlight__body">
        <span className="product-card__tag product-spotlight__tag">{tag}</span>
        <h2 className="product-spotlight__title">{name}</h2>
        {ageRange && <p className="product-spotlight__age">👶 Phù hợp cho bé {ageRange}</p>}
        <p className="product-spotlight__desc">{longDesc || desc}</p>

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
          <Link to={`/products/${slug}`} className="btn btn--primary">
            Xem chi tiết
          </Link>
          <button type="button" className="btn btn--ghost" onClick={openChat}>
            💬 Hỏi trợ lý KidScape
          </button>
        </div>
      </div>
    </section>
  )
}
