import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ProductGallery from '../components/products/ProductGallery.jsx'
import ProductBuyPanel from '../components/products/ProductBuyPanel.jsx'
import ComingSoonGrid from '../components/products/ComingSoonGrid.jsx'
import NewsletterCta from '../components/products/NewsletterCta.jsx'
import TrustBar from '../components/home/TrustBar.jsx'
import { getProductBySlug } from '../api/products.js'
import { gallery, heroImage, heading, FLAGSHIP_SLUG } from '../productData.js'
import { ChevronIcon } from '../components/home/Icons.jsx'
import Reveal from '../motion/Reveal.jsx'
import { popIn } from '../motion/variants'

// Màn sản phẩm. Vào thẳng ở /products (bộ sa bàn chủ lực); /products/:slug
// dùng cho các sản phẩm khác đến từ API.
// Thư viện ảnh / giá / thông số lấy từ productData.js vì Product model chưa có
// các trường này; tên sản phẩm ưu tiên dữ liệu API khi có.
export default function ProductPage() {
  const { slug } = useParams()
  const activeSlug = slug || FLAGSHIP_SLUG
  const [product, setProduct] = useState(null)

  useEffect(() => {
    let active = true
    setProduct(null)
    // Không có bản ghi vẫn dựng được trang — nội dung tĩnh đã đủ.
    getProductBySlug(activeSlug)
      .then((p) => active && setProduct(p))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [activeSlug])

  // Dự phòng lấy từ tiêu đề thay vì chuỗi cứng, để không lệch khi đổi tên sản phẩm.
  const crumb = product?.name || `${heading.line2} ${heading.line3}`

  return (
    <div className="home">
      <Header />
      <main className="pdp">
        <div className="container">
          <nav className="pdp__crumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link>
            <ChevronIcon width="14" height="14" aria-hidden="true" />
            <Link to="/products">Sản phẩm</Link>
            <ChevronIcon width="14" height="14" aria-hidden="true" />
            <span aria-current="page">{crumb}</span>
          </nav>

          <div className="pdp__top">
            <Reveal className="pdp__left" variants={popIn}>
              <ProductGallery images={gallery} hero={heroImage} />
              <TrustBar variant="inline" />
            </Reveal>

            <Reveal className="pdp__right">
              <ProductBuyPanel product={product} />
            </Reveal>
          </div>
        </div>

        <ComingSoonGrid />
        <NewsletterCta />
      </main>
      <Footer />
    </div>
  )
}
