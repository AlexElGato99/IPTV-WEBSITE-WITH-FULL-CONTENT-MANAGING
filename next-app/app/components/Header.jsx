'use client'
import React, { useState, useEffect } from 'react'
import { getApiUrl } from '../lib/config'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [logoText, setLogoText] = useState('')
  const [useLogoImage, setUseLogoImage] = useState(true)
  const [logoWidth, setLogoWidth] = useState(150)
  
  const toggleMenu = () => setMenuOpen(v => !v)
  const handleLinkClick = () => setMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
        setMenuOpen(false) // close mobile menu when scrolling
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    loadSettings()
  }, [])

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
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <div className="logo">
          {useLogoImage && logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" style={{ width: logoWidth, height: 'auto' }} />
          ) : !useLogoImage && logoText ? (
            <span>{logoText}</span>
          ) : null}
        </div>
        <nav aria-label="Primary">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#channels">Channel List</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </nav>
        <button className="free-trial">Free Trial</button>
        {/* Burger for small screens */}
        <button
          className={`burger${menuOpen ? ' open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {/* Mobile menu panel */}
      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul onClick={handleLinkClick}>
          <li><a href="#home">Home</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#channels">Channel List</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#blog">Blog</a></li>
          <li className="mobile-cta"><a href="#pricing" className="btn-cta">Free Trial</a></li>
        </ul>
      </div>
    </header>
  )
}
