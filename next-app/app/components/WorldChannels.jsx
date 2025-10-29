import React from 'react'
import Image from 'next/image'
import worldImg from '../../public/images/images 1 (1).png'

export default function WorldChannels() {
  return (
    <section className="world-channels">
      <div className="container">
        <h2>Channels From Every Around the World</h2>
        <div className="world-image-wrap">
          {/* Replace the src with your preferred image path */}
          <Image src={worldImg} alt="Channels from around the world" width={641} height={400} className="world-image" />
        </div>
      </div>
    </section>
  )
}
