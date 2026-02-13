import styles from './Transactions.module.css'

/**
 * Recent Transactions - Case Study Log
 * 
 * High-end credibility through discreet examples (no hype)
 */
export function Transactions() {
    const transactions = [
        { area: 'River Oaks', type: 'Purchase', program: 'Jumbo' },
        { area: 'West University', type: 'Purchase', program: 'Physician' },
        { area: 'The Heights', type: 'Investment', program: 'Portfolio' },
        { area: 'Memorial', type: 'Refinance', program: 'Conventional' },
        { area: 'Sugar Land', type: 'Purchase', program: 'FHA' }
    ]

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Recent Transactions</h2>
                    <p>A sample of recent activity across the Houston area.</p>
                </div>

                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <div>Area</div>
                        <div>Type</div>
                        <div>Program</div>
                    </div>
                    {transactions.map((transaction, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div>{transaction.area}</div>
                            <div>{transaction.type}</div>
                            <div>{transaction.program}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
