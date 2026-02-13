import { Card } from '@/src/components/ui/Card'
import styles from './Pillars.module.css'

/**
 * Advisory Pillars Section
 * 
 * Explains the "private client approach" with 3 simple cards
 */
export function Pillars() {
    const pillars = [
        {
            title: 'Loan Structuring & Strategy',
            text: 'Guidance tailored to your financial picture and long-term goals.'
        },
        {
            title: 'Calm, Clear Communication',
            text: 'Consistent updates and direct answers throughout the mortgage process.'
        },
        {
            title: 'Execution Through Closing',
            text: 'Coordinated support with underwriting, title, and all parties involved.'
        }
    ]

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>A Private Client Approach</h2>
                    <p className={styles.intro}>
                        We combine local market knowledge with a structured lending process
                        designed to reduce uncertainty and simplify decisions.
                    </p>
                </div>

                <div className={styles.grid}>
                    {pillars.map((pillar, index) => (
                        <Card key={index} className={styles.pillarCard}>
                            <h3>{pillar.title}</h3>
                            <p>{pillar.text}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
