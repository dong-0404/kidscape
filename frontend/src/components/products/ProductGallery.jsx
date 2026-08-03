import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronIcon } from '../home/Icons.jsx'
import { DUR, EASE } from '../../motion/variants'

// Thư viện ảnh sản phẩm: cột thumbnail dọc + khung ảnh lớn.
// Theo file thiết kế, khung lớn mở ra bằng ẢNH TỔNG BỘ (`hero`) còn dải thumbnail
// chỉ liệt kê các ảnh chi tiết. Bấm vào khung lớn để quay lại ảnh tổng bộ.
export default function ProductGallery({ images, hero }) {
  const [active, setActive] = useState(0)
  const [showHero, setShowHero] = useState(Boolean(hero))
  const [canScroll, setCanScroll] = useState(false)
  const railRef = useRef(null)
  const reduce = useReducedMotion()

  const current = showHero && hero ? hero : images[active]

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    setCanScroll(rail.scrollHeight - rail.clientHeight - rail.scrollTop > 8)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const pick = (i) => {
    setActive(i)
    setShowHero(false)
  }

  const scrollDown = () => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ top: rail.clientHeight * 0.6, behavior: 'smooth' })
  }

  // Điều hướng bằng phím mũi tên khi đang focus trong cột thumbnail.
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? active + 1 : active - 1
    if (next < 0 || next >= images.length) return
    pick(next)
    railRef.current?.children[next]?.focus()
  }

  return (
    <div className="pgal">
      <div className="pgal__rail-wrap">
        <div
          className="pgal__rail"
          ref={railRef}
          onScroll={sync}
          onKeyDown={onKeyDown}
          role="tablist"
          aria-label="Ảnh chi tiết sản phẩm"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-selected={!showHero && i === active}
              aria-label={img.alt}
              className={`pgal__thumb ${i === active ? 'is-active' : ''}`}
              onClick={() => pick(i)}
            >
              <img src={img.thumb} alt="" loading="lazy" width="260" height="260" />
            </button>
          ))}
        </div>
        {canScroll && (
          <button type="button" className="pgal__more" aria-label="Xem thêm ảnh" onClick={scrollDown}>
            <ChevronIcon dir="down" />
          </button>
        )}
      </div>

      <button
        type="button"
        className={`pgal__stage ${showHero ? 'is-hero' : ''}`}
        onClick={() => hero && setShowHero(true)}
        title={showHero ? undefined : 'Xem lại ảnh tổng bộ'}
        aria-label={showHero ? current.alt : `${current.alt} — bấm để xem lại ảnh tổng bộ`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="pgal__img"
            width="1200"
            height="800"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={reduce ? undefined : { duration: DUR.fast, ease: EASE }}
          />
        </AnimatePresence>
      </button>
    </div>
  )
}
