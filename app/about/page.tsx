import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'About Model Mortgage | Matthew Bramow | Houston Mortgage Broker',
    description: 'Meet Matthew Bramow, Houston\'s premier mortgage strategist. $500M+ funded, 5,000+ happy clients, and 15+ years of expertise in strategic mortgage planning.',
    keywords: 'Matthew Bramow mortgage broker, about Model Mortgage, Houston mortgage expert, best mortgage lender Houston',
}

export default function AboutPage() {
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
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--gold-main)',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '1rem'
                        }}>
                            About Us
                        </p>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '1.5rem',
                            color: 'var(--ivory-white)'
                        }}>
                            Strategic Mortgage Planning,
                            <br />
                            <span style={{ color: 'var(--gold-main)' }}>Not Just Loan Processing</span>
                        </h1>
                        <div className="gold-divider" style={{ margin: '2rem auto', maxWidth: '400px' }}></div>
                    </div>
                </section>

                {/* Story Section */}
                <section style={{
                    background: 'var(--ivory-white)',
                    padding: '5rem 2rem',
                    color: 'var(--midnight-black)'
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '4rem',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{
                                    fontSize: '2.5rem',
                                    marginBottom: '2rem',
                                    color: 'var(--midnight-black)'
                                }}>
                                    Our Story
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem'
                                }}>
                                    <p style={{ lineHeight: 1.8, fontSize: '1.0625rem' }}>
                                        Model Mortgage was founded on a simple belief: your mortgage should be a strategic financial tool,
                                        not just a means to an end. Too many borrowers focus solely on the interest rate, missing the bigger
                                        picture of wealth-building opportunities.
                                    </p>
                                    <p style={{ lineHeight: 1.8, fontSize: '1.0625rem' }}>
                                        Since 2012, we've helped over 5,000 families and investors navigate the complex world of mortgage finance.
                                        Our approach combines institutional expertise with boutique, personalized service—giving you the best of both worlds.
                                    </p>
                                    <p style={{ lineHeight: 1.8, fontSize: '1.0625rem' }}>
                                        We're not a call center. We're not a faceless online lender. We're your strategic mortgage partner in Houston,
                                        committed to your long-term financial success.
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                background: 'var(--deep-charcoal)',
                                padding: '3rem',
                                borderRadius: '4px',
                                color: 'var(--ivory-white)'
                            }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--gold-main)',
                                    marginBottom: '2rem'
                                }}>
                                    By The Numbers
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2rem'
                                }}>
                                    {[
                                        { number: '$500M+', label: 'Total Loans Funded' },
                                        { number: '5,000+', label: 'Happy Clients' },
                                        { number: '15+ Years', label: 'Industry Experience' },
                                        { number: '18 Days', label: 'Average Close Time' },
                                        { number: '5.0 ★★★★★', label: 'Google Rating' }
                                    ].map((stat, i) => (
                                        <div key={i} style={{ borderBottom: i < 4 ? '1px solid rgba(200, 154, 91, 0.1)' : 'none', paddingBottom: '1.5rem' }}>
                                            <div style={{
                                                fontSize: '2rem',
                                                fontFamily: 'var(--font-serif)',
                                                color: 'var(--gold-main)',
                                                fontWeight: 700,
                                                marginBottom: '0.5rem'
                                            }}>
                                                {stat.number}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section style={{
                    background: 'var(--midnight-black)',
                    padding: '5rem 2rem',
                    color: 'var(--ivory-white)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            textAlign: 'center',
                            marginBottom: '4rem',
                            color: 'var(--ivory-white)'
                        }}>
                            What Sets Us Apart
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '3rem'
                        }}>
                            {[
                                {
                                    title: 'Strategic Thinking',
                                    description: 'We don\'t just process loans. We analyze your entire financial picture to recommend the optimal mortgage structure for long-term wealth building.'
                                },
                                {
                                    title: 'Boutique Service',
                                    description: 'You work directly with Matthew and the core team. No handoffs, no call centers, no confusion. Just expert guidance from start to finish.'
                                },
                                {
                                    title: 'Market Intelligence',
                                    description: 'Real-time Houston market data, rate insights, and strategic timing recommendations give you a competitive edge in your home purchase.'
                                },
                                {
                                    title: 'Speed & Efficiency',
                                    description: '18-day average close time (vs. industry 45 days). We respect your time and move decisively without compromising quality.'
                                }
                            ].map((value, i) => (
                                <div key={i} style={{
                                    background: 'var(--deep-charcoal)',
                                    padding: '2.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(200, 154, 91, 0.1)'
                                }}>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--gold-main)',
                                        marginBottom: '1rem'
                                    }}>
                                        {value.title}
                                    </h3>
                                    <p style={{ lineHeight: 1.7, opacity: 0.85 }}>
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section style={{
                    background: 'var(--deep-charcoal)',
                    padding: '5rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            marginBottom: '1.5rem',
                            color: 'var(--ivory-white)'
                        }}>
                            Ready to Work Together?
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            marginBottom: '2.5rem',
                            opacity: 0.8,
                            color: 'var(--ivory-white)'
                        }}>
                            Let's build your mortgage strategy. Get pre-approved in minutes.
                        </p>
                        <Link href="/pre-qualify" className="btn btn-primary">
                            Get Pre-Approved Now
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
