'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/design-system'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './HeroSection.module.css'
import { siteData } from '@/src/lib/siteData'

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { ref: contentRef, isVisible: contentVisible } = useIntersectionAnimation({ threshold: 0.1 })

    return (
        <section ref={heroRef} className={styles.hero}>
            <div className={`${styles.container} ${contentVisible ? styles.visible : ''}`} ref={contentRef as React.RefObject<HTMLDivElement>}>

                {/* LEFT: STRATEGIC COPY */}
                <div className={styles.leftContent}>
                    <h1 className={styles.headline}>
                        Strategic Mortgage Planning for <span className={styles.goldText}>Houston Buyers & Investors</span>
                    </h1>

                    <h2 className={styles.subheadline}>
                        A boutique lending team built for speed, leverage, and certainty — from pre-approval to closing table.
                    </h2>

                    <div className={styles.ctaGroup}>
                        <a
                            href={siteData.cta.applyOnline.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ minWidth: '200px' }}
                        >
                            Apply Online
                        </a>
                        <Link href="/pre-qualify" passHref legacyBehavior>
                            <a className={styles.goldGradientBtn}>
                                Get Pre-Qualified
                            </a>
                        </Link>
                    </div>

                    {/* TRUST STRIP */}
                    <div className={styles.trustStrip}>
                        <div className={styles.trustItem}>
                            <span className={styles.trustValue}>$500M+</span>
                            <span className={styles.trustLabel}>Funded</span>
                        </div>
                        <div className={styles.trustDivider}></div>
                        <div className={styles.trustItem}>
                            <span className={styles.trustValue}>18 Days</span>
                            <span className={styles.trustLabel}>Avg Close</span>
                        </div>
                        <div className={styles.trustDivider}></div>
                        <div className={styles.trustItem}>
                            <span className={styles.trustValue}>5.0</span>
                            <span className={styles.trustLabel}>★★★★★</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TRUST PANEL */}
                <div className={styles.rightVisual}>
                    <div className={styles.trustPanel}>
                        <h3 className={styles.panelTitle}>Why Houston Chooses Model Mortgage</h3>
                        <div className={styles.panelList}>
                            <div className={styles.panelItem}>
                                <div className={styles.panelIcon}>✓</div>
                                <div className={styles.panelText}>
                                    <strong>Fast Pre-Approvals</strong>
                                    <span>Same-day qualification for competitive offers</span>
                                </div>
                            </div>
                            <div className={styles.panelItem}>
                                <div className={styles.panelIcon}>✓</div>
                                <div className={styles.panelText}>
                                    <strong>Local Expertise</strong>
                                    <span>Deep Houston market knowledge since 2015</span>
                                </div>
                            </div>
                            <div className={styles.panelItem}>
                                <div className={styles.panelIcon}>✓</div>
                                <div className={styles.panelText}>
                                    <strong>Investor-Friendly</strong>
                                    <span>DSCR, portfolio loans, strategic financing</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.panelBadge}>
                            NMLS #2518610 • Licensed in Texas
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

