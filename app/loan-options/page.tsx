import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Houston Home Loans & Mortgage Options | Model Mortgage',
    description: 'Explore mortgage loan options in Houston: Conventional, FHA, VA, Jumbo, Refinance, and Investment loans. Expert guidance from Matthew Bramow.',
    keywords: 'Houston home loans, mortgage options Texas, FHA loans Houston, VA loans Houston, jumbo mortgage Houston',
}

const loanTypes = [
    {
        title: 'Conventional Loans',
        slug: 'conventional',
        icon: '🏛️',
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
        icon: '🏠',
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
        icon: '🇺🇸',
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
        icon: '💎',
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
        icon: '🔄',
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
        icon: '📊',
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
            <main style={{ marginTop: '80px' }}>
                {/* Hero */}
                <section style={{
                    background: 'linear-gradient(135deg, var(--midnight-black), var(--deep-charcoal))',
                    padding: '6rem 2rem 4rem',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(200, 154, 91, 0.2)'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1.5rem',
                            color: 'var(--ivory-white)'
                        }}>
                            Houston <span style={{ color: 'var(--gold-main)' }}>Mortgage Options</span>
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--ivory-white)',
                            opacity: 0.8,
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Every financial situation is unique. We'll match you with the perfect loan program
                            to achieve your real estate goals.
                        </p>
                    </div>
                </section>

                {/* Loan Types Grid */}
                <section style={{
                    background: 'var(--ivory-white)',
                    padding: '5rem 2rem',
                    color: 'var(--midnight-black)'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4rem'
                        }}>
                            {loanTypes.map((loan, index) => (
                                <div
                                    key={loan.slug}
                                    style={{
                                        background: 'white',
                                        border: '2px solid rgba(200, 154, 91, 0.2)',
                                        borderRadius: '4px',
                                        padding: '3rem',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 2fr',
                                        gap: '3rem',
                                        alignItems: 'start'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{loan.icon}</div>
                                        <h2 style={{
                                            fontSize: '2rem',
                                            marginBottom: '1rem',
                                            color: 'var(--midnight-black)'
                                        }}>
                                            {loan.title}
                                        </h2>
                                        <p style={{
                                            fontSize: '1.0625rem',
                                            lineHeight: 1.7,
                                            marginBottom: '2rem',
                                            opacity: 0.8
                                        }}>
                                            {loan.description}
                                        </p>
                                        <div style={{
                                            background: 'var(--deep-charcoal)',
                                            color: 'var(--ivory-white)',
                                            padding: '1.5rem',
                                            borderRadius: '4px',
                                            marginBottom: '2rem'
                                        }}>
                                            <p style={{
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                opacity: 0.7,
                                                marginBottom: '0.75rem',
                                                color: 'var(--gold-light)'
                                            }}>
                                                Ideal For
                                            </p>
                                            <p style={{
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: 'var(--ivory-white)'
                                            }}>
                                                {loan.idealFor}
                                            </p>
                                        </div>
                                        <Link href="/pre-qualify" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                            Get Pre-Approved
                                        </Link>
                                    </div>

                                    <div>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            marginBottom: '1.5rem',
                                            color: 'var(--midnight-black)',
                                            paddingBottom: '0.75rem',
                                            borderBottom: '2px solid var(--gold-main)'
                                        }}>
                                            Key Features
                                        </h3>
                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem'
                                        }}>
                                            {loan.features.map((feature, i) => (
                                                <li key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '1rem',
                                                    fontSize: '1.0625rem',
                                                    lineHeight: 1.6
                                                }}>
                                                    <span style={{
                                                        color: 'var(--gold-main)',
                                                        fontSize: '1.25rem',
                                                        fontWeight: 700,
                                                        flexShrink: 0
                                                    }}>
                                                        ✓
                                                    </span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section style={{
                    background: 'var(--deep-charcoal)',
                    padding: '5rem 2rem',
                    textAlign: 'center',
                    color: 'var(--ivory-white)'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            Not Sure Which Loan Is Right for You?
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            marginBottom: '2.5rem',
                            opacity: 0.8
                        }}>
                            Let's discuss your situation and find the perfect financing strategy.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Link href="/pre-qualify" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                Get Pre-Approved
                            </Link>
                            <Link href="/contact" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                                Talk to Matthew
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
