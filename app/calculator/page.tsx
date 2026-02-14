import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FaDollarSign, FaHome, FaSyncAlt, FaBalanceScale, FaFlag, FaMedal, FaChartBar } from 'react-icons/fa'
import styles from './calculator.module.css'

export const metadata: Metadata = {
    title: 'Mortgage Calculators | Houston Home Loan Calculator | Model Mortgage',
    description: 'Free mortgage calculators for Houston buyers. Calculate affordability, monthly payments, refinance savings, and more. Expert tools by Matthew Bramow.',
    keywords: 'mortgage calculator Houston, home loan calculator Texas, mortgage payment calculator, affordability calculator, refinance calculator',
    openGraph: {
        title: 'Mortgage Calculators | Houston Home Loan Calculator',
        description: 'Free mortgage calculators for Houston home buyers. Calculate affordability, monthly payments, refinance savings, and more.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mortgage Calculators | Houston Home Loan Calculator',
        description: 'Free mortgage calculators for Houston home buyers. Calculate affordability, monthly payments, refinance savings, and more.',
    },
    alternates: {
        canonical: '/calculator',
    },
}

const calculators = [
    {
        title: 'How Much Can I Afford?',
        description: 'Calculate your maximum home purchase price based on income, debts, and down payment.',
        slug: 'affordability',
        category: 'Purchase Planning',
        icon: FaDollarSign
    },
    {
        title: 'Purchase Calculator',
        description: 'Estimate monthly mortgage payments, taxes, insurance, and total costs.',
        slug: 'purchase',
        category: 'Purchase Planning',
        icon: FaHome
    },
    {
        title: 'Refinance Calculator',
        description: 'See how much you could save by refinancing your current mortgage.',
        slug: 'refinance',
        category: 'Refinance Analysis',
        icon: FaSyncAlt
    },
    {
        title: 'Rent vs Buy',
        description: 'Compare the financial impact of renting versus buying over time.',
        slug: 'rent-vs-buy',
        category: 'Decision Analysis',
        icon: FaBalanceScale
    },
    {
        title: 'VA Purchase Calculator',
        description: 'Specialized calculator for VA home loans with zero down payment.',
        slug: 'va-purchase',
        category: 'VA Loans',
        icon: FaFlag
    },
    {
        title: 'VA Refinance Calculator',
        description: 'Calculate VA refinance options including cash-out and streamline.',
        slug: 'va-refinance',
        category: 'VA Loans',
        icon: FaMedal
    },
    {
        title: 'DSCR Investment Calculator',
        description: 'Calculate debt service coverage ratio for investment properties.',
        slug: 'dscr',
        category: 'Investment Analysis',
        icon: FaChartBar
    }
]

export default function CalculatorHub() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContainer}>
                        <span className={styles.heroLabel}>Financial Tools</span>
                        <h1 className={styles.heroTitle}>
                            Mortgage <span className={styles.heroTitleAccent}>Calculators</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Make informed decisions with our suite of professional mortgage calculators. All tools are free and built by experts for Houston buyers.
                        </p>
                    </div>
                </section>

                {/* Calculator Grid */}
                <section className={styles.calculatorSection}>
                    <div className={styles.calculatorGrid}>
                        {calculators.map((calc) => (
                            <Link
                                key={calc.slug}
                                href={`/calculator/${calc.slug}`}
                                className={styles.calculatorCard}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardIcon}>
                                        <calc.icon />
                                    </div>
                                    <span className={styles.cardCategory}>{calc.category}</span>
                                </div>
                                <h2 className={styles.cardTitle}>{calc.title}</h2>
                                <p className={styles.cardDescription}>{calc.description}</p>
                                <div className={styles.cardFooter}>
                                    <span className={styles.cardLink}>Launch Calculator</span>
                                    <svg className={styles.cardArrow} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <span className={styles.ctaLabel}>Next Step</span>
                        <h2 className={styles.ctaTitle}>Ready to Get Pre-Approved?</h2>
                        <p className={styles.ctaSubtitle}>
                            Tools are helpful, but nothing beats personalized guidance from an expert.
                        </p>
                        <a 
                            href="https://2516810.my1003app.com/?time=1702581789975" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.ctaButton}
                        >
                            Start Your Pre-Approval
                        </a>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Structured Data for Calculator Hub */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "Mortgage Calculator Hub",
                        "description": "Free mortgage calculators for Houston home buyers",
                        "applicationCategory": "FinanceApplication",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        }
                    })
                }}
            />
        </>
    )
}
