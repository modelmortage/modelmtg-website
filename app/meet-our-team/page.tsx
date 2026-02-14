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
                        <h1 className={styles.heroTitle}>The Advisory Team</h1>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Left Side: Mission Statement */}
                    <div className={styles.missionSection}>
                        <div className={styles.missionContent}>
                            <div className={styles.goldLine}></div>
                            <h2 className={styles.missionTitle}>
                                Guided by a commitment to financial leadership, our advisory collective navigates the complexities of the modern mortgage landscape with surgical precision.
                            </h2>
                            <p className={styles.missionText}>
                                Based in Houston, Model Mortgage serves as the institutional benchmark for high-net-worth lending. We don't just facilitate transactions; we architect legacy-driven capital solutions.
                            </p>
                            <div className={styles.missionCta}>
                                <Link href="/contact" className={styles.ctaLink}>
                                    <span>View Firm Credentials</span>
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
                            <div className={styles.headerProfile}>Professional Profile</div>
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
                                    Leading Model Mortgage with a commitment to excellence and personalized service. Specializing in navigating complex financing solutions for Houston homebuyers and investors with institutional precision.
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
                                    Bringing dedication and expertise to every client interaction. Specializing in guiding clients through the mortgage process with clarity and precision, ensuring exceptional service at every step.
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
