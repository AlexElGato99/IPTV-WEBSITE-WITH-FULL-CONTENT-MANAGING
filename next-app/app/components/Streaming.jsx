'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'

import logo14 from '../../public/images/images 1 (14).webp'
import logo15 from '../../public/images/images 1 (15).webp'
import logo16 from '../../public/images/images 1 (16).webp'
import logo17 from '../../public/images/images 1 (17).webp'
import logo18 from '../../public/images/images 1 (18).webp'
import logo19 from '../../public/images/images 1 (19).webp'
import logo20 from '../../public/images/images 1 (20).webp'
import logo21 from '../../public/images/images 1 (21).webp'
import logo22 from '../../public/images/images 1 (22).webp'

const LOGOS = [logo20, logo22, logo19, logo16, logo18, logo22, logo21, logo14, logo15, logo17]

export default function Streaming(){
  // logos already duplicated for seamless looping
  const logos = useMemo(()=> [...LOGOS, ...LOGOS], [])
  const duration = Math.max(12, Math.round(10 + LOGOS.length * 1.5))

  return (
    <section className="streaming">
      <h2 style={{marginBottom: '2rem'}}>Streaming Services</h2>

      {/* reuse the movie strip styles so the streaming row matches the movies width/behavior */}
      <div className="movie-strip">
        <div className="movie-row" style={{ ['--movie-scroll-duration']: `${duration}s` }} aria-hidden="false">
          {logos.map((s,i)=> (
            <div className="movie-card" key={i} style={{width:120}}>
              <Image src={s} alt={`logo-${i}`} width={120} height={60} style={{objectFit:'contain', width:'100%', height:'auto'}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
