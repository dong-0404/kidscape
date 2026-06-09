import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ProductCard from '../components/products/ProductCard.jsx'
import ComingSoonCard from '../components/products/ComingSoonCard.jsx'
import ProductSpotlight from '../components/products/ProductSpotlight.jsx'
import ProductBenefits from '../components/products/ProductBenefits.jsx'
import ProductFaq from '../components/products/ProductFaq.jsx'
import NewsletterCta from '../components/products/NewsletterCta.jsx'
import { getProducts } from '../api/products.js'

export default function ProductsPage() {
  const [products, setProducts] = useState(null) // null = loading
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    getProducts()
      .then((list) => active && setProducts(list))
      .catch(() => active && setError(true))
    return () => {
      active = false
    }
  }, [])

  const available = (products || []).filter((p) => p.status !== 'upcoming')
  const upcoming = (products || []).filter((p) => p.status === 'upcoming')

  return (
    <>
      <Header />
      <main>
        <section className="section products-page__intro">
          <div className="container">
            <div className="section__head">
              <span className="eyebrow">Sản phẩm</span>
              <h1 className="section__title">Sản phẩm của KidScape</h1>
              <p className="section__sub">
                Đồ chơi giáo dục đa giác quan giúp bé 3-6 tuổi học hỏi qua nhìn — nghe — chạm — tương
                tác.
              </p>
            </div>

            {products === null && !error && <p className="admin-muted products-page__state">Đang tải sản phẩm…</p>}
            {error && (
              <p className="admin-muted products-page__state">
                Không tải được sản phẩm. Vui lòng thử lại sau.
              </p>
            )}

            {products && !error && (
              <>
                {available[0] && <ProductSpotlight product={available[0]} />}

                <div className="products__grid products-page__grid">
                  {available.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                  {upcoming.map((p) => (
                    <ComingSoonCard key={p._id} product={p} />
                  ))}
                </div>

                {available.length === 0 && upcoming.length === 0 && (
                  <p className="admin-muted products-page__state">Chưa có sản phẩm nào.</p>
                )}
              </>
            )}
          </div>
        </section>

        <ProductBenefits />
        <ProductFaq />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  )
}
