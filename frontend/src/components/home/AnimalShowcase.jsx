import { animals } from '../../homeData.js'
import { PawIcon } from './Icons.jsx'
import Reveal from '../../motion/Reveal.jsx'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'
import MotionButton from '../../motion/MotionButton.jsx'

// Lưới 10 loài động vật quý hiếm có trong bộ sa bàn.
export default function AnimalShowcase() {
  return (
    <section className="k-section k-section--tint" id="kham-pha">
      <div className="container">
        <Reveal className="k-panel">
          <span className="k-pill k-pill--green k-panel__pill">Khám phá 10 loài động vật quý hiếm</span>
          <p className="k-panel__sub">
            Mỗi mô hình là một người bạn trong Sách Đỏ Việt Nam, kèm âm thanh và câu chuyện riêng.
          </p>

          <Stagger className="k-animals" gap={0.05}>
            {animals.map((a) => (
              <StaggerItem as="article" className="k-animal" key={a.slug}>
                <div className="k-animal__media">
                  <img
                    src={a.img}
                    alt={a.name}
                    loading="lazy"
                    width={Math.round(300 * a.ratio)}
                    height="300"
                    style={{ '--s': a.scale }}
                  />
                </div>
                <h3 className="k-animal__name">{a.name}</h3>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="k-animals__more">
            <MotionButton to="/products" className="k-btn k-btn--green-outline k-btn--lg">
              Tìm hiểu tất cả loài <PawIcon />
            </MotionButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
