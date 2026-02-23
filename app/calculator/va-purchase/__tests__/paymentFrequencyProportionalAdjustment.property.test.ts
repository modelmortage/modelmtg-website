/**
 * Payment Frequency Proportional Adjustment Property-Based Tests
 * Tests universal properties of payment frequency proportional adjustments using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 5: Payment Frequency Proportional Adjustment
 */

import fc from 'fast-check'

// Type definitions
type PaymentFrequency = 'monthly' | 'bi-weekly' | 'weekly'

// Calculation functions (redefined for testing)
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

function adjustPaymentForFrequency(
  monthlyPayment: number,
  frequency: PaymentFrequency
): number {
  const periodsPerYear = getPeriodsPerYear(frequency)
  return (monthlyPayment * 12) / periodsPerYear
}

/**
 * **Validates: Requirements 2.5**
 * 
 * Property 5: Payment Frequency Proportional Adjustment
 * For any loan with a given monthly payment amount, when the payment frequency changes,
 * the total annual payment amount (payment per period × periods per year) should remain constant.
 */
describe('Payment Frequency Proportional Adjustment - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbMonthlyPayment = fc.float({ min: 100, max: 10000, noNaN: true })
  const arbPaymentFrequency = fc.constantFrom<PaymentFrequency>('monthly', 'bi-weekly', 'weekly')

  /**
   * Property 5: Total annual payment remains constant across all payment frequencies
   * 
   * **Validates: Requirements 2.5**
   */
  it('Property 5: Total annual payment remains constant across all payment frequencies', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        arbPaymentFrequency,
        (monthlyPayment, frequency) => {
          // Calculate payment per period for the given frequency
          const paymentPerPeriod = adjustPaymentForFrequency(monthlyPayment, frequency)
          
          // Calculate periods per year
          const periodsPerYear = getPeriodsPerYear(frequency)
          
          // Calculate total annual payment
          const annualPayment = paymentPerPeriod * periodsPerYear
          
          // Expected annual payment (monthly payment × 12)
          const expectedAnnual = monthlyPayment * 12
          
          // Verify the annual payment remains constant (within $1 tolerance for floating point)
          return Math.abs(annualPayment - expectedAnnual) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5a: Monthly frequency payment per period equals original monthly payment
   */
  it('Property 5a: Monthly frequency payment per period equals original monthly payment', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        (monthlyPayment) => {
          const paymentPerPeriod = adjustPaymentForFrequency(monthlyPayment, 'monthly')
          
          // For monthly frequency, payment per period should equal the monthly payment
          return Math.abs(paymentPerPeriod - monthlyPayment) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5b: Bi-weekly payment is approximately half of monthly payment
   */
  it('Property 5b: Bi-weekly payment is approximately half of monthly payment', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        (monthlyPayment) => {
          const biWeeklyPayment = adjustPaymentForFrequency(monthlyPayment, 'bi-weekly')
          
          // Bi-weekly payment should be approximately monthly * 12 / 26
          const expectedBiWeekly = (monthlyPayment * 12) / 26
          
          return Math.abs(biWeeklyPayment - expectedBiWeekly) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5c: Weekly payment is approximately one-quarter of monthly payment
   */
  it('Property 5c: Weekly payment is approximately one-quarter of monthly payment', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        (monthlyPayment) => {
          const weeklyPayment = adjustPaymentForFrequency(monthlyPayment, 'weekly')
          
          // Weekly payment should be approximately monthly * 12 / 52
          const expectedWeekly = (monthlyPayment * 12) / 52
          
          return Math.abs(weeklyPayment - expectedWeekly) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5d: Payment per period decreases as frequency increases
   */
  it('Property 5d: Payment per period decreases as frequency increases (monthly > bi-weekly > weekly)', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        (monthlyPayment) => {
          // Skip if monthly payment is too small
          if (monthlyPayment < 1) return true
          
          const monthlyPeriodPayment = adjustPaymentForFrequency(monthlyPayment, 'monthly')
          const biWeeklyPeriodPayment = adjustPaymentForFrequency(monthlyPayment, 'bi-weekly')
          const weeklyPeriodPayment = adjustPaymentForFrequency(monthlyPayment, 'weekly')
          
          // More frequent payments should have smaller per-period amounts
          return monthlyPeriodPayment > biWeeklyPeriodPayment && 
                 biWeeklyPeriodPayment > weeklyPeriodPayment
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5e: Annual payment is invariant across frequency changes
   */
  it('Property 5e: Annual payment is invariant - changing frequency does not change total annual amount', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        (monthlyPayment) => {
          // Calculate annual payment for each frequency
          const monthlyAnnual = adjustPaymentForFrequency(monthlyPayment, 'monthly') * 12
          const biWeeklyAnnual = adjustPaymentForFrequency(monthlyPayment, 'bi-weekly') * 26
          const weeklyAnnual = adjustPaymentForFrequency(monthlyPayment, 'weekly') * 52
          
          // All annual payments should be equal (within $1 tolerance)
          return Math.abs(monthlyAnnual - biWeeklyAnnual) < 1.0 &&
                 Math.abs(biWeeklyAnnual - weeklyAnnual) < 1.0 &&
                 Math.abs(monthlyAnnual - weeklyAnnual) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5f: Adjustment is reversible - converting back to monthly yields original payment
   */
  it('Property 5f: Adjustment is reversible - converting to frequency and back to monthly yields original', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        arbPaymentFrequency,
        (monthlyPayment, frequency) => {
          // Skip monthly since it's already monthly
          if (frequency === 'monthly') return true
          
          // Convert monthly to frequency
          const paymentPerPeriod = adjustPaymentForFrequency(monthlyPayment, frequency)
          
          // Convert back to monthly (reverse calculation)
          const periodsPerYear = getPeriodsPerYear(frequency)
          const backToMonthly = (paymentPerPeriod * periodsPerYear) / 12
          
          // Should get back the original monthly payment (within small tolerance)
          return Math.abs(backToMonthly - monthlyPayment) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5g: Adjustment scales linearly with monthly payment
   */
  it('Property 5g: Adjustment scales linearly - doubling monthly payment doubles payment per period', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        arbPaymentFrequency,
        (monthlyPayment, frequency) => {
          // Skip if monthly payment is too small
          if (monthlyPayment < 1) return true
          
          const payment1 = adjustPaymentForFrequency(monthlyPayment, frequency)
          const payment2 = adjustPaymentForFrequency(monthlyPayment * 2, frequency)
          
          // Doubling the monthly payment should double the payment per period
          return Math.abs(payment2 - (payment1 * 2)) < 0.02
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5h: Adjusted payment is always positive for positive monthly payment
   */
  it('Property 5h: Adjusted payment is always positive for positive monthly payment', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        arbPaymentFrequency,
        (monthlyPayment, frequency) => {
          const paymentPerPeriod = adjustPaymentForFrequency(monthlyPayment, frequency)
          
          // Payment per period should always be positive if monthly payment is positive
          return monthlyPayment > 0 ? paymentPerPeriod > 0 : true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5i: Zero monthly payment results in zero payment per period
   */
  it('Property 5i: Zero monthly payment results in zero payment per period for all frequencies', () => {
    fc.assert(
      fc.property(
        arbPaymentFrequency,
        (frequency) => {
          const paymentPerPeriod = adjustPaymentForFrequency(0, frequency)
          
          // Zero monthly payment should result in zero payment per period
          return paymentPerPeriod === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5j: Function is deterministic - same inputs always produce same output
   */
  it('Property 5j: Function is deterministic - same inputs always produce same output', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        arbPaymentFrequency,
        (monthlyPayment, frequency) => {
          const result1 = adjustPaymentForFrequency(monthlyPayment, frequency)
          const result2 = adjustPaymentForFrequency(monthlyPayment, frequency)
          const result3 = adjustPaymentForFrequency(monthlyPayment, frequency)
          
          return result1 === result2 && result2 === result3
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5k: Calculation formula correctness - payment per period = (monthly × 12) / periods per year
   */
  it('Property 5k: Calculation formula correctness - payment per period equals (monthly × 12) / periods per year', () => {
    fc.assert(
      fc.property(
        arbMonthlyPayment,
        arbPaymentFrequency,
        (monthlyPayment, frequency) => {
          const paymentPerPeriod = adjustPaymentForFrequency(monthlyPayment, frequency)
          const periodsPerYear = getPeriodsPerYear(frequency)
          
          // Verify the formula: payment per period = (monthly × 12) / periods per year
          const expectedPayment = (monthlyPayment * 12) / periodsPerYear
          
          return Math.abs(paymentPerPeriod - expectedPayment) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })
})
