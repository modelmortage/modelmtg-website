// Shared calculator layout component

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CalculatorConfig } from '@/lib/types/calculator'

interface CalculatorLayoutProps {
  config: CalculatorConfig
  children: React.ReactNode
}

export default function CalculatorLayout({ config, children }: CalculatorLayoutProps) {
  return (
    <>
      <Header />
      <main id="main-content" style={{ marginTop: '80px', minHeight: '100vh' }}>
        {/* Hero Section */}
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
              {config.icon} <span style={{ color: 'var(--gold-main)' }}>{config.title}</span>
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--ivory-white)',
              opacity: 0.8,
              maxWidth: '700px'
            }}>
              {config.description}
            </p>
          </div>
        </section>

        {/* Calculator Content */}
        <section style={{
          background: 'var(--midnight-black)',
          padding: '4rem 2rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </section>

        {/* CTA Section */}
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
