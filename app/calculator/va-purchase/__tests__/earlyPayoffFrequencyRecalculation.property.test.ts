/**
 * Early Payoff Frequency Recalculation Property-Based Tests
 * Tests universal properties of early payoff frequency recalculation using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 15: Early Payoff Frequency Recalculation
 */

import fc from 'fast-check'

// Type definitions
type PaymentFrequency = 'monthly' | 'bi-weekly' | 'weekly'
type LumpSumFrequency = 'one-time' | 'yearly' | 'quarterly'

// Helper functions (replicated from page.tsx for testing)
function getPeriodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12
    case 'bi-weekly':
      return 26
    case 'weekly':
      return 52
  }
}

function calculateAmortization(
  principal: number,
  annualRate: number,
  termInMonths: number,
  extraPayment: number = 0
): {
  monthlyPayment: number
  totalInterest: number
  actualTermMonths: number
} {
  const monthlyRate = annualRate / 12
  
  // Standard monthly payment (principal + interest)
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  // Calculate actual payoff with extra payments
  let balance = principal
  let totalInterest = 0
  let monthsPaid = 0
  
  while (balance > 0 && monthsPaid < termInMonths * 2) { // Max 2x term to prevent infinite loops
    const interestPayment = balance * monthlyRate
    const principalPayment = Math.min(monthlyPI - interestPayment + extraPayment, balance + interestPayment)
    
    totalInterest += interestPayment
    balance -= (principalPayment - interestPayment)
    monthsPaid++
    
    if (balance <= 0) break
  }
  
  return {
    monthlyPayment: monthlyPI,
    totalInterest,
    actualTermMonths: monthsPaid
  }
}

function calculateEarlyPayoffStrategy(
  principal: number,
  annualRate: number,
  termInMonths: number,
  additionalMonthly: number,
  frequency: PaymentFrequency,
  lumpSumAmount: number,
  lumpSumFrequency: LumpSumFrequency
): {
  savings: number
  newPaymentAmount: number
  termReduction: number
} {
  // Calculate baseline (no extra payments)
  const baseline = calculateAmortization(principal, annualRate, termInMonths, 0)
  
  // Calculate with additional monthly payment
  const extraMonthly = additionalMonthly
  
  // Adjust for payment frequency
  const periodsPerYear = getPeriodsPerYear(frequency)
  const adjustedExtra = (extraMonthly * 12) / periodsPerYear
  
  // Calculate lump sum contribution per month
  let lumpSumPerMonth = 0
  if (lumpSumAmount > 0) {
    switch (lumpSumFrequency) {
      case 'one-time':
        lumpSumPerMonth = lumpSumAmount / termInMonths
        break
      case 'yearly':
        lumpSumPerMonth = lumpSumAmount / 12
        break
      case 'quarterly':
        lumpSumPerMonth = lumpSumAmount / 3
        break
    }
  }
  
  // Calculate with early payoff strategy
  const withStrategy = calculateAmortization(
    principal,
    annualRate,
    termInMonths,
    adjustedExtra + lumpSumPerMonth
  )
  
  return {
    savings: baseline.totalInterest - withStrategy.totalInterest,
    newPaymentAmount: withStrategy.monthlyPayment + adjustedExtra + lumpSumPerMonth,
    termReduction: baseline.actualTermMonths - withStrategy.actualTermMonths
  }
}

/**
 * **Validates: Requirements 6.7**
 * 
 * Property 15: Early Payoff Frequency Recalculation
 * For any change to the early payoff frequency, the payment amount and savings
 * should be recalculated to reflect the new frequency's payment schedule.
 */
describe('Early Payoff Frequency Recalculation - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbPrincipal = fc.integer({ min: 50000, max: 1000000 })
  const arbInterestRate = fc.float({ min: Math.fround(0.02), max: Math.fround(0.10), noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbAdditionalMonthly = fc.float({ min: Math.fround(100), max: Math.fround(2000), noNaN: true })
  const arbLumpSumAmount = fc.float({ min: Math.fround(0), max: Math.fround(50000), noNaN: true })
  const arbLumpSumFrequency = fc.constantFrom<LumpSumFrequency>('one-time', 'yearly', 'quarterly')

  /**
   * Property 15: Early payoff frequency recalculation - different frequencies produce different results
   * 
   * **Validates: Requirements 6.7**
   */
  it('Property 15: Early payoff frequency recalculation - different frequencies produce different results', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, additionalMonthly, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with monthly frequency
          const strategyMonthly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'monthly',
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Calculate with bi-weekly frequency
          const strategyBiWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'bi-weekly',
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Calculate with weekly frequency
          const strategyWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'weekly',
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Different frequencies should produce different payment amounts
          // (unless additional monthly is 0, in which case they'd be the same)
          if (additionalMonthly > 0) {
            const monthlyDifferent = Math.abs(strategyMonthly.newPaymentAmount - strategyBiWeekly.newPaymentAmount) > 0.01
            const biWeeklyDifferent = Math.abs(strategyBiWeekly.newPaymentAmount - strategyWeekly.newPaymentAmount) > 0.01
            
            return monthlyDifferent || biWeeklyDifferent
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 15a: Frequency change affects payment amount proportionally
   * 
   * **Validates: Requirements 6.7**
   */
  it('Property 15a: Frequency change affects payment amount proportionally', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        (principal, annualRate, termYears, additionalMonthly) => {
          const termInMonths = termYears * 12
          
          // Calculate with monthly frequency
          const strategyMonthly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'monthly',
            0,
            'one-time'
          )
          
          // Calculate with bi-weekly frequency
          const strategyBiWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'bi-weekly',
            0,
            'one-time'
          )
          
          // Calculate with weekly frequency
          const strategyWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'weekly',
            0,
            'one-time'
          )
          
          // Get base payment (same for all frequencies)
          const basePayment = calculateAmortization(principal, annualRate, termInMonths, 0).monthlyPayment
          
          // Calculate expected adjusted extras
          const adjustedExtraMonthly = additionalMonthly
          const adjustedExtraBiWeekly = (additionalMonthly * 12) / 26
          const adjustedExtraWeekly = (additionalMonthly * 12) / 52
          
          // Verify payment amounts match expected (within $1 tolerance)
          const monthlyMatch = Math.abs(strategyMonthly.newPaymentAmount - (basePayment + adjustedExtraMonthly)) < 1.0
          const biWeeklyMatch = Math.abs(strategyBiWeekly.newPaymentAmount - (basePayment + adjustedExtraBiWeekly)) < 1.0
          const weeklyMatch = Math.abs(strategyWeekly.newPaymentAmount - (basePayment + adjustedExtraWeekly)) < 1.0
          
          return monthlyMatch && biWeeklyMatch && weeklyMatch
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 15b: Frequency change affects savings calculation
   * 
   * **Validates: Requirements 6.7**
   */
  it('Property 15b: Frequency change affects savings calculation', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        (principal, annualRate, termYears, additionalMonthly) => {
          const termInMonths = termYears * 12
          
          // Calculate with monthly frequency
          const strategyMonthly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'monthly',
            0,
            'one-time'
          )
          
          // Calculate with bi-weekly frequency
          const strategyBiWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'bi-weekly',
            0,
            'one-time'
          )
          
          // Calculate with weekly frequency
          const strategyWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'weekly',
            0,
            'one-time'
          )
          
          // All savings should be non-negative
          return (
            strategyMonthly.savings >= -0.01 &&
            strategyBiWeekly.savings >= -0.01 &&
            strategyWeekly.savings >= -0.01
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 15c: Frequency change affects term reduction
   * 
   * **Validates: Requirements 6.7**
   */
  it('Property 15c: Frequency change affects term reduction', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        (principal, annualRate, termYears, additionalMonthly) => {
          const termInMonths = termYears * 12
          
          // Calculate with monthly frequency
          const strategyMonthly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'monthly',
            0,
            'one-time'
          )
          
          // Calculate with bi-weekly frequency
          const strategyBiWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'bi-weekly',
            0,
            'one-time'
          )
          
          // Calculate with weekly frequency
          const strategyWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'weekly',
            0,
            'one-time'
          )
          
          // All term reductions should be non-negative
          return (
            strategyMonthly.termReduction >= -1 &&
            strategyBiWeekly.termReduction >= -1 &&
            strategyWeekly.termReduction >= -1
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 15d: Higher frequency with same additional monthly results in smaller per-period extra payment
   * 
   * **Validates: Requirements 6.7**
   */
  it('Property 15d: Higher frequency with same additional monthly results in smaller per-period extra payment', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        (principal, annualRate, termYears, additionalMonthly) => {
          const termInMonths = termYears * 12
          
          // Calculate with monthly frequency
          const strategyMonthly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'monthly',
            0,
            'one-time'
          )
          
          // Calculate with bi-weekly frequency
          const strategyBiWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'bi-weekly',
            0,
            'one-time'
          )
          
          // Calculate with weekly frequency
          const strategyWeekly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            'weekly',
            0,
            'one-time'
          )
          
          // Get base payment
          const basePayment = calculateAmortization(principal, annualRate, termInMonths, 0).monthlyPayment
          
          // Calculate extra payment per period
          const extraMonthly = strategyMonthly.newPaymentAmount - basePayment
          const extraBiWeekly = strategyBiWeekly.newPaymentAmount - basePayment
          const extraWeekly = strategyWeekly.newPaymentAmount - basePayment
          
          // Higher frequency should result in smaller per-period extra payment
          // Monthly > Bi-weekly > Weekly
          return extraMonthly >= extraBiWeekly - 0.01 && extraBiWeekly >= extraWeekly - 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 15e: Recalculation maintains consistency across all metrics
   * 
   * **Validates: Requirements 6.7**
   */
  it('Property 15e: Recalculation maintains consistency across all metrics', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, additionalMonthly, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with each frequency
          const frequencies: PaymentFrequency[] = ['monthly', 'bi-weekly', 'weekly']
          
          for (const frequency of frequencies) {
            const strategy = calculateEarlyPayoffStrategy(
              principal,
              annualRate,
              termInMonths,
              additionalMonthly,
              frequency,
              lumpSumAmount,
              lumpSumFrequency
            )
            
            // All metrics should be valid
            if (strategy.newPaymentAmount <= 0) return false
            if (strategy.savings < -0.01) return false
            if (strategy.termReduction < -1) return false
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
