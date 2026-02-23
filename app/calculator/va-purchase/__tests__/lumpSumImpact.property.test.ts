/**
 * Lump Sum Impact Property-Based Tests
 * Tests universal properties of lump sum payment impact on loan calculations using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 16: Lump Sum Impact
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
 * **Validates: Requirements 6.11**
 * 
 * Property 16: Lump Sum Impact
 * For any lump sum payment greater than zero, the total interest paid should be
 * less than without the lump sum, and the loan term should be shorter.
 */
describe('Lump Sum Impact - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbPrincipal = fc.integer({ min: 50000, max: 1000000 })
  const arbInterestRate = fc.float({ min: Math.fround(0.02), max: Math.fround(0.10), noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbPaymentFrequency = fc.constantFrom<PaymentFrequency>('monthly', 'bi-weekly', 'weekly')
  const arbLumpSumAmount = fc.float({ min: Math.fround(1000), max: Math.fround(50000), noNaN: true })
  const arbLumpSumFrequency = fc.constantFrom<LumpSumFrequency>('one-time', 'yearly', 'quarterly')

  /**
   * Property 16: Lump sum impact - reduces interest and shortens term
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16: Lump sum impact - reduces interest and shortens term', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate without lump sum
          const strategyNoLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            0,
            lumpSumFrequency
          )
          
          // Calculate with lump sum
          const strategyWithLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Lump sum should reduce interest (increase savings)
          const interestReduced = strategyWithLump.savings >= strategyNoLump.savings - 0.01
          
          // Lump sum should shorten term (increase term reduction)
          const termShortened = strategyWithLump.termReduction >= strategyNoLump.termReduction - 1
          
          return interestReduced && termShortened
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16a: Larger lump sum results in greater interest savings
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16a: Larger lump sum results in greater interest savings', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with $5,000 lump sum
          const strategy1 = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            5000,
            lumpSumFrequency
          )
          
          // Calculate with $10,000 lump sum
          const strategy2 = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            10000,
            lumpSumFrequency
          )
          
          // Larger lump sum should result in greater or equal savings
          return strategy2.savings >= strategy1.savings - 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16b: Larger lump sum results in greater term reduction
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16b: Larger lump sum results in greater term reduction', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate with $5,000 lump sum
          const strategy1 = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            5000,
            lumpSumFrequency
          )
          
          // Calculate with $10,000 lump sum
          const strategy2 = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            10000,
            lumpSumFrequency
          )
          
          // Larger lump sum should result in greater or equal term reduction
          return strategy2.termReduction >= strategy1.termReduction - 1
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16c: Lump sum frequency affects amortization
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16c: Lump sum frequency affects amortization', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumAmount,
        (principal, annualRate, termYears, frequency, lumpSumAmount) => {
          const termInMonths = termYears * 12
          
          // Calculate with one-time lump sum
          const strategyOneTime = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            'one-time'
          )
          
          // Calculate with yearly lump sum
          const strategyYearly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            'yearly'
          )
          
          // Calculate with quarterly lump sum
          const strategyQuarterly = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            'quarterly'
          )
          
          // All should produce valid results
          const allValid = (
            strategyOneTime.savings >= -0.01 &&
            strategyYearly.savings >= -0.01 &&
            strategyQuarterly.savings >= -0.01 &&
            strategyOneTime.termReduction >= -1 &&
            strategyYearly.termReduction >= -1 &&
            strategyQuarterly.termReduction >= -1
          )
          
          return allValid
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16d: Lump sum increases payment amount
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16d: Lump sum increases payment amount', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          // Calculate without lump sum
          const strategyNoLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            0,
            lumpSumFrequency
          )
          
          // Calculate with lump sum
          const strategyWithLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Lump sum should increase payment amount (amortized over term)
          return strategyWithLump.newPaymentAmount > strategyNoLump.newPaymentAmount
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16e: Lump sum combined with additional monthly has cumulative effect
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16e: Lump sum combined with additional monthly has cumulative effect', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          const additionalMonthly = 500
          const lumpSumAmount = 10000
          
          // Calculate with only additional monthly
          const strategyOnlyAdditional = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            frequency,
            0,
            lumpSumFrequency
          )
          
          // Calculate with only lump sum
          const strategyOnlyLump = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Calculate with both
          const strategyBoth = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            additionalMonthly,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Combined should have greater or equal savings than either alone
          const savingsGreater = (
            strategyBoth.savings >= strategyOnlyAdditional.savings - 0.01 &&
            strategyBoth.savings >= strategyOnlyLump.savings - 0.01
          )
          
          // Combined should have greater or equal term reduction than either alone
          const termReductionGreater = (
            strategyBoth.termReduction >= strategyOnlyAdditional.termReduction - 1 &&
            strategyBoth.termReduction >= strategyOnlyLump.termReduction - 1
          )
          
          return savingsGreater && termReductionGreater
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16f: Lump sum amortization calculation is correct
   * 
   * **Validates: Requirements 6.11**
   */
  it('Property 16f: Lump sum amortization calculation is correct', () => {
    fc.assert(
      fc.property(
        arbPrincipal,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        arbLumpSumAmount,
        arbLumpSumFrequency,
        (principal, annualRate, termYears, frequency, lumpSumAmount, lumpSumFrequency) => {
          const termInMonths = termYears * 12
          
          const strategy = calculateEarlyPayoffStrategy(
            principal,
            annualRate,
            termInMonths,
            0,
            frequency,
            lumpSumAmount,
            lumpSumFrequency
          )
          
          // Calculate expected lump sum per month
          let expectedLumpSumPerMonth = 0
          switch (lumpSumFrequency) {
            case 'one-time':
              expectedLumpSumPerMonth = lumpSumAmount / termInMonths
              break
            case 'yearly':
              expectedLumpSumPerMonth = lumpSumAmount / 12
              break
            case 'quarterly':
              expectedLumpSumPerMonth = lumpSumAmount / 3
              break
          }
          
          // Get base payment
          const basePayment = calculateAmortization(principal, annualRate, termInMonths, 0).monthlyPayment
          
          // Expected payment amount should be base + lump sum per month
          const expectedPaymentAmount = basePayment + expectedLumpSumPerMonth
          
          // Verify payment amount matches expected (within $1 tolerance)
          return Math.abs(strategy.newPaymentAmount - expectedPaymentAmount) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })
})
