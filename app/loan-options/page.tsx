import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './loanOptions.module.css'

export const metadata: Metadata = {
    title: 'Loan Options | Model Mortgage Houston',
    description: 'A curated catalog of purchase and refinance structures. Built for Houston buyers, homeowners, and investors who prefer clarity, speed, and precision.',
    keywords: 'Houston home loans, mortgage options Texas, FHA loans Houston, VA loans Houston, jumbo mortgage Houston',
    openGraph: {
        title: 'Loan Options | Model Mortgage Houston',
        description: 'A curated catalog of purchase and refinance structures for Houston buyers and investors.',
        type: 'website',
    },
    alternates: {
        canonical: '/loan-options',
    },
}

const purchasePrograms = [
    {
        number: '01',
        title: 'Fixed Rate Mortgage',
        subtitle: 'Stable Payments. Long-Term Confidence.',
        tags: ['Predictable', 'Long-Term'],
        memo: 'A straightforward option for buyers who want predictable monthly payments and a plan they can stick with long term — especially for primary homes.',
        clientTarget: 'Buyers who value stability',
        specs: [
            'Fixed principal & interest payment',
            '15, 20, or 30-year terms',
            'Primary & second homes eligible',
            'Ideal for long-term ownership'
        ],
        href: '/loan-options/conventional'
    },
    {
        number: '02',
        title: 'FHA Loan',
        subtitle: 'Lower Down Payment. Flexible Approval.',
        tags: ['Low Down', 'Flexible'],
        memo: 'Designed to make homeownership more accessible, especially for buyers rebuilding credit or wanting to keep more cash in reserve.',
        clientTarget: 'First-time buyers or credit rebuilders',
        specs: [
            '3.5% down (minimum, when eligible)',
            'Flexible credit guidelines',
            'Seller concessions often allowed',
            'Primary residence only'
        ],
        href: '/loan-options/fha'
    },
    {
        number: '03',
        title: 'VA Loan',
        subtitle: '0% Down. No PMI.',
        tags: ['0% Down', 'No PMI'],
        memo: 'An exclusive benefit for eligible service members and veterans — offering strong buying power with minimal upfront cost.',
        clientTarget: 'Military & Veterans',
        specs: [
            '0% down (when eligible)',
            'No monthly mortgage insurance',
            'Fixed or adjustable options',
            'Primary residence only'
        ],
        href: '/loan-options/va'
    },
    {
        number: '04',
        title: 'USDA Loan',
        subtitle: 'Zero Down in Eligible Areas.',
        tags: ['0% Down', 'Location-Based'],
        memo: 'A great option for buyers purchasing in approved suburban or rural areas who qualify based on location and income limits.',
        clientTarget: 'Buyers outside major metro cores',
        specs: [
            '0% down (if eligible)',
            'Property must meet location guidelines',
            'Income limits may apply',
            'Primary residence only'
        ],
        href: '/loan-options/conventional'
    },
    {
        number: '05',
        title: 'Jumbo Loan',
        subtitle: 'For Higher-Value Homes.',
        tags: ['High Balance', 'Luxury'],
        memo: 'Designed for properties that exceed standard loan limits — with flexible options for buyers with strong income and assets.',
        clientTarget: 'Luxury & high-balance buyers',
        specs: [
            'Loan amounts above conforming limits',
            'Strong credit typically required',
            'Fixed & adjustable options',
            'Second homes may qualify'
        ],
        href: '/loan-options/jumbo'
    },
    {
        number: '06',
        title: 'First-Time Home Buyer',
        subtitle: 'Guided From Start to Finish.',
        tags: ['Guided', 'Support'],
        memo: 'We help new buyers understand the process, improve approval strength, and make confident offers in competitive markets.',
        clientTarget: 'First-time buyers',
        specs: [
            'Step-by-step planning',
            'Down payment assistance review',
            'Credit & debt-to-income review',
            'Offer strategy support'
        ],
        href: '/loan-options/conventional'
    },
    {
        number: '07',
        title: 'Low Down Payment Options',
        subtitle: 'Keep More Cash on Hand.',
        tags: ['3–5% Down', 'Flexible'],
        memo: 'For buyers who want to minimize upfront costs while still staying financially comfortable after closing.',
        clientTarget: 'Buyers prioritizing liquidity',
        specs: [
            '3–5% down options (program dependent)',
            'Gift funds allowed (when eligible)',
            'Seller concession strategies',
            'Reserve planning guidance'
        ],
        href: '/loan-options/conventional'
    },
    {
        number: '08',
        title: 'Investment Property',
        subtitle: 'Built for Rental Income Goals.',
        tags: ['Rental', 'Portfolio'],
        memo: 'Financing options for buyers purchasing long-term rentals, vacation properties, or building a real estate portfolio.',
        clientTarget: 'Real estate investors',
        specs: [
            'Long-term & vacation rentals',
            'Multi-property options',
            'DSCR programs available (when applicable)',
            'LLC eligibility varies by lender'
        ],
        href: '/loan-options/investment'
    }
]

const refinancePrograms = [
    {
        number: '09',
        title: 'Rate & Term Refinance',
        subtitle: 'Lower Payment or Better Timeline.',
        tags: ['Rate', 'Term'],
        memo: 'Refinance to potentially reduce your rate, remove mortgage insurance, or adjust your loan term.',
        clientTarget: 'Homeowners optimizing payments',
        specs: [
            'Potential rate reduction',
            'Shorten or extend term',
            'MI removal review',
            'Break-even calculation included'
        ],
        href: '/loan-options/conventional'
    },
    {
        number: '10',
        title: 'Cash-Out Refinance',
        subtitle: 'Turn Equity Into Opportunity.',
        tags: ['Equity', 'Liquidity'],
        memo: 'Access the equity in your home for renovations, debt consolidation, or investments.',
        clientTarget: 'Homeowners needing liquidity',
        specs: [
            'Convert equity to cash',
            'Loan-to-value limits apply',
            'Common uses: remodel, reserves, debt payoff',
            'Clear cost breakdown before you decide'
        ],
        href: '/loan-options/conventional'
    },
    {
        number: '11',
        title: 'VA Refinance (IRRRL / Cash-Out)',
        subtitle: 'Streamlined for Veterans.',
        tags: ['IRRRL', 'Veterans'],
        memo: 'Eligible VA borrowers can refinance through a simplified IRRRL option or access equity when needed.',
        clientTarget: 'VA homeowners',
        specs: [
            'IRRRL streamline (if eligible)',
            'Cash-out option available',
            'No PMI (VA structure)',
            'Faster approval process'
        ],
        href: '/loan-options/va'
    }
]

export default function LoanOptionsPage() {
    return (
        <>
            <Header />
            <div className={styles.page}>
                {/* Header Section */}
                <section className={styles.header}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            Loan <span className={styles.titleAccent}>Options</span>.
                        </h1>
                        <p className={styles.subtitle}>
                            A curated catalog of purchase and refinance structures. Built for Houston buyers, homeowners, and investors who prefer clarity, speed, and precision.
                        </p>
                    </div>
                </div>
            </section>

            {/* Column Headers */}
            <div className={styles.columnHeaders}>
                <div className={styles.colName}>Program Name</div>
                <div className={styles.colMemo}>Client Memo / Ideal Profile</div>
                <div className={styles.colSpecs}>Technical Specifications</div>
                <div className={styles.colInquire}>Inquire</div>
            </div>

            {/* Purchase Programs */}
            <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                    <span className={styles.categoryLabel}>Purchase</span>
                    <p className={styles.categoryDesc}>Acquisition structures for primary, secondary, and investment properties.</p>
                </div>
                <div className={styles.categoryBadges}>
                    <span className={styles.badge}>8 Programs</span>
                    <span className={styles.badge}>Houston Focused</span>
                </div>
            </div>

            {purchasePrograms.map((program) => (
                <div key={program.number} className={styles.programRow}>
                    <div className={styles.programName}>
                        <span className={styles.programNumber}>{program.number} / PURCHASE</span>
                        <h2 className={styles.programTitle}>{program.title}</h2>
                        <p className={styles.programSubtitle}>{program.subtitle}</p>
                        <div className={styles.programTags}>
                            {program.tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.programMemo}>
                        <p className={styles.memoText}>{program.memo}</p>
                        <div className={styles.clientTarget}>
                            <div className={styles.dot}></div>
                            <span className={styles.targetLabel}>Best Fit: {program.clientTarget}</span>
                        </div>
                    </div>

                    <div className={styles.programSpecs}>
                        {program.specs.map((spec, i) => (
                            <div key={i} className={styles.specItem}>
                                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p className={styles.specText}>{spec}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.programInquire}>
                        <Link href={program.href} className={styles.inquireBtn}>
                            <span className={styles.inquireArrow}>↗</span>
                        </Link>
                    </div>
                </div>
            ))}

            {/* Refinance Programs */}
            <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                    <span className={styles.categoryLabel}>Refinance</span>
                    <p className={styles.categoryDesc}>Restructure your mortgage to reduce cost, access equity, or improve terms.</p>
                </div>
                <div className={styles.categoryBadges}>
                    <span className={styles.badge}>3 Programs</span>
                    <span className={styles.badge}>Optimization</span>
                </div>
            </div>

            {refinancePrograms.map((program) => (
                <div key={program.number} className={styles.programRow}>
                    <div className={styles.programName}>
                        <span className={styles.programNumber}>{program.number} / REFI</span>
                        <h2 className={styles.programTitle}>{program.title}</h2>
                        <p className={styles.programSubtitle}>{program.subtitle}</p>
                        <div className={styles.programTags}>
                            {program.tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.programMemo}>
                        <p className={styles.memoText}>{program.memo}</p>
                        <div className={styles.clientTarget}>
                            <div className={styles.dot}></div>
                            <span className={styles.targetLabel}>Best Fit: {program.clientTarget}</span>
                        </div>
                    </div>

                    <div className={styles.programSpecs}>
                        {program.specs.map((spec, i) => (
                            <div key={i} className={styles.specItem}>
                                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p className={styles.specText}>{spec}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.programInquire}>
                        <Link href={program.href} className={styles.inquireBtn}>
                            <span className={styles.inquireArrow}>↗</span>
                        </Link>
                    </div>
                </div>
            ))}
            </div>
            <Footer />
        </>
    )
}
