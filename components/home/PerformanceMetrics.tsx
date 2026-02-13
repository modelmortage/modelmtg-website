'use client'

import React from 'react'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './PerformanceMetrics.module.css'

export default function PerformanceMetrics() {
    const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.1 })

    const metrics = [
        {
            value: '$500M+',
            label: 'Funded',
            sub: 'Boutique execution at scale'
        },
        {
            value: '18 Days',
            label: 'Avg Close',
            sub: 'Faster timelines, stronger offers'
        },
        {
            value: '5,000+',
            label: 'Clients Served',
            sub: 'From first homes to luxury portfolios'
        },
        {
            value: '1,000+',
            label: '5-Star Reviews',
            sub: 'Trusted across Houston'
        }
    ]

    return (
        <section className={styles.section} ref={ref as React.RefObject<HTMLElement>}>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

                <div className={styles.header}>
                    <h2 className={styles.title}>Performance <span className={styles.goldText}>That Wins Offers</span></h2>
                </div>

                <div className={styles.grid}>
                    {metrics.map((metric, index) => (
                        <div key={index} className={styles.card} style={{ transitionDelay: `${index * 100}ms` }}>
                            <div className={styles.value}>{metric.value}</div>
                            <div className={styles.label}>{metric.label}</div>
                            <div className={styles.sub}>{metric.sub}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.sourceLine}>
                    *Internal closing averages based on 2024-2025 transaction data. Updated quarterly.
                </div>
            </div>
        </section>
    )
}
