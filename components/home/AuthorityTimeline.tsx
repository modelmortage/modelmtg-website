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
        year: '2008',
        title: 'Started Career in Mortgage Finance',
        description: 'Began journey in mortgage industry during market transformation'
    },
    {
        year: '2012',
        title: 'Founded Model Mortgage',
        description: 'Established boutique mortgage brokerage in Houston',
        amount: '$50M'
    },
    {
        year: '2016',
        title: 'Expanded to Luxury Market',
        description: 'Specialized in high-value residential financing',
        amount: '$150M'
    },
    {
        year: '2020',
        title: 'Digital Transformation',
        description: 'Pioneered tech-forward mortgage experience',
        amount: '$325M'
    },
    {
        year: '2024',
        title: 'Market Leader',
        description: 'Recognized as top Houston mortgage strategist',
        amount: '$500M+'
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
                    <h2>Track Record of Excellence</h2>
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
