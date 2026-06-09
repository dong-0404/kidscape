// Static hero banner for the blog page (theme: animals, education, nature).
export default function BlogHero() {
  return (
    <section className="blog-hero">
      <div className="container blog-hero__inner">
        <span className="badge">📰 Tin tức & Câu chuyện</span>
        <h1 className="blog-hero__title">
          Khám phá thế giới <span className="text-grad">động vật, giáo dục & thiên nhiên</span>
        </h1>
        <p className="blog-hero__desc">
          Những bài viết, mẹo nuôi dạy và câu chuyện truyền cảm hứng từ KidScape — đồng hành cùng bé
          trên hành trình khám phá thế giới.
        </p>
      </div>
    </section>
  )
}
