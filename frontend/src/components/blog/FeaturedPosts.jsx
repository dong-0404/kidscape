import BlogCard from './BlogCard.jsx'
import Reveal from '../../motion/Reveal.jsx'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'

// Highlight up to 3 featured articles. Hidden when there are none.
export default function FeaturedPosts({ posts, categoryName }) {
  if (!posts.length) return null

  return (
    <section className="blog-featured">
      <Reveal className="section__head section__head--left">
        <span className="eyebrow">Nổi bật</span>
        <h2 className="section__title">Bài viết nổi bật</h2>
      </Reveal>
      <Stagger className="blogs__grid blog-featured__grid" gap={0.08}>
        {posts.slice(0, 3).map((b) => (
          <StaggerItem key={b._id} className="grid-cell">
            <BlogCard blog={b} categoryName={categoryName(b.category)} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
