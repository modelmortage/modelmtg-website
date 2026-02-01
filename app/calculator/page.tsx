import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FaDollarSign, FaHome, FaSyncAlt, FaBalanceScale, FaFlag, FaMedal, FaChartBar } from 'react-icons/fa'
import { IconType } from 'react-icons'

export const metadata: Metadata = {
    title: 'Mortgage Calculators | Houston Home Loan Calculator | Model Mortgage',
    description: 'Free mortgage calculators for Houston buyers. Calculate affordability, monthly payments, refinance savings, and more. Expert tools by Matthew Bramow.',
    keywords: 'mortgage calculator Houston, home loan calculator Texas, mortgage payment calculator, affford ability calculator, refinance calculator',
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
        icon: FaDollarSign
    },
    {
        title: 'Purchase Calculator',
        description: 'Estimate monthly mortgage payments, taxes, insurance, and total costs.',
        slug: 'purchase',
        icon: FaHome
    },
    {
        title: 'Refinance Calculator',
        description: 'See how much you could save by refinancing your current mortgage.',
        slug: 'refinance',
        icon: FaSyncAlt
    },
    {
        title: 'Rent vs Buy',
        description: 'Compare the financial impact of renting versus buying over time.',
        slug: 'rent-vs-buy',
        icon: FaBalanceScale
    },
    {
        title: 'VA Purchase Calculator',
        description: 'Specialized calculator for VA home loans with zero down payment.',
        slug: 'va-purchase',
        icon: FaFlag
    },
    {
        title: 'VA Refinance Calculator',
        description: 'Calculate VA refinance options including cash-out and streamline.',
        slug: 'va-refinance',
        icon: FaMedal
    },
    {
        title: 'DSCR Investment Calculator',
        description: 'Calculate debt service coverage ratio for investment properties.',
        slug: 'dscr',
        icon: FaChartBar
    }
]

export default function CalculatorHub() {
    return (
        <>
            <Header />
            <main style={{ marginTop: '80px', minHeight: '100vh' }}>
                {/* Hero */}
                <section style={{
                    background: 'var(--deep-charcoal)',
                    padding: '4rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                            marginBottom: '1.5rem',
                            color: 'var(--ivory-white)'
                        }}>
                            <span style={{ color: 'var(--gold-main)' }}>Mortgage Calculators</span> for Houston Buyers
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--ivory-white)',
                            opacity: 0.8,
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Make informed decisions with our suite of professional mortgage calculators.
                            All tools are free and built by experts.
                        </p>
                    </div>
                </section>

                {/* Calculator Grid */}
                <section style={{
                    background: 'var(--midnight-black)',
                    padding: '4rem 2rem'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '2rem'
                        }}>
                            {calculators.map((calc) => (
                                <Link
                                    key={calc.slug}
                                    href={`/calculator/${calc.slug}`}
                                    style={{
                                        background: 'var(--deep-charcoal)',
                                        border: '1px solid rgba(200, 154, 91, 0.1)',
                                        borderRadius: '4px',
                                        padding: '2.5rem',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    className="card"
                                >
                                    <div style={{ fontSize: '3rem', color: 'var(--gold-main)' }}>
                                        <calc.icon />
                                    </div>
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--ivory-white)',
                                        margin: 0
                                    }}>
                                        {calc.title}
                                    </h2>
                                    <p style={{
                                        fontSize: '0.9375rem',
                                        color: 'var(--ivory-white)',
                                        opacity: 0.7,
                                        margin: 0
                                    }}>
                                        {calc.description}
                                    </p>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--gold-main)',
                                        alignSelf: 'flex-start'
                                    }}>
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={{
                    background: 'var(--deep-charcoal)',
                    padding: '4rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            color: 'var(--ivory-white)',
                            marginBottom: '1.5rem'
                        }}>
                            Ready to Get Pre-Approved?
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--ivory-white)',
                            opacity: 0.8,
                            marginBottom: '2rem'
                        }}>
                            Tools are helpful, but nothing beats personalized guidance from an expert.
                        </p>
                        <a href="https://2516810.my1003app.com/?time=1702581789975" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
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
