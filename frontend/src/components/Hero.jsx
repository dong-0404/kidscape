import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Stagger from '../motion/Stagger.jsx'
import StaggerItem from '../motion/StaggerItem.jsx'
import { heroChips } from '../homeData.js'
import { CartIcon, PlayIcon, SoundIcon } from './home/Icons.jsx'
import { fadeUp, popToy, EASE, EASE_SOFT, DUR } from '../motion/variants'

// Hero "bầu trời": nền gradient trời + sa bàn gỗ bên phải.
// Entrance chỉ chạy một lần khi mount (above-the-fold) — không dùng whileInView.
export default function Hero() {
  const reduce = useReducedMotion()

  const floatIn = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: DUR.base, ease: EASE_SOFT, delay },
        }

  return (
    <section className="k-hero" id="home">
      <div className="k-hero__sky" aria-hidden="true">
        <span className="k-cloud k-cloud--1" />
        <span className="k-cloud k-cloud--2" />
        <span className="k-cloud k-cloud--3" />
        <span className="k-spark k-spark--1" />
        <span className="k-spark k-spark--2" />
        <span className="k-spark k-spark--3" />
      </div>

      {/* Sa bàn + 2 bé — ảnh đã fade mềm ở cạnh trái/dưới để tan vào nền trời */}
      <motion.div
        className="k-hero__stage"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scale: 1.04 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
        transition={reduce ? undefined : { duration: 0.9, ease: EASE }}
      >
        <img
          src="/assets/home/hero-board.webp"
          alt=""
          className="k-hero__board"
          width="1500"
          height="955"
        />

        <motion.div className="k-hero__bubble" {...floatIn(0.75)}>
          <span className="k-hero__bubble-icon"><SoundIcon /></span>
          <span>
            Chạm đúng vị trí
            <br />
            Lắng nghe thiên nhiên
          </span>
        </motion.div>

      </motion.div>

      <div className="container k-hero__inner">
        <Stagger className="k-hero__copy" animateNow gap={0.08} delay={0.05}>
          <StaggerItem variants={fadeUp}>
            <span className="k-ribbon">Sa bàn tương tác KidScape</span>
          </StaggerItem>

          <StaggerItem variants={fadeUp} as="h1" className="k-hero__title">
            <span className="k-hero__title-1">Khám phá</span>
            <span className="k-hero__title-2">
              <b>10 loài</b> <i>động vật</i>
            </span>
            <span className="k-hero__title-3">quý hiếm tại Việt Nam</span>
          </StaggerItem>

          <StaggerItem variants={fadeUp} as="p" className="k-hero__desc">
            Bộ đồ chơi giáo dục đa giác quan dành cho trẻ từ 3-6 tuổi, giúp con vừa chơi,
            vừa học, vừa yêu thiên nhiên.
          </StaggerItem>

          <StaggerItem variants={fadeUp} as="ul" className="k-hero__chips">
            {heroChips.map((c, i) => (
              <motion.li
                key={c.label}
                className={`k-chip k-chip--${c.tone}`}
                initial={reduce ? false : 'hidden'}
                animate={reduce ? undefined : 'show'}
                variants={reduce ? undefined : popToy}
                transition={reduce ? undefined : { delay: 0.45 + i * 0.08 }}
              >
                <span className="k-chip__art">
                  {c.icon ? <img src={c.icon} alt="" loading="lazy" /> : <b>{c.value}</b>}
                </span>
                <span className="k-chip__rule" aria-hidden="true" />
                <span className="k-chip__label">
                  {c.label.split('\n').map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </span>
              </motion.li>
            ))}
          </StaggerItem>

          <StaggerItem variants={fadeUp} className="k-hero__actions">
            <motion.span whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
              <Link to="/products" className="k-btn k-btn--red k-btn--lg">
                Đặt mua ngay <CartIcon width="20" height="20" />
              </Link>
            </motion.span>
            <motion.span whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
              <a href="#huong-dan" className="k-btn k-btn--outline k-btn--lg">
                Xem cách chơi <PlayIcon />
              </a>
            </motion.span>
          </StaggerItem>
        </Stagger>
      </div>

      <div className="k-hero__hem" aria-hidden="true" />
    </section>
  )
}
