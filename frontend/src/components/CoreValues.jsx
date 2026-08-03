import { coreValues } from '../data.js'
import Reveal from '../motion/Reveal.jsx'
import Stagger from '../motion/Stagger.jsx'
import StaggerItem from '../motion/StaggerItem.jsx'

export default function CoreValues() {
  return (
    <section className="section core" id="gioi-thieu">
      <div className="container">
        <Reveal className="section__head">
          <span className="eyebrow">Giá trị cốt lõi</span>
          <h2 className="section__title">Điều làm nên KidScape</h2>
          <p className="section__sub">
            5 giá trị định hướng mọi sản phẩm và hoạt động của chúng tôi.
          </p>
        </Reveal>

        <Stagger className="core__grid" gap={0.09}>
          {coreValues.map((v) => (
            // Framer làm chủ stagger — đã bỏ style={{'--i':i}} để tránh double-timing.
            <StaggerItem as="article" className="value-card" key={v.title}>
              <div className="value-card__icon">{v.icon}</div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
