'use client'

import { motion } from 'framer-motion'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>A Clear, Structured Mortgage Process</h2>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>
            Professional guidance through every stage of your home financing journey, delivered with institutional precision.
          </p>
        </motion.div>

        {/* Process Grid */}
        <motion.div 
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className={`${styles.step} ${index > 0 ? styles.stepBorder : ''}`}
              variants={itemVariants}
              whileHover={{ x: 10, transition: { duration: 0.2 } }}
            >
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
