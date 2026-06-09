import { Link } from 'react-router-dom'
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

  return (
    <Link to={`/blog/${slug}`} className="blog-card">
      <div className="blog-card__media">
        {img ? (
          <img src={img} alt={title} loading="lazy" />
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
