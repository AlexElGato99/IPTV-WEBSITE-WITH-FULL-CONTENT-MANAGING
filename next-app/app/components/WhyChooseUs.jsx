import React from 'react'

const FEATURES = [
  {
    icon: '📺',
    title: '40,000+ Live Channels',
    text: 'Access an extensive library of live TV channels from around the world, including sports, news, entertainment, and more.'
  },
  {
    icon: '🎬',
    title: '54,000+ VOD Titles',
    text: 'Enjoy unlimited on-demand movies and TV shows with our massive VOD collection, updated regularly with the latest content.'
  },
  {
    icon: '⚡',
    title: 'Ultra-Fast Streaming',
    text: 'Experience buffer-free HD and 4K streaming with our high-performance servers optimized for speed and reliability.'
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    text: 'Your privacy matters. We use encrypted connections and never log your viewing activity or personal information.'
  },
  {
    icon: '🌍',
    title: 'Multi-Device Support',
    text: 'Watch on any device - Smart TV, smartphone, tablet, computer, or streaming box. One subscription, unlimited devices.'
  },
  {
    icon: '🎯',
    title: '24/7 Customer Support',
    text: 'Our dedicated support team is available around the clock to help you with setup, troubleshooting, and any questions.'
  }
]

export default function WhyChooseUs() {
  return (
    <section className="why-choose-us">
      <div className="container">
        <h2>Why Customers Choosing Us?</h2>
        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
