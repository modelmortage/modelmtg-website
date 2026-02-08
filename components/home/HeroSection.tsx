'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/design-system'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './HeroSection.module.css'

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { ref: contentRef, isVisible: contentVisible } = useIntersectionAnimation({ threshold: 0.1 })

    return (
        <section ref={heroRef} className={styles.hero}>
            {/* Background Layers */}
            <div className={styles.bgImage}></div>
            <div className={styles.bgOverlay}></div>
            <div className="motif-security-paper"></div>

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
                        <Link href="/apply" passHref legacyBehavior>
                            <a className="btn btn-primary" style={{ minWidth: '200px' }}>
                                Apply Online
                            </a>
                        </Link>
                        <Link href="/pre-qualify" passHref legacyBehavior>
                            <a className="btn btn-secondary" style={{ minWidth: '200px' }}>
                                Pre-Qualify
                            </a>
                        </Link>
                    </div>

                    {/* MICRO TRUST STRIP */}
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

                {/* RIGHT: VISUAL + DEAL DESK */}
                <div className={styles.rightVisual}>
                    <div className={styles.visualContainer}>
                        {/* Placeholder for Cinematic Video/Image - Darkened for Luxury Feel */}
                        <div className={styles.placeholderBg}></div>

                        {/* DEAL DESK OVERLAY */}
                        <div className={styles.dealDeskCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.liveDot}></span>
                                MARKET SNAPSHOT
                            </div>
                            <div className={styles.cardRow}>
                                <span>30-Year Fixed</span>
                                <span className={styles.cardValue}>Trending Flat</span>
                            </div>
                            <div className={styles.cardSeparator}></div>
                            <div className={styles.cardRow}>
                                <span>Avg Close Time</span>
                                <span className={styles.cardValue}>18 Days</span>
                            </div>
                            <div className={styles.cardSeparator}></div>
                            <div className={styles.cardRow}>
                                <span>Investor Activity</span>
                                <span className={styles.cardValue}>High Demand</span>
                            </div>

                            <div className={styles.approvalBadge}>
                                HOUSTON LUXURY CERTIFIED
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

