'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../lib/config'

export default function GoogleAnalytics() {
  const [gaId, setGaId] = useState(null)

  useEffect(() => {
    const loadGAId = async () => {
      try {
        const apiUrl = getApiUrl()
        const res = await fetch(`${apiUrl}/settings`)
        const data = await res.json()
        if (data.google_analytics_measurement_id) {
          setGaId(data.google_analytics_measurement_id)
        }
      } catch (error) {
        console.error('Failed to load GA ID:', error)
      }
    }
    loadGAId()
  }, [])

  if (!gaId) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
