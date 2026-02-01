'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/design-system'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './HeroSection.module.css'

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { ref: contentRef, isVisible: contentVisible } = useIntersectionAnimation({ threshold: 0.2 })
    const { ref: portraitRef, isVisible: portraitVisible } = useIntersectionAnimation({ threshold: 0.2 })

    useEffect(() => {
        // Particle animation
        const createParticle = () => {
            if (!heroRef.current) return

            const particle = document.createElement('div')
            particle.className = styles.particle
            particle.style.left = Math.random() * 100 + '%'
            particle.style.animationDelay = Math.random() * 3 + 's'
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's'

            heroRef.current.appendChild(particle)

            setTimeout(() => {
                particle.remove()
            }, 5000)
        }

        const particleInterval = setInterval(createParticle, 300)

        return () => {
            clearInterval(particleInterval)
        }
    }, [])

    return (
        <section ref={heroRef} className={styles.hero}>
            {/* Animated Gold Light Rays */}
            <div className={styles.lightRay1}></div>
            <div className={styles.lightRay2}></div>
            <div className={styles.lightRay3}></div>

            {/* Content */}
            <div className={styles.content}>
                <div 
                    ref={contentRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.textContent} ${contentVisible ? styles.visible : ''}`}
                >
                    <h1 className={styles.headline}>
                        <span className={styles.goldAccent}>Strategic</span> Mortgage Planning
                        <br />
                        for Buyers Who Refuse to Lose
                    </h1>

                    <h2 className={styles.seoSubHeadline}>
                        Houston's Premier Mortgage Broker for Home Buyers, Investors & Luxury Properties
                    </h2>

                    <p className={styles.powerQuote}>
                        This is not a rate quote. This is a financial strategy.
                    </p>

                    <p className={styles.subheadline}>
                        Elite mortgage brokerage in Houston, TX. Institutional expertise,
                        boutique service, unmatched results.
                    </p>

                    <div className={styles.ctaGroup}>
                        <a 
                            href="https://2516810.my1003app.com/?time=1702581789975" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button variant="primary" size="lg">
                                Get Pre-Approved
                            </Button>
                        </a>
                        <Link href="/calculator" passHref legacyBehavior>
                            <a style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="lg">
                                    Calculate Payment
                                </Button>
                            </a>
                        </Link>
                    </div>
                </div>

                {/* Professional Portrait */}
                <div 
                    ref={portraitRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.portraitContainer} ${portraitVisible ? styles.visible : ''}`}
                >
                    <div className={styles.portraitPlaceholder}>
                        <div className={styles.portraitGlow}></div>
                        <div className={styles.portraitImage}>
                            <Image
                                src="/matthew-bramow.png"
                                alt="Matthew Bramow - Houston Mortgage Strategist"
                                width={500}
                                height={667}
                                priority
                                className={styles.portrait}
                            />
                        </div>
                    </div>
                    <div className={styles.portraitCaption}>
                        <div className={styles.portraitName}>MATTHEW BRAMOW</div>
                        <div className={styles.portraitTitle}>CEO | Mortgage Broker</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
