import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { offer } from '../../homeData.js'
import { CartIcon, ChatIcon } from './Icons.jsx'
import { useChatWidget } from '../chatbot/ChatWidgetContext.jsx'
import Reveal from '../../motion/Reveal.jsx'
import { popIn } from '../../motion/variants'

// Khối chốt đơn: banner hồng bên trái + bảng giá và 2 nút hành động bên phải.
export default function BuyCta() {
  const { open: openChat } = useChatWidget()
  const reduce = useReducedMotion()
  const lift = reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } }

  return (
    <section className="k-section k-buy" id="lien-he">
      <div className="container">
        <Reveal className="k-buy__box" variants={popIn}>
          <div className="k-buy__art">
            <img
              src="/assets/home/cta-explore.webp"
              alt="Sẵn sàng cùng con khám phá thế giới?"
              loading="lazy"
              width="760"
              height="803"
            />
          </div>

          <div className="k-buy__panel">
            <h2 className="k-buy__name">
              {offer.name} <span className="k-buy__name-accent">{offer.nameAccent}</span>
            </h2>

            {/* Nhãn + giá + ghi chú là một nhóm: panel chỉ có 3 con (tên / giá /
                nút) để `space-between` giãn đều ba khối thay vì từng dòng lẻ. */}
            <div className="k-buy__pricing">
              <p className="k-buy__label">Giá niêm yết</p>
              <p className="k-buy__price">
                {offer.listPrice}
                <sup>{offer.currency}</sup>
              </p>
              <p className="k-buy__note">{offer.note}</p>
            </div>

            <div className="k-buy__actions">
              <motion.span {...lift}>
                <Link to="/products" className="k-btn k-btn--red k-btn--lg k-btn--block">
                  Đặt mua ngay <CartIcon width="20" height="20" />
                </Link>
              </motion.span>
              <motion.span {...lift}>
                <button type="button" className="k-btn k-btn--outline k-btn--lg k-btn--block" onClick={openChat}>
                  Tư vấn sản phẩm <ChatIcon />
                </button>
              </motion.span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
