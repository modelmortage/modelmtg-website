'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const reasons = [
  {
    title: 'Fast Pre-Approvals',
    description: 'Get pre-approved in as little as 24 hours with our streamlined process.',
  },
  {
    title: 'Expert Guidance',
    description: 'Matthew Bramow brings years of local Houston market expertise to every loan.',
  },
  {
    title: 'Competitive Rates',
    description: 'Access to dozens of lenders means we find the best rate for your situation.',
  },
  {
    title: 'Personalized Service',
    description: 'You work directly with your broker — no call centers, no runaround.',
  },
]

export function WhyChooseUs() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 60%, #0a1020 100%)',
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top border glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(196,160,93,0.4), transparent)',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        {/* Left — Lottie animation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DotLottieReact
            src="/Insider Home.lottie"
            loop
            autoplay
            style={{ width: '100%', maxWidth: '420px' }}
          />
        </div>

        {/* Right — Heading + reasons */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(196,160,93,0.7)',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(196,160,93,0.85)',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              Our Difference
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              color: '#f0e6d0',
              lineHeight: 1.2,
              marginBottom: '40px',
              fontFamily: 'var(--font-serif, Georgia, serif)',
            }}
          >
            Why Choose{' '}
            <em style={{ fontStyle: 'italic', color: '#c4a05d' }}>Model Mortgage</em>
          </h2>

          {/* Reason cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {reasons.map(({ title, description }) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#c4a05d',
                    flexShrink: 0,
                    marginTop: '7px',
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f0e6d0',
                      margin: '0 0 4px',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'rgba(240,230,208,0.65)',
                      margin: 0,
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle bottom border glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(196,160,93,0.4), transparent)',
        }}
      />
    </section>
  )
}
