'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PurchaseCalculator() {
    const [homePrice, setHomePrice] = useState('')
    const [downPayment, setDownPayment] = useState('')
    const [interestRate, setInterestRate] = useState('7.0')
    const [loanTerm, setLoanTerm] = useState('30')
    const [propertyTax, setPropertyTax] = useState('1.2')
    const [insurance, setInsurance] = useState('1200')
    const [hoa, setHoa] = useState('0')
    const [result, setResult] = useState<any>(null)

    const calculate = () => {
        const price = parseFloat(homePrice)
        const down = parseFloat(downPayment)
        const rate = parseFloat(interestRate) / 100 / 12
        const term = parseInt(loanTerm) * 12
        const loanAmount = price - down

        // Monthly P&I
        const monthlyPI = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
        
        // Property tax monthly
        const taxRate = parseFloat(propertyTax) / 100
        const monthlyTax = (price * taxRate) / 12
        
        // Insurance monthly
        const monthlyInsurance = parseFloat(insurance) / 12
        
        // HOA
        const monthlyHoa = parseFloat(hoa)
        
        // PMI (if down payment < 20%)
        const downPercent = (down / price) * 100
        const monthlyPMI = downPercent < 20 ? (loanAmount * 0.005) / 12 : 0
        
        const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPMI

        setResult({
            monthlyPI,
            monthlyTax,
            monthlyInsurance,
            monthlyHoa,
            monthlyPMI,
            totalMonthly,
            loanAmount,
            downPercent
        })
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
                            🏠 <span style={{ color: 'var(--gold-main)' }}>Purchase Calculator</span>
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--ivory-white)',
                            opacity: 0.8,
                            maxWidth: '700px'
                        }}>
                            Estimate your monthly mortgage payment including principal, interest, taxes, insurance, and HOA fees.
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
                            <div style={{
                                background: 'var(--deep-charcoal)',
                                padding: '2.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(200, 154, 91, 0.1)'
                            }}>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--ivory-white)' }}>Loan Details</h3>
                                
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Home Price
                                    </label>
                                    <input
                                        type="number"
                                        value={homePrice}
                                        onChange={(e) => setHomePrice(e.target.value)}
                                        placeholder="350000"
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
                                        placeholder="70000"
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

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Loan Term (years)
                                    </label>
                                    <select
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            background: 'var(--midnight-black)',
                                            border: '1px solid rgba(200, 154, 91, 0.2)',
                                            borderRadius: '4px',
                                            color: 'var(--ivory-white)',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <option value="15">15 years</option>
                                        <option value="30">30 years</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--ivory-white)' }}>
                                        Property Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={propertyTax}
                                        onChange={(e) => setPropertyTax(e.target.value)}
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
                                        Annual Insurance
                                    </label>
                                    <input
                                        type="number"
                                        value={insurance}
                                        onChange={(e) => setInsurance(e.target.value)}
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
                                        Monthly HOA Fees
                                    </label>
                                    <input
                                        type="number"
                                        value={hoa}
                                        onChange={(e) => setHoa(e.target.value)}
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
                                    onClick={calculate}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Calculate Payment
                                </button>
                            </div>

                            <div style={{
                                background: 'var(--deep-charcoal)',
                                padding: '2.5rem',
                                borderRadius: '4px',
                                border: '1px solid rgba(200, 154, 91, 0.1)'
                            }}>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--ivory-white)' }}>Monthly Payment</h3>
                                
                                {result ? (
                                    <>
                                        <div style={{
                                            background: 'var(--midnight-black)',
                                            padding: '2rem',
                                            borderRadius: '4px',
                                            marginBottom: '2rem',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                                                Total Monthly Payment
                                            </p>
                                            <p style={{
                                                fontSize: '2.5rem',
                                                color: 'var(--gold-main)',
                                                fontWeight: 'bold',
                                                margin: 0
                                            }}>
                                                ${result.totalMonthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <span style={{ opacity: 0.8 }}>Principal & Interest</span>
                                                <span style={{ fontWeight: 600 }}>${result.monthlyPI.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <span style={{ opacity: 0.8 }}>Property Tax</span>
                                                <span style={{ fontWeight: 600 }}>${result.monthlyTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <span style={{ opacity: 0.8 }}>Insurance</span>
                                                <span style={{ fontWeight: 600 }}>${result.monthlyInsurance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                            {result.monthlyHoa > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                    <span style={{ opacity: 0.8 }}>HOA Fees</span>
                                                    <span style={{ fontWeight: 600 }}>${result.monthlyHoa.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                                                </div>
                                            )}
                                            {result.monthlyPMI > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                    <span style={{ opacity: 0.8 }}>PMI</span>
                                                    <span style={{ fontWeight: 600 }}>${result.monthlyPMI.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{
                                            padding: '1.5rem',
                                            background: 'rgba(200, 154, 91, 0.1)',
                                            borderRadius: '4px',
                                            borderLeft: '3px solid var(--gold-main)'
                                        }}>
                                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                                <strong>Loan Amount:</strong> ${result.loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                                <strong>Down Payment:</strong> {result.downPercent.toFixed(1)}%
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
                                        Enter loan details and click Calculate
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

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
