// Shared calculator CTA component

import React from 'react'
import Link from 'next/link'

interface CalculatorCTAProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export default function CalculatorCTA({
  title = 'Ready to Get Pre-Approved?',
  description = 'Get a personalized quote based on your unique financial situation.',
  buttonText = 'Start Your Pre-Approval',
  buttonHref = 'https://2516810.my1003app.com/?time=1702581789975'
}: CalculatorCTAProps) {
  return (
    <section style={{
      background: 'var(--deep-charcoal)',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: 'var(--ivory-white)'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '1.125rem',
          opacity: 0.8,
          marginBottom: '2rem',
          color: 'var(--ivory-white)'
        }}>
          {description}
        </p>
        <Link href={buttonHref} className="btn btn-primary">
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
