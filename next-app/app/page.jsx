import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Streaming from './components/Streaming'
import Movies from './components/Movies'
import SportsEvents from './components/SportsEvents'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import WhyChooseUs from './components/WhyChooseUs'
import WorldChannels from './components/WorldChannels'
import Footer from './components/Footer'
import StructuredData from './components/StructuredData'

export const metadata = {
  title: 'IPTV ACCESS - Best IPTV Service Provider | 40,000+ Live Channels & VOD Streaming',
  description: 'Get the best IPTV subscription with IPTV ACCESS. Stream 40,000+ live TV channels, 54,000+ movies & series in HD/4K. Premium IPTV with anti-freeze technology, EPG guide, multi-device support for Smart TV, Android, iOS, Firestick. Free trial available. Affordable IPTV packages starting at $10.99/month.',
  alternates: {
    canonical: 'https://iptv-access.com',
  },
  openGraph: {
    url: 'https://iptv-access.com',
    title: 'IPTV ACCESS - Best IPTV Service Provider | Premium IPTV Subscription',
    description: 'Stream 40,000+ live channels & 54,000+ VOD in HD/4K. Best IPTV service with anti-freeze tech, EPG, multi-device support. Free trial!',
  },
}

export default function Page() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main-content">
        <h1 style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          IPTV ACCESS - Best IPTV Service Provider with 40,000+ Live TV Channels and VOD Streaming
        </h1>
        <Hero />
        <Stats />
        <Streaming />
        <Movies />
        <SportsEvents />
        <Pricing />
        <WhyChooseUs />
        <WorldChannels />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
