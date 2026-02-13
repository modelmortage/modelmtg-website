'use client'

import { motion } from 'framer-motion'
import { siteData } from '@/src/lib/siteData'
import Link from 'next/link'
import styles from './FinalCta.module.css'

/**
 * Final CTA - Last Conversion Opportunity
 *
 * Private client tone, no urgency language
 */
export function FinalCta() {
  const { cta } = siteData

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.pinstripeBg}></div>
      <div className={styles.radialGlow}></div>

      <motion.div 
        className={styles.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.span className={styles.label} variants={itemVariants}>
          FINAL STEP
        </motion.span>

        <motion.h2 className={styles.headline} variants={itemVariants}>
          Begin the Conversation
        </motion.h2>

        <motion.p className={styles.subtext} variants={itemVariants}>
          Request a private consultation with our Houston mortgage team to explore customized strategies for your next acquisition.
        </motion.p>

        <motion.div className={styles.cardGroup} variants={itemVariants}>
          <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Link href={cta.scheduleCall.href} className={styles.strategyBlock}>
              <span className={styles.cardLabel}>SCHEDULING</span>
              <span className={styles.cardTitle}>{cta.scheduleCall.label}</span>
              <span className={styles.cardLine}></span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Link href={cta.applyOnline.href} className={styles.strategyBlock}>
              <span className={styles.cardLabel}>PRE-APPROVAL</span>
              <span className={styles.cardTitle}>{cta.applyOnline.label}</span>
              <span className={styles.cardLine}></span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
