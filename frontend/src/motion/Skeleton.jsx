// Skeleton loaders dùng LẠI class layout THẬT (.product-card, .blog-card, ...)
// để khớp dim — zero CLS khi data về. Media dùng aspect-ratio thật, không fixed px.
// Mọi node aria-hidden.

export function Skeleton({ w = '100%', h = 16, r = 8, style }) {
  return (
    <span
      className="skeleton"
      aria-hidden="true"
      style={{ width: w, height: h, borderRadius: r, ...style }}
    />
  )
}

export function SkeletonBlogCard() {
  return (
    <div className="blog-card" aria-hidden="true">
      <div className="blog-card__media">
        <Skeleton h="100%" w="100%" r={0} />
      </div>
      <div className="blog-card__body">
        <Skeleton h={20} w="80%" />
        <Skeleton h={14} w="100%" style={{ marginTop: 8 }} />
        <Skeleton h={14} w="60%" style={{ marginTop: 6 }} />
        <Skeleton h={14} w="35%" style={{ marginTop: 14 }} />
      </div>
    </div>
  )
}
