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
                    <p
                        style={{
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            color: '#3a3a3a',
                            fontWeight: 300,
                            margin: '0 0 24px',
                            maxWidth: '520px',
                        }}
                    >
                        Our team brings years of experience and careful guidance to every step of the process—because here, winning isn't optional.
                    </p>
                    <div style={{ width: '2px', height: '40px', background: '#c5a059' }} />
                </section>

                {/* Team members */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }} className="team-grid">
                        <TeamMember
                            imageSrc="/matthew-bramow.png"
                            imageAlt="Professional portrait of Matthew Bramow"
                            role="Founding Partner"
                            name="Matthew Bramow"
                            nmls="NMLS #1373388"
                            bioTitle="Strategic Loan Management"
                            bio="With over 15 years of experience in the Houston mortgage landscape, Matthew specializes in navigating complex financial profiles for high-net-worth individuals and first-time buyers alike."
                            bullets={[]}
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
                            bullets={[]}
                            profileHref="/rolston-nicholls"
                        />
                        <TeamMember
                            imageSrc="/matthew-bramow.png"
                            imageAlt="Professional portrait of Sarah Delgado"
                            role="Loan Officer"
                            name="Sarah Delgado"
                            nmls="NMLS #1984721"
                            bioTitle="First-Time Buyer Specialist"
                            bio="Sarah has guided hundreds of first-time buyers through the Houston market with patience and precision. She excels at simplifying the complex and making clients feel confident at every step."
                            bullets={[]}
                            profileHref="#"
                        />
                        <TeamMember
                            imageSrc="/matthew-bramow.png"
                            imageAlt="Professional portrait of James Whitfield"
                            role="Mortgage Consultant"
                            name="James Whitfield"
                            nmls="NMLS #2201456"
                            bioTitle="Jumbo & Luxury Lending"
                            bio="James brings deep expertise in jumbo loan structuring and luxury property financing. His background in private banking gives clients access to solutions beyond conventional lending."
                            bullets={[]}
                            profileHref="#"
                        />
                        <TeamMember
                            imageSrc="/matthew-bramow.png"
                            imageAlt="Professional portrait of Priya Nair"
                            role="Refinance Specialist"
                            name="Priya Nair"
                            nmls="NMLS #1756302"
                            bioTitle="Rate Optimization Expert"
                            bio="Priya specializes in refinance strategy, helping homeowners reduce their monthly obligations and build equity faster. She has saved clients millions in interest across her career."
                            bullets={[]}
                            profileHref="#"
                        />
                        <TeamMember
                            imageSrc="/matthew-bramow.png"
                            imageAlt="Professional portrait of Derek Okafor"
                            role="VA Loan Specialist"
                            name="Derek Okafor"
                            nmls="NMLS #2089134"
                            bioTitle="Serving Those Who Served"
                            bio="A veteran himself, Derek is passionate about helping fellow service members navigate VA loan benefits. He brings both personal understanding and professional expertise to every transaction."
                            bullets={[]}
                            profileHref="#"
                        />
                    </div>
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
                    .team-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    )
}
