'use client'
import React, { useEffect, useState } from 'react'
import { getApiUrl } from '../lib/config'

const DEFAULT_FAQ = [
  { question: 'What is TITAN IPTV?', answer: 'TITAN IPTV is a premium IPTV service offering access to over 40,000 live channels and 54,000+ VOD titles from around the world. Compatible with Smart TV, Android, iOS, Windows, and more.' },
  { question: 'How do I get started?', answer: 'Simply choose a subscription plan, complete your purchase, and you\'ll receive login credentials via email within minutes. Install our app or configure your device, and start streaming immediately.' },
  { question: 'What devices are supported?', answer: 'TITAN IPTV works on Smart TVs, Android devices, iOS (iPhone/iPad), Windows, Mac, Amazon Fire Stick, MAG boxes, and most IPTV-compatible devices.' },
  { question: 'Is there a free trial available?', answer: 'Yes! We offer a free trial so you can test our service quality and channel selection before committing to a paid subscription.' },
  { question: 'Can I use one subscription on multiple devices?', answer: 'Our plans support multiple connections depending on the package you choose. Check the pricing section for details on simultaneous device usage.' },
  { question: 'What if I experience buffering or technical issues?', answer: 'Our support team is available 24/7 to help with any technical issues. We also provide setup guides and troubleshooting resources to ensure smooth streaming.' }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [faqs, setFaqs] = useState(DEFAULT_FAQ)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const apiUrl = getApiUrl()
        const res = await fetch(`${apiUrl}/faqs`)
        if (!res.ok) throw new Error('Failed to fetch FAQs')
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          setFaqs(data.map(x => ({ question: x.question, answer: x.answer })))
        }
      } catch (e) {
        console.warn('Using default FAQs due to error:', e.message)
      } finally {
        setLoaded(true)
      }
    }
    loadFaqs()
  }, [])

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index)

  return (
    <section className="faq" id="faq">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {(loaded ? faqs : DEFAULT_FAQ).map((item, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggle(index)} aria-expanded={openIndex === index}>
                <span>{item.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
