import '../styles/globals.css'
import { Inter } from 'next/font/google'
import GoogleAnalytics from './components/GoogleAnalytics'
import ogImage from '../public/images/tv-1024x636-1-1.webp'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://iptv-access.com'),
  title: {
    default: 'IPTV ACCESS - Best IPTV Service Provider | 40,000+ Live Channels & VOD',
    template: '%s | IPTV ACCESS'
  },
  description: 'IPTV ACCESS - Premium IPTV subscription with 40,000+ live TV channels, 54,000+ movies & series in HD/4K. Best IPTV service with anti-freeze technology, EPG guide, multi-device support. Free trial available. Get your IPTV subscription today!',
  keywords: [
    'IPTV',
    'IPTV service',
    'IPTV subscription',
    'best IPTV',
    'premium IPTV',
    'IPTV provider',
    'IPTV ACCESS',
    'buy IPTV',
    'IPTV package',
    'IPTV streaming',
    'live TV IPTV',
    '4K IPTV',
    'HD IPTV',
    'IPTV channels',
    'sports IPTV',
    'IPTV VOD',
    'movies IPTV',
    'series IPTV',
    'IPTV subscription service',
    'IPTV for smart TV',
    'IPTV for Android',
    'IPTV for iOS',
    'IPTV Firestick',
    'cheap IPTV',
    'affordable IPTV',
    'reliable IPTV',
    'stable IPTV',
    'anti-freeze IPTV',
    'anti-buffering IPTV',
    'IPTV with EPG',
    'multi-device IPTV',
    'IPTV trial',
    'IPTV free trial',
    'international IPTV',
    'worldwide IPTV channels',
    'USA IPTV',
    'UK IPTV',
    'Canada IPTV',
    'Arabic IPTV',
    'European IPTV',
    'IPTV reseller',
    'IPTV m3u',
    'IPTV playlist',
    'IPTV server',
    'IPTV panel'
  ],
  authors: [{ name: 'IPTV ACCESS' }],
  creator: 'IPTV ACCESS',
  publisher: 'IPTV ACCESS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://iptv-access.com',
    siteName: 'IPTV ACCESS',
    title: 'IPTV ACCESS - Best IPTV Service Provider | 40,000+ Channels',
    description: 'Premium IPTV subscription with 40,000+ live channels, 54,000+ VOD in HD/4K. Anti-freeze technology, EPG guide, multi-device support. Free trial available!',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width || 1024,
        height: ogImage.height || 636,
        alt: 'IPTV ACCESS - Premium IPTV Streaming Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPTV ACCESS - Best IPTV Service | 40,000+ Live Channels',
    description: 'Premium IPTV with 40,000+ live channels, 54,000+ VOD in HD/4K. Anti-freeze tech, EPG, multi-device. Free trial!',
    images: [ogImage.src],
    creator: '@iptvaccess',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://iptv-access.com',
  },
  category: 'technology',
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#86ff00" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'IPTV ACCESS',
              url: 'https://iptv-access.com',
              logo: 'https://iptv-access.com/images/tv-1024x636-1-1.webp',
              description: 'Premium IPTV Service Provider - Best IPTV Subscription with 40,000+ Live Channels',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['English', 'Arabic', 'French', 'Spanish'],
                areaServed: 'Worldwide'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '2847',
                bestRating: '5',
                worstRating: '1'
              }
            })
          }}
        />
        
        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              serviceType: 'IPTV Streaming Service',
              name: 'IPTV ACCESS - Premium IPTV Subscription',
              description: 'Premium IPTV service with 40,000+ live TV channels, 54,000+ VOD movies and series in HD/4K quality. Anti-freeze technology, EPG guide, and multi-device support.',
              provider: {
                '@type': 'Organization',
                name: 'IPTV ACCESS',
                url: 'https://iptv-access.com'
              },
              areaServed: 'Worldwide',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: '10.99',
                highPrice: '349.99',
                offerCount: '16'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '2847'
              }
            })
          }}
        />
        
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'IPTV ACCESS',
              url: 'https://iptv-access.com',
              description: 'Best IPTV Service Provider - Premium IPTV Subscription',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://iptv-access.com/?s={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
