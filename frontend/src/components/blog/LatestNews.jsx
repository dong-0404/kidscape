import { useEffect, useState } from 'react'
import BlogCard from './BlogCard.jsx'
import { getBlogs } from '../../api/blogs.js'
import { getCategories } from '../../api/categories.js'
import Reveal from '../../motion/Reveal.jsx'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'
import MotionButton from '../../motion/MotionButton.jsx'

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
        <Reveal className="section__head">
          <span className="eyebrow">Tin tức</span>
          <h2 className="section__title">Tin tức mới nhất</h2>
          <p className="section__sub">Câu chuyện và mẹo nuôi dạy mới nhất từ KidScape.</p>
        </Reveal>

        <Stagger className="blogs__grid" gap={0.08}>
          {blogs.map((b) => (
            <StaggerItem key={b._id} className="grid-cell">
              <BlogCard blog={b} categoryName={catName(b.category)} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="products__more">
          <MotionButton to="/blog" className="btn btn--primary btn--lg">
            Xem tất cả bài viết
          </MotionButton>
        </div>
      </div>
    </section>
  )
}
