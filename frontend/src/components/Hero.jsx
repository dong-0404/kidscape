import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge">✨ Đồ chơi giáo dục đa giác quan</span>
          <h1 className="hero__title">
            KidScape — Đồng hành cùng con <span className="text-grad">khám phá thế giới</span>
          </h1>
          <p className="hero__desc">
            Thương hiệu đồ chơi giáo dục đa giác quan dành cho trẻ từ 3-6 tuổi, học hỏi và
            khám phá thế giới xung quanh thông qua <strong>nhìn — nghe — chạm — tương tác</strong>.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="btn btn--primary btn--lg">Khám phá sản phẩm</Link>
            <a href="#about" className="btn btn--ghost btn--lg">Tìm hiểu thêm</a>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <span className="stat__num">3-6</span>
              <span className="stat__label">Độ tuổi phù hợp</span>
            </div>
            <div className="stat">
              <span className="stat__num">4</span>
              <span className="stat__label">Giác quan kích hoạt</span>
            </div>
            <div className="stat">
              <span className="stat__num">100%</span>
              <span className="stat__label">An toàn cho trẻ</span>
            </div>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card">
            <div className="hero__emoji hero__emoji--main">🧸</div>
            <div className="float-chip float-chip--1">👀 Nhìn</div>
            <div className="float-chip float-chip--2">👂 Nghe</div>
            <div className="float-chip float-chip--3">✋ Chạm</div>
            <div className="float-chip float-chip--4">🎯 Tương tác</div>
          </div>
        </div>
      </div>
    </section>
  )
}
