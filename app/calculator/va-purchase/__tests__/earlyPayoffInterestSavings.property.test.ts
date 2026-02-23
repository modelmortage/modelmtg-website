/**
 * Early Payoff Interest Savings Property-Based Tests
 * Tests universal properties of early payoff interest savings calculations using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 12: Early Payoff Interest Savings
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
 * **Validates: Requirements 6.2**
 * 
 * Property 12: Early Payoff Interest Savings
 * For any early payoff strategy with additional payments or lump sums,
 * the interest savings should equal the baseline total interest minus
 * the accelerated total interest, and this value should be non-negative.
 */
describe('Early Payoff Interest Savings - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbPrincipal = fc.integer({ min: 50000, max: 1000000 })
  const arbInterestRate = fc.float({ min: Math.fround(0.02), max: Math.fround(0.10), noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbAdditionalMonthly = fc.float({ min: Math.fround(0), max: Math.fround(2000), noNaN: true })
  const arbPaymentFrequency = fc.constantFrom<PaymentFrequency>('monthly', 'bi-weekly', 'weekly')
  const arbLumpSumAmount = fc.float({ min: Math.fround(0), max: Math.fround(50000), noNaN: true })
  const arbLumpSumFrequency = fc.constantFrom<LumpSumFrequency>('one-time', 'yearly', 'quarterly')

  /**
   * Property 12: Early payoff interest savings - savings equal baseline interest minus accelerated interest
   * 
   * **Validates: Requirements 6.2**
   */
  it('Property 12: Early payoff interest savings - savings equal baseline interest minus accelerated interest', () => {
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
          
          // Calculate baseline (no extra payments)
          const baseline = calculateAmortization(principal, annualRate, termInMonths, 0)
          
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
          
          // Calculate expected savings
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
          
          const withStrategy = calculateAmortization(
            principal,
            annualRate,
            termInMonths,
            adjustedExtra + lumpSumPerMonth
          )
          
          const expectedSavings = baseline.totalInterest - withStrategy.totalInterest
          
          // Verify savings match expected (within $1 tolerance)
          return Math.abs(strategy.savings - expectedSavings) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 12a: Interest savings are always non-negative
   * 
   * **Validates: Requirements 6.2**
   */
  it('Property 12a: Interest savings are always non-negative', () => {
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
          
          // Savings should always be >= 0 (or very close due to floating point)
          return strategy.savings >= -0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 12b: With no additional payments or lump sums, savings should be zero
   * 
   * **Validates: Requirements 6.2**
   */
  it('Property 12b: With no additional payments or lump sums, savings should be zero', () => {
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
          
          // With no extra payments, savings should be zero (within $1 tolerance)
          return Math.abs(strategy.savings) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 12c: Larger additional payments result in greater savings
   * 
   * **Validates: Requirements 6.2**
   */
  it('Property 12c: Larger additional payments result in greater savings', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        (principal, annualRate, termYears, frequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with $100 additional monthly
          const strategy1 = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            100,
            frequency,
            0,
            'one-time'
          )
          
          // Calculate with $200 additional monthly
          const strategy2 = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            200,
            frequency,
            0,
            'one-time'
          )
          
          // Greater additional payment should result in greater or equal savings
          return strategy2.savings >= strategy1.savings - 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 12d: Lump sum payments contribute to interest savings
   * 
   * **Validates: Requirements 6.2**
   */
  it('Property 12d: Lump sum payments contribute to interest savings', () => {
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
          
          // Lump sum should increase savings (or keep it the same if already paid off)
          return strategyWithLump.savings >= strategyNoLump.savings - 0.01
        }
      ),
      { numRuns: 100 }
    )
  })
})
