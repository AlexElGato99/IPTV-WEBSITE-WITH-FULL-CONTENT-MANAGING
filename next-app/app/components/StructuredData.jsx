'use client'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../lib/config'

export default function StructuredData() {
  const [plans, setPlans] = useState([])
  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiUrl = getApiUrl()
        
        // Fetch plans
        const plansRes = await fetch(`${apiUrl}/plans`)
        if (plansRes.ok) {
          const plansData = await plansRes.json()
          setPlans(plansData.slice(0, 8))
        }

        // Fetch FAQs
        const faqsRes = await fetch(`${apiUrl}/faqs`)
        if (faqsRes.ok) {
          const faqsData = await faqsRes.json()
          setFaqs(faqsData)
        }
      } catch (error) {
        console.error('Failed to load structured data:', error)
      }
    }
    loadData()
  }, [])

  // Product Schema for each pricing plan
  const productSchemas = plans.map((plan, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `IPTV ACCESS - ${plan.name}`,
    description: `Premium IPTV subscription plan: ${plan.features?.join(', ') || 'Premium IPTV with live channels and VOD'}`,
    brand: {
      '@type': 'Brand',
      name: 'IPTV ACCESS'
    },
    offers: {
      '@type': 'Offer',
      price: plan.price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: plan.buy_link || 'https://iptv-access.com/#pricing',
      seller: {
        '@type': 'Organization',
        name: 'IPTV ACCESS'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1'
    }
  }))

  // FAQ Schema
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://iptv-access.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'IPTV Pricing',
        item: 'https://iptv-access.com/#pricing'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'FAQ',
        item: 'https://iptv-access.com/#faq'
      }
    ]
  }

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Product Schemas */}
      {productSchemas.map((schema, index) => (
        <script
          key={`product-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  )
}
