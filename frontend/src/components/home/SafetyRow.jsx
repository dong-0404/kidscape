import { useCallback, useEffect, useRef, useState } from 'react'
import { safetyPoints, warrantyPoints, testimonials } from '../../homeData.js'
import { CheckIcon, ChevronIcon, StarIcon } from './Icons.jsx'
import Reveal from '../../motion/Reveal.jsx'

const TONES = ['blue', 'green', 'red']

function CheckList({ title, items, tone }) {
  return (
    <article className={`k-promise k-promise--${tone}`}>
      <h3 className="k-promise__title">{title}</h3>
      <ul className="k-promise__list">
        {items.map((t) => (
          <li key={t}>
            <span className="k-promise__tick" aria-hidden="true"><CheckIcon /></span>
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}

// Cam kết an toàn + cảm nhận phụ huynh + bảo hành.
// Carousel dùng scroll-snap: kéo được bằng ngón tay, nút mũi tên chỉ là phím tắt.
export default function SafetyRow() {
  const trackRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [overflow, setOverflow] = useState(false)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setOverflow(track.scrollWidth - track.clientWidth > 8)
    const kids = Array.from(track.children)
    if (!kids.length) return
    const origin = kids[0].offsetLeft
    let best = 0
    let bestDist = Infinity
    kids.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - origin - track.scrollLeft)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    setIdx(best)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const goTo = (i) => {
    const track = trackRef.current
    if (!track) return
    const kids = Array.from(track.children)
    const target = kids[Math.max(0, Math.min(kids.length - 1, i))]
    if (target) track.scrollTo({ left: target.offsetLeft - kids[0].offsetLeft, behavior: 'smooth' })
  }

  return (
    <section className="k-section k-section--white" id="an-toan">
      <div className="container k-safety">
        <Reveal className="k-safety__side">
          <CheckList title="An toàn cho bé" items={safetyPoints} tone="blue" />
        </Reveal>

        <Reveal className="k-safety__main">
          <h3 className="k-safety__title">
            Ba mẹ nói gì về <span className="k-brand">Kid<b>Scape</b></span>?
          </h3>

          <div className="k-quotes">
            {overflow && (
              <button
                type="button"
                className="k-quotes__nav k-quotes__nav--prev"
                aria-label="Cảm nhận trước"
                disabled={idx === 0}
                onClick={() => goTo(idx - 1)}
              >
                <ChevronIcon dir="left" />
              </button>
            )}

            <ul className="k-quotes__track" ref={trackRef} onScroll={sync}>
              {testimonials.map((t, i) => (
                <li className={`k-quote k-quote--${TONES[i % TONES.length]}`} key={t.name}>
                  <div className="k-quote__stars" aria-label={`${t.stars} trên 5 sao`}>
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <StarIcon key={s} />
                    ))}
                  </div>
                  <p className="k-quote__text">“{t.quote}”</p>
                  <div className="k-quote__who">
                    <span className="k-quote__avatar" aria-hidden="true">
                      {t.name.trim().split(' ').pop().charAt(0)}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                      <em>{t.city}</em>
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {overflow && (
              <button
                type="button"
                className="k-quotes__nav k-quotes__nav--next"
                aria-label="Cảm nhận tiếp theo"
                disabled={idx >= testimonials.length - 1}
                onClick={() => goTo(idx + 1)}
              >
                <ChevronIcon />
              </button>
            )}
          </div>

          {overflow && (
            <div className="k-quotes__dots">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={i === idx ? 'is-on' : ''}
                  aria-label={`Xem cảm nhận ${i + 1}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </Reveal>

        <Reveal className="k-safety__side">
          <CheckList title="Bảo hành 3 tháng" items={warrantyPoints} tone="green" />
        </Reveal>
      </div>
    </section>
  )
}
