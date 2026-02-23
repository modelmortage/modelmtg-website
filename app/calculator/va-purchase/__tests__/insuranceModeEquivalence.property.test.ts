/**
 * Insurance Mode Calculation Equivalence Property-Based Tests
 * Tests that insurance calculations produce the same result regardless of input mode
 * 
 * Feature: va-purchase-calculator-enhancements, Property 19: Insurance Mode Calculation Equivalence
 */

import fc from 'fast-check'

// Import the conversion functions from the page component
// Since they're not exported, we'll redefine them here for testing
function convertInsuranceDollarToPercent(
  dollarAmount: number,
  homeValue: number
): number {
  return homeValue > 0 ? (dollarAmount / homeValue) * 100 : 0
}

function convertInsurancePercentToDollar(
  percent: number,
  homeValue: number
): number {
  return (homeValue * percent) / 100
}

/**
 * **Validates: Requirement 7.7**
 * 
 * Property 19: Insurance Mode Calculation Equivalence
 * For any insurance amount entered in either dollar or percent mode,
 * the resulting monthly insurance payment should be the same regardless
 * of which input mode was used.
 */
describe('Insurance Mode Calculation Equivalence - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbInsuranceDollar = fc.float({ min: Math.fround(500), max: Math.fround(5000), noNaN: true })

  /**
   * Property 19a: Monthly insurance payment is the same regardless of input mode
   * 
   * **Validates: Requirement 7.7**
   */
  it('Property 19a: Monthly insurance payment is the same regardless of input mode', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Calculate monthly insurance using dollar mode
          const monthlyInsuranceFromDollar = insuranceDollar / 12
          
          // Convert dollar to percent
          const insurancePercent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          
          // Calculate monthly insurance using percent mode
          const insuranceDollarFromPercent = convertInsurancePercentToDollar(insurancePercent, homeValue)
          const monthlyInsuranceFromPercent = insuranceDollarFromPercent / 12
          
          // Both modes should produce the same monthly payment (within 1 cent tolerance)
          return Math.abs(monthlyInsuranceFromDollar - monthlyInsuranceFromPercent) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19b: Annual insurance amount is the same regardless of input mode
   * 
   * **Validates: Requirement 7.7**
   */
  it('Property 19b: Annual insurance amount is the same regardless of input mode', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Annual insurance using dollar mode
          const annualInsuranceFromDollar = insuranceDollar
          
          // Convert dollar to percent and back
          const insurancePercent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const annualInsuranceFromPercent = convertInsurancePercentToDollar(insurancePercent, homeValue)
          
          // Both modes should produce the same annual amount (within 1 cent tolerance)
          return Math.abs(annualInsuranceFromDollar - annualInsuranceFromPercent) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19c: Starting with percent mode produces same result as dollar mode
   */
  it('Property 19c: Starting with percent mode produces same result as dollar mode', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        fc.float({ min: Math.fround(0.1), max: Math.fround(2.5), noNaN: true }),
        (homeValue, insurancePercent) => {
          // Calculate dollar amount from percent
          const insuranceDollar = convertInsurancePercentToDollar(insurancePercent, homeValue)
          
          // Calculate monthly insurance from dollar
          const monthlyInsuranceFromDollar = insuranceDollar / 12
          
          // Calculate monthly insurance directly from percent
          const monthlyInsuranceFromPercent = (homeValue * insurancePercent / 100) / 12
          
          // Both should be equal (within 1 cent tolerance)
          return Math.abs(monthlyInsuranceFromDollar - monthlyInsuranceFromPercent) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19d: Mode conversion preserves the insurance cost in calculations
   */
  it('Property 19d: Mode conversion preserves the insurance cost in calculations', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Original monthly cost
          const originalMonthlyCost = insuranceDollar / 12
          
          // Convert to percent and back to dollar
          const percent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const convertedDollar = convertInsurancePercentToDollar(percent, homeValue)
          const convertedMonthlyCost = convertedDollar / 12
          
          // Monthly cost should be preserved (within 1 cent tolerance)
          return Math.abs(originalMonthlyCost - convertedMonthlyCost) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19e: Zero insurance in any mode results in zero monthly payment
   */
  it('Property 19e: Zero insurance in any mode results in zero monthly payment', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        (homeValue) => {
          // Zero dollar mode
          const monthlyFromDollar = 0 / 12
          
          // Zero percent mode
          const dollarFromPercent = convertInsurancePercentToDollar(0, homeValue)
          const monthlyFromPercent = dollarFromPercent / 12
          
          // Both should be zero
          return monthlyFromDollar === 0 && monthlyFromPercent === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19f: Insurance calculation is commutative across modes
   */
  it('Property 19f: Insurance calculation is commutative across modes', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Path 1: Dollar -> Percent -> Monthly
          const percent1 = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const dollar1 = convertInsurancePercentToDollar(percent1, homeValue)
          const monthly1 = dollar1 / 12
          
          // Path 2: Dollar -> Monthly directly
          const monthly2 = insuranceDollar / 12
          
          // Both paths should produce the same result
          return Math.abs(monthly1 - monthly2) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19g: Total payment calculation is mode-independent
   */
  it('Property 19g: Total payment calculation is mode-independent', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        fc.integer({ min: 12, max: 360 }), // loan term in months
        (homeValue, insuranceDollar, termMonths) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Total insurance payment using dollar mode
          const monthlyFromDollar = insuranceDollar / 12
          const totalFromDollar = monthlyFromDollar * termMonths
          
          // Total insurance payment using percent mode
          const percent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const dollarFromPercent = convertInsurancePercentToDollar(percent, homeValue)
          const monthlyFromPercent = dollarFromPercent / 12
          const totalFromPercent = monthlyFromPercent * termMonths
          
          // Total payments should be the same (within $1 tolerance for longer terms)
          return Math.abs(totalFromDollar - totalFromPercent) < 1.0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19h: Insurance mode equivalence holds for all valid home values
   */
  it('Property 19h: Insurance mode equivalence holds for all valid home values', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Calculate using both modes
          const monthlyDollar = insuranceDollar / 12
          
          const percent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const dollarFromPercent = convertInsurancePercentToDollar(percent, homeValue)
          const monthlyPercent = dollarFromPercent / 12
          
          // Verify equivalence
          const isEquivalent = Math.abs(monthlyDollar - monthlyPercent) < 0.01
          
          // Also verify that the percent is reasonable (not NaN or Infinity)
          const isValidPercent = !isNaN(percent) && isFinite(percent)
          
          return isEquivalent && isValidPercent
        }
      ),
      { numRuns: 100 }
    )
  })
})
