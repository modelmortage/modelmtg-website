'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from '@/src/lib/siteData'
import { checkReducedMotion } from '@/src/utils/animations'
import styles from './Hero.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Hero() {
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const skylineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isReduced = checkReducedMotion()
    const ctx = gsap.context(() => {
      if (isReduced) {
        gsap.set([ctaGroupRef.current], { opacity: 1 })
        return
      }
      if (ctaGroupRef.current) {
        gsap.fromTo(ctaGroupRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: 'power3.out' }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.skylineContainer} ref={skylineRef}>
        <Image
          src="/model-mortage-home-page.png"
          alt="Houston Skyline"
          fill
          className={styles.skylineImage}
          priority
          quality={100}
          placeholder="empty"
        />
      </div>

      <div className={styles.ctaCenter}>
        <h1 className={styles.heroTitle}>Model Mortgage</h1>
        <p className={styles.heroTagline}>The model of excellence in lending</p>
        <div className={styles.ctaGroup} ref={ctaGroupRef}>
          <a href={siteData.cta.preQualify.href} className={styles.primaryButton}>
            {siteData.cta.preQualify.label}
          </a>
          <a href={siteData.cta.applyOnline.href} className={styles.secondaryButton}>
            <span className={styles.buttonText}>{siteData.cta.applyOnline.label}</span>
            <span className={styles.buttonArrow}>→</span>
          </a>
        </div>
      </div>

      <div className={styles.cornerElement}></div>
    </section>
  )
}
