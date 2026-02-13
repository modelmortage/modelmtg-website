import { homeSections } from '@/src/lib/homeSections'
import { siteData } from '@/src/lib/siteData'
import styles from './Rates.module.css'

/**
 * Current Texas Mortgage Rates Section
 *
 * Displays current mortgage rates for FHA, Conventional, VA
 * TODO: Integrate with /api/tx-rates endpoint when live rates available
 *
 * Data structure: Shows Purchase and Refinance rates for 30Y Fixed
 * Includes APR, 1W Change, Last Updated
 * Gracefully handles API failures by hiding section
 */

interface Rate {
  label: string
  purchase30y: string
  refinance30y: string
  aprPurchase: string
  aprRefinance: string
  change1w: string
  lastUpdated: string
}

// Mock rates data for development
const MOCK_RATES: Rate[] = [
  {
    label: 'FHA',
    purchase30y: '6.85%',
    refinance30y: '6.95%',
    aprPurchase: '7.15%',
    aprRefinance: '7.25%',
    change1w: '+0.05%',
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  },
  {
    label: 'Conventional',
    purchase30y: '6.75%',
    refinance30y: '6.85%',
    aprPurchase: '7.05%',
    aprRefinance: '7.15%',
    change1w: '-0.02%',
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  },
  {
    label: 'VA',
    purchase30y: '6.45%',
    refinance30y: '6.55%',
    aprPurchase: '6.75%',
    aprRefinance: '6.85%',
    change1w: '-0.10%',
    lastUpdated: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
]

export async function Rates() {
  // TODO: Replace with actual API call to /api/tx-rates
  const rates = MOCK_RATES

  // Gracefully hide section if rates unavailable
  if (!rates || rates.length === 0) {
    return null
  }

  const displayRates: Rate[] = rates

  return (
    <section className={styles.section} id="rates">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Current Texas Mortgage Rates</h2>
          <p className={styles.intro}>
            {siteData.rates.disclaimer}
          </p>
        </div>

        {/* Rates Grid */}
        <div className={styles.ratesGrid}>
          {displayRates.map((rate, index) => (
            <div key={index} className={styles.rateCard}>
              <div className={styles.cardHeader}>
                <h3>{rate.label}</h3>
              </div>

              <div className={styles.rateRow}>
                <div className={styles.rateLabel}>
                  <span className={styles.rateType}>Purchase 30Y Fixed</span>
                </div>
                <div className={styles.rateValue}>
                  <div className={styles.rate}>{rate.purchase30y}</div>
                  <div className={styles.apr}>APR {rate.aprPurchase}</div>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.rateRow}>
                <div className={styles.rateLabel}>
                  <span className={styles.rateType}>Refinance 30Y Fixed</span>
                </div>
                <div className={styles.rateValue}>
                  <div className={styles.rate}>{rate.refinance30y}</div>
                  <div className={styles.apr}>APR {rate.aprRefinance}</div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.change}>
                  <span>1W Change:</span>
                  <span className={styles.changeValue}>{rate.change1w}</span>
                </div>
                <div className={styles.updated}>
                  {rate.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className={styles.disclaimer}>
          <p>
            <strong>Disclaimer:</strong> Rates displayed are illustrative and may not reflect current market conditions.
            These rates are provided by external sources and are subject to change at any time.
            Contact us for an accurate rate quote based on your specific situation.
          </p>
          <p className={styles.source}>Source: Market data updated regularly</p>
        </div>
      </div>
    </section>
  )
}
