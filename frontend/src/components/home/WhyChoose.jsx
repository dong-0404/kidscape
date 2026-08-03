import { whyChoose } from '../../homeData.js'
import Reveal from '../../motion/Reveal.jsx'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'
import { fadeUp } from '../../motion/variants'

// "Vì sao ba mẹ chọn KidScape?" — 4 lý do trong một card lớn, chia 2 cột.
export default function WhyChoose() {
  return (
    <section className="k-section" id="vi-sao">
      <div className="container">
        <Reveal className="k-panel k-panel--plain">
          <h2 className="k-title k-panel__title">
            Vì sao ba mẹ chọn <span className="k-brand">Kid<b>Scape</b></span>?
          </h2>
          <p className="k-panel__sub">
            Bốn điều làm nên khác biệt của bộ sa bàn tương tác đầu tiên về động vật quý hiếm Việt Nam.
          </p>

          <Stagger className="k-why" gap={0.08}>
            {whyChoose.map((w) => (
              <StaggerItem as="article" variants={fadeUp} className="k-why__item" key={w.title}>
                <span className="k-why__icon">
                  <img src={w.icon} alt="" loading="lazy" width="200" height="200" />
                </span>
                <div>
                  <h3 className="k-why__title">{w.title}</h3>
                  <p className="k-why__desc">{w.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </section>
  )
}
