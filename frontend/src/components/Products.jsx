import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './products/ProductCard.jsx'
import ComingSoonCard from './products/ComingSoonCard.jsx'
import { getProducts } from '../api/products.js'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let active = true
    getProducts()
      .then((list) => active && setProducts(list))
      .catch(() => active && setProducts([]))
    return () => {
      active = false
    }
  }, [])

  const available = products.filter((p) => p.status !== 'upcoming')
  const upcoming = products.filter((p) => p.status === 'upcoming')

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
          {available.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {upcoming.map((p) => (
            <ComingSoonCard key={p._id} product={p} />
          ))}
        </div>

        <div className="products__more">
          <Link to="/products" className="btn btn--primary btn--lg">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  )
}
