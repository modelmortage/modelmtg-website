import Link from 'next/link'
import styles from './LoanProgramsGrid.module.css'

const loanPrograms = [
    {
        title: 'Conventional Loans',
        description: 'Classic financing for strong credit profiles. Competitive rates, flexible terms.',
        icon: '🏛️',
        link: '/loan-options/conventional'
    },
    {
        title: 'FHA Loans',
        description: 'Lower down payments for first-time buyers. Government-backed security.',
        icon: '🏠',
        link: '/loan-options/fha'
    },
    {
        title: 'VA Loans',
        description: 'Zero down payment for military veterans. No PMI required.',
        icon: '🇺🇸',
        link: '/loan-options/va'
    },
    {
        title: 'Jumbo Loans',
        description: 'Luxury property financing. $750K+ loan amounts with competitive rates.',
        icon: '💎',
        link: '/loan-options/jumbo'
    },
    {
        title: 'Refinance',
        description: 'Lower your rate, tap equity, or consolidate debt. Strategic refinancing.',
        icon: '🔄',
        link: '/loan-options/refinance'
    },
    {
        title: 'Investment Property',
        description: 'Build wealth through real estate. DSCR and portfolio loans available.',
        icon: '📊',
        link: '/loan-options/investment'
    }
]

export default function LoanProgramsGrid() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Loan Programs Built for Success</h2>
                    <p className={styles.subtitle}>
                        Every situation is unique. We match you with the right financing strategy.
                    </p>
                </div>

                <div className={styles.grid}>
                    {loanPrograms.map((program, index) => (
                        <Link
                            href={program.link}
                            key={index}
                            className={styles.card}
                        >
                            <div className={styles.icon}>{program.icon}</div>
                            <h3 className={styles.title}>{program.title}</h3>
                            <p className={styles.description}>{program.description}</p>
                            <span className={styles.arrow}>→</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/loan-options" className={styles.viewAllBtn}>
                        View All Loan Options
                    </Link>
                </div>
            </div>
        </section>
    )
}
