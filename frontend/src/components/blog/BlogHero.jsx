import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'
import { fadeUp, popToy } from '../../motion/variants'

// Static hero banner for the blog page (theme: animals, education, nature).
export default function BlogHero() {
  return (
    <section className="blog-hero">
      {/* dotted-accent overlay — chỗ DUY NHẤT dùng dotted overlay */}
      <span className="blog-hero__dots deco-dots" aria-hidden="true" />
      <Stagger className="container blog-hero__inner" animateNow gap={0.09} delay={0.05}>
        <StaggerItem as="span" variants={popToy} className="badge">📰 Tin tức & Câu chuyện</StaggerItem>
        <StaggerItem as="h1" variants={fadeUp} className="blog-hero__title">
          Khám phá thế giới <span className="text-grad">động vật, giáo dục & thiên nhiên</span>
        </StaggerItem>
        <StaggerItem as="p" variants={fadeUp} className="blog-hero__desc">
          Những bài viết, mẹo nuôi dạy và câu chuyện truyền cảm hứng từ KidScape — đồng hành cùng bé
          trên hành trình khám phá thế giới.
        </StaggerItem>
      </Stagger>
    </section>
  )
}
