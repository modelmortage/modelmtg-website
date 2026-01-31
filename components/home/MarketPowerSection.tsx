'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './MarketPowerSection.module.css'

export default function MarketPowerSection() {
    const [rate, setRate] = useState(6.875)
    const [closingDays, setClosingDays] = useState(18)

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
                <div className={styles.header}>
                    <h2>Market Intelligence</h2>
                    <p className={styles.subtitle}>
                        Real-time data. Strategic insights. Your competitive advantage.
                    </p>
                </div>

                <div className={styles.dashboardGrid}>
                    {/* Live Rate Ticker */}
                    <div className={`${styles.card} ${styles.rateTicker}`}>
                        <div className={styles.cardHeader}>
                            <h3>Current Rates</h3>
                            <span className={styles.liveDot}>● LIVE</span>
                        </div>
                        <div className={styles.rateDisplay}>
                            <span className={styles.rateNumber}>{rate.toFixed(3)}%</span>
                            <span className={styles.rateLabel}>30-Year Fixed</span>
                        </div>
                        <div className={styles.rateChange}>
                            <span className={styles.changePositive}>↗ +0.125%</span>
                            <span className={styles.changeTime}>Updated 2 min ago</span>
                        </div>
                    </div>

                    {/* Houston Heatmap */}
                    <div className={`${styles.card} ${styles.heatmap}`}>
                        <div className={styles.cardHeader}>
                            <h3>Houston Market Heat</h3>
                        </div>
                        <div className={styles.heatmapGrid}>
                            <div className={`${styles.zone} ${styles.zoneHot}`}>
                                <span className={styles.zoneName}>Heights</span>
                                <span className={styles.zoneTemp}>🔥 Hot</span>
                            </div>
                            <div className={`${styles.zone} ${styles.zoneWarm}`}>
                                <span className={styles.zoneName}>Katy</span>
                                <span className={styles.zoneTemp}>⬆️ Warm</span>
                            </div>
                            <div className={`${styles.zone} ${styles.zoneCool}`}>
                                <span className={styles.zoneName}>Sugar Land</span>
                                <span className={styles.zoneTemp}>✓ Stable</span>
                            </div>
                            <div className={`${styles.zone} ${styles.zoneWarm}`}>
                                <span className={styles.zoneName}>Pearland</span>
                                <span className={styles.zoneTemp}>⬆️ Warm</span>
                            </div>
                        </div>
                    </div>

                    {/* Equity Growth Chart */}
                    <div className={`${styles.card} ${styles.equityChart}`}>
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
                    </div>

                    {/* Closing Timer */}
                    <div className={`${styles.card} ${styles.closingTimer}`}>
                        <div className={styles.cardHeader}>
                            <h3>Avg Close Time</h3>
                        </div>
                        <div className={styles.timerDisplay}>
                            <div className={styles.timerNumber}>{closingDays}</div>
                            <div className={styles.timerLabel}>Days</div>
                        </div>
                        <div className={styles.timerComparison}>
                            <span className={styles.comparisonText}>vs Industry: 45 days</span>
                            <span className={styles.comparisonStat}>60% Faster</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
