// Category filter chips. `selected` is a category slug or '' for all.
export default function CategoryFilter({ categories, selected, onSelect }) {
  if (!categories.length) return null

  return (
    <div className="blog-filter" role="tablist" aria-label="Lọc theo danh mục">
      <button
        type="button"
        className={`blog-chip${selected === '' ? ' is-active' : ''}`}
        onClick={() => onSelect('')}
      >
        Tất cả
      </button>
      {categories.map((c) => (
        <button
          key={c._id || c.slug}
          type="button"
          className={`blog-chip${selected === c.slug ? ' is-active' : ''}`}
          onClick={() => onSelect(c.slug)}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
