'use client'

import styles from './Process.module.css'

export function Process() {
  const steps = [
    {
      number: '1.',
      title: 'Pre-Approval & Financial Review',
      description: 'We begin with a detailed review of your income, assets, credit, and goals to determine your purchasing power. A strong pre-approval positions you confidently when making an offer.'
    },
    {
      number: '2.',
      title: 'Loan Options & Rate Strategy',
      description: 'Once you\'re under contract, we structure the right loan solution for your scenario — comparing programs, terms, and rate options to align with your short- and long-term financial goals.'
    },
    {
      number: '3.',
      title: 'Underwriting & Documentation',
      description: 'Your file is submitted to underwriting for review. We coordinate documentation, respond to conditions, and keep you informed at every step to ensure a smooth approval process.'
    },
    {
      number: '4.',
      title: 'Closing & Funding',
      description: 'We work closely with title and all parties involved to finalize documents and complete your closing efficiently — so you can move forward with confidence.'
    }
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>A Clear, Structured Mortgage Process</h2>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Professional guidance through every stage of your home financing journey, delivered with institutional precision.
          </p>
        </div>

        {/* Process Grid */}
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.step} ${index > 0 ? styles.stepBorder : ''}`}
            >
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
