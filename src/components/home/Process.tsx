'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Process.module.css'

export function Process() {
  const steps = [
    {
      number: 1,
      title: 'Pre-Approval & Financial Review',
      description: 'We begin with a detailed review of your income, assets, credit, and goals to determine your purchasing power. A strong pre-approval positions you confidently when making an offer.'
    },
    {
      number: 2,
      title: 'Loan Options & Rate Strategy',
      description: "Once you're under contract, we structure the right loan solution for your scenario — comparing programs, terms, and rate options to align with your short- and long-term financial goals."
    },
    {
      number: 3,
      title: 'Underwriting & Documentation',
      description: 'Your file is submitted to underwriting for review. We coordinate documentation, respond to conditions, and keep you informed at every step to ensure a smooth approval process.'
    },
    {
      number: 4,
      title: 'Closing & Funding',
      description: 'We work closely with title and all parties involved to finalize documents and complete your closing efficiently — so you can move forward with confidence.'
    }
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px 0px' })

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.15,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }
    })
  }

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>A Clear, Structured Mortgage Process</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Professional guidance through every stage of your home financing journey, delivered with institutional precision.
          </p>
        </motion.div>

        {/* Step connector bar */}
        <div className={styles.connectorRow}>
          {steps.map((step, i) => (
            <div key={i} className={styles.connectorItem}>
              {/* Animated number bubble */}
              <motion.div
                className={styles.connectorBubble}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.18 }}
              >
                {step.number}
              </motion.div>

              {/* Connector line (not after last) */}
              {i < steps.length - 1 && (
                <div className={styles.connectorLine}>
                  <motion.div
                    className={styles.connectorLineFill}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{
                      duration: 0.55,
                      delay: 0.5 + i * 0.18,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Process Grid */}
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`${styles.step} ${index > 0 ? styles.stepBorder : ''}`}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <div className={styles.stepHeader}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
