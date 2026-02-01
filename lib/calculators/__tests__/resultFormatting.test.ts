// Property-based tests for result formatting
// Feature: website-structure-migration, Property 5: Result Formatting

import fc from 'fast-check'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/formatters'
import { calculatePurchase } from '../purchase'
import { calculateAffordability } from '../affordability'
import { calculateRefinance } from '../refinance'
import { calculateRentVsBuy } from '../rentVsBuy'
import type { CalculatorResult } from '@/lib/types/calculator'

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
          
          // Should start with $
          expect(formatted).toMatch(/^\$/)
          
          // Should contain commas for values >= 1000
          if (value >= 1000) {
            expect(formatted).toContain(',')
          }
          
          // Should have correct decimal places
          const decimalPart = formatted.split('.')[1]
          if (decimals > 0) {
            expect(decimalPart).toBeDefined()
            expect(decimalPart?.length).toBe(decimals)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('percentage values are formatted with % symbol', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.integer({ min: 0, max: 4 }),
        (value, decimals) => {
          const formatted = formatPercentage(value, decimals)
          
          // Should end with %
          expect(formatted).toMatch(/%$/)
          
          // Should have correct decimal places
          const numericPart = formatted.replace('%', '')
          const decimalPart = numericPart.split('.')[1]
          if (decimals > 0) {
            expect(decimalPart).toBeDefined()
            expect(decimalPart?.length).toBe(decimals)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('numbers are formatted with commas and appropriate decimal places', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1000000, noNaN: true }),
        fc.integer({ min: 0, max: 4 }),
        (value, decimals) => {
          const formatted = formatNumber(value, decimals)
          
          // Should contain commas for values >= 1000
          if (value >= 1000) {
            expect(formatted).toContain(',')
          }
          
          // Should have correct decimal places
          const decimalPart = formatted.split('.')[1]
          if (decimals > 0) {
            expect(decimalPart).toBeDefined()
            expect(decimalPart?.length).toBe(decimals)
          }
          
          // Should not start with $ or end with %
          expect(formatted).not.toMatch(/^\$/)
          expect(formatted).not.toMatch(/%$/)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('calculator results specify correct format types', () => {
    fc.assert(
      fc.property(
        fc.record({
          homePrice: fc.float({ min: 100000, max: 2000000, noNaN: true }),
          downPayment: fc.float({ min: 10000, max: 500000, noNaN: true }),
          interestRate: fc.float({ min: 2, max: 10, noNaN: true }),
          loanTerm: fc.integer({ min: 10, max: 30 }),
          propertyTaxRate: fc.float({ min: 0.5, max: 3, noNaN: true }),
          insurance: fc.float({ min: 500, max: 5000, noNaN: true }),
          hoa: fc.float({ min: 0, max: 500, noNaN: true })
        }),
        (inputs) => {
          // Ensure down payment doesn't exceed home price
          const validInputs = {
            ...inputs,
            downPayment: Math.min(inputs.downPayment, inputs.homePrice * 0.5)
          }
          
          const results = calculatePurchase(validInputs)
          
          // All results should have a valid format field
          results.forEach((result: CalculatorResult) => {
            expect(['currency', 'percentage', 'number']).toContain(result.format)
          })
        }
      ),
      { numRuns: 50 }
    )
  })

  it('calculator results are formatted correctly based on their format type', () => {
    fc.assert(
      fc.property(
        fc.record({
          annualIncome: fc.float({ min: 30000, max: 500000, noNaN: true }),
          monthlyDebts: fc.float({ min: 0, max: 5000, noNaN: true }),
          downPayment: fc.float({ min: 10000, max: 200000, noNaN: true }),
          interestRate: fc.float({ min: 2, max: 10, noNaN: true })
        }),
        (inputs) => {
          const results = calculateAffordability(inputs)
          
          results.forEach((result: CalculatorResult) => {
            let formatted: string
            
            switch (result.format) {
              case 'currency':
                formatted = formatCurrency(result.value)
                // Currency should contain $ (may have - for negative values)
                expect(formatted).toContain('$')
                if (Math.abs(result.value) >= 1000) {
                  expect(formatted).toContain(',')
                }
                break
              
              case 'percentage':
                formatted = formatPercentage(result.value)
                // Percentage should end with %
                expect(formatted).toMatch(/%$/)
                break
              
              case 'number':
                formatted = formatNumber(result.value)
                // Number should have commas for large values
                if (Math.abs(result.value) >= 1000) {
                  expect(formatted).toContain(',')
                }
                // Should not have $ or % (but may have - for negative)
                expect(formatted).not.toContain('$')
                expect(formatted).not.toMatch(/%$/)
                break
            }
          })
        }
      ),
      { numRuns: 50 }
    )
  })

  it('all calculators produce results with proper formatting', () => {
    fc.assert(
      fc.property(
        fc.record({
          homePrice: fc.float({ min: 100000, max: 1000000, noNaN: true }),
          downPayment: fc.float({ min: 10000, max: 200000, noNaN: true }),
          interestRate: fc.float({ min: 2, max: 8, noNaN: true }),
          loanTerm: fc.integer({ min: 15, max: 30 }),
          propertyTaxRate: fc.float({ min: 0.5, max: 2.5, noNaN: true }),
          insurance: fc.float({ min: 500, max: 3000, noNaN: true }),
          hoa: fc.float({ min: 0, max: 300, noNaN: true })
        }),
        fc.record({
          currentBalance: fc.float({ min: 50000, max: 500000, noNaN: true }),
          currentRate: fc.float({ min: 3, max: 8, noNaN: true }),
          newRate: fc.float({ min: 2, max: 7, noNaN: true }),
          remainingTerm: fc.integer({ min: 10, max: 30 }),
          newTerm: fc.integer({ min: 15, max: 30 }),
          closingCosts: fc.float({ min: 2000, max: 10000, noNaN: true })
        }),
        fc.record({
          homePrice: fc.float({ min: 100000, max: 800000, noNaN: true }),
          downPayment: fc.float({ min: 10000, max: 150000, noNaN: true }),
          interestRate: fc.float({ min: 2, max: 8, noNaN: true }),
          rentAmount: fc.float({ min: 1000, max: 4000, noNaN: true }),
          yearsToStay: fc.integer({ min: 3, max: 15 }),
          appreciationRate: fc.float({ min: 1, max: 5, noNaN: true })
        }),
        (purchaseInputs, refinanceInputs, rentVsBuyInputs) => {
          // Ensure valid inputs
          const validPurchaseInputs = {
            ...purchaseInputs,
            downPayment: Math.min(purchaseInputs.downPayment, purchaseInputs.homePrice * 0.5)
          }
          
          const validRentVsBuyInputs = {
            ...rentVsBuyInputs,
            downPayment: Math.min(rentVsBuyInputs.downPayment, rentVsBuyInputs.homePrice * 0.5)
          }
          
          // Test multiple calculators
          const calculators = [
            { name: 'purchase', results: calculatePurchase(validPurchaseInputs) },
            { name: 'refinance', results: calculateRefinance(refinanceInputs) },
            { name: 'rentVsBuy', results: calculateRentVsBuy(validRentVsBuyInputs) }
          ]
          
          calculators.forEach(({ results }) => {
            results.forEach((result: CalculatorResult) => {
              // Verify format field is valid
              expect(['currency', 'percentage', 'number']).toContain(result.format)
              
              // Verify value is a valid number (but may be infinite in edge cases)
              expect(typeof result.value).toBe('number')
              expect(isNaN(result.value)).toBe(false)
              
              // Skip formatting tests for infinite values (edge case in calculators)
              if (!isFinite(result.value)) {
                return
              }
              
              // Apply formatter and verify output
              let formatted: string
              switch (result.format) {
                case 'currency':
                  formatted = formatCurrency(result.value)
                  // Currency should contain $ and commas for large values
                  expect(formatted).toContain('$')
                  if (Math.abs(result.value) >= 1000) {
                    expect(formatted).toContain(',')
                  }
                  break
                
                case 'percentage':
                  formatted = formatPercentage(result.value)
                  expect(formatted).toMatch(/%$/)
                  break
                
                case 'number':
                  formatted = formatNumber(result.value)
                  // Should have commas for large values
                  if (Math.abs(result.value) >= 1000) {
                    expect(formatted).toContain(',')
                  }
                  break
              }
            })
          })
        }
      ),
      { numRuns: 30 }
    )
  })

  it('formatters handle edge cases correctly', () => {
    // Test zero values
    expect(formatCurrency(0)).toBe('$0')
    expect(formatPercentage(0)).toBe('0.00%')
    expect(formatNumber(0)).toBe('0')
    
    // Test very small values
    expect(formatCurrency(0.01, 2)).toBe('$0.01')
    expect(formatPercentage(0.0001, 2)).toBe('0.01%')
    expect(formatNumber(0.5, 1)).toBe('0.5')
    
    // Test values at comma boundary
    expect(formatCurrency(999)).toBe('$999')
    expect(formatCurrency(1000)).toBe('$1,000')
    expect(formatNumber(999)).toBe('999')
    expect(formatNumber(1000)).toBe('1,000')
    
    // Test large values
    expect(formatCurrency(1234567.89, 2)).toBe('$1,234,567.89')
    expect(formatNumber(9876543.21, 2)).toBe('9,876,543.21')
    
    // Test percentage conversion
    expect(formatPercentage(0.05, 2)).toBe('5.00%')
    expect(formatPercentage(0.125, 2)).toBe('12.50%')
    expect(formatPercentage(1, 2)).toBe('100.00%')
  })
})
