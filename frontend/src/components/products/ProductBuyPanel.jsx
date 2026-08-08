import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CartIcon, MinusIcon, PlusIcon } from '../home/Icons.jsx'
import { useChatWidget } from '../chatbot/ChatWidgetContext.jsx'
import { heading, offer, specs, formatVnd } from '../../productData.js'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'
import { fadeUp } from '../../motion/variants'

const MAX_QTY = 20

// Cột thông tin mua hàng: tiêu đề, giá, thông số, chọn số lượng và 2 nút hành động.
// Chưa có giỏ hàng thật -> cả hai nút mở trợ lý chat kèm nội dung soạn sẵn.
export default function ProductBuyPanel({ product }) {
  const { open: openChat } = useChatWidget()
  const [qty, setQty] = useState(1)
  const reduce = useReducedMotion()
  const lift = reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.98 } }

  // Dự phòng khi API chưa trả về: ghép dòng 2-3 của tiêu đề = tên sản phẩm.
  const name = product?.name || `${heading.line2} ${heading.line3}`
  const step = (d) => setQty((q) => Math.min(MAX_QTY, Math.max(1, q + d)))

  return (
    <Stagger className="pbuy" gap={0.07} delay={0.05}>
      <StaggerItem as="h1" variants={fadeUp} className="pbuy__title">
        <span className="pbuy__title-1">{heading.line1}</span>
        <span className="pbuy__title-2">{heading.line2}</span>
        <span className="pbuy__title-3">{heading.line3}</span>
      </StaggerItem>

      <StaggerItem variants={fadeUp} className="pbuy__price">
        <strong>
          {formatVnd(offer.price)}
          <sup>đ</sup>
        </strong>
      </StaggerItem>

      <StaggerItem variants={fadeUp} as="ul" className="pbuy__specs">
        {specs.map((s) => (
          <li key={s.label}>
            <span className="pbuy__spec-art">
              {s.icon ? <img src={s.icon} alt="" loading="lazy" /> : <b>{s.value}</b>}
            </span>
            <span className="pbuy__spec-label">
              {s.label.split('\n').map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </span>
          </li>
        ))}
      </StaggerItem>

      <StaggerItem variants={fadeUp} className="pbuy__order">
        <div className="pbuy__qty">
          <span className="pbuy__qty-label" id="qty-label">Số lượng</span>
          <div className="pbuy__stepper">
            <button type="button" aria-label="Giảm số lượng" onClick={() => step(-1)} disabled={qty <= 1}>
              <MinusIcon />
            </button>
            <input
              type="number"
              min="1"
              max={MAX_QTY}
              value={qty}
              aria-labelledby="qty-label"
              onChange={(e) => {
                const v = Number(e.target.value)
                setQty(Number.isFinite(v) ? Math.min(MAX_QTY, Math.max(1, Math.trunc(v))) : 1)
              }}
            />
            <button type="button" aria-label="Tăng số lượng" onClick={() => step(1)} disabled={qty >= MAX_QTY}>
              <PlusIcon />
            </button>
          </div>
        </div>

        <div className="pbuy__actions">
          <motion.button
            type="button"
            className="k-btn k-btn--red k-btn--lg k-btn--block"
            onClick={() => openChat(`Mình muốn đặt mua ${qty} bộ "${name}".`)}
            {...lift}
          >
            <CartIcon width="20" height="20" /> Đặt mua ngay
          </motion.button>
          <motion.button
            type="button"
            className="k-btn k-btn--outline k-btn--lg k-btn--block"
            onClick={() => openChat(`Mình muốn thêm ${qty} bộ "${name}" vào giỏ hàng.`)}
            {...lift}
          >
            <CartIcon width="20" height="20" /> Thêm vào giỏ hàng
          </motion.button>
        </div>
      </StaggerItem>
    </Stagger>
  )
}
