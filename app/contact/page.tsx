import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Contact Us | Houston Mortgage Broker | Model Mortgage',
    description: 'Contact Matthew Bramow at Model Mortgage. Call (832) 727-4128 or email for expert mortgage guidance in Houston, TX. Fast response guaranteed.',
    keywords: 'contact mortgage broker Houston, Matthew Bramow contact, Model Mortgage phone number',
}

export default function ContactPage() {
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
                            Let's Start the Conversation
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--gold-light)',
                            opacity: 0.9,
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Ready to discuss your mortgage strategy? We're here to help.
                        </p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section style={{
                    background: 'var(--ivory-white)',
                    padding: '5rem 2rem',
                    color: 'var(--midnight-black)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '3rem',
                            marginBottom: '5rem'
                        }}>
                            <div style={{
                                background: 'white',
                                padding: '3rem',
                                borderRadius: '4px',
                                border: '2px solid rgba(200, 154, 91, 0.2)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📞</div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '1rem',
                                    color: 'var(--midnight-black)'
                                }}>
                                    Call Us
                                </h3>
                                <a href="tel:832-727-4128" style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--gold-main)',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}>
                                    (832) 727-4128
                                </a>
                                <p style={{
                                    marginTop: '1rem',
                                    fontSize: '0.9375rem',
                                    opacity: 0.7
                                }}>
                                    Mon-Fri: 8am-7pm<br />
                                    Sat: 9am-5pm
                                </p>
                            </div>

                            <div style={{
                                background: 'white',
                                padding: '3rem',
                                borderRadius: '4px',
                                border: '2px solid rgba(200, 154, 91, 0.2)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📧</div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '1rem',
                                    color: 'var(--midnight-black)'
                                }}>
                                    Email Us
                                </h3>
                                <a href="mailto:matthew@modelmortgage.com" style={{
                                    fontSize: '1.125rem',
                                    color: 'var(--gold-main)',
                                    textDecoration: 'none'
                                }}>
                                    matthew@modelmortgage.com
                                </a>
                                <p style={{
                                    marginTop: '1rem',
                                    fontSize: '0.9375rem',
                                    opacity: 0.7
                                }}>
                                    Typical response: &lt; 2 hours
                                </p>
                            </div>

                            <div style={{
                                background: 'white',
                                padding: '3rem',
                                borderRadius: '4px',
                                border: '2px solid rgba(200, 154, 91, 0.2)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📍</div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '1rem',
                                    color: 'var(--midnight-black)'
                                }}>
                                    Visit Us
                                </h3>
                                <p style={{
                                    fontSize: '1.0625rem',
                                    lineHeight: 1.6
                                }}>
                                    Houston, TX<br />
                                    (By Appointment Only)
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            background: 'white',
                            padding: '3rem',
                            borderRadius: '4px',
                            border: '2px solid rgba(200, 154, 91, 0.2)'
                        }}>
                            <h2 style={{
                                fontSize: '2rem',
                                marginBottom: '2rem',
                                textAlign: 'center',
                                color: 'var(--midnight-black)'
                            }}>
                                Send Us a Message
                            </h2>
                            <form style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1.5rem'
                                }}>
                                    <input
                                        type="text"
                                        placeholder="First Name *"
                                        required
                                        style={{
                                            padding: '1rem',
                                            border: '2px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '2px',
                                            fontSize: '1rem',
                                            fontFamily: 'var(--font-sans)'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name *"
                                        required
                                        style={{
                                            padding: '1rem',
                                            border: '2px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '2px',
                                            fontSize: '1rem',
                                            fontFamily: 'var(--font-sans)'
                                        }}
                                    />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address *"
                                    required
                                    style={{
                                        padding: '1rem',
                                        border: '2px solid rgba(200, 154, 91, 0.2)',
                                        borderRadius: '2px',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    required
                                    style={{
                                        padding: '1rem',
                                        border: '2px solid rgba(200, 154, 91, 0.2)',
                                        borderRadius: '2px',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                />
                                <select
                                    style={{
                                        padding: '1rem',
                                        border: '2px solid rgba(200, 154, 91, 0.2)',
                                        borderRadius: '2px',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-sans)',
                                        background: 'white'
                                    }}
                                >
                                    <option>I'm interested in...</option>
                                    <option>Purchase Loan</option>
                                    <option>Refinance</option>
                                    <option>Pre-Approval</option>
                                    <option>Investment Property</option>
                                    <option>General Question</option>
                                </select>
                                <textarea
                                    placeholder="Tell us about your situation..."
                                    rows={5}
                                    style={{
                                        padding: '1rem',
                                        border: '2px solid rgba(200, 154, 91, 0.2)',
                                        borderRadius: '2px',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-sans)',
                                        resize: 'vertical'
                                    }}
                                ></textarea>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        padding: '1.25rem 3rem',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
