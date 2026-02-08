'use client'

import { useEffect, useState } from 'react'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './AuthorityTimeline.module.css'

interface Milestone {
    year: string
    title: string
    description: string
    amount?: string
}

const milestones: Milestone[] = [
    {
        year: '2012',
        title: 'Model Mortgage Founded',
        description: 'Established as a boutique brokerage for complex financial profiles.',
        amount: '$50M'
    },
    {
        year: '2016',
        title: 'Luxury & Investor Division',
        description: 'Expanded specialized lending for high-net-worth real estate portfolios.',
        amount: '$150M'
    },
    {
        year: '2020',
        title: 'Dedicated Processing Team',
        description: 'Built in-house operations to ensure 18-day closing averages.',
        amount: '$325M'
    },
    {
        year: '2023',
        title: '$500M+ Funded Milestone',
        description: 'Reached half a billion in funded residential and investment loans.',
        amount: '$500M+'
    },
    {
        year: '2025',
        title: '5,000+ Clients Served',
        description: 'Continuing to set the standard for strategic mortgage planning in Texas.',
        amount: '5000+'
    }
]

export default function AuthorityTimeline() {
    const [visibleMilestones, setVisibleMilestones] = useState<number[]>([])
    const [totalFunded, setTotalFunded] = useState(0)
    const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({ threshold: 0.3 })

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0')
                        setVisibleMilestones(prev => [...new Set([...prev, index])])
                    }
                })
            },
            { threshold: 0.5 }
        )

        const milestoneElements = document.querySelectorAll(`.${styles.milestone}`)
        milestoneElements.forEach(el => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (visibleMilestones.length > 0) {
            const targetValue = 500
            const duration = 2000
            const steps = 60
            const increment = targetValue / steps
            let current = 0

            const timer = setInterval(() => {
                current += increment
                if (current >= targetValue) {
                    setTotalFunded(targetValue)
                    clearInterval(timer)
                } else {
                    setTotalFunded(Math.floor(current))
                }
            }, duration / steps)

            return () => clearInterval(timer)
        }
    }, [visibleMilestones.length])

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div
                    ref={headerRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.header} ${headerVisible ? styles.visible : ''}`}
                >
                    <h2>Company Growth & Milestones</h2>
                    <div className={styles.totalFunded}>
                        <span className={styles.fundedAmount}>${totalFunded}M+</span>
                        <span className={styles.fundedLabel}>Total Funded</span>
                    </div>
                </div>

                <div className={styles.timeline}>
                    <div className={styles.timelineLine}></div>

                    {milestones.map((milestone, index) => (
                        <div
                            key={index}
                            className={`${styles.milestone} ${visibleMilestones.includes(index) ? styles.visible : ''}`}
                            data-index={index}
                        >
                            <div className={styles.milestoneYear}>{milestone.year}</div>
                            <div className={styles.milestoneDot}></div>
                            <div className={styles.milestoneContent}>
                                <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                                <p className={styles.milestoneDescription}>{milestone.description}</p>
                                {milestone.amount && (
                                    <span className={styles.milestoneAmount}>{milestone.amount} Funded</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
