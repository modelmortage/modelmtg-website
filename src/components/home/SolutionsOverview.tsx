'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import styles from './SolutionsOverview.module.css'

const purchasePrograms = [
  {
    title: 'Fixed-Rate Mortgage',
    description: 'Stable financing with consistent payments over the life of the loan.',
    profile: '15–30 Year Terms • Predictable Payments • Long-Term Ownership',
    href: '/loan-options/conventional'
  },
  {
    title: 'FHA Loan',
    description: 'Government-insured financing designed to expand access to homeownership.',
    profile: '3.5% Down • Flexible Credit Guidelines • Primary Residence',
    href: '/loan-options/fha'
  },
  {
    title: 'VA Loan',
    description: 'Exclusive financing for eligible veterans, active-duty service members, and qualifying spouses.',
    profile: '0% Down • No PMI • Competitive Rates',
    href: '/loan-options/va'
  },
  {
    title: 'USDA Loan',
    description: 'Zero-down financing for eligible rural and select suburban properties.',
    profile: '0% Down • Geographic Eligibility Required • Income Limits Apply',
    href: '/loan-options/conventional'
  },
  {
    title: 'Jumbo Loan',
    description: 'Financing for high-value properties exceeding conforming loan limits.',
    profile: 'High Loan Balances • Strong Credit Profile • Luxury Properties',
    href: '/loan-options/jumbo'
  },
  {
    title: 'First-Time Home Buyer',
    description: 'Programs designed to support new buyers entering the housing market.',
    profile: 'Down Payment Assistance Options • Flexible Qualification • Education Programs',
    href: '/loan-options/conventional'
  },
  {
    title: 'Low Down Payment Options',
    description: 'Solutions designed to minimize upfront capital requirements.',
    profile: '3–5% Down • Conventional & Government Options • Primary Residence',
    href: '/loan-options/conventional'
  },
  {
    title: 'Investment Property',
    description: 'Financing structured for rental properties and long-term portfolio growth.',
    profile: 'Single-Family to Multi-Unit • DSCR Options Available • Portfolio Expansion',
    href: '/loan-options/investment'
  }
]

const refinancePrograms = [
  {
    title: 'Rate & Term Refinance',
    description: 'Restructure your mortgage to potentially lower payments or adjust loan terms.',
    profile: 'Lower Rate Potential • Shorten or Extend Term • Primary or Secondary Homes',
    href: '/loan-options/conventional'
  },
  {
    title: 'Cash-Out Refinance',
    description: 'Access home equity to fund renovations, investments, or major expenses.',
    profile: 'Equity Conversion • Flexible Use of Funds • Competitive Loan Limits',
    href: '/loan-options/conventional'
  },
  {
    title: 'VA Loan Refinance',
    description: 'Specialized refinancing options available for existing VA borrowers.',
    profile: 'IRRRL Streamline Option • Cash-Out Available • No PMI',
    href: '/loan-options/va'
  }
]

const rowVariants = {
  hidden: { opacity: 0, y: 28, scaleY: 0.92, transformOrigin: 'top' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.55,
      delay: i * 0.09,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    }
  })
}

function LoanRow({ program, index }: { program: typeof purchasePrograms[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      <Link href={program.href} className={styles.loanRow}>
        <div className={styles.loanInfo}>
          <h3 className={styles.loanTitle}>{program.title}</h3>
          <p className={styles.loanDescription}>{program.description}</p>
          <div className={styles.loanMeta}>
            <span className={styles.dealSpecs}>
              {program.profile.split(' • ').map((spec, i, arr) => (
                <React.Fragment key={i}>
                  {spec}
                  {i < arr.length - 1 && <span style={{ color: '#c5a059' }}> • </span>}
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>
        <div className={styles.inquireBtn}>Explore Options →</div>
      </Link>
    </motion.div>
  )
}

function CategorySection({ title, description, programs }: {
  title: string
  description: string
  programs: typeof purchasePrograms
}) {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px 0px' })

  return (
    <div className={styles.categorySection}>
      <motion.div
        ref={headerRef}
        className={styles.categoryHeader}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 className={styles.categoryTitle}>{title}</h2>
        <p className={styles.categoryDescription}>{description}</p>
      </motion.div>

      <div className={styles.loanList}>
        {programs.map((program, index) => (
          <LoanRow key={index} program={program} index={index} />
        ))}
      </div>
    </div>
  )
}

export function SolutionsOverview() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px 0px' })

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        <motion.header
          ref={headerRef}
          className={styles.headerContent}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className={styles.title}>Loan Options</h1>
          <p className={styles.description}>
            Strategic mortgage solutions tailored for homebuyers, homeowners, and investors.
          </p>
        </motion.header>

        <CategorySection
          title="Purchase Programs"
          description="Financing structured for primary residences, second homes, and investment properties."
          programs={purchasePrograms}
        />

        <CategorySection
          title="Refinance Programs"
          description="Optimize your current mortgage structure to align with your financial goals."
          programs={refinancePrograms}
        />
      </div>
    </section>
  )
}
