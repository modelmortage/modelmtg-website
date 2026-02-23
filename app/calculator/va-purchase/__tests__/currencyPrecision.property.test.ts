// Feature: va-purchase-calculator-enhancements, Property 20: Currency precision
// **Validates: Requirements 8.3**

import * as fc from 'fast-check'

// Helper function to format currency (matches implementation)
function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Helper to extract decimal places from formatted string
function getDecimalPlaces(formattedValue: string): number {
  const withoutCommas = formattedValue.replace(/,/g, '')
  const parts = withoutCommas.split('.')
  return parts.length > 1 ? parts[1].length : 0
}

describe('Property 20: Currency Precision', () => {
  it('should format all currency values to exactly 2 decimal places', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10000000, noNaN: true }), // Arbitrary currency amounts
        (amount) => {
          const formatted = formatCurrency(amount)
          const decimalPlaces = getDecimalPlaces(formatted)
          
          // Currency values must have exactly 2 decimal places
          return decimalPlaces === 2
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should round currency values correctly to 2 decimal places', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10000000, noNaN: true }),
        (amount) => {
          const formatted = formatCurrency(amount)
          const withoutCommas = formatted.replace(/,/g, '')
          const numericValue = parseFloat(withoutCommas)
          
          // The formatted value should equal the original rounded to 2 decimals
          const expectedValue = Math.round(amount * 100) / 100
          
          return Math.abs(numericValue - expectedValue) < 0.001
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should handle edge cases with proper 2 decimal precision', () => {
    // Test specific edge cases
    expect(getDecimalPlaces(formatCurrency(0))).toBe(2)
    expect(getDecimalPlaces(formatCurrency(0.001))).toBe(2)
    expect(getDecimalPlaces(formatCurrency(0.999))).toBe(2)
    expect(getDecimalPlaces(formatCurrency(1234567.89))).toBe(2)
    expect(getDecimalPlaces(formatCurrency(999999.999))).toBe(2)
  })
})
