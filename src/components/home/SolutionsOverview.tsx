'use client'

import React from 'react'
import Link from 'next/link'
import styles from './SolutionsOverview.module.css'

export function SolutionsOverview() {
  const programs = [
    {
      title: 'Conventional',
      description: 'Best suited for buyers with strong credit and stable income. Competitive rates and flexible down payment options.',
      profile: '5–20% Down • Established Credit • Primary or Secondary Homes',
      href: '/loan-options/fixed-rate-mortgage'
    },
    {
      title: 'FHA',
      description: 'Designed for buyers who benefit from lower down payment requirements and more flexible qualification standards.',
      profile: '3.5% Down • Moderate Credit • First-Time Buyers',
      href: '/loan-options/fha-home-loan'
    },
    {
      title: 'VA',
      description: 'Exclusive financing for eligible veterans, active-duty service members, and certain surviving spouses.',
      profile: '0% Down • No PMI • Government-Backed',
      href: '/loan-options/va-home-loan'
    },
    {
      title: 'Jumbo',
      description: 'Financing for higher-value properties that exceed conforming loan limits.',
      profile: 'High Loan Balances • Strong Credit • Luxury Properties',
      href: '/loan-options/jumbo-home-loan'
    },
    {
      title: 'Investment',
      description: 'Structured financing for rental properties and long-term portfolio growth.',
      profile: 'Rental Units • Multi-Property Investors • Portfolio Expansion',
      href: '/loan-options/investment-property-loans'
    },
    {
      title: 'USDA',
      description: 'Government-backed financing for eligible rural and suburban properties.',
      profile: '0% Down • Geographic Eligibility Required',
      href: '/loan-options/usda-loan'
    }
  ]

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        <header className={styles.headerContent}>
          <h1 className={styles.title}>Loan Programs</h1>
          <p className={styles.description}>
            Mortgage solutions structured for Houston buyers across a range of financial profiles and property types.
          </p>
        </header>

        <div className={styles.loanList}>
          {programs.map((program, index) => (
            <Link key={index} href={program.href} className={styles.loanRow}>
              <div className={styles.loanInfo}>
                <h2 className={styles.loanTitle}>{program.title}</h2>
                <p className={styles.loanDescription}>{program.description}</p>
                <div className={styles.loanMeta}>
                  <span className={styles.dealLabel}>Typical Profile</span>
                  <span className={styles.dealSpecs}>{program.profile}</span>
                </div>
              </div>
              <div className={styles.inquireBtn}>Explore Options →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
