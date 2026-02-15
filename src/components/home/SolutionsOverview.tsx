'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'
import styles from './SolutionsOverview.module.css'

export function SolutionsOverview() {
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [refinanceOpen, setRefinanceOpen] = useState(false)
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
      description: 'Programs designed to support new buyers entering the Houston market.',
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  }

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        <motion.header
          className={styles.headerContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h1 className={styles.title} variants={itemVariants}>
            Loan Options
          </motion.h1>
          <motion.p className={styles.description} variants={itemVariants}>
            Strategic mortgage solutions tailored for Houston homebuyers and property owners.
          </motion.p>
        </motion.header>

        {/* Purchase Programs */}
        <motion.div
          className={styles.categorySection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <button
            className={styles.accordionHeader}
            onClick={() => setPurchaseOpen(!purchaseOpen)}
            aria-expanded={purchaseOpen}
          >
            <div>
              <motion.h2 className={styles.categoryTitle} variants={itemVariants}>
                Purchase Programs
              </motion.h2>
              <motion.p className={styles.categoryDescription} variants={itemVariants}>
                Financing structured for primary residences, second homes, and investment properties across Houston.
              </motion.p>
            </div>
            <motion.div
              className={styles.accordionIcon}
              animate={{ rotate: purchaseOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown />
            </motion.div>
          </button>

          <AnimatePresence>
            {purchaseOpen && (
              <motion.div
                className={styles.loanList}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {purchasePrograms.map((program, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={program.href}
                      className={styles.loanRow}
                    >
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
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Refinance Programs */}
        <motion.div
          className={styles.categorySection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <button
            className={styles.accordionHeader}
            onClick={() => setRefinanceOpen(!refinanceOpen)}
            aria-expanded={refinanceOpen}
          >
            <div>
              <motion.h2 className={styles.categoryTitle} variants={itemVariants}>
                Refinance Programs
              </motion.h2>
              <motion.p className={styles.categoryDescription} variants={itemVariants}>
                Optimize your current mortgage structure to align with your financial goals.
              </motion.p>
            </div>
            <motion.div
              className={styles.accordionIcon}
              animate={{ rotate: refinanceOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown />
            </motion.div>
          </button>

          <AnimatePresence>
            {refinanceOpen && (
              <motion.div
                className={styles.loanList}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {refinancePrograms.map((program, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={program.href}
                      className={styles.loanRow}
                    >
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
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
