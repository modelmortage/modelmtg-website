'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Icon } from '@/components/design-system'
import { FaChartLine, FaFire, FaArrowUp, FaCheckCircle, FaClock, FaDownload, FaCalendarAlt, FaArrowRight } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './MarketPowerSection.module.css'

export default function MarketPowerSection() {
    const [rate, setRate] = useState(6.875)
    const [closingDays] = useState(18)
    const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({ threshold: 0.3 })
    const { ref: gridRef, isVisible: gridVisible } = useIntersectionAnimation({ threshold: 0.1 })

    useEffect(() => {
        // Simulate live rate ticker
        const rateInterval = setInterval(() => {
            setRate(prev => {
                const change = (Math.random() - 0.5) * 0.025
                return Math.max(6.5, Math.min(7.5, prev + change))
            })
        }, 3000)

        return () => clearInterval(rateInterval)
    }, [])

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div
                    ref={headerRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.header} ${headerVisible ? styles.visible : ''}`}
                >
                    <div className={styles.labelBadge}>UPDATED WEEKLY</div>
                    <h2>Market Intelligence</h2>
                    <p className={styles.subtitle}>
                        Real-time data. Strategic insights. Your competitive advantage.
                    </p>
                </div>

                <div
                    ref={gridRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.dashboardGrid} ${gridVisible ? styles.visible : ''}`}
                >
                    {/* Live Rate Ticker */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>30-Year Fixed</h3>
                            <span className={styles.liveDot}>● LIVE</span>
                        </div>
                        <div className={styles.rateDisplay}>
                            <span className={styles.rateNumber}>{rate.toFixed(3)}%</span>
                            <span className={styles.rateLabel}>Trending Flat</span>
                        </div>
                        <div className={styles.cardFooter}>
                            Updated 2 min ago
                        </div>
                    </div>

                    {/* Houston Heatmap */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Houston Heatmap</h3>
                        </div>
                        <div className={styles.heatmapGrid}>
                            <div className={styles.zoneRow}>
                                <span className={styles.zoneName}>Heights</span>
                                <span className={styles.zoneHot}><FaFire /> Hot</span>
                            </div>
                            <div className={styles.zoneRow}>
                                <span className={styles.zoneName}>Katy</span>
                                <span className={styles.zoneWarm}><FaArrowUp /> Warm</span>
                            </div>
                            <div className={styles.zoneRow}>
                                <span className={styles.zoneName}>Sugar Land</span>
                                <span className={styles.zoneStable}><FaCheckCircle /> Stable</span>
                            </div>
                        </div>
                    </div>

                    {/* Closing Timer */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Avg Close Time</h3>
                        </div>
                        <div className={styles.timerDisplay}>
                            <div className={styles.timerNumber}>{closingDays}</div>
                            <div className={styles.timerLabel}>Days</div>
                        </div>
                        <div className={styles.timerComparison}>
                            vs Industry: 45 days
                        </div>
                    </div>
                </div>

                {/* NEW CTAs */}
                <div className={styles.ctaRow}>
                    <button className="btn btn-secondary">
                        <FaDownload /> Download Weekly Brief (PDF)
                    </button>
                    <Link href="/strategy" passHref legacyBehavior>
                        <a className="btn-link-gold">
                            Schedule Strategy Call <FaArrowRight />
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    )
}

