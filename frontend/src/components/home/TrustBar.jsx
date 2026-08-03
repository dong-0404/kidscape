import { servicePoints } from '../../homeData.js'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'
import { fadeUp } from '../../motion/variants'

// Dải cam kết dịch vụ. `variant="inline"` dùng bên trong thẻ (trang sản phẩm),
// mặc định là dải trắng full-width ngay trước footer (trang chủ).
export default function TrustBar({ variant = 'band' }) {
  const Row = variant === 'inline' ? 'div' : 'div'
  const rowClass = variant === 'inline' ? 'k-trust__row' : 'container k-trust__row'

  const content = (
    <Stagger as="div" className={rowClass} gap={0.06}>
      {servicePoints.map((s) => (
        <StaggerItem as="div" variants={fadeUp} className="k-trust__item" key={s.title}>
          <img src={s.icon} alt="" loading="lazy" width="200" height="140" />
          <p>
            <strong>{s.title}</strong>
            <span>{s.desc}</span>
          </p>
        </StaggerItem>
      ))}
    </Stagger>
  )

  if (variant === 'inline') return <Row className="k-trust k-trust--inline">{content}</Row>

  return (
    <section className="k-trust" id="cam-ket">
      {content}
    </section>
  )
}
