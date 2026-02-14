import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import styles from './about.module.css'

export const metadata: Metadata = {
    title: 'About Us | Model Mortgage Houston',
    description: 'Model Mortgage specializes in precision-structured residential financing for Houston and surrounding markets. Strategy-driven mortgage solutions.',
    keywords: 'about Model Mortgage, Houston mortgage broker, mortgage company Houston, residential financing',
    openGraph: {
        title: 'About Us | Model Mortgage Houston',
        description: 'Strategy-driven mortgage solutions for Houston homebuyers and investors.',
        type: 'website',
    },
    alternates: {
        canonical: '/about-us',
    },
}

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContainer}>
                        <span className={styles.heroLabel}>Our Story</span>
                        <h1 className={styles.heroTitle}>
                            Precision-Structured <span className={styles.heroTitleAccent}>Residential Financing</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Model Mortgage specializes in institutional-grade financing for primary residences, second homes, and investment properties across Houston and surrounding markets.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className={styles.missionSection}>
                    <div className={styles.missionGrid}>
                        {/* Left Column */}
                        <div className={styles.missionContent}>
                            <div className={styles.goldLine}></div>
                            <h2 className={styles.missionTitle}>
                                We don't "sell loan products." We structure capital intelligently.
                            </h2>
                            <div className={styles.missionText}>
                                <p>
                                    At Model Mortgage, we operate at the intersection of conventional lending, jumbo financing, and investor-focused acquisition strategy. Our approach is rooted in precision analysis and strategic positioning.
                                </p>
                                <p>
                                    Every file is analyzed through risk layering review, cash-flow positioning, equity preservation strategy, and long-term hold modeling. We serve clients who value clarity, speed, and institutional precision.
                                </p>
                                <p>
                                    Based in Spring, Texas, we serve the Greater Houston metropolitan area with a focus on high-net-worth lending and complex income structuring for self-employed borrowers, real estate investors, and multi-entity clients.
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className={styles.approachSection}>
                            <h3 className={styles.approachTitle}>Our Approach</h3>
                            <div className={styles.approachList}>
                                <div className={styles.approachItem}>
                                    <div className={styles.approachNumber}>01</div>
                                    <div className={styles.approachContent}>
                                        <h4 className={styles.approachItemTitle}>Strategic Analysis</h4>
                                        <p className={styles.approachItemText}>
                                            Comprehensive evaluation of your financial profile, debt-to-income positioning, and liquidity to determine optimal loan structure.
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.approachItem}>
                                    <div className={styles.approachNumber}>02</div>
                                    <div className={styles.approachContent}>
                                        <h4 className={styles.approachItemTitle}>Precision Execution</h4>
                                        <p className={styles.approachItemText}>
                                            Clean underwriting positioning with accurate documentation and timeline management for predictable closings.
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.approachItem}>
                                    <div className={styles.approachNumber}>03</div>
                                    <div className={styles.approachContent}>
                                        <h4 className={styles.approachItemTitle}>Long-Term Partnership</h4>
                                        <p className={styles.approachItemText}>
                                            Ongoing support for refinancing, portfolio expansion, and equity optimization as your financial situation evolves.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expertise Section */}
                <section className={styles.expertiseSection}>
                    <div className={styles.expertiseContainer}>
                        <h2 className={styles.expertiseTitle}>Areas of Expertise</h2>
                        <div className={styles.expertiseGrid}>
                            <div className={styles.expertiseCard}>
                                <h3 className={styles.expertiseCardTitle}>Conventional & Agency Lending</h3>
                                <p className={styles.expertiseCardText}>
                                    Conforming loans with competitive rates and flexible terms for primary residences and second homes.
                                </p>
                            </div>
                            <div className={styles.expertiseCard}>
                                <h3 className={styles.expertiseCardTitle}>Jumbo & High-Balance Financing</h3>
                                <p className={styles.expertiseCardText}>
                                    Specialized structures for luxury properties and high-value acquisitions above conforming limits.
                                </p>
                            </div>
                            <div className={styles.expertiseCard}>
                                <h3 className={styles.expertiseCardTitle}>Investment Property Strategy</h3>
                                <p className={styles.expertiseCardText}>
                                    DSCR loans, portfolio financing, and acquisition strategies for real estate investors.
                                </p>
                            </div>
                            <div className={styles.expertiseCard}>
                                <h3 className={styles.expertiseCardTitle}>Complex Income Structuring</h3>
                                <p className={styles.expertiseCardText}>
                                    Self-employed, asset-based, and multi-entity income analysis for non-traditional borrowers.
                                </p>
                            </div>
                            <div className={styles.expertiseCard}>
                                <h3 className={styles.expertiseCardTitle}>Credit Repositioning</h3>
                                <p className={styles.expertiseCardText}>
                                    Strategic guidance for credit optimization and scenario planning to improve approval odds.
                                </p>
                            </div>
                            <div className={styles.expertiseCard}>
                                <h3 className={styles.expertiseCardTitle}>VA & Government Programs</h3>
                                <p className={styles.expertiseCardText}>
                                    Specialized support for military members and veterans with VA loan benefits.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <span className={styles.ctaLabel}>Get Started</span>
                        <h2 className={styles.ctaTitle}>Ready to Structure Your Next Acquisition?</h2>
                        <p className={styles.ctaSubtitle}>
                            Contact our team to discuss your financing needs and explore strategic mortgage solutions.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/contact" className={styles.primaryButton}>
                                Contact Our Team
                            </Link>
                            <Link href="/pre-qualify" className={styles.secondaryButton}>
                                Get Pre-Qualified
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
