'use client'

import Link from 'next/link'
import { Card, Icon, Button } from '@/components/design-system'
import { FaUniversity, FaHome, FaFlag, FaGem, FaSync, FaChartLine } from 'react-icons/fa'
import { useIntersectionAnimation } from '@/app/utils/animations'
import styles from './LoanProgramsGrid.module.css'

const loanPrograms = [
    {
        title: 'Conventional Loans',
        description: 'Classic financing for strong credit profiles. Competitive rates, flexible terms.',
        icon: FaUniversity,
        link: '/loan-options/conventional'
    },
    {
        title: 'FHA Loans',
        description: 'Lower down payments for first-time buyers. Government-backed security.',
        icon: FaHome,
        link: '/loan-options/fha-home-loan'
    },
    {
        title: 'VA Loans',
        description: 'Zero down payment for military veterans. No PMI required.',
        icon: FaFlag,
        link: '/loan-options/va'
    },
    {
        title: 'Jumbo Loans',
        description: 'Luxury property financing. $750K+ loan amounts with competitive rates.',
        icon: FaGem,
        link: '/loan-options/jumbo'
    },
    {
        title: 'Refinance',
        description: 'Lower your rate, tap equity, or consolidate debt. Strategic refinancing.',
        icon: FaSync,
        link: '/loan-options/refinance'
    },
    {
        title: 'Investment Property',
        description: 'Build wealth through real estate. DSCR and portfolio loans available.',
        icon: FaChartLine,
        link: '/loan-options/investment'
    }
]

export default function LoanProgramsGrid() {
    const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation({ threshold: 0.3 })
    const { ref: gridRef, isVisible: gridVisible } = useIntersectionAnimation({ threshold: 0.1 })

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div 
                    ref={headerRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.header} ${headerVisible ? styles.visible : ''}`}
                >
                    <h2>Loan Programs Built for Success</h2>
                    <p className={styles.subtitle}>
                        Every situation is unique. We match you with the right financing strategy.
                    </p>
                </div>

                <div 
                    ref={gridRef as React.RefObject<HTMLDivElement>}
                    className={`${styles.grid} ${gridVisible ? styles.visible : ''}`}
                >
                    {loanPrograms.map((program, index) => (
                        <Link
                            href={program.link}
                            key={index}
                            style={{ textDecoration: 'none' }}
                        >
                            <Card 
                                variant="elevated" 
                                padding="lg" 
                                hoverable
                                className={styles.card}
                            >
                                <div className={styles.iconWrapper}>
                                    <Icon icon={program.icon} size="xl" color="#D4AF37" />
                                </div>
                                <h3 className={styles.title}>{program.title}</h3>
                                <p className={styles.description}>{program.description}</p>
                                <span className={styles.arrow}>→</span>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/loan-options" passHref legacyBehavior>
                        <a style={{ textDecoration: 'none' }}>
                            <Button variant="outline" size="lg">
                                View All Loan Options
                            </Button>
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    )
}
