import Image from 'next/image'
import { FaLock, FaBuilding } from 'react-icons/fa'
import { siteData } from '@/src/lib/siteData'
import { homeSections } from '@/src/lib/homeSections'
import { Button } from '@/src/components/ui/Button'
import styles from './Hero.module.css'

/**
 * Hero Section - Private Client Homepage (Institutional Memo Style)
 *
 * Premium 2-column asymmetric layout:
 * - Left: Eyebrow, serif headline with italic accent, description, CTAs
 * - Right: "Institutional Memo" card with trust points
 * - Background: Houston skyline
 * - Asymmetric vertical divider between columns
 */
export function Hero() {
  const data = homeSections.hero
  const { compliance, brand } = siteData

  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Confidential': FaLock,
    'Lender': FaBuilding
  }

  return (
    <section className={styles.hero} id="hero">
      {/* Background layers */}
      <div className={styles.bgLayer}></div>

      {/* Skyline background image */}
      <div className={styles.skylineContainer}>
        <Image
          src="/skyline.jpg"
          alt="Houston Skyline at Night"
          fill
          className={styles.skylineImage}
          priority
          quality={100}
          placeholder="empty"
        />
      </div>

      {/* Gradient overlay */}
      <div className={styles.bgGradient}></div>

      <div className={styles.container}>
        {/* LEFT COLUMN - Main Content */}
        <div className={styles.leftContent}>
          {/* Eyebrow with decorative line */}
          <div className={styles.eyebrowGroup}>
            <div className={styles.eyebrowLine}></div>
            <p className={styles.eyebrow}>Trusted Mortgage Guidance in Houston</p>
          </div>

          {/* Headline with italic accent */}
          <h1 className={styles.headline}>
            {data.headline.split('\n')[0] || 'Private Mortgage'}
            <br />
            <span className={styles.headlineAccent}>Advisory</span>
            {data.headline.split('\n')[1] ? (
              <>
                <br />
                {data.headline.split('\n')[1]}
              </>
            ) : null}
          </h1>

          {/* Subheading */}
          <p className={styles.subhead}>
            {data.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaGroup}>
            <Button
              href={siteData.cta.preQualify.href}
              variant="primary"
            >
              {siteData.cta.preQualify.label}
            </Button>
            <Button
              href={siteData.cta.applyOnline.href}
              variant="secondary"
            >
              {siteData.cta.applyOnline.label}
            </Button>
          </div>
        </div>

        {/* Asymmetric Vertical Divider */}
        <div className={styles.dividerLine}></div>

        {/* RIGHT COLUMN - Institutional Memo Card */}
        <div className={styles.rightContent}>
          <div className={styles.trustPanel}>
            {/* Memo Header */}
            <div className={styles.memoHeader}>
              <span className={styles.memoLabel}>Why Choose Model Mortgage</span>
            </div>

            {/* Trust Points */}
            <div className={styles.memoContent}>
              {data.trustPoints.map((point, idx) => {
                const [title, description] = point.split('—')
                const IconComponent = Object.entries(iconMap).find(([key]) =>
                  title.toLowerCase().includes(key.toLowerCase())
                )?.[1]

                return (
                  <div key={idx} className={styles.memoItem}>
                    <div className={styles.memoIcon}>
                      {IconComponent ? <IconComponent /> : null}
                    </div>
                    <div className={styles.memoText}>
                      <h3>{title.trim()}</h3>
                      <p>{description?.trim()}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Memo Footer */}
            <div className={styles.memoFooter}>
              <div className={styles.memoFooterText}>
                <p className={styles.memoAvailability}>Experience Over Assumptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner element */}
      <div className={styles.cornerElement}></div>
    </section>
  )
}
