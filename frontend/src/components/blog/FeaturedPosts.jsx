import BlogCard from './BlogCard.jsx'

// Highlight up to 3 featured articles. Hidden when there are none.
export default function FeaturedPosts({ posts, categoryName }) {
  if (!posts.length) return null

  return (
    <section className="blog-featured">
      <div className="section__head section__head--left">
        <span className="eyebrow">Nổi bật</span>
        <h2 className="section__title">Bài viết nổi bật</h2>
      </div>
      <div className="blogs__grid blog-featured__grid">
        {posts.slice(0, 3).map((b) => (
          <BlogCard key={b._id} blog={b} categoryName={categoryName(b.category)} />
        ))}
      </div>
    </section>
  )
}
