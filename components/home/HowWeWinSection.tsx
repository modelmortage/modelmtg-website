'use client'

import React from 'react'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './HowWeWinSection.module.css'

export default function HowWeWinSection() {
    const { ref: sectionRef, isVisible } = useIntersectionAnimation({ threshold: 0.1 })

    const steps = [
        {
            title: "Strategic Pre-Approval",
            desc: "Fully underwritten to TBD property before you shop. Offers are written as cash-equivalent."
        },
        {
            title: "Direct Underwriter Access",
            desc: "We clear complex income or asset questions directly with the decision maker in real-time."
        },
        {
            title: "Proactive Title Work",
            desc: "We order title work immediately upon contract to prevent last-minute delays."
        }
    ]

    return (
        <section className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>

                {/* LEFT: SYSTEM IDENTITY */}
                <div className={styles.identityCol}>
                    <h2 className={styles.headline}>The Execution <br /><span className={styles.goldText}>Model.</span></h2>
                    <div className={styles.signatureLine}></div>
                    <p className={styles.philosophy}>
                        A standardized process designed to remove variance and guarantee closing dates.
                    </p>

                    <div className={styles.microStat}>
                        <div className={styles.statValue}>100%</div>
                        <div className={styles.statLabel}>On-Time Closing Rate (YTD)</div>
                    </div>
                </div>

                {/* RIGHT: SYSTEM STEPS */}
                <div className={styles.stepsCol}>
                    {steps.map((step, i) => (
                        <div key={i} className={styles.stepItem} style={{ transitionDelay: `${i * 100}ms` }}>
                            <span className={styles.stepNum}>0{i + 1}</span>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>
                            </div>
                        </div>
                    ))}

                    <div className={styles.systemNote}>
                        <span className={styles.noteIcon}>⚡</span>
                        <span>Docs sent to title 48 hours before signing.</span>
                    </div>
                </div>

            </div>
        </section>
    )
}
