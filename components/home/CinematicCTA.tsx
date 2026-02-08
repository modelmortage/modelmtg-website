'use client'

import Link from 'next/link'
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './CinematicCTA.module.css'

export default function CinematicCTA() {
    const { ref: sectionRef, isVisible } = useIntersectionAnimation({ threshold: 0.3 })

    return (
        <section className={styles.section} ref={sectionRef as React.RefObject<HTMLElement>}>
            {/* Background Layers */}
            <div className={styles.bgImage}></div>
            <div className={styles.bgOverlay}></div>
            <div className={styles.noiseOverlay}></div>
            <div className="motif-security-paper"></div>

            <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
                <div className={styles.content}>
                    <h2 className={styles.headline}>
                        Ready to Execute <br />
                        <span className={styles.goldText}>Your Strategy?</span>
                    </h2>

                    <p className={styles.subtext}>
                        The market moves fast. So do we. Schedule your strategy session today and get fully underwritten in 24 hours.
                    </p>

                    <div className={styles.ctaGroup}>
                        <Link href="/strategy" className={styles.primaryButton}>
                            Start Conversation <FaArrowRight />
                        </Link>
                        <Link href="/apply" className={styles.secondaryButton}>
                            <FaCalendarAlt /> Apply Now
                        </Link>
                    </div>

                    <div className={styles.trustStrip}>
                        <span>Zero Obligation</span>
                        <span className={styles.dot}>•</span>
                        <span>No Hard Credit Pull</span>
                        <span className={styles.dot}>•</span>
                        <span>Same-Day Pre-Approval</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
