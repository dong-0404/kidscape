import { productFaqs } from '../../data.js'

// FAQ accordion using native <details>/<summary> — accessible, no JS state.
export default function ProductFaq() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <div className="section__head">
          <span className="eyebrow">Giải đáp</span>
          <h2 className="section__title">Câu hỏi thường gặp</h2>
        </div>

        <div className="product-faq">
          {productFaqs.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary className="faq-item__q">
                {item.q}
                <span className="faq-item__icon" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="faq-item__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
