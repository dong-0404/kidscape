import { useParams, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { getBlogBySlug } from '../api/blogs.js'
import { mediaUrl } from '../api/client.js'
import Reveal from '../motion/Reveal.jsx'
import Stagger from '../motion/Stagger.jsx'
import StaggerItem from '../motion/StaggerItem.jsx'
import { Skeleton } from '../motion/Skeleton.jsx'
import { popIn, popToy } from '../motion/variants'

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
            <nav className="breadcrumb" aria-hidden="true">
              <Skeleton w={60} h={14} />
              <Skeleton w={160} h={14} />
            </nav>
            <article className="blog-detail__article">
              <Skeleton w="85%" h={36} />
              <Skeleton w={200} h={14} style={{ marginTop: 14 }} />
              <Skeleton w="100%" h={260} r={18} style={{ marginTop: 20 }} />
              <Skeleton w="100%" h={14} style={{ marginTop: 22 }} />
              <Skeleton w="95%" h={14} style={{ marginTop: 10 }} />
              <Skeleton w="90%" h={14} style={{ marginTop: 10 }} />
            </article>
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
            <Stagger as="header" className="blog-detail__header" animateNow gap={0.08} delay={0.05}>
              <StaggerItem as="h1" className="blog-detail__title">{title}</StaggerItem>
              <StaggerItem as="div" className="blog-detail__meta">
                <span>{author || 'KidScape'}</span>
                {publishedAt && (
                  <>
                    <span aria-hidden="true">•</span>
                    <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                  </>
                )}
              </StaggerItem>
            </Stagger>

            {img && (
              <Reveal as="img" variants={popIn} className="blog-detail__hero" src={img} alt={title} />
            )}

            {/* Nội dung HTML (DOMPurify) — chỉ MỘT wrapper fade-up bên ngoài */}
            <Reveal
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            {tags.length > 0 && (
              <footer className="blog-detail__footer">
                <Stagger className="blog-tags" gap={0.05}>
                  {tags.map((t) => (
                    <StaggerItem as="span" variants={popToy} className="blog-tag" key={t}>
                      #{t}
                    </StaggerItem>
                  ))}
                </Stagger>
              </footer>
            )}
          </article>

          <Reveal className="blog-detail__back">
            <Link to="/blog" className="link-arrow">
              <span aria-hidden="true">←</span> Tất cả bài viết
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  )
}
