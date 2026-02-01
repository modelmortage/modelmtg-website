'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { FaBolt, FaHandFist, FaRocket, FaLock } from 'react-icons/fa6'

export default function PreQualifyPage() {
    return (
        <>
            <Header />
            <main style={{ marginTop: '80px', minHeight: '100vh' }}>
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
                            Get <span style={{ color: 'var(--gold-main)' }}>Pre-Approved</span> in Minutes
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--ivory-white)',
                            opacity: 0.8,
                            maxWidth: '700px',
                            margin: '0 auto 2rem'
                        }}>
                            Free, fast, and won't impact your credit score. Get a personalized pre-approval letter
                            that gives you real buying power in Houston's competitive market.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ color: 'var(--gold-main)', fontSize: '0.9375rem' }}>• No Hard Credit Pull</span>
                            <span style={{ color: 'var(--gold-main)', fontSize: '0.9375rem' }}>• 5-Minute Process</span>
                            <span style={{ color: 'var(--gold-main)', fontSize: '0.9375rem' }}>• Expert Review</span>
                        </div>
                    </div>
                </section>

                {/* Pre-Qualification Form */}
                <section style={{
                    background: 'var(--ivory-white)',
                    padding: '5rem 2rem',
                    color: 'var(--midnight-black)'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{
                            background: 'white',
                            padding: '3rem',
                            borderRadius: '4px',
                            border: '2px solid rgba(200, 154, 91, 0.2)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h2 style={{
                                    fontSize: '2rem',
                                    marginBottom: '1rem',
                                    color: 'var(--midnight-black)'
                                }}>
                                    Start Your Pre-Approval
                                </h2>
                                <p style={{ fontSize: '1.0625rem', opacity: 0.7 }}>
                                    Fill out the form below and Matthew will review your application personally.
                                </p>
                            </div>

                            <form style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2rem'
                            }}>
                                {/* Personal Information */}
                                <div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        marginBottom: '1.5rem',
                                        color: 'var(--midnight-black)',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '2px solid var(--gold-main)'
                                    }}>
                                        Personal Information
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        <input type="text" placeholder="First Name *" required className="form-input" />
                                        <input type="text" placeholder="Last Name *" required className="form-input" />
                                        <input type="email" placeholder="Email *" required className="form-input" />
                                        <input type="tel" placeholder="Phone *" required className="form-input" />
                                    </div>
                                </div>

                                {/* Property Information */}
                                <div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        marginBottom: '1.5rem',
                                        color: 'var(--midnight-black)',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '2px solid var(--gold-main)'
                                    }}>
                                        Property Information
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        <select className="form-input">
                                            <option>Looking to Purchase or Refinance?</option>
                                            <option>Purchase</option>
                                            <option>Refinance</option>
                                        </select>
                                        <input type="text" placeholder="Estimated Purchase Price" className="form-input" />
                                        <input type="text" placeholder="Down Payment" className="form-input" />
                                        <select className="form-input">
                                            <option>Property Type</option>
                                            <option>Single Family</option>
                                            <option>Condo</option>
                                            <option>Townhouse</option>
                                            <option>Multi-Family</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        marginBottom: '1.5rem',
                                        color: 'var(--midnight-black)',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '2px solid var(--gold-main)'
                                    }}>
                                        Financial Information
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        <input type="text" placeholder="Annual Income" className="form-input" />
                                        <input type="text" placeholder="Monthly Debts" className="form-input" />
                                        <select className="form-input">
                                            <option>Credit Score Range</option>
                                            <option>Excellent (740+)</option>
                                            <option>Good (700-739)</option>
                                            <option>Fair (650-699)</option>
                                            <option>Building (below 650)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        padding: '1.5rem 3rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Get My Pre-Approval Letter
                                </button>

                                <p style={{
                                    fontSize: '0.875rem',
                                    opacity: 0.6,
                                    textAlign: 'center'
                                }}>
                                    By submitting, you agree to receive communication from Model Mortgage.
                                    Your information is secure and will never be shared.
                                </p>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section style={{
                    background: 'var(--midnight-black)',
                    padding: '5rem 2rem',
                    color: 'var(--ivory-white)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            textAlign: 'center',
                            marginBottom: '3rem'
                        }}>
                            Why Get Pre-Approved?
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {[
                                {
                                    icon: FaBolt,
                                    title: 'Shop with Confidence',
                                    description: 'Know exactly what you can afford before house hunting'
                                },
                                {
                                    icon: FaHandFist,
                                    title: 'Stronger Offers',
                                    description: 'Sellers take pre-approved buyers seriously'
                                },
                                {
                                    icon: FaRocket,
                                    title: 'Faster Closing',
                                    description: 'Pre-approval speeds up the entire process'
                                },
                                {
                                    icon: FaLock,
                                    title: 'Rate Lock Protection',
                                    description: 'Lock in rates before they rise'
                                }
                            ].map((benefit, i) => (
                                <div key={i} style={{
                                    background: 'var(--deep-charcoal)',
                                    padding: '2.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(200, 154, 91, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--gold-main)', display: 'flex', justifyContent: 'center' }}>
                                        <benefit.icon />
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        color: 'var(--gold-main)',
                                        marginBottom: '0.75rem'
                                    }}>
                                        {benefit.title}
                                    </h3>
                                    <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            <style jsx>{`
        .form-input {
          padding: 1rem;
          border: 2px solid rgba(200, 154, 91, 0.2);
          border-radius: 2px;
          font-size: 1rem;
          font-family: var(--font-sans);
          width: 100%;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--gold-main);
        }
      `}</style>
        </>
    )
}
