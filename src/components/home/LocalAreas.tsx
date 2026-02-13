'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import styles from './LocalAreas.module.css'

export function LocalAreas() {
  const neighborhoods = [
    ['River Oaks', 'The Heights', 'Memorial', 'Tanglewood'],
    ['West University', 'Sugar Land', 'Katy', 'The Woodlands'],
    ['Bellaire', 'Montrose', 'Museum District', 'Piney Point']
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  }

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
          <motion.div 
            className={styles.headerColumn}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>

          {/* Right Column: Neighborhood Grid */}
          <motion.div 
            className={styles.neighborhoodColumn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <div className={styles.neighborhoodGrid}>
              {neighborhoods.map((column, colIndex) => (
                <div key={colIndex} className={styles.column}>
                  {column.map((neighborhood, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Link
                        href="#"
                        className={styles.neighborhoodLink}
                      >
                        <motion.span 
                          className={styles.neighborhoodName}
                          whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        >
                          {neighborhood}
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
