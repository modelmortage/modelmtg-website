import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import styles from './pre-qualify.module.css'

export const metadata: Metadata = {
    title: 'Pre-Qualification | Model Mortgage Houston',
    description: 'Become more attractive to sellers with a pre-qualification. In the competitive Houston landscape, institutional readiness is the differentiator.',
    keywords: 'mortgage pre-qualification, Houston pre-approval, home loan pre-qualification, mortgage readiness',
    openGraph: {
        title: 'Pre-Qualification | Model Mortgage Houston',
        description: 'Become more attractive to sellers with a pre-qualification.',
        type: 'website',
    },
    alternates: {
        canonical: '/pre-qualify',
    },
}

export default function PreQualifyPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContainer}>
                        <div className={styles.labelContainer}>
                            <span className={styles.labelLine}></span>
                            <span className={styles.heroLabel}>Strategic Advantage</span>
                        </div>
                        <h1 className={styles.heroTitle}>
                            Become More <span className={styles.heroTitleAccent}>Attractive</span> to Sellers with a Pre-Qualification
                        </h1>
                        <p className={styles.heroSubtitle}>
                            In the competitive Houston landscape, institutional readiness is the differentiator between a submitted offer and a secured asset.
                        </p>
                    </div>
                </section>

                {/* Split Editorial Content */}
                <section className={styles.contentSection}>
                    <div className={styles.contentGrid}>
                        {/* Left: Strategy Memo */}
                        <div className={styles.strategyMemo}>
                            <h2 className={styles.memoTitle}>Market Execution Strategy</h2>
                            <div className={styles.memoContent}>
                                <p>
                                    Pre-qualification serves as the foundational validation of your purchasing power. By establishing your creditworthiness before engaging in the search process, you position yourself as a serious contender in high-stakes negotiations.
                                </p>
                                <div className={styles.memoSection}>
                                    <h3 className={styles.sectionTitle}>
                                        <span className={styles.sectionLine}></span>
                                        Learn More
                                    </h3>
                                    <p>
                                        Understanding the nuances of your financial profile allows for a more agile response to market opportunities. We analyze your debt-to-income ratio and liquidity to provide a comprehensive outlook on your acquisition capacity.
                                    </p>
                                </div>
                                <div className={styles.memoSection}>
                                    <h3 className={styles.sectionTitle}>
                                        <span className={styles.sectionLine}></span>
                                        Narrow Your Search
                                    </h3>
                                    <p>
                                        Targeted acquisitions require precision. Pre-qualification defines the boundaries of your search, ensuring that resources are allocated only toward properties that align with your institutional financing capabilities.
                                    </p>
                                </div>
                            </div>
                            <div className={styles.memoActions}>
                                <a
                                    href="https://2516810.my1003app.com/?time=1702581789975"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.primaryButton}
                                >
                                    Initiate Pre-Qualification
                                </a>
                                <Link href="/contact" className={styles.secondaryButton}>
                                    Contact Our Team
                                </Link>
                            </div>
                        </div>

                        {/* Right: Credit Evaluation Card */}
                        <div className={styles.sidebarContainer}>
                            <div className={styles.creditCard}>
                                <div className={styles.cardCornerTopRight}></div>
                                <div className={styles.cardCornerBottomLeft}></div>

                                <div className={styles.cardHeader}>
                                    <span className={styles.cardLabel}>Risk Assessment</span>
                                    <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                <h3 className={styles.cardTitle}>Credit Evaluation</h3>

                                <div className={styles.scoreDisplay}>
                                    <div className={styles.scoreNumber}>
                                        640<span className={styles.scorePlus}>+</span>
                                    </div>
                                    <div className={styles.scoreLabel}>Minimum Recommended Score</div>
                                </div>

                                <div className={styles.cardDescription}>
                                    <p>
                                        A score of 640 or higher is the benchmark for institutional reliability. This metric ensures that your financial history reflects the stability required for elite mortgage structures.
                                    </p>
                                    <p>
                                        Reliability is the cornerstone of our lending philosophy. We prioritize clients who demonstrate consistent fiscal responsibility and a clear trajectory of asset management.
                                    </p>
                                </div>

                                <div className={styles.externalResources}>
                                    <span className={styles.resourcesLabel}>External Resources</span>
                                    <div className={styles.resourcesGrid}>
                                        <a
                                            href="https://www.freecreditreport.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.resourceLink}
                                        >
                                            <span>FreeCreditReport</span>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://www.creditkarma.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.resourceLink}
                                        >
                                            <span>Credit Karma</span>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
