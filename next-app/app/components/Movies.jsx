import React from 'react'
import Image from 'next/image'
import movie1 from '../../public/images/images 1 (1).jpg'
import movie2 from '../../public/images/images 1 (2).jpg'
import movie3 from '../../public/images/images 1 (3).jpg'
import movie4 from '../../public/images/images 1 (4).jpg'
import movie5 from '../../public/images/images 1 (5).jpg'
import movie6 from '../../public/images/images 1 (6).jpg'

const SAMPLE = [
  { title: 'Movie 1', image: movie1 },
  { title: 'Movie 2', image: movie2 },
  { title: 'Movie 3', image: movie3 },
  { title: 'Movie 4', image: movie4 },
  { title: 'Movie 5', image: movie5 },
  { title: 'Movie 6', image: movie6 }
]

export default function Movies() {
  // We render the movie list twice in a single row to create a seamless infinite scroll.
  const doubled = [...SAMPLE, ...SAMPLE]

  return (
    <section className="movies">
      <h2>Movies & TV Shows</h2>

      <div className="movie-strip">
        <div className="movie-row" aria-hidden="false">
          {doubled.map((m, i) => (
            <div className="movie-card" key={i} style={{width:180}}>
              <Image src={m.image} alt={m.title} width={180} height={270} style={{width:'100%',height:'auto',borderRadius:'12px'}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
