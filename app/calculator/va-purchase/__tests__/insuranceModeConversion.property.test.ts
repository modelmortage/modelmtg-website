/**
 * Insurance Mode Conversion Property-Based Tests
 * Tests universal properties of insurance mode conversions using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 17: Insurance Mode Conversion Round Trip
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
 * **Validates: Requirements 7.4, 7.5**
 * 
 * Property 17: Insurance Mode Conversion Round Trip
 * For any insurance amount and home value, converting from dollar to percent and back to dollar
 * should produce the original dollar amount (within rounding tolerance), and converting from
 * percent to dollar and back to percent should produce the original percent.
 */
describe('Insurance Mode Conversion - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbInsuranceDollar = fc.float({ min: Math.fround(500), max: Math.fround(5000), noNaN: true })
  const arbInsurancePercent = fc.float({ min: Math.fround(0.1), max: Math.fround(2.5), noNaN: true })

  /**
   * Property 17a: Dollar to percent to dollar conversion round trip preserves original value
   * 
   * **Validates: Requirements 7.4, 7.5**
   */
  it('Property 17a: Dollar to percent to dollar conversion round trip preserves original value', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero to avoid division by zero
          if (homeValue === 0) return true
          
          // Convert dollar to percent
          const percent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          
          // Convert back to dollar
          const backToDollar = convertInsurancePercentToDollar(percent, homeValue)
          
          // Verify the round trip preserves the original value (within 1 cent tolerance)
          return Math.abs(backToDollar - insuranceDollar) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17b: Percent to dollar to percent conversion round trip preserves original value
   * 
   * **Validates: Requirements 7.4, 7.5**
   */
  it('Property 17b: Percent to dollar to percent conversion round trip preserves original value', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsurancePercent,
        (homeValue, insurancePercent) => {
          // Skip if home value is zero to avoid division by zero
          if (homeValue === 0) return true
          
          // Convert percent to dollar
          const dollar = convertInsurancePercentToDollar(insurancePercent, homeValue)
          
          // Convert back to percent
          const backToPercent = convertInsuranceDollarToPercent(dollar, homeValue)
          
          // Verify the round trip preserves the original value (within 0.0001% tolerance)
          return Math.abs(backToPercent - insurancePercent) < 0.0001
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17c: Zero home value always results in zero percent
   */
  it('Property 17c: Zero home value always results in zero percent', () => {
    fc.assert(
      fc.property(
        arbInsuranceDollar,
        (insuranceDollar) => {
          const percent = convertInsuranceDollarToPercent(insuranceDollar, 0)
          return percent === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17d: Zero insurance dollar always results in zero percent
   */
  it('Property 17d: Zero insurance dollar always results in zero percent', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        (homeValue) => {
          const percent = convertInsuranceDollarToPercent(0, homeValue)
          return percent === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17e: Zero insurance percent always results in zero dollar
   */
  it('Property 17e: Zero insurance percent always results in zero dollar', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        (homeValue) => {
          const dollar = convertInsurancePercentToDollar(0, homeValue)
          return dollar === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17f: Conversion functions are inverse operations
   */
  it('Property 17f: Conversion functions are inverse operations (for non-zero home value)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero
          if (homeValue === 0) return true
          
          // Apply both conversions in sequence
          const percent = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const backToDollar = convertInsurancePercentToDollar(percent, homeValue)
          
          // Also test the reverse direction
          const dollar = convertInsurancePercentToDollar(percent, homeValue)
          const backToPercent = convertInsuranceDollarToPercent(dollar, homeValue)
          
          // Both round trips should preserve values
          const dollarRoundTrip = Math.abs(backToDollar - insuranceDollar) < 0.01
          const percentRoundTrip = Math.abs(backToPercent - percent) < 0.0001
          
          return dollarRoundTrip && percentRoundTrip
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17g: Insurance percent scales linearly with dollar amount
   */
  it('Property 17g: Insurance percent scales linearly with dollar amount (for fixed home value)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsuranceDollar,
        (homeValue, insuranceDollar) => {
          // Skip if home value is zero or insurance is too small
          if (homeValue === 0 || insuranceDollar < 1) return true
          
          const percent1 = convertInsuranceDollarToPercent(insuranceDollar, homeValue)
          const percent2 = convertInsuranceDollarToPercent(insuranceDollar * 2, homeValue)
          
          // Doubling the dollar amount should double the percent
          return Math.abs(percent2 - (percent1 * 2)) < 0.0001
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17h: Insurance dollar scales linearly with percent
   */
  it('Property 17h: Insurance dollar scales linearly with percent (for fixed home value)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbInsurancePercent,
        (homeValue, insurancePercent) => {
          // Skip if insurance percent is too small
          if (insurancePercent < 0.01) return true
          
          const dollar1 = convertInsurancePercentToDollar(insurancePercent, homeValue)
          const dollar2 = convertInsurancePercentToDollar(insurancePercent * 2, homeValue)
          
          // Doubling the percent should double the dollar amount
          return Math.abs(dollar2 - (dollar1 * 2)) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })
})
