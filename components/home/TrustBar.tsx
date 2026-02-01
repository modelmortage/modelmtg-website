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
                    <div className={styles.stars}>
                        <Icon icon={FaStar} size="sm" color="#D4AF37" ariaLabel="5 star rating" />
                        <Icon icon={FaStar} size="sm" color="#D4AF37" />
                        <Icon icon={FaStar} size="sm" color="#D4AF37" />
                        <Icon icon={FaStar} size="sm" color="#D4AF37" />
                        <Icon icon={FaStar} size="sm" color="#D4AF37" />
                    </div>
                    <p className={styles.trustText}>5.0 Google Rating</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustNumber}>$500M+</p>
                    <p className={styles.trustText}>Loans Funded</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustNumber}>5,000+</p>
                    <p className={styles.trustText}>Happy Clients</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustNumber}>18 Days</p>
                    <p className={styles.trustText}>Avg Close Time</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.trustItem}>
                    <p className={styles.trustNumber}>15+ Years</p>
                    <p className={styles.trustText}>Experience</p>
                </div>
            </div>
        </section>
    )
}
