'use client'

import { motion } from 'framer-motion'
import styles from './HoustonNuances.module.css'
import { FaFileInvoiceDollar, FaWater, FaHome } from 'react-icons/fa'

export function HoustonNuances() {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
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
      <div className={styles.container}>
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Local Insight for <span className={styles.accent}>Houston Buyers.</span>
        </motion.h2>

        <motion.div 
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Property Taxes */}
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className={styles.iconWrapper}>
              <FaFileInvoiceDollar className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>PROPERTY TAXES</h3>
            <p className={styles.cardText}>
              Texas property taxes are unique. We help you calculate true monthly costs including homestead exemptions and school district assessments.
            </p>
          </motion.div>

          {/* Flood Zones */}
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className={styles.iconWrapper}>
              <FaWater className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>FLOOD ZONES</h3>
            <p className={styles.cardText}>
              Essential guidance on FEMA maps, flood insurance requirements, and how different zones affect your lending eligibility.
            </p>
          </motion.div>

          {/* HOA Navigation */}
          <motion.div 
            className={styles.card}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className={styles.iconWrapper}>
              <FaHome className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>HOA NAVIGATION</h3>
            <p className={styles.cardText}>
              Understanding Houston's complex HOA landscape and how mandatory dues impact your debt-to-income ratios.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
