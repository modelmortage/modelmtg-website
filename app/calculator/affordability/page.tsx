'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AffordabilityCalculator() {
    const [income, setIncome] = useState('')
    const [monthlyDebts, setMonthlyDebts] = useState('')
    const [downPayment, setDownPayment] = useState('')
    const [interestRate, setInterestRate] = useState('7.0')
    const [result, setResult] = useState<number | null>(null)

    const calculateAffordability = () => {
        const annualIncome = parseFloat(income)
        const debts = parseFloat(monthlyDebts)
        const rate = parseFloat(interestRate) / 100 / 12
        const down = parseFloat(downPayment)

        // DTI ratio of 43% (conservative)
        const maxMonthlyPayment = (annualIncome / 12) * 0.43 - debts
        
        // Calculate max loan amount (30-year mortgage)
        const n = 360 // 30 years * 12 months
        const maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + rate, -n)) / rate)
        
        const maxPrice = maxLoan + down
        setResult(maxPrice)
    }

    return (
        <>
            <Header />
            <main style={{ marginTop: '80px', minHeight: '100vh' }}>
                <section style={{
                    background: 'var(--deep-charcoal)',
                    padding: '3rem 2rem',
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Link href="/calculator" style={{
                            color: 'var(--gold-main)',
                            textDecoration: 'none',
                            fontSize: '0.9375rem',
                            marginBottom: '1rem',
                            display: 'inline-block'
                        }}>
                            ← Back to Calculators
                        </Link>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            marginBottom: '1rem',
                            color: 'var(--ivory-white)'
                        }}>
                            💰 <span style={{ color: 'var(--gold-main)' }}>How Much Can I Afford?</span>
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--ivory-white)',
                            opacity: 0.8,
                            maxWidth: '700px'
                        }}>
                            Calculate your maximum home purchase price based on your income, debts, and down payment.
                        </p>
                    </div>
                </section>

                <section style={{
                    background: 'var(--midnight-black)',
                    padding: '4rem 2rem'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '3rem'
                        }}>
                            {/* Calculator Form */}
                            <div style={{
                                background: 'var(--deep-charcoal)',
                                padding: '2.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(200, 154, 91, 0.1)'
                            }}>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--ivory-white)' }}>Your Information</h3>
                                
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Annual Gross Income
                                    </label>
                                    <input
                                        type="number"
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                        placeholder="80000"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            background: 'var(--midnight-black)',
                                            border: '1px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '4px',
                                            color: 'var(--ivory-white)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Monthly Debts (car, credit cards, etc.)
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyDebts}
                                        onChange={(e) => setMonthlyDebts(e.target.value)}
                                        placeholder="500"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            background: 'var(--midnight-black)',
                                            border: '1px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '4px',
                                            color: 'var(--ivory-white)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Down Payment
                                    </label>
                                    <input
                                        type="number"
                                        value={downPayment}
                                        onChange={(e) => setDownPayment(e.target.value)}
                                        placeholder="20000"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            background: 'var(--midnight-black)',
                                            border: '1px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '4px',
                                            color: 'var(--ivory-white)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Interest Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            background: 'var(--midnight-black)',
                                            border: '1px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '4px',
                                            color: 'var(--ivory-white)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={calculateAffordability}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Calculate
                                </button>
                            </div>

                            {/* Results */}
                            <div style={{
                                background: 'var(--deep-charcoal)',
                                padding: '2.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(200, 154, 91, 0.1)'
                            }}>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--ivory-white)' }}>Your Results</h3>
                                
                                {result !== null ? (
                                    <>
                                        <div style={{
                                            background: 'var(--midnight-black)',
                                            padding: '2rem',
                                            borderRadius: '4px',
                                            marginBottom: '2rem',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                                                Maximum Home Price
                                            </p>
                                            <p style={{
                                                fontSize: '2.5rem',
                                                color: 'var(--gold-main)',
                                                fontWeight: 'bold',
                                                margin: 0
                                            }}>
                                                ${result.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        
                                        <div style={{
                                            padding: '1.5rem',
                                            background: 'rgba(200, 154, 91, 0.1)',
                                            borderRadius: '4px',
                                            borderLeft: '3px solid var(--gold-main)'
                                        }}>
                                            <p style={{ fontSize: '0.9375rem', margin: 0 }}>
                                                💡 This estimate uses a 43% debt-to-income ratio and assumes a 30-year fixed mortgage. 
                                                Actual approval amounts may vary based on credit score, property taxes, and insurance costs.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
                                        Enter your information and click Calculate to see results
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section style={{
                    background: 'var(--deep-charcoal)',
                    padding: '4rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                            Ready to Get Pre-Approved?
                        </h2>
                        <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '2rem' }}>
                            Get a personalized quote based on your unique financial situation.
                        </p>
                        <Link href="/pre-qualify" className="btn btn-primary">
                            Start Your Pre-Approval
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
