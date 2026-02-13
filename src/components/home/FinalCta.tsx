import { siteData } from '@/src/lib/siteData'
import { homeSections } from '@/src/lib/homeSections'
import { Button } from '@/src/components/ui/Button'
import styles from './FinalCta.module.css'

/**
 * Final CTA - Last Conversion Opportunity
 *
 * Private client tone, no urgency language
 */
export function FinalCta() {
  const data = homeSections.finalCta
  const { cta } = siteData

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>{data.headline}</h2>
        <p className={styles.subhead}>
          {data.subheadline}
        </p>

        <div className={styles.ctaGroup}>
          <Button href={cta.scheduleCall.href} variant="primary">
            {cta.scheduleCall.label}
          </Button>
          <Button href={cta.applyOnline.href} variant="secondary">
            {cta.applyOnline.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
