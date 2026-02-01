import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Card, Icon, Button } from '@/components/design-system'
import { 
    FaUniversity, 
    FaHome, 
    FaFlag, 
    FaGem, 
    FaSync, 
    FaChartLine,
    FaCheckCircle,
    FaArrowRight
} from 'react-icons/fa'
import styles from './loanOptions.module.css'

export const metadata: Metadata = {
    title: 'Houston Home Loans & Mortgage Options | Model Mortgage',
    description: 'Explore mortgage loan options in Houston: Conventional, FHA, VA, Jumbo, Refinance, and Investment loans. Expert guidance from Matthew Bramow.',
    keywords: 'Houston home loans, mortgage options Texas, FHA loans Houston, VA loans Houston, jumbo mortgage Houston',
    openGraph: {
        title: 'Houston Home Loans & Mortgage Options',
        description: 'Explore mortgage loan options in Houston: Conventional, FHA, VA, Jumbo, Refinance, and Investment loans. Expert guidance from Matthew Bramow.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Houston Home Loans & Mortgage Options',
        description: 'Explore mortgage loan options in Houston: Conventional, FHA, VA, Jumbo, Refinance, and Investment loans.',
    },
    alternates: {
        canonical: '/loan-options',
    },
}

const loanTypes = [
    {
        title: 'Conventional Loans',
        slug: 'conventional',
        icon: FaUniversity,
        description: 'The gold standard for borrowers with strong credit and stable income.',
        features: [
            'Down payment as low as 3%',
            'Competitive interest rates',
            'Flexible term options (15, 20, 30 years)',
            'No mortgage insurance with 20%+ down',
            'Loan amounts up to $766,550'
        ],
        idealFor: 'Buyers with good credit (640+) and 3%+ down payment'
    },
    {
        title: 'FHA Loans',
        slug: 'fha',
        icon: FaHome,
        description: 'Government-backed loans designed for first-time buyers and those with lower credit scores.',
        features: [
            'Down payment as low as 3.5%',
            'Credit scores from 580+',
            'More lenient debt-to-income ratios',
            'Assumable loans',
            'Gift funds allowed for down payment'
        ],
        idealFor: 'First-time buyers or those with less-than-perfect credit'
    },
    {
        title: 'VA Loans',
        slug: 'va',
        icon: FaFlag,
        description: 'Zero down payment loans for military service members, veterans, and eligible spouses.',
        features: [
            '0% down payment required',
            'No private mortgage insurance (PMI)',
            'Competitive interest rates',
            'Limited closing costs',
            'No prepayment penalties'
        ],
        idealFor: 'Active duty military, veterans, and eligible spouses'
    },
    {
        title: 'Jumbo Loans',
        slug: 'jumbo',
        icon: FaGem,
        description: 'High-balance financing for luxury properties exceeding conforming loan limits.',
        features: [
            'Loan amounts $766,551+',
            'Competitive rates for luxury market',
            'Down payment typically 10-20%',
            'Custom underwriting for high-net-worth clients',
            'Portfolio loan options available'
        ],
        idealFor: 'Luxury home buyers in Houston\'s premium markets'
    },
    {
        title: 'Refinance',
        slug: 'refinance',
        icon: FaSync,
        description: 'Lower your rate, tap equity, or change your loan structure strategically.',
        features: [
            'Rate & term refinance',
            'Cash-out refinance up to 80% LTV',
            'Streamline refinance options',
            'Debt consolidation',
            'Remove PMI'
        ],
        idealFor: 'Homeowners looking to optimize their mortgage'
    },
    {
        title: 'Investment Property Loans',
        slug: 'investment',
        icon: FaChartLine,
        description: 'Build wealth through real estate with specialized investor financing.',
        features: [
            'DSCR (Debt Service Coverage Ratio) loans',
            'No income verification options',
            'Portfolio financing available',
            'Up to 10 financed properties',
            'Rental income qualifying'
        ],
        idealFor: 'Real estate investors and rental property owners'
    }
]

export default function LoanOptionsPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <h1 className={styles.heroTitle}>
                            Houston <span className={styles.heroTitleAccent}>Mortgage Options</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Every financial situation is unique. We'll match you with the perfect loan program
                            to achieve your real estate goals.
                        </p>
                    </div>
                </section>

                {/* Loan Types Grid */}
                <section className={styles.loanTypesSection}>
                    <div className={styles.container}>
                        <div className={styles.loanTypesGrid}>
                            {loanTypes.map((loan) => (
                                <Card
                                    key={loan.slug}
                                    variant="outlined"
                                    padding="lg"
                                    hoverable
                                    className={styles.loanCard}
                                >
                                    <div className={styles.loanCardHeader}>
                                        <div className={styles.iconWrapper}>
                                            <Icon icon={loan.icon} size="xl" ariaLabel={loan.title} />
                                        </div>
                                        <h2 className={styles.loanTitle}>{loan.title}</h2>
                                    </div>
                                    
                                    <p className={styles.loanDescription}>{loan.description}</p>
                                    
                                    <div className={styles.idealForBox}>
                                        <p className={styles.idealForLabel}>Ideal For</p>
                                        <p className={styles.idealForText}>{loan.idealFor}</p>
                                    </div>

                                    <div className={styles.featuresSection}>
                                        <h3 className={styles.featuresTitle}>Key Features</h3>
                                        <ul className={styles.featuresList}>
                                            {loan.features.map((feature, i) => (
                                                <li key={i} className={styles.featureItem}>
                                                    <Icon 
                                                        icon={FaCheckCircle} 
                                                        size="sm" 
                                                        className={styles.checkIcon}
                                                    />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className={styles.cardActions}>
                                        <Link href={`/loan-options/${loan.slug}`} style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="primary" 
                                                size="md"
                                                icon={<FaArrowRight />}
                                                iconPosition="right"
                                                fullWidth
                                            >
                                                Learn More
                                            </Button>
                                        </Link>
                                        <a 
                                            href="https://2516810.my1003app.com/?time=1702581789975" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button variant="outline" size="md" fullWidth>
                                                Get Pre-Approved
                                            </Button>
                                        </a>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <h2 className={styles.ctaTitle}>
                            Not Sure Which Loan Is Right for You?
                        </h2>
                        <p className={styles.ctaText}>
                            Let's discuss your situation and find the perfect financing strategy.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a 
                                href="https://2516810.my1003app.com/?time=1702581789975" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                            >
                                <Button variant="primary" size="lg">
                                    Get Pre-Approved
                                </Button>
                            </a>
                            <Link href="/contact" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" size="lg">
                                    Talk to Matthew
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
