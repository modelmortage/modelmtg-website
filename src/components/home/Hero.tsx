'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { FaLock, FaBuilding } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from '@/src/lib/siteData'
import { homeSections } from '@/src/lib/homeSections'
import { Button } from '@/src/components/ui/Button'
import { ANIMATION_DURATION, EASING, checkReducedMotion } from '@/src/utils/animations'
import styles from './Hero.module.css'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Hero Section - Private Client Homepage (Institutional Memo Style)
 *
 * Premium 2-column asymmetric layout:
 * - Left: Eyebrow, serif headline with italic accent, description, CTAs
 * - Right: "Institutional Memo" card with trust points
 * - Background: Houston skyline
 * - Asymmetric vertical divider between columns
 */
export function Hero() {
  const data = homeSections.hero
  const { compliance, brand } = siteData

  // Refs for animation targets
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const ctaGroupRef = useRef<HTMLDivElement>(null)
  const memoCardRef = useRef<HTMLDivElement>(null)
  const skylineRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Confidential': FaLock,
    'Lender': FaBuilding
  }

  // Hero entrance animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isReduced = checkReducedMotion()

    const ctx = gsap.context(() => {
      if (isReduced) {
        // Just show everything immediately if reduced motion
        gsap.set([eyebrowRef.current, headlineRef.current, subheadRef.current, ctaGroupRef.current, dividerRef.current, memoCardRef.current], { opacity: 1 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Eyebrow fade in
      if (eyebrowRef.current) {
        tl.fromTo(eyebrowRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.2
        )
      }

      // Headline staggered reveal
      if (headlineRef.current) {
        const headlineLines = headlineRef.current.children
        tl.fromTo(headlineLines,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          0.3
        )
      }

      // Subheadline fade in
      if (subheadRef.current) {
        tl.fromTo(subheadRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.8
        )
      }

      // CTA buttons fade in
      if (ctaGroupRef.current) {
        tl.fromTo(ctaGroupRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          1.0
        )
      }

      // Divider line grow from top
      if (dividerRef.current) {
        tl.fromTo(dividerRef.current,
          { scaleY: 0, transformOrigin: 'top' },
          { scaleY: 1, duration: 1.0, ease: 'power1.inOut' },
          0.5
        )
      }

      // Memo card slide in from right
      if (memoCardRef.current) {
        tl.fromTo(memoCardRef.current,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 1.0 },
          0.6
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.hero} id="hero">
      {/* Background layers */}
      <div className={styles.bgLayer}></div>

      {/* Skyline background image */}
      <div className={styles.skylineContainer} ref={skylineRef}>
        <Image
          src="/skyline.jpg"
          alt="Houston Skyline at Night"
          fill
          className={styles.skylineImage}
          priority
          quality={100}
          placeholder="empty"
        />
      </div>

      {/* Gradient overlay */}
      <div className={styles.bgGradient}></div>

      <div className={styles.container}>
        {/* LEFT COLUMN - Main Content */}
        <div className={styles.leftContent}>
          {/* Eyebrow with decorative line */}
          <div className={styles.eyebrowGroup} ref={eyebrowRef}>
            <div className={styles.eyebrowLine}></div>
            <p className={styles.eyebrow}>Trusted Mortgage Guidance in Houston</p>
          </div>

          {/* Headline with italic accent */}
          <h1 className={styles.headline} ref={headlineRef}>
            <span>{data.headline.split('\n')[0] || 'Private Mortgage'}</span>
            <br />
            <span className={styles.headlineAccent}>Advisory</span>
            {data.headline.split('\n')[1] ? (
              <>
                <br />
                <span>{data.headline.split('\n')[1]}</span>
              </>
            ) : null}
          </h1>

          {/* Subheading */}
          <p className={styles.subhead} ref={subheadRef}>
            {data.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaGroup} ref={ctaGroupRef}>
            <Button
              href={siteData.cta.preQualify.href}
              variant="primary"
            >
              {siteData.cta.preQualify.label}
            </Button>
            <Button
              href={siteData.cta.applyOnline.href}
              variant="secondary"
            >
              {siteData.cta.applyOnline.label}
            </Button>
          </div>
        </div>

        {/* Asymmetric Vertical Divider */}
        <div className={styles.dividerLine} ref={dividerRef}></div>

        {/* RIGHT COLUMN - Institutional Memo Card */}
        <div className={styles.rightContent}>
          <div className={styles.trustPanel} ref={memoCardRef}>
            {/* Memo Header */}
            <div className={styles.memoHeader}>
              <span className={styles.memoLabel}>Why Choose Model Mortgage</span>
            </div>

            {/* Trust Points */}
            <div className={styles.memoContent}>
              {data.trustPoints.map((point, idx) => {
                const [title, description] = point.split('—')
                const IconComponent = Object.entries(iconMap).find(([key]) =>
                  title.toLowerCase().includes(key.toLowerCase())
                )?.[1]

                return (
                  <div key={idx} className={styles.memoItem}>
                    <div className={styles.memoIcon}>
                      {IconComponent ? <IconComponent /> : null}
                    </div>
                    <div className={styles.memoText}>
                      <h3>{title.trim()}</h3>
                      <p>{description?.trim()}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Memo Footer */}
            <div className={styles.memoFooter}>
              <div className={styles.memoFooterText}>
                <p className={styles.memoAvailability}>Experience Over Assumptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner element */}
      <div className={styles.cornerElement}></div>
    </section>
  )
}
