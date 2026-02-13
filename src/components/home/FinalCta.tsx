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

  return (
    <section className={styles.section}>
      <div className={styles.pinstripeBg}></div>
      <div className={styles.radialGlow}></div>

      <div className={styles.container}>
        <span className={styles.label}>FINAL STEP</span>

        <h2 className={styles.headline}>
          Begin the Conversation
        </h2>

        <p className={styles.subtext}>
          Request a private consultation with our Houston mortgage team to explore customized strategies for your next acquisition.
        </p>

        <div className={styles.cardGroup}>
          <Link href={cta.scheduleCall.href} className={styles.strategyBlock}>
            <span className={styles.cardLabel}>SCHEDULING</span>
            <span className={styles.cardTitle}>{cta.scheduleCall.label}</span>
            <span className={styles.cardLine}></span>
          </Link>

          <Link href={cta.applyOnline.href} className={styles.strategyBlock}>
            <span className={styles.cardLabel}>PRE-APPROVAL</span>
            <span className={styles.cardTitle}>{cta.applyOnline.label}</span>
            <span className={styles.cardLine}></span>
          </Link>
        </div>
      </div>
    </section>
  )
}
