'use client'
import React, { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!target) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const current = Math.floor(progress * target)
      setValue(current)
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

export default function Stats() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [values, setValues] = useState({ happy: 0, channels: 0, sport: 0, movies: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          setValues({ happy: 7, channels: 40, sport: 15, movies: 54 })
        }
      })
    }, { threshold: 0.4 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  const happy = useCountUp(values.happy, 1800)
  const channels = useCountUp(values.channels, 1800)
  const sport = useCountUp(values.sport, 1800)
  const movies = useCountUp(values.movies, 1800)

  const toK = (v) => `${v}K`

  return (
    <section className="stats" ref={ref}>
      <div className="stat-item">
        <h2><span data-stat="happy-customers">{toK(happy)}</span></h2>
        <p>Happy Customers</p>
      </div>
      <div className="stat-item">
        <h2><span data-stat="channels">{toK(channels)}</span></h2>
        <p>Channels</p>
      </div>
      <div className="stat-item">
        <h2><span data-stat="sport-channels">{toK(sport)}</span></h2>
        <p>Sport Channels</p>
      </div>
      <div className="stat-item">
        <h2><span data-stat="movies-shows">{toK(movies)}</span></h2>
        <p>Movies & TV Shows</p>
      </div>
    </section>
  )
}
