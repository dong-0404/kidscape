import { whyReasons } from '../data.js'

export default function WhyKidScape() {
  return (
    <section className="section why" id="why">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Vì sao chọn KidScape</span>
          <h2 className="section__title">Giá trị dành cho phụ huynh &amp; trẻ em</h2>
        </div>

        <div className="why__grid">
          {whyReasons.map((r) => (
            <article className="why-card" key={r.title}>
              <span className="why-card__icon">{r.icon}</span>
              <div>
                <h3 className="why-card__title">{r.title}</h3>
                <p className="why-card__desc">{r.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
