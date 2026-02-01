// Property-based tests for result formatting
// Feature: website-structure-migration, Property 5: Result Formatting

import fc from 'fast-check'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters'

/**
 * **Validates: Requirements 1.7**
 * 
 * Property 5: Result Formatting
 * For any calculation result, currency values should be formatted with $ and commas,
 * percentages with % symbol, and numbers with appropriate decimal places.
 */

describe('Property 5: Result Formatting', () => {
  it('currency values are formatted with $ and commas', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10000000, noNaN: true }),
        fc.integer({ min: 0, max: 2 }),
        (value, decimals) => {
          const formatted = formatCurrency(value, decimals)
          expect(formatted).toMatch(/^\$/)
          if (value >= 1000) {
            expect(formatted).toContain(',')
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
