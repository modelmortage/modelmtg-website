import styles from './PersonalBrandSection.module.css'

export default function PersonalBrandSection() {
    return (
        <section className={styles.section}>
            <div className={styles.spotlight}></div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.signatureContainer}>
                        <span className={styles.signature}>Matthew Bramow</span>
                    </div>

                    <h2 className={styles.name}>MATTHEW BRAMOW</h2>

                    <p className={styles.title}>CEO · Mortgage Strategist · NMLS #2518610</p>

                    <div className={styles.quote}>
                        <span className={styles.quoteMarks}>"</span>
                        <p className={styles.quoteText}>
                            A mortgage is not a rate. It's a strategy.
                        </p>
                    </div>

                    <div className={styles.bio}>
                        <p>
                            With over 15 years of experience in mortgage finance, I've helped thousands of families and investors
                            achieve their real estate goals. My approach goes beyond finding the lowest rate — it's about creating
                            a comprehensive financial strategy that positions you for long-term wealth building.
                        </p>
                        <p>
                            From first-time buyers to luxury property investors, I bring institutional expertise with boutique service.
                            Every client deserves a mortgage strategist who understands their unique financial picture and builds a
                            solution accordingly.
                        </p>
                    </div>

                    <div className={styles.credentials}>
                        <div className={styles.credential}>
                            <span className={styles.credIcon}>✓</span>
                            <span>Licensed Mortgage Broker</span>
                        </div>
                        <div className={styles.credential}>
                            <span className={styles.credIcon}>✓</span>
                            <span>NMLS Certified</span>
                        </div>
                        <div className={styles.credential}>
                            <span className={styles.credIcon}>✓</span>
                            <span>$500M+ Funded</span>
                        </div>
                        <div className={styles.credential}>
                            <span className={styles.credIcon}>✓</span>
                            <span>5,000+ Clients Served</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
