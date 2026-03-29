import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { TeamMember } from './TeamMember'

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
            <main style={{ minHeight: '100vh', background: '#f9f9f8', paddingTop: '112px', paddingBottom: '80px' }}>

                {/* Page header */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 56px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'flex-start' }}>
                        <div>
                            <span
                                style={{
                                    display: 'block',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: '#c5a059',
                                    marginBottom: '14px',
                                }}
                            >
                                Our People
                            </span>
                            <h1
                                style={{
                                    fontFamily: 'Georgia, serif',
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                    fontWeight: 400,
                                    color: '#1a1a1a',
                                    lineHeight: 1.1,
                                    margin: '0 0 20px',
                                }}
                            >
                                Meet the Team
                            </h1>
                            <div style={{ width: '2px', height: '48px', background: '#c5a059' }} />
                        </div>
                        <div style={{ paddingTop: '56px' }}>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    lineHeight: 1.8,
                                    color: '#6b6b6b',
                                    fontWeight: 300,
                                    margin: 0,
                                }}
                            >
                                Based in the heart of Houston, our team blends deep financial heritage with modern precision to guide you through every step of your homeownership journey.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team members */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    <TeamMember
                        imageSrc="/matthew-bramow.png"
                        imageAlt="Professional portrait of Matthew Bramow"
                        role="Founding Partner"
                        name="Matthew Bramow"
                        nmls="NMLS #1373388"
                        bioTitle="Strategic Loan Management"
                        bio="With over 15 years of experience in the Houston mortgage landscape, Matthew specializes in navigating complex financial profiles for high-net-worth individuals and first-time buyers alike."
                        bullets={[
                            { icon: 'check', text: 'Jumbo & Conventional Financing' },
                            { icon: 'camera', text: 'Refinancing Strategy' },
                            { icon: 'building', text: 'Houston Market Specialist' },
                        ]}
                        profileHref="/matthew-bramow"
                    />

                    <TeamMember
                        imageSrc="/matthew-bramow.png"
                        imageAlt="Professional portrait of Rolston Nicholls"
                        role="Senior Loan Officer"
                        name="Rolston Nicholls"
                        nmls="NMLS #2516810"
                        bioTitle="The Precision Architect"
                        bio="Rolston is renowned for his meticulous attention to detail and his ability to structure loans that others find impossible. His client-first approach has earned him a top-tier reputation in Texas."
                        bullets={[
                            { icon: 'check', text: 'Investment Property Portfolio' },
                            { icon: 'camera', text: 'FHA & VA Loan Expert' },
                            { icon: 'building', text: 'Rate Lock Optimization' },
                        ]}
                        profileHref="/rolston-nicholls"
                        reversed
                    />
                </section>

                {/* CTA */}
                <section style={{ maxWidth: '1100px', margin: '80px auto 0', padding: '0 40px' }}>
                    <div
                        style={{
                            background: '#f3f3f1',
                            padding: '64px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <h2
                            style={{
                                fontFamily: 'Georgia, serif',
                                fontSize: '2rem',
                                fontWeight: 400,
                                color: '#1a1a1a',
                                marginBottom: '16px',
                            }}
                        >
                            Ready to start your journey?
                        </h2>
                        <p style={{ color: '#6b6b6b', fontSize: '0.9rem', maxWidth: '560px', marginBottom: '36px', lineHeight: 1.7 }}>
                            Our team is available for one-on-one consultations to discuss your unique financial goals and property aspirations.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link
                                href="/schedule-a-call"
                                style={{
                                    background: '#c5a059',
                                    color: '#fff',
                                    padding: '12px 32px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                }}
                            >
                                Schedule Consultation
                            </Link>
                            <Link
                                href="/contact"
                                style={{
                                    background: 'transparent',
                                    color: '#c5a059',
                                    padding: '12px 32px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    border: '1px solid rgba(197,160,89,0.35)',
                                    display: 'inline-block',
                                }}
                            >
                                Call (832) 727-4128
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <style>{`
                @media (max-width: 768px) {
                    .team-member-grid {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                        direction: ltr !important;
                    }
                }
            `}</style>
        </>
    )
}
