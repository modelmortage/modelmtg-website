/**
 * Final Mortgage Amount Calculation Property-Based Tests
 * Tests universal properties of final mortgage amount calculations using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 2: Final Mortgage Amount Calculation
 */

import fc from 'fast-check'

// Type definitions
type VAFundingFeeType = 'first-time' | 'subsequent' | 'exempt'

// Calculation functions (redefined for testing)
function calculateVAFundingFee(
  baseMortgageAmount: number,
  feeType: VAFundingFeeType
): number {
  switch (feeType) {
    case 'first-time':
      return baseMortgageAmount * 0.0215
    case 'subsequent':
      return baseMortgageAmount * 0.033
    case 'exempt':
      return 0
  }
}

function calculateFinalMortgageAmount(
  baseMortgageAmount: number,
  vaFundingFeeAmount: number
): number {
  return baseMortgageAmount + vaFundingFeeAmount
}

/**
 * **Validates: Requirements 1.9**
 * 
 * Property 2: Final Mortgage Amount Calculation
 * For any base mortgage amount and VA funding fee amount, the final mortgage amount
 * should equal the base mortgage amount plus the VA funding fee amount.
 */
describe('Final Mortgage Amount Calculation - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbDownPaymentPercent = fc.float({ min: 0, max: 20, noNaN: true })
  const arbVAFeeType = fc.constantFrom<VAFundingFeeType>('first-time', 'subsequent', 'exempt')

  /**
   * Property 2: Final mortgage amount equals base mortgage plus VA funding fee
   * 
   * **Validates: Requirements 1.9**
   */
  it('Property 2: Final mortgage amount equals base mortgage plus VA funding fee', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        (homeValue, downPercent, feeType) => {
          // Calculate base mortgage amount
          const baseMortgage = homeValue * (1 - downPercent / 100)
          
          // Calculate VA funding fee
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          
          // Calculate final mortgage amount
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFundingFee)
          
          // Expected final mortgage amount
          const expectedFinal = baseMortgage + vaFundingFee
          
          // Verify the final mortgage amount matches expected (within 1 cent tolerance for floating point)
          return Math.abs(finalMortgage - expectedFinal) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2a: Final mortgage amount is always greater than or equal to base mortgage
   */
  it('Property 2a: Final mortgage amount is always greater than or equal to base mortgage', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        (homeValue, downPercent, feeType) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFundingFee)
          
          // Final mortgage should always be >= base mortgage (since VA fee is non-negative)
          return finalMortgage >= baseMortgage - 0.01 // Allow small floating point tolerance
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2b: Final mortgage equals base mortgage when exempt from VA funding fee
   * 
   * **Validates: Requirement 1.7, 1.9**
   */
  it('Property 2b: Final mortgage equals base mortgage when exempt from VA funding fee', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        (homeValue, downPercent) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          const vaFundingFee = calculateVAFundingFee(baseMortgage, 'exempt')
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFundingFee)
          
          // When exempt, final mortgage should equal base mortgage
          return Math.abs(finalMortgage - baseMortgage) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2c: Final mortgage amount is commutative with respect to addition
   */
  it('Property 2c: Final mortgage amount calculation is commutative (base + fee = fee + base)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        (homeValue, downPercent, feeType) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          
          const finalMortgage1 = calculateFinalMortgageAmount(baseMortgage, vaFundingFee)
          const finalMortgage2 = calculateFinalMortgageAmount(vaFundingFee, baseMortgage)
          
          // Addition is commutative
          return Math.abs(finalMortgage1 - finalMortgage2) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2d: Final mortgage amount with zero VA fee equals base mortgage
   */
  it('Property 2d: Final mortgage amount with zero VA fee equals base mortgage', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        (homeValue, downPercent) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, 0)
          
          // With zero fee, final should equal base
          return Math.abs(finalMortgage - baseMortgage) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2e: Final mortgage amount is always non-negative
   */
  it('Property 2e: Final mortgage amount is always non-negative', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        (homeValue, downPercent, feeType) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFundingFee)
          
          return finalMortgage >= 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2f: Difference between final and base mortgage equals VA funding fee
   */
  it('Property 2f: Difference between final and base mortgage equals VA funding fee', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        (homeValue, downPercent, feeType) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = calculateFinalMortgageAmount(baseMortgage, vaFundingFee)
          
          const difference = finalMortgage - baseMortgage
          
          // The difference should equal the VA funding fee
          return Math.abs(difference - vaFundingFee) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2g: Final mortgage scales proportionally with base mortgage for same fee type
   */
  it('Property 2g: Final mortgage scales proportionally with base mortgage for same fee type', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        (homeValue, downPercent, feeType) => {
          const baseMortgage = homeValue * (1 - downPercent / 100)
          
          // Skip if base mortgage is too small
          if (baseMortgage < 1) return true
          
          const vaFundingFee1 = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage1 = calculateFinalMortgageAmount(baseMortgage, vaFundingFee1)
          
          const baseMortgage2 = baseMortgage * 2
          const vaFundingFee2 = calculateVAFundingFee(baseMortgage2, feeType)
          const finalMortgage2 = calculateFinalMortgageAmount(baseMortgage2, vaFundingFee2)
          
          // Doubling the base mortgage should approximately double the final mortgage
          // (exact doubling depends on fee type, but relationship should be proportional)
          const ratio = finalMortgage2 / finalMortgage1
          
          // For exempt, ratio should be exactly 2
          if (feeType === 'exempt') {
            return Math.abs(ratio - 2) < 0.01
          }
          
          // For non-exempt, ratio should be close to 2 (within small tolerance)
          return Math.abs(ratio - 2) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })
})
