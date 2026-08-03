import { useState } from 'react'
import { comingSoon } from '../../productData.js'
import Reveal from '../../motion/Reveal.jsx'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'

// "Sắp ra mắt" — các bộ sưu tập đang phát triển. Nút "Nhận thông báo" cuộn
// xuống ô đăng ký email (chưa có hàng đợi riêng cho từng bộ).
export default function ComingSoonGrid() {
  const [asked, setAsked] = useState(null)

  const notify = (slug) => {
    setAsked(slug)
    const box = document.getElementById('dang-ky-tin')
    box?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    box?.querySelector('input')?.focus({ preventScroll: true })
  }

  return (
    <section className="k-section psoon" id="sap-ra-mat">
      <div className="container">
        <Reveal as="h2" className="psoon__head">
          <img src="/assets/product/icon-bell.png" alt="" width="65" height="74" />
          Sắp ra mắt
          <span className="psoon__sparkle" aria-hidden="true">✨</span>
        </Reveal>

        <Stagger className="psoon__grid" gap={0.07}>
          {comingSoon.map((c) => (
            <StaggerItem as="article" className="psoon__card" key={c.slug}>
              <div className="psoon__media">
                <img src={c.img} alt={c.name.replace('\n', ' ')} loading="lazy" width="680" height="334" />
              </div>
              <div className="psoon__row">
                <h3 className="psoon__name">
                  {c.name.split('\n').map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </h3>
                <span className="psoon__badge">Coming soon</span>
              </div>
              <button
                type="button"
                className="psoon__notify"
                onClick={() => notify(c.slug)}
                aria-describedby={asked === c.slug ? 'psoon-hint' : undefined}
              >
                <img src="/assets/product/icon-bell.png" alt="" width="65" height="74" />
                Nhận thông báo
              </button>
            </StaggerItem>
          ))}
        </Stagger>

        <p id="psoon-hint" className="psoon__hint" role="status">
          {asked ? 'Để lại email bên dưới, KidScape sẽ báo bạn ngay khi bộ này lên kệ nhé!' : ''}
        </p>
      </div>
    </section>
  )
}
