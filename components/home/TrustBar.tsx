'use client'

import { Icon } from '@/components/design-system'
import { FaStar } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './TrustBar.module.css'

export default function TrustBar() {
    const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.3 })

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            className={`${styles.trustBar} ${isVisible ? styles.visible : ''}`}
        >
            <div className={styles.container}>
                <div className={styles.trustItem}>
                    <p className={styles.trustText}>Licensed & Insured</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustText}>NMLS Certified</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustText}>5,000+ Clients Served</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustText}>$500M+ Funded</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustText}>Houston-Based Team</p>
                </div>
            </div>
        </section>
    )
}
