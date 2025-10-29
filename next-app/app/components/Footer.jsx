'use client'
import React, { useEffect, useState } from 'react'
import { getApiUrl } from '../lib/config'

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState('')
  const [logoText, setLogoText] = useState('')
  const [useLogoImage, setUseLogoImage] = useState(true)
  const [logoWidth, setLogoWidth] = useState(150)
  const [email, setEmail] = useState('contact@yourdomain.com')
  const [whatsApp, setWhatsApp] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const apiUrl = getApiUrl()
        const res = await fetch(`${apiUrl}/settings`)
        if (!res.ok) return
        const data = await res.json()
        if (data.logo_url) setLogoUrl(data.logo_url)
        if (data.logo_text) setLogoText(data.logo_text)
        if (data.use_logo_image !== undefined) setUseLogoImage(data.use_logo_image)
        if (data.logo_width) setLogoWidth(data.logo_width)
        if (data.contact_email) setEmail(data.contact_email)
        if (data.whatsapp_number) setWhatsApp(data.whatsapp_number)
      } catch (e) {
        console.error('Failed to load settings for footer:', e)
      }
    }
    loadSettings()
  }, [])

  const waHref = whatsApp
    ? `https://wa.me/${whatsApp.replace(/[^\d]/g, '')}`
    : 'https://wa.me/'

  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-4">
        {/* First row: Logo, Nav, Email */}
        <div className="footer-first-row">
          {/* 1) Left: Logo (optional) */}
          <div className="footer-col footer-logo-col">
            {useLogoImage && logoUrl ? (
              <a href="#home" className="footer-logo" aria-label="Homepage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Site logo"
                  style={{ width: logoWidth, height: 'auto', maxWidth: 220, objectFit: 'contain' }}
                />
              </a>
            ) : !useLogoImage && logoText ? (
              <a href="#home" className="footer-logo" aria-label="Homepage">
                <span className="footer-logo-fallback">{logoText}</span>
              </a>
            ) : null}
          </div>

          {/* 2) Center: nav links in one line */}
          <nav className="footer-col footer-links" aria-label="Footer navigation">
            <ul className="footer-nav-list">
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#channels">Channel List</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>

          {/* 3) Right: email */}
          <div className="footer-col footer-email-col">
            <a href={`mailto:${email}`} className="email-link" aria-label={`Send email to ${email}`}>
              {email}
            </a>
          </div>
        </div>

        {/* Second row: WhatsApp CTA */}
        <div className="footer-col footer-whatsapp-col">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
            aria-label="Chat with us on WhatsApp"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} POD IPTV. All rights reserved.</p>
      </div>
    </footer>
  )
}
