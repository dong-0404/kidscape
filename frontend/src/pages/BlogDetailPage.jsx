import { useParams, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { getBlogBySlug } from '../api/blogs.js'
import { mediaUrl } from '../api/client.js'

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('vi-VN')
  } catch {
    return ''
  }
}

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null) // null = loading
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    window.scrollTo(0, 0)
    setBlog(null)
    setNotFound(false)
    getBlogBySlug(slug)
      .then((b) => active && setBlog(b))
      .catch(() => active && setNotFound(true))
    return () => {
      active = false
    }
  }, [slug])

  if (notFound) return <Navigate to="/blog" replace />

  if (blog === null) {
    return (
      <>
        <Header />
        <main className="blog-detail">
          <div className="container">
            <p className="admin-muted">Đang tải bài viết…</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const { title, content, category, tags = [], author, imagePath, publishedAt } = blog
  const img = mediaUrl(imagePath)
  // Sanitize the admin-authored HTML before rendering (defense against stored XSS).
  const safeHtml = DOMPurify.sanitize(content || '')

  return (
    <>
      <Header />
      <main className="blog-detail">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/blog">Tin tức</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>

          <article className="blog-detail__article">
            <header className="blog-detail__header">
              <h1 className="blog-detail__title">{title}</h1>
              <div className="blog-detail__meta">
                <span>{author || 'KidScape'}</span>
                {publishedAt && (
                  <>
                    <span aria-hidden="true">•</span>
                    <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                  </>
                )}
              </div>
            </header>

            {img && <img className="blog-detail__hero" src={img} alt={title} />}

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />

            {tags.length > 0 && (
              <footer className="blog-detail__footer">
                <div className="blog-tags">
                  {tags.map((t) => (
                    <span className="blog-tag" key={t}>
                      #{t}
                    </span>
                  ))}
                </div>
              </footer>
            )}
          </article>

          <div className="blog-detail__back">
            <Link to="/blog" className="link-arrow">
              <span aria-hidden="true">←</span> Tất cả bài viết
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
