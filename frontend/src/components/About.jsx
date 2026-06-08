export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Về chúng tôi</span>
          <h2 className="section__title">Lý do KidScape tồn tại</h2>
        </div>

        <div className="about__grid">
          <article className="mv-card mv-card--mission">
            <div className="mv-card__icon">🎯</div>
            <h3 className="mv-card__title">Sứ mệnh</h3>
            <p>
              KidScape mang đến các sản phẩm đồ chơi giáo dục đa giác quan giúp trẻ học hỏi
              thông qua vui chơi, khám phá và tương tác. Chúng tôi đồng hành cùng phụ huynh
              trong hành trình phát triển toàn diện của trẻ, xây dựng môi trường làm việc sáng
              tạo cho đội ngũ và thúc đẩy hợp tác bền vững với các đối tác giáo dục. Thông qua
              việc kết hợp giáo dục, công nghệ và trải nghiệm đa giác quan, KidScape hướng đến
              lan tỏa những giá trị tích cực cho trẻ em và cộng đồng.
            </p>
          </article>

          <article className="mv-card mv-card--vision">
            <div className="mv-card__icon">🔭</div>
            <h3 className="mv-card__title">Tầm nhìn</h3>
            <p>
              KidScape hướng đến trở thành thương hiệu giáo dục trải nghiệm được phụ huynh Việt
              Nam tin tưởng và luôn nghĩ đến đầu tiên khi lựa chọn sản phẩm đồng hành cùng con
              trong những năm đầu đời. Chúng tôi kiến tạo một tương lai nơi mọi trẻ em được phát
              triển toàn diện thông qua học tập trải nghiệm đa giác quan, nuôi dưỡng tư duy sáng
              tạo và phát triển toàn diện.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
