import Link from 'next/link'
import { Card } from '@/src/components/ui/Card'
import styles from './Programs.module.css'

/**
 * Loan Programs Grid
 * 
 * SEO core + navigation to loan product pages
 */
export function Programs() {
    const programs = [
        { title: 'Conventional Loans', text: 'Flexible options for qualified buyers.', href: '/loan-options/conventional' },
        { title: 'FHA Loans', text: 'Accessible financing with flexible requirements.', href: '/loan-options/fha' },
        { title: 'VA Loans', text: 'Loan options for eligible veterans and service members.', href: '/loan-options/va' },
        { title: 'Jumbo Loans', text: 'Financing for higher-value homes.', href: '/loan-options/jumbo' },
        { title: 'USDA Loans', text: '0% down options in qualifying areas.', href: '/loan-options/usda' },
        { title: 'First-Time Buyers', text: 'Guidance and planning for your first purchase.', href: '/loan-options/first-time-home-buyer' },
        { title: 'Investment Properties', text: 'Financing options for rentals and second homes.', href: '/loan-options/investment-property' },
        { title: 'Refinance', text: 'Explore rate/term or cash-out refinance paths.', href: '/loan-options/refinance' }
    ]

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Loan Programs</h2>
                    <p className={styles.intro}>
                        Explore mortgage solutions designed for a range of buyer profiles and lending needs.
                    </p>
                </div>

                <div className={styles.grid}>
                    {programs.map((program, index) => (
                        <Link key={index} href={program.href} className={styles.programCard}>
                            <Card>
                                <h3>{program.title}</h3>
                                <p>{program.text}</p>
                                <span className={styles.arrow}>Learn more →</span>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className={styles.ctaContainer}>
                    <Link href="/loan-options" className={styles.viewAllBtn}>
                        View All Loan Programs
                    </Link>
                </div>
            </div>
        </section>
    )
}
