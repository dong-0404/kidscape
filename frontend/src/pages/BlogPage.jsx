import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import BlogHero from '../components/blog/BlogHero.jsx'
import FeaturedPosts from '../components/blog/FeaturedPosts.jsx'
import CategoryFilter from '../components/blog/CategoryFilter.jsx'
import BlogCard from '../components/blog/BlogCard.jsx'
import { getBlogs } from '../api/blogs.js'
import { getCategories } from '../api/categories.js'
import Reveal from '../motion/Reveal.jsx'
import Stagger from '../motion/Stagger.jsx'
import StaggerItem from '../motion/StaggerItem.jsx'
import { SkeletonBlogCard } from '../motion/Skeleton.jsx'

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

  const loading = blogs === null && !error
  const featured = (blogs || []).filter((b) => b.featured)
  const feed = (blogs || []).filter((b) => (selected ? b.category === selected : true))
  // Lưới lớn (>8 card) hạ stagger để không tạo chuỗi giật.
  const feedGap = feed.length > 8 ? 0.04 : 0.07

  return (
    <>
      <Header />
      <main>
        <BlogHero />

        <section className="section">
          <div className="container">
            {loading && (
              <div className="blogs__grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonBlogCard key={i} />
                ))}
              </div>
            )}
            {error && <p className="blog-state">Không tải được bài viết. Vui lòng thử lại sau.</p>}

            {blogs && !error && (
              <>
                {selected === '' && <FeaturedPosts posts={featured} categoryName={categoryName} />}

                <Reveal className="section__head section__head--left">
                  <span className="eyebrow">Tin tức</span>
                  <h2 className="section__title">Tất cả bài viết</h2>
                </Reveal>

                <CategoryFilter categories={categories} selected={selected} onSelect={setSelected} />

                {feed.length === 0 ? (
                  <p className="blog-state">Chưa có bài viết nào trong mục này.</p>
                ) : (
                  <AnimatePresence mode="wait">
                    {/* key đổi theo filter -> grid re-stagger "gật đầu" với thao tác lọc */}
                    <Stagger key={selected || 'all'} className="blogs__grid" gap={feedGap}>
                      {feed.map((b) => (
                        <StaggerItem key={b._id} className="grid-cell">
                          <BlogCard blog={b} categoryName={categoryName(b.category)} />
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </AnimatePresence>
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
