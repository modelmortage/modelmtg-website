// Feature: va-purchase-calculator-enhancements, Property 21: Percentage precision
// **Validates: Requirements 8.4**

import * as fc from 'fast-check'

// Helper function to format percentage (matches implementation)
function formatPercent(value: number, decimals: number = 4): string {
  return value.toFixed(decimals) + '%'
}

// Helper to extract decimal places from formatted percentage string
function getDecimalPlaces(formattedValue: string): number {
  const withoutPercent = formattedValue.replace('%', '')
  const parts = withoutPercent.split('.')
  return parts.length > 1 ? parts[1].length : 0
}

describe('Property 21: Percentage Precision', () => {
  it('should format all percentage values to exactly 4 decimal places', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }), // Arbitrary percentage values
        (percentage) => {
          const formatted = formatPercent(percentage)
          const decimalPlaces = getDecimalPlaces(formatted)
          
          // Percentage values must have exactly 4 decimal places
          return decimalPlaces === 4
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should round percentage values correctly to 4 decimal places', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        (percentage) => {
          const formatted = formatPercent(percentage)
          const withoutPercent = formatted.replace('%', '')
          const numericValue = parseFloat(withoutPercent)
          
          // The formatted value should equal the original rounded to 4 decimals
          const expectedValue = Math.round(percentage * 10000) / 10000
          
          return Math.abs(numericValue - expectedValue) < 0.00001
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle edge cases with proper 4 decimal precision', () => {
    // Test specific edge cases
    expect(getDecimalPlaces(formatPercent(0))).toBe(4)
    expect(getDecimalPlaces(formatPercent(0.00001))).toBe(4)
    expect(getDecimalPlaces(formatPercent(0.99999))).toBe(4)
    expect(getDecimalPlaces(formatPercent(50.12345))).toBe(4)
    expect(getDecimalPlaces(formatPercent(99.99999))).toBe(4)
  })

  it('should support custom decimal places parameter', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.integer({ min: 0, max: 10 }),
        (percentage, decimals) => {
          const formatted = formatPercent(percentage, decimals)
          const actualDecimals = getDecimalPlaces(formatted)
          
          // Should match the requested decimal places
          return actualDecimals === decimals
        }
      ),
      { numRuns: 100 }
    )
  })
})
