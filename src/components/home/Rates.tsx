import styles from './Rates.module.css'

/**
 * Current Texas Mortgage Rates Section
 *
 * Displays current mortgage rates for FHA, Conventional, VA
 * Updated regularly. Rates vary based on borrower profile and property details.
 *
 * Data structure: Shows Purchase and Refinance rates for 30Y Fixed
 * Includes APR, 1W Change, Last Updated
 * Source: Zillow
 */

interface Rate {
    label: string
    purchase30y: string
    refinance30y: string
    aprPurchase: string
    aprRefinance: string
    change1w: string
    lastUpdated: string
}

export function Rates() {
    // Mock rates data - in production, fetch from Zillow API
    const rates: Rate[] = [
        {
            label: 'FHA',
            purchase30y: '6.75%',
            refinance30y: '6.82%',
            aprPurchase: '7.12%',
            aprRefinance: '7.18%',
            change1w: '+0.15%',
            lastUpdated: 'Updated today'
        },
        {
            label: 'Conventional',
            purchase30y: '6.52%',
            refinance30y: '6.58%',
            aprPurchase: '6.89%',
            aprRefinance: '6.95%',
            change1w: '+0.08%',
            lastUpdated: 'Updated today'
        },
        {
            label: 'VA',
            purchase30y: '6.28%',
            refinance30y: '6.35%',
            aprPurchase: '6.65%',
            aprRefinance: '6.72%',
            change1w: '+0.10%',
            lastUpdated: 'Updated today'
        }
    ]

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>Current Texas Mortgage Rates</h2>
                    <p className={styles.intro}>
                        Updated regularly. Rates vary based on borrower profile and property details.
                    </p>
                </div>

                {/* Rates Grid */}
                <div className={styles.ratesGrid}>
                    {rates.map((rate, index) => (
                        <div key={index} className={styles.rateCard}>
                            <div className={styles.cardHeader}>
                                <h3>{rate.label}</h3>
                            </div>

                            <div className={styles.rateRow}>
                                <div className={styles.rateLabel}>
                                    <span className={styles.rateType}>Purchase 30Y Fixed</span>
                                </div>
                                <div className={styles.rateValue}>
                                    <div className={styles.rate}>{rate.purchase30y}</div>
                                    <div className={styles.apr}>APR {rate.aprPurchase}</div>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.rateRow}>
                                <div className={styles.rateLabel}>
                                    <span className={styles.rateType}>Refinance 30Y Fixed</span>
                                </div>
                                <div className={styles.rateValue}>
                                    <div className={styles.rate}>{rate.refinance30y}</div>
                                    <div className={styles.apr}>APR {rate.aprRefinance}</div>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.change}>
                                    <span>1W Change:</span>
                                    <span className={styles.changeValue}>{rate.change1w}</span>
                                </div>
                                <div className={styles.updated}>
                                    {rate.lastUpdated}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className={styles.disclaimer}>
                    <p>
                        <strong>Disclaimer:</strong> Rates displayed are illustrative and may not reflect current market conditions.
                        These rates are provided by external sources and are subject to change at any time.
                        Contact us for an accurate rate quote based on your specific situation.
                    </p>
                    <p className={styles.source}>Source: Market data updated regularly</p>
                </div>
            </div>
        </section>
    )
}
