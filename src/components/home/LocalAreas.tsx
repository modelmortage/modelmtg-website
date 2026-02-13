'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './LocalAreas.module.css'

export function LocalAreas() {
  const neighborhoods = [
    ['River Oaks', 'The Heights', 'Memorial', 'Tanglewood'],
    ['West University', 'Sugar Land', 'Katy', 'The Woodlands'],
    ['Bellaire', 'Montrose', 'Museum District', 'Piney Point']
  ]

  return (
    <section className={styles.section}>
      {/* Background Map Image */}
      <div className={styles.bg} aria-hidden="true">
        <Image
          src="/houston-map-white.jpg"
          alt=""
          fill
          className={styles.mapImage}
          quality={100}
          priority={false}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Header */}
          <div className={styles.headerColumn}>
            <div className={styles.headerContent}>
              <span className={styles.label}>Locations</span>
              <h2 className={styles.title}>
                Serving Houston's <br />
                <span className={styles.titleItalic}>Premier</span> Communities
              </h2>
            </div>
            <div className={styles.divider}></div>
            <p className={styles.description}>
              Exceptional mortgage solutions tailored for the most prestigious enclaves across the Greater Houston area. Institutional precision, local expertise.
            </p>
          </div>

          {/* Right Column: Neighborhood Grid */}
          <div className={styles.neighborhoodColumn}>
            <div className={styles.neighborhoodGrid}>
              {neighborhoods.map((column, colIndex) => (
                <div key={colIndex} className={styles.column}>
                  {column.map((neighborhood, index) => (
                    <Link
                      key={index}
                      href="#"
                      className={styles.neighborhoodLink}
                    >
                      <span className={styles.neighborhoodName}>{neighborhood}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </section>
  )
}
