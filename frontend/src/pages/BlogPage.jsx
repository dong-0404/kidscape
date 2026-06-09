import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import BlogHero from '../components/blog/BlogHero.jsx'
import FeaturedPosts from '../components/blog/FeaturedPosts.jsx'
import CategoryFilter from '../components/blog/CategoryFilter.jsx'
import BlogCard from '../components/blog/BlogCard.jsx'
import { getBlogs } from '../api/blogs.js'
import { getCategories } from '../api/categories.js'

export default function BlogPage() {
  const [blogs, setBlogs] = useState(null) // null = loading
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState('') // category slug filter

  useEffect(() => {
    let active = true
    Promise.all([getBlogs(), getCategories()])
      .then(([b, c]) => {
        if (!active) return
        setBlogs(b)
        setCategories(c)
      })
      .catch(() => active && setError(true))
    return () => {
      active = false
    }
  }, [])

  // slug -> display name
  const categoryName = useMemo(() => {
    const map = Object.fromEntries(categories.map((c) => [c.slug, c.name]))
    return (slug) => map[slug] || ''
  }, [categories])

  const featured = (blogs || []).filter((b) => b.featured)
  const feed = (blogs || []).filter((b) => (selected ? b.category === selected : true))

  return (
    <>
      <Header />
      <main>
        <BlogHero />

        <section className="section">
          <div className="container">
            {blogs === null && !error && <p className="admin-muted">Đang tải bài viết…</p>}
            {error && <p className="admin-muted">Không tải được bài viết. Vui lòng thử lại sau.</p>}

            {blogs && !error && (
              <>
                {selected === '' && <FeaturedPosts posts={featured} categoryName={categoryName} />}

                <div className="section__head section__head--left">
                  <span className="eyebrow">Tin tức</span>
                  <h2 className="section__title">Tất cả bài viết</h2>
                </div>

                <CategoryFilter categories={categories} selected={selected} onSelect={setSelected} />

                {feed.length === 0 ? (
                  <p className="admin-muted">Chưa có bài viết nào trong mục này.</p>
                ) : (
                  <div className="blogs__grid">
                    {feed.map((b) => (
                      <BlogCard key={b._id} blog={b} categoryName={categoryName(b.category)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
