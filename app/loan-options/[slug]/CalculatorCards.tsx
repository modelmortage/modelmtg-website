'use client'

import { Card, Icon } from '@/components/design-system'
import { FaCalculator, FaArrowRight } from 'react-icons/fa'
import styles from './LoanOptionPage.module.css'

interface CalculatorCardsProps {
  calculators: string[]
}

// Map calculator slugs to display names and paths
const calculatorMap: Record<string, { name: string; path: string }> = {
  'affordability': { name: 'Affordability Calculator', path: '/calculator/affordability' },
  'purchase': { name: 'Purchase Calculator', path: '/calculator/purchase' },
  'refinance': { name: 'Refinance Calculator', path: '/calculator/refinance' },
  'rent-vs-buy': { name: 'Rent vs Buy Calculator', path: '/calculator/rent-vs-buy' },
  'va-purchase': { name: 'VA Purchase Calculator', path: '/calculator/va-purchase' },
  'va-refinance': { name: 'VA Refinance Calculator', path: '/calculator/va-refinance' },
  'dscr': { name: 'DSCR Investment Calculator', path: '/calculator/dscr' },
}

export default function CalculatorCards({ calculators }: CalculatorCardsProps) {
  return (
    <div className={styles.calculatorGrid}>
      {calculators.map((calcSlug) => {
        const calculator = calculatorMap[calcSlug]
        if (!calculator) return null
        return (
          <Card
            key={calcSlug}
            variant="outlined"
            padding="md"
            hoverable
            onClick={() => window.location.href = calculator.path}
            className={styles.calculatorCard}
          >
            <Icon 
              icon={FaCalculator} 
              size="lg" 
              className={styles.calculatorIcon}
            />
            <span className={styles.calculatorName}>{calculator.name}</span>
            <Icon 
              icon={FaArrowRight} 
              size="md" 
              className={styles.calculatorArrow}
            />
          </Card>
        )
      })}
    </div>
  )
}
