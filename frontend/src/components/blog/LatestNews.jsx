import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BlogCard from './BlogCard.jsx'
import { getBlogs } from '../../api/blogs.js'
import { getCategories } from '../../api/categories.js'

// Homepage "latest news" preview — 3 newest articles + a link to /blog.
export default function LatestNews() {
  const [blogs, setBlogs] = useState([])
  const [catName, setCatName] = useState(() => () => '')

  useEffect(() => {
    let active = true
    Promise.all([getBlogs(), getCategories()])
      .then(([b, c]) => {
        if (!active) return
        setBlogs(b.slice(0, 3))
        const map = Object.fromEntries(c.map((x) => [x.slug, x.name]))
        setCatName(() => (slug) => map[slug] || '')
      })
      .catch(() => active && setBlogs([]))
    return () => {
      active = false
    }
  }, [])

  if (!blogs.length) return null

  return (
    <section className="section news-preview">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Tin tức</span>
          <h2 className="section__title">Tin tức mới nhất</h2>
          <p className="section__sub">Câu chuyện và mẹo nuôi dạy mới nhất từ KidScape.</p>
        </div>

        <div className="blogs__grid">
          {blogs.map((b) => (
            <BlogCard key={b._id} blog={b} categoryName={catName(b.category)} />
          ))}
        </div>

        <div className="products__more">
          <Link to="/blog" className="btn btn--primary btn--lg">
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </section>
  )
}
