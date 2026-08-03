import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import HowToPlay from '../components/home/HowToPlay.jsx'
import AnimalShowcase from '../components/home/AnimalShowcase.jsx'
import WhyChoose from '../components/home/WhyChoose.jsx'
import SafetyRow from '../components/home/SafetyRow.jsx'
import CoreValues from '../components/CoreValues.jsx'
import LatestNews from '../components/blog/LatestNews.jsx'
import BuyCta from '../components/home/BuyCta.jsx'
import TrustBar from '../components/home/TrustBar.jsx'
import Footer from '../components/Footer.jsx'

export default function HomePage() {
  return (
    <div className="home">
      <Header />
      <main>
        <Hero />
        <HowToPlay />
        <AnimalShowcase />
        <WhyChoose />
        <SafetyRow />
        <CoreValues />
        <LatestNews />
        <BuyCta />
      </main>
      <TrustBar />
      <Footer />
    </div>
  )
}
