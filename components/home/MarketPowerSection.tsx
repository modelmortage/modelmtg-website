'use client'

import { useEffect, useState } from 'react'
import { Card, Icon } from '@/components/design-system'
import { FaChartLine, FaFire, FaArrowUp, FaCheckCircle, FaClock } from 'react-icons/fa'
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
                    <Card variant="elevated" padding="lg" className={`${styles.card} ${styles.rateTicker}`}>
                        <div className={styles.cardHeader}>
                            <h3>Current Rates</h3>
                            <span className={styles.liveDot}>● LIVE</span>
                        </div>
                        <div className={styles.rateDisplay}>
                            <span className={styles.rateNumber}>{rate.toFixed(3)}%</span>
                            <span className={styles.rateLabel}>30-Year Fixed</span>
                        </div>
                        <div className={styles.rateChange}>
                            <span className={styles.changePositive}>
                                <Icon icon={FaChartLine} size="sm" /> +0.125%
                            </span>
                            <span className={styles.changeTime}>Updated 2 min ago</span>
                        </div>
                    </Card>

                    {/* Houston Heatmap */}
                    <Card variant="elevated" padding="lg" className={`${styles.card} ${styles.heatmap}`}>
                        <div className={styles.cardHeader}>
                            <h3>Houston Market Heat</h3>
                        </div>
                        <div className={styles.heatmapGrid}>
                            <div className={`${styles.zone} ${styles.zoneHot}`}>
                                <span className={styles.zoneName}>Heights</span>
                                <span className={styles.zoneTemp}>
                                    <Icon icon={FaFire} size="sm" /> Hot
                                </span>
                            </div>
                            <div className={`${styles.zone} ${styles.zoneWarm}`}>
                                <span className={styles.zoneName}>Katy</span>
                                <span className={styles.zoneTemp}>
                                    <Icon icon={FaArrowUp} size="sm" /> Warm
                                </span>
                            </div>
                            <div className={`${styles.zone} ${styles.zoneCool}`}>
                                <span className={styles.zoneName}>Sugar Land</span>
                                <span className={styles.zoneTemp}>
                                    <Icon icon={FaCheckCircle} size="sm" /> Stable
                                </span>
                            </div>
                            <div className={`${styles.zone} ${styles.zoneWarm}`}>
                                <span className={styles.zoneName}>Pearland</span>
                                <span className={styles.zoneTemp}>
                                    <Icon icon={FaArrowUp} size="sm" /> Warm
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Equity Growth Chart */}
                    <Card variant="elevated" padding="lg" className={`${styles.card} ${styles.equityChart}`}>
                        <div className={styles.cardHeader}>
                            <h3>Avg Equity Growth</h3>
                        </div>
                        <div className={styles.chartContainer}>
                            <div className={styles.chartBars}>
                                <div className={styles.bar} style={{ height: '40%' }}><span>Year 1</span></div>
                                <div className={styles.bar} style={{ height: '55%' }}><span>Year 3</span></div>
                                <div className={styles.bar} style={{ height: '70%' }}><span>Year 5</span></div>
                                <div className={styles.bar} style={{ height: '90%' }}><span>Year 10</span></div>
                            </div>
                            <div className={styles.chartValue}>
                                <span className={styles.valueNumber}>+$127K</span>
                                <span className={styles.valueLabel}>Houston Avg (10yr)</span>
                            </div>
                        </div>
                    </Card>

                    {/* Closing Timer */}
                    <Card variant="elevated" padding="lg" className={`${styles.card} ${styles.closingTimer}`}>
                        <div className={styles.cardHeader}>
                            <h3>Avg Close Time</h3>
                        </div>
                        <div className={styles.timerDisplay}>
                            <Icon icon={FaClock} size="xl" color="#D4AF37" />
                            <div className={styles.timerNumber}>{closingDays}</div>
                            <div className={styles.timerLabel}>Days</div>
                        </div>
                        <div className={styles.timerComparison}>
                            <span className={styles.comparisonText}>vs Industry: 45 days</span>
                            <span className={styles.comparisonStat}>60% Faster</span>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
