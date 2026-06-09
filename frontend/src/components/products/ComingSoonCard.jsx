import { mediaUrl } from '../../api/client.js'

// A teaser card for an upcoming product — dimmed, badged "Sắp ra mắt", no link.
export default function ComingSoonCard({ product }) {
  // `desc` is the public field; older callers may pass `teaser`.
  const { name, tag, color, emoji, imagePath } = product
  const blurb = product.desc || product.teaser || ''
  const img = mediaUrl(imagePath)

  return (
    <article className="product-card product-card--soon" aria-label={`${name} — sắp ra mắt`}>
      <div className="product-card__media" style={{ '--accent': color }}>
        {img ? (
          <img className="product-card__img" src={img} alt={name} loading="lazy" />
        ) : (
          <span className="product-card__emoji">{emoji}</span>
        )}
        {tag && <span className="product-card__tag">{tag}</span>}
        <span className="product-card__soon-badge">Sắp ra mắt</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>
        <p className="product-card__desc">{blurb}</p>
        <span className="product-card__soon-note">Đang phát triển — hãy đón chờ nhé! ✨</span>
      </div>
    </article>
  )
}
