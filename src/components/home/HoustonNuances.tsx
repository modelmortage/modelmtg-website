'use client'

import styles from './HoustonNuances.module.css'
import { FaFileInvoiceDollar, FaWater, FaHome } from 'react-icons/fa'

export function HoustonNuances() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Local Insight for <span className={styles.accent}>Houston Buyers.</span>
        </h2>

        <div className={styles.grid}>
          {/* Property Taxes */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <FaFileInvoiceDollar className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>PROPERTY TAXES</h3>
            <p className={styles.cardText}>
              Texas property taxes are unique. We help you calculate true monthly costs including homestead exemptions and school district assessments.
            </p>
          </div>

          {/* Flood Zones */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <FaWater className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>FLOOD ZONES</h3>
            <p className={styles.cardText}>
              Essential guidance on FEMA maps, flood insurance requirements, and how different zones affect your lending eligibility.
            </p>
          </div>

          {/* HOA Navigation */}
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <FaHome className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>HOA NAVIGATION</h3>
            <p className={styles.cardText}>
              Understanding Houston's complex HOA landscape and how mandatory dues impact your debt-to-income ratios.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
