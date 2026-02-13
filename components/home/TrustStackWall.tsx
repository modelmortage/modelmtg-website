'use client'

import React, { useState } from 'react'
import { Icon } from '@/components/design-system'
import { FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './TrustStackWall.module.css'

export default function TrustStackWall() {
    const { ref: sectionRef, isVisible } = useIntersectionAnimation({ threshold: 0.1 })
    const [activeStory, setActiveStory] = useState(0)

    const stories = [
        {
            name: "The Harrison Family",
            location: "River Oaks",
            loanType: "Jumbo Purchase",
            time: "21 Days",
            amount: "$2.4M",
            headline: "Complex Income? No Problem.",
            quote: "Matthew's team understood our K-1 income structure better than our CPA. They closed our loan in 3 weeks when another lender said it would take 60 days.",
            tags: ["Self-Employed", "Jumbo", "Fast Close"]
        },
        {
            name: "Dr. Aris & Elena",
            location: "West University",
            loanType: "Physician Loan",
            time: "18 Days",
            amount: "$1.8M",
            headline: " flawless execution.",
            quote: "We were in a multiple offer situation. The team called the listing agent to vouch for our approval, and that made the difference.",
            tags: ["Medical Pro", "Multiple Offer Win", "Low Down Payment"]
        },
        {
            name: "Marcus T.",
            location: "The Heights",
            loanType: "Investment Portfolio",
            time: "14 Days",
            amount: "$850k",
            headline: "Scale made simple.",
            quote: "I'm scaling a rental portfolio. I need speed and leverage, not hand-holding. This is the only team I trust to execute.",
            tags: ["Investor", "DSCR", "Cash-Out"]
        }
    ]

    return (
        <section className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

                <h2 className={styles.sectionTitle}>Client <span className={styles.goldText}>Success Stories</span></h2>

                <div className={styles.contentGrid}>
                    {/* LEFT: FEATURED STORY */}
                    <div className={styles.featuredCard}>
                        <div className={styles.quoteIcon}><FaQuoteLeft /></div>
                        <h3 className={styles.storyHeadline}>{stories[activeStory].headline}</h3>
                        <p className={styles.storyQuote}>{stories[activeStory].quote}</p>

                        <div className={styles.storyMeta}>
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>Client</span>
                                <span className={styles.metaValue}>{stories[activeStory].name}</span>
                            </div>
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>Property</span>
                                <span className={styles.metaValue}>{stories[activeStory].location}</span>
                            </div>
                            <div className={styles.metaDivider}></div>
                            <div className={styles.statRow}>
                                <div className={styles.statItem}>
                                    <span className={styles.statVal}>{stories[activeStory].time}</span>
                                    <span className={styles.statLab}>Close Time</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statVal}>{stories[activeStory].amount}</span>
                                    <span className={styles.statLab}>Loan Amount</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tags}>
                            {stories[activeStory].tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: STORY SELECTOR */}
                    <div className={styles.storyList}>
                        <h4 className={styles.listTitle}>Recent Wins</h4>
                        <div className={styles.listScroll}>
                            {stories.map((story, index) => (
                                <div
                                    key={index}
                                    className={`${styles.listItem} ${activeStory === index ? styles.active : ''}`}
                                    onClick={() => setActiveStory(index)}
                                >
                                    <div className={styles.itemHeader}>
                                        <span className={styles.itemName}>{story.name}</span>
                                        {activeStory === index && <FaArrowRight className={styles.activeArrow} />}
                                    </div>
                                    <div className={styles.itemSub}>
                                        {story.location} • {story.loanType}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.reviewsBadge}>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <span>5.0 Rating on Google (170+ Reviews)</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
