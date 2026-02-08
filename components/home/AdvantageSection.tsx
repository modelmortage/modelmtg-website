'use client'

import React from 'react'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './AdvantageSection.module.css'

export default function AdvantageSection() {
    const { ref: sectionRef, isVisible } = useIntersectionAnimation({ threshold: 0.1 })

    return (
        <section className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
            <div className="motif-security-paper"></div>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

                <div className={styles.header}>
                    <h2 className={styles.title}>The Model Mortgage <span className={styles.goldText}>Advantage</span></h2>
                    <p className={styles.subtitle}>Not just a loan officer — a full lending team built for execution.</p>
                </div>

                <div className={styles.grid}>
                    {/* FEATURED BLOCK (LEFT) */}
                    <div className={styles.featuredBlock}>
                        <div className={styles.blockContent}>
                            <h3 className={styles.blockTitle}>Strategy-First Lending</h3>
                            <p className={styles.blockDesc}>
                                We don't sell rates. We build lending strategy. We structure approvals around your long-term goals, not just lender limitations.
                            </p>
                            <div className={styles.highlightBadge}>CORE PHILOSOPHY</div>
                        </div>
                        <div className={styles.blockBg}></div>
                    </div>

                    {/* STACKED BLOCKS (RIGHT) */}
                    <div className={styles.stackedColumn}>
                        <div className={styles.secondaryBlock}>
                            <h3 className={styles.smallTitle}>Dedicated Processing Team</h3>
                            <p className={styles.smallDesc}>
                                Clean documentation, proactive conditions, and no surprises at the closing table.
                            </p>
                        </div>

                        <div className={styles.secondaryBlock}>
                            <h3 className={styles.smallTitle}>Fast Underwriting Access</h3>
                            <p className={styles.smallDesc}>
                                Speed matters in Houston. We move quickly when offers are on the line.
                            </p>
                        </div>

                        <div className={styles.calloutBox}>
                            "This is why our clients close in 18 days — not 45."
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
