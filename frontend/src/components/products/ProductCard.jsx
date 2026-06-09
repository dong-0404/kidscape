import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client.js'

// A single (real, available) product card. Links to its detail page.
export default function ProductCard({ product }) {
  const { slug, name, tag, desc, color, emoji, imagePath } = product
  const img = mediaUrl(imagePath)

  return (
    <article className="product-card">
      <Link to={`/products/${slug}`} className="product-card__media" style={{ '--accent': color }}>
        {img ? (
          <img className="product-card__img" src={img} alt={name} loading="lazy" />
        ) : (
          <span className="product-card__emoji">{emoji}</span>
        )}
        {tag && <span className="product-card__tag">{tag}</span>}
      </Link>
      <div className="product-card__body">
        <h3 className="product-card__title">{name}</h3>
        <p className="product-card__desc">{desc}</p>
        <Link to={`/products/${slug}`} className="link-arrow" style={{ color }}>
          Xem chi tiết sản phẩm <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
