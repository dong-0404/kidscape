import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import CoreValues from '../components/CoreValues.jsx'
import WhyKidScape from '../components/WhyKidScape.jsx'
import Products from '../components/Products.jsx'
import LatestNews from '../components/blog/LatestNews.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <CoreValues />
        <WhyKidScape />
        <Products />
        <LatestNews />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
