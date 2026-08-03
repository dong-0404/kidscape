import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { mediaUrl } from '../../api/client.js'

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('vi-VN')
  } catch {
    return ''
  }
}

// A blog article card linking to its detail page. `categoryName` maps the
// stored category slug to a display name (passed by the page).
export default function BlogCard({ blog, categoryName }) {
  const { slug, title, excerpt, imagePath, publishedAt } = blog
  const img = mediaUrl(imagePath)
  const reduce = useReducedMotion()

  // Card lift giữ ở CSS (.blog-card:hover). Framer chỉ lo media-zoom trên ẢNH THẬT.
  return (
    <Link to={`/blog/${slug}`} className="blog-card">
      <div className="blog-card__media">
        {img ? (
          <motion.img
            src={img}
            alt={title}
            loading="lazy"
            whileHover={reduce ? undefined : { scale: 1.08 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <span className="blog-card__icon" aria-hidden="true">
            📰
          </span>
        )}
        {categoryName && <span className="blog-card__category">{categoryName}</span>}
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title">{title}</h3>
        {excerpt && <p className="blog-card__excerpt">{excerpt}</p>}
        <div className="blog-card__foot">
          {publishedAt && <time className="blog-card__date">{formatDate(publishedAt)}</time>}
          <span className="link-arrow">
            Đọc thêm <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
