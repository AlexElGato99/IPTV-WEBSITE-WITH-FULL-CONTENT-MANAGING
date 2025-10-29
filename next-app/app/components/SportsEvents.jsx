import React from 'react'
import Image from 'next/image'

import img1 from '../../public/images/images 1 (1).jpg'
import img23 from '../../public/images/images 1 (23).jpg'
import img24 from '../../public/images/images 1 (24).jpg'
import img25 from '../../public/images/images 1 (25).jpg'
import img26 from '../../public/images/images 1 (26).jpg'
import img27 from '../../public/images/images 1 (27).jpg'
import img28 from '../../public/images/images 1 (28).jpg'
import img29 from '../../public/images/images 1 (29).jpg'

const TOURNAMENTS = [
  { title: 'Sport 1', image: img25 },
  { title: 'Sport 2', image: img26 },
  { title: 'Sport 3', image: img27 },
  { title: 'Sport 4', image: img28 },
  { title: 'Sport 5', image: img29 },
  { title: 'Sport 6', image: img1 },
  { title: 'Sport 8', image: img24 },
  { title: 'Sport 9', image: img23 },
  { title: 'Sport 11', image: img25 },
  { title: 'Sport 12', image: img26 },
  { title: 'Sport 13', image: img27 },
  { title: 'Sport 14', image: img28 },
  { title: 'Sport 15', image: img29 },
  { title: 'Sport 16', image: img1 },
  { title: 'Sport 17', image: img23 },
  { title: 'Sport 18', image: img24 },
  // Removed missing image (34)

]

export default function SportsEvents() {
  // We render the tournament list twice in a single row to create a seamless infinite scroll.
  const doubled = [...TOURNAMENTS, ...TOURNAMENTS]

  return (
    <section className="sports-events">
      <h2>Watch All Major Sport Events</h2>

      <div className="movie-strip">
        <div className="movie-row" aria-hidden="false">
          {doubled.map((tournament, i) => (
            <div className="movie-card" key={i}>
              <Image src={tournament.image} alt={tournament.title} width={180} height={270} style={{width:'100%',height:'auto'}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
