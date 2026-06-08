import { coreValues } from '../data.js'

export default function CoreValues() {
  return (
    <section className="section core" id="values">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Giá trị cốt lõi</span>
          <h2 className="section__title">Điều làm nên KidScape</h2>
          <p className="section__sub">
            5 giá trị định hướng mọi sản phẩm và hoạt động của chúng tôi.
          </p>
        </div>

        <div className="core__grid">
          {coreValues.map((v, i) => (
            <article className="value-card" key={v.title} style={{ '--i': i }}>
              <div className="value-card__icon">{v.icon}</div>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
