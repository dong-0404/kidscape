import { motion, useReducedMotion } from 'framer-motion'
import { EASE, EASE_SOFT, DUR } from '../../motion/variants'

// Category filter chips. `selected` is a category slug or '' for all.
export default function CategoryFilter({ categories, selected, onSelect }) {
  const reduce = useReducedMotion()
  if (!categories.length) return null

  const renderChip = (key, label, slug, i) => {
    const active = selected === slug
    const props = reduce
      ? {}
      : {
          initial: { opacity: 0, y: -6 },
          // is-active nảy nhẹ 1.04 (chip = đồ-chơi); thường thì scale 1.
          animate: { opacity: 1, y: 0, scale: active ? 1.04 : 1 },
          transition: active
            ? { duration: DUR.fast, ease: EASE_SOFT }
            : { duration: DUR.fast, ease: EASE, delay: i * 0.05 },
          whileTap: { scale: 0.94 },
        }
    return (
      <motion.button
        key={key}
        type="button"
        className={`blog-chip${active ? ' is-active' : ''}`}
        onClick={() => onSelect(slug)}
        {...props}
      >
        {label}
      </motion.button>
    )
  }

  return (
    <div className="blog-filter" role="tablist" aria-label="Lọc theo danh mục">
      {renderChip('all', 'Tất cả', '', 0)}
      {categories.map((c, i) => renderChip(c._id || c.slug, c.name, c.slug, i + 1))}
    </div>
  )
}
