'use client'
import React, { useState, useEffect } from 'react'
import { getApiUrl } from '../lib/config'

// Helper function to ensure URL has protocol
const ensureAbsoluteUrl = (url) => {
  if (!url) return null
  
  // Remove any leading/trailing whitespace
  url = url.trim()
  
  // If URL already has protocol, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If URL starts with www., add https://
  if (url.startsWith('www.')) {
    return `https://${url}`
  }
  
  // Otherwise, assume it needs https://
  return `https://${url}`
}

// Fallback static plans in case API fails
const FALLBACK_PLANS = {
  '1': [
    { label: '1 Month', price: '$10.99', features: [] },
    { label: '3 Months', price: '$24.99', features: [] },
    { label: '6 Months', price: '$39.99', featured: true, features: [] },
    { label: '12 Months', price: '$59.99', features: [] },
  ],
  '2': [
    { label: '1 Month', price: '$18.99', features: [] },
    { label: '3 Months', price: '$44.99', features: [] },
    { label: '6 Months', price: '$69.99', featured: true, features: [] },
    { label: '12 Months', price: '$109.99', features: [] },
  ],
  '3': [
    { label: '1 Month', price: '$24.99', features: [] },
    { label: '3 Months', price: '$64.99', features: [] },
    { label: '6 Months', price: '$109.99', featured: true, features: [] },
    { label: '12 Months', price: '$179.99', features: [] },
  ],
  '6': [
    { label: '1 Month', price: '$59.99', features: [] },
    { label: '3 Months', price: '$129.99', features: [] },
    { label: '6 Months', price: '$219.99', featured: true, features: [] },
    { label: '12 Months', price: '$349.99', features: [] },
  ],
}

export default function Pricing() {
  const [devices, setDevices] = useState('1 Device')
  const [plans, setPlans] = useState([])
  const [deviceTabs, setDeviceTabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeviceTabs()
    loadPlans()
  }, [])

  const loadDeviceTabs = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/plans/device-tabs`)
      if (!res.ok) throw new Error('Failed to fetch tabs')
      const data = await res.json()
      setDeviceTabs(data)
      if (data.length > 0) {
        setDevices(data[0]) // Set first tab as default
      }
    } catch (error) {
      console.error('Failed to load device tabs:', error)
      // Fallback to default tabs
      setDeviceTabs(['1', '2', '3', '6'])
      setDevices('1')
    }
  }

  const loadPlans = async () => {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/plans`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPlans(data)
    } catch (error) {
      console.error('Failed to load plans:', error)
      // Use fallback plans
      const fallbackArray = Object.entries(FALLBACK_PLANS).flatMap(([deviceTab, devicePlans]) =>
        devicePlans.map(p => ({ ...p, device_tab: deviceTab }))
      )
      setPlans(fallbackArray)
    } finally {
      setLoading(false)
    }
  }

  const getPlansForDevice = (deviceTab) => {
    const filtered = plans.filter(p => p.device_tab === deviceTab)
    if (filtered.length === 0) return FALLBACK_PLANS[deviceTab] || []

    // Sort, then de-duplicate by normalized name (defensive against DB duplicates)
    const sorted = filtered.sort((a, b) => (a.display_order || 0) - (b.display_order || 0) || a.id - b.id)
    const seen = new Set()
    const unique = []
    for (const p of sorted) {
      const key = (p.name || '').trim().toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(p)
      }
    }

    return unique.map(p => ({
      label: p.name,
      price: p.price,
      featured: p.is_featured,
      features: p.features || [],
      buy_link: p.buy_link || null
    }))
  }

  const currentPlans = getPlansForDevice(devices)

  return (
    <section className="pricing" id="pricing">
      <h2>Choose Your <span className="accent">IPTV Plan</span></h2>

      <div className="pricing-tabs">
        {deviceTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${devices === tab ? 'active' : ''}`}
            onClick={() => setDevices(tab)}
            aria-pressed={devices === tab}
            aria-label={tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pricing-cards">
        {currentPlans.map((plan, idx) => (
          <article key={`${plan.label}-${idx}`} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
            <h3>{plan.label}</h3>
            <div className="price">{plan.price}</div>
            <div className="device-count">{devices}</div>
            <ul className="features">
              {plan.features && plan.features.length > 0 ? (
                plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))
              ) : (
                <>
                  <li>SD / HD / FHD / 4K Streams</li>
                  <li>40,000+ Live Channels</li>
                  <li>54,000+ VOD</li>
                  <li>VIP & Premium Channels</li>
                  <li>Anti-buffering Technology</li>
                  <li>24/7 Support</li>
                </>
              )}
            </ul>
            {plan.buy_link ? (
              <a 
                href={ensureAbsoluteUrl(plan.buy_link)} 
                className="buy-now"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                Buy Now
              </a>
            ) : (
              <button className="buy-now">Buy Now</button>
            )}
            <p style={{ margin: '10px 0 17px 0', color: '#aaa', fontSize: '13px', textAlign: 'center' }}>
              Ready within 5-7mins
            </p>
            <img 
              src="/images/images 1 (6).webp" 
              alt="Payment methods" 
              style={{ width: '50%', maxWidth: '120px', height: 'auto', margin: '0 auto', display: 'block' }}
            />
            {/* Removed badge rendering to avoid stray text below cards */}
          </article>
        ))}
      </div>
    </section>
  )
}
