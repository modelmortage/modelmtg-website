'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './ClientProfiles.module.css'

export default function ClientProfiles() {
    const { ref: sectionRef, isVisible } = useIntersectionAnimation({ threshold: 0.1 })
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const profiles = [
        {
            title: "Luxury Home Buyers",
            desc: "Jumbo financing strategies for properties $750k+.",
            icon: "🏰"
        },
        {
            title: "Real Estate Investors",
            desc: "DSCR, Portfolio, and Fix & Flip structuring.",
            icon: "📈"
        },
        {
            title: "Self-Employed",
            desc: "Bank statement & 1099 income qualification.",
            icon: "💼"
        },
        {
            title: "Relocation & Physicians",
            desc: "Specialized programs for medical professionals.",
            icon: "✈️"
        },
        {
            title: "First-Time Buyers",
            desc: "Strategic entry with down payment assistance.",
            icon: "🔑"
        }
    ]

    return (
        <section className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

                {/* LEFT: EDITORIAL COPY */}
                <div className={styles.leftContent}>
                    <h2 className={styles.headline}>
                        Financing Built for <br />
                        <span className={styles.goldText}>Complex Buyers</span>
                    </h2>

                    <p className={styles.subtext}>
                        We specialize in high-stakes deals where structure matters more than rate shopping. Whether you're a CEO, investor, or first-time buyer, we architect the loan to fit your financial picture.
                    </p>

                    <div className={styles.ctaWrapper}>
                        <Link href="/programs" className={styles.linkButton}>
                            View All Loan Programs <FaArrowRight className={styles.arrowIcon} />
                        </Link>
                    </div>
                </div>

                {/* RIGHT: ROSTER LIST */}
                <div className={styles.rightList}>
                    {profiles.map((profile, index) => (
                        <div
                            key={index}
                            className={`${styles.listItem} ${hoveredIndex === index ? styles.active : ''}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className={styles.itemHeader}>
                                <span className={styles.icon}>{profile.icon}</span>
                                <h3 className={styles.itemTitle}>{profile.title}</h3>
                            </div>

                            <div className={styles.itemMeta}>
                                <span className={styles.itemDesc}>{profile.desc}</span>
                                <FaArrowRight className={styles.itemArrow} />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
