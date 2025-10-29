import React from 'react'
import Image from 'next/image'
import devicesImg from '../../public/images/devices.webp'
import tvImg from '../../public/images/tv-1024x636-1-1.webp'

export default function Hero(){
  return (
    <section className="hero" id="home">
      <div className="container hero-inner">
        <div className="hero-left">
          <h1>TITAN IPTV <span className="accent">Premium</span><br/>TV Service</h1>
          <p className="lead">Enjoy premium TV with Titan IPTV. Access a wide range of channels and exclusive content, with over 40,000 channels and more than 54,000 VOD.</p>
          <div className="hero-ctas">
            <button className="btn-cta">Free Trial</button>
          </div>
          <div className="devices">
            <Image src={devicesImg} alt="devices" width={640} height={80} style={{width:'50%', height:'auto'}} />
          </div>
        </div>
        <div className="hero-right">
          <Image src={tvImg} alt="tv" width={1024} height={636} priority style={{width:'100%', height:'auto'}} />
        </div>
      </div>
    </section>
  )
}
