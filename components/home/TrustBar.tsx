import styles from './TrustBar.module.css'

export default function TrustBar() {
    return (
        <section className={styles.trustBar}>
            <div className={styles.container}>
                <div className={styles.trustItem}>
                    <div className={styles.stars}>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
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
