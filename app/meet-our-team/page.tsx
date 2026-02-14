import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import styles from './meet-our-team.module.css'

export const metadata: Metadata = {
    title: 'Meet Our Team | Model Mortgage Houston',
    description: 'Meet the elite team behind Houston\'s most prestigious institutional residential lending. Matthew Bramow and Rolston Nicholls lead Model Mortgage.',
    keywords: 'Model Mortgage team, Matthew Bramow, Rolston Nicholls, Houston mortgage brokers, mortgage team',
    openGraph: {
        title: 'Meet Our Team | Model Mortgage Houston',
        description: 'Meet the elite team behind Houston\'s most prestigious institutional residential lending.',
        type: 'website',
    },
    alternates: {
        canonical: '/meet-our-team',
    },
}

export default function MeetOurTeamPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <header className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroLabel}>Expertise</span>
                        <h1 className={styles.heroTitle}>Meet the Team</h1>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Left Side: Mission Statement */}
                    <div className={styles.missionSection}>
                        <div className={styles.missionContent}>
                            <div className={styles.goldLine}></div>
                            <h2 className={styles.missionTitle}>
                                At Model Mortgage, we specialize in precision-structured residential financing for primary residences, second homes, and investment properties across Houston and surrounding markets.
                            </h2>
                            <p className={styles.missionText}>
                                We operate at the intersection of:
                            </p>
                            <ul className={styles.missionList}>
                                <li>Conventional & Agency lending</li>
                                <li>Jumbo & high-balance financing</li>
                                <li>Investor-focused acquisition strategy</li>
                                <li>Credit repositioning & scenario optimization</li>
                                <li>Complex income structuring (self-employed, asset-based, multi-entity)</li>
                            </ul>
                            <p className={styles.missionText}>
                                We don't "sell loan products." We structure capital intelligently.
                            </p>
                            <p className={styles.missionText}>
                                Every file is analyzed through:
                            </p>
                            <ul className={styles.missionList}>
                                <li>Risk layering review</li>
                                <li>Cash-flow positioning</li>
                                <li>Equity preservation strategy</li>
                                <li>Long-term hold modeling</li>
                            </ul>
                            <p className={styles.missionText} style={{ fontStyle: 'italic', marginTop: '1.5rem' }}>
                                Houston is our focus. Strategy is our edge.
                            </p>
                            <div className={styles.missionCta}>
                                <Link href="/contact" className={styles.ctaLink}>
                                    <span>View Lending Credentials</span>
                                    <span className={styles.arrow}>→</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Vertical Team Registry */}
                    <div className={styles.registrySection}>
                        {/* Registry Header Labels */}
                        <div className={styles.registryHeader}>
                            <div className={styles.headerPortrait}>Portrait</div>
                            <div className={styles.headerDivider}></div>
                            <div className={styles.headerProfile}>Leadership</div>
                        </div>

                        {/* Profile Item 1: Matthew Bramow */}
                        <div className={styles.profileEntry}>
                            <div className={styles.profilePortrait}>
                                <div className={styles.portraitContainer}>
                                    <Image
                                        src="/matthew-bramow.png"
                                        alt="Matthew Bramow - CEO | Mortgage Broker"
                                        width={300}
                                        height={375}
                                        className={styles.portraitImage}
                                    />
                                </div>
                            </div>
                            <div className={styles.profileDivider}>
                                <div className={styles.goldHairline}></div>
                            </div>
                            <div className={styles.profileInfo}>
                                <div className={styles.profileNameRow}>
                                    <h3 className={styles.profileName}>Matthew Bramow</h3>
                                    <span className={styles.profileNmls}>NMLS #1373388</span>
                                </div>
                                <p className={styles.profileTitle}>CEO | Mortgage Broker</p>
                                <p className={styles.profileBio}>
                                    Founder of Model Mortgage, Matthew leads with a systems-first approach to residential lending. His focus is structuring efficient mortgage solutions for:
                                </p>
                                <ul className={styles.profileList}>
                                    <li>Primary homebuyers</li>
                                    <li>Move-up buyers</li>
                                    <li>Self-employed borrowers</li>
                                    <li>Real estate investors</li>
                                    <li>High-balance / jumbo clients</li>
                                </ul>
                                <p className={styles.profileBio}>
                                    Matthew specializes in:
                                </p>
                                <ul className={styles.profileList}>
                                    <li>Income analysis & scenario engineering</li>
                                    <li>Investor financing structures</li>
                                    <li>Equity optimization</li>
                                    <li>Clean underwriting positioning</li>
                                </ul>
                                <p className={styles.profileBio} style={{ fontStyle: 'italic', marginTop: '1rem' }}>
                                    Every transaction is treated as a financial decision — not a form submission.
                                </p>
                                <Link href="/matthew-bramow" className={styles.profileButton}>
                                    View Full Profile
                                </Link>
                            </div>
                        </div>

                        {/* Profile Item 2: Rolston Nicholls */}
                        <div className={styles.profileEntry}>
                            <div className={styles.profilePortrait}>
                                <div className={styles.portraitContainer}>
                                    <Image
                                        src="/rolston-nicholls.png"
                                        alt="Rolston Nicholls - Loan Officer"
                                        width={300}
                                        height={375}
                                        className={styles.portraitImage}
                                    />
                                </div>
                            </div>
                            <div className={styles.profileDivider}>
                                <div className={styles.goldHairline}></div>
                            </div>
                            <div className={styles.profileInfo}>
                                <div className={styles.profileNameRow}>
                                    <h3 className={styles.profileName}>Rolston Nicholls</h3>
                                    <span className={styles.profileNmls}>NMLS #2516810</span>
                                </div>
                                <p className={styles.profileTitle}>Loan Officer</p>
                                <p className={styles.profileBio}>
                                    Rolston works directly with clients to ensure smooth execution from consultation to closing. His approach emphasizes:
                                </p>
                                <ul className={styles.profileList}>
                                    <li>Clear communication</li>
                                    <li>Accurate pre-qualification</li>
                                    <li>Document preparation efficiency</li>
                                    <li>Process transparency</li>
                                </ul>
                                <p className={styles.profileBio}>
                                    He ensures borrowers understand:
                                </p>
                                <ul className={styles.profileList}>
                                    <li>Approval pathways</li>
                                    <li>Payment structure options</li>
                                    <li>Timeline expectations</li>
                                    <li>Risk variables</li>
                                </ul>
                                <p className={styles.profileBio} style={{ fontStyle: 'italic', marginTop: '1rem' }}>
                                    The result: controlled closings and predictable execution.
                                </p>
                                <Link href="/contact" className={styles.profileButton}>
                                    Contact Rolston
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
