import { products } from '../data.js'

export default function Products() {
  return (
    <section className="section products" id="products">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Sản phẩm nổi bật</span>
          <h2 className="section__title">Những Người Bạn Sách Đỏ</h2>
          <p className="section__sub">
            Khám phá bộ sưu tập đồ chơi giáo dục được thiết kế riêng cho hành trình lớn khôn của bé.
          </p>
        </div>

        <div className="products__grid">
          {products.map((p) => (
            <article className="product-card" key={p.name}>
              <div className="product-card__media" style={{ '--accent': p.color }}>
                <span className="product-card__emoji">{p.emoji}</span>
                <span className="product-card__tag">{p.tag}</span>
              </div>
              <div className="product-card__body">
                <h3 className="product-card__title">{p.name}</h3>
                <p className="product-card__desc">{p.desc}</p>
                <a href="#products" className="link-arrow" style={{ color: p.color }}>
                  Xem chi tiết sản phẩm <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
