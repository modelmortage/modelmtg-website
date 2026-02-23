/**
 * Early Payoff Payment Amount Property-Based Tests
 * Tests universal properties of early payoff payment amount calculations using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 13: Early Payoff Payment Amount
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
 * **Validates: Requirements 6.3**
 * 
 * Property 13: Early Payoff Payment Amount
 * For any early payoff strategy, the new payment amount should equal
 * the base payment plus additional monthly payment plus the amortized lump sum payment.
 */
describe('Early Payoff Payment Amount - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbPrincipal = fc.integer({ min: 50000, max: 1000000 })
  const arbInterestRate = fc.float({ min: Math.fround(0.02), max: Math.fround(0.10), noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbAdditionalMonthly = fc.float({ min: Math.fround(0), max: Math.fround(2000), noNaN: true })
  const arbPaymentFrequency = fc.constantFrom<PaymentFrequency>('monthly', 'bi-weekly', 'weekly')
  const arbLumpSumAmount = fc.float({ min: Math.fround(0), max: Math.fround(50000), noNaN: true })
  const arbLumpSumFrequency = fc.constantFrom<LumpSumFrequency>('one-time', 'yearly', 'quarterly')

  /**
   * Property 13: Early payoff payment amount - equals base payment plus additional payments
   * 
   * **Validates: Requirements 6.3**
   */
  it('Property 13: Early payoff payment amount - equals base payment plus additional payments', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        arbPaymentFrequency,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, additionalMonthly, frequency, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate early payoff strategy
          const strategy = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Calculate expected payment amount
          const basePayment = calculateAmortization(principal, annualRate, termInMonths, 0).monthlyPayment
          
          const periodsPerYear = getPeriodsPerYear(frequency)
          const adjustedExtra = (additionalMonthly * 12) / periodsPerYear
          
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
          
          const expectedPaymentAmount = basePayment + adjustedExtra + lumpSumPerMonth
          
          // Verify payment amount matches expected (within $1 tolerance)
          return Math.abs(strategy.newPaymentAmount - expectedPaymentAmount) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13a: Payment amount with no additional payments equals base payment
   * 
   * **Validates: Requirements 6.3**
   */
  it('Property 13a: Payment amount with no additional payments equals base payment', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        (principal, annualRate, termYears, frequency) => {
          const termInMonths = termYears * 12
          
          const strategy = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0, // No additional monthly
            frequency,
            0, // No lump sum
            'one-time'
          )
          
          const basePayment = calculateAmortization(principal, annualRate, termInMonths, 0).monthlyPayment
          
          // With no extra payments, new payment should equal base payment (within $1 tolerance)
          return Math.abs(strategy.newPaymentAmount - basePayment) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13b: Payment amount increases with additional monthly payment
   * 
   * **Validates: Requirements 6.3**
   */
  it('Property 13b: Payment amount increases with additional monthly payment', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        (principal, annualRate, termYears, frequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with no additional payment
          const strategyNoExtra = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            0,
            'one-time'
          )
          
          // Calculate with $500 additional monthly
          const strategyWithExtra = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            500,
            frequency,
            0,
            'one-time'
          )
          
          // Payment amount should increase with additional payment
          return strategyWithExtra.newPaymentAmount > strategyNoExtra.newPaymentAmount
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13c: Payment amount increases with lump sum payment
   * 
   * **Validates: Requirements 6.3**
   */
  it('Property 13c: Payment amount increases with lump sum payment', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with no lump sum
          const strategyNoLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            0,
            lumpSumFrequency
          )
          
          // Calculate with $10,000 lump sum
          const strategyWithLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            10000,
            lumpSumFrequency
          )
          
          // Payment amount should increase with lump sum
          return strategyWithLump.newPaymentAmount > strategyNoLump.newPaymentAmount
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13d: Payment amount is always positive
   * 
   * **Validates: Requirements 6.3**
   */
  it('Property 13d: Payment amount is always positive', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbAdditionalMonthly,
        arbPaymentFrequency,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, additionalMonthly, frequency, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          const strategy = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Payment amount should always be positive
          return strategy.newPaymentAmount > 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13e: Payment frequency affects additional payment adjustment
   * 
   * **Validates: Requirements 6.3**
   */
  it('Property 13e: Payment frequency affects additional payment adjustment', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        (principal, annualRate, termYears) => {
          const termInMonths = termYears * 12
          const additionalMonthly = 600 // $600 additional monthly
          
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
          
          // Base payment should be the same
          const basePayment = calculateAmortization(principal, annualRate, termInMonths, 0).monthlyPayment
          
          // Monthly: base + 600
          const expectedMonthly = basePayment + 600
          
          // Bi-weekly: base + (600 * 12 / 26)
          const expectedBiWeekly = basePayment + (600 * 12 / 26)
          
          // Weekly: base + (600 * 12 / 52)
          const expectedWeekly = basePayment + (600 * 12 / 52)
          
          // Verify each frequency produces the expected payment amount (within $1 tolerance)
          return (
            Math.abs(strategyMonthly.newPaymentAmount - expectedMonthly) < 1.0 &&
            Math.abs(strategyBiWeekly.newPaymentAmount - expectedBiWeekly) < 1.0 &&
            Math.abs(strategyWeekly.newPaymentAmount - expectedWeekly) < 1.0
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})
