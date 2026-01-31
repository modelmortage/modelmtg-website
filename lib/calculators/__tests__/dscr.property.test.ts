// Property-based tests for DSCR calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculateDSCR } from '../dscr'
import type { DSCRInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('DSCR Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate DSCR using correct formulas', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }), // propertyPrice
          fc.integer({ min: 0, max: 5000000 }), // downPayment
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100), // interestRate (0-20%)
          fc.integer({ min: 0, max: 50000 }), // monthlyRent
          fc.integer({ min: 0, max: 30000 }), // monthlyExpenses
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            // Skip if down payment exceeds property price
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice,
              downPayment,
              interestRate,
              monthlyRent,
              monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            // Extract results
            const dscrRatio = results.find(r => r.label === 'DSCR Ratio')!.value
            const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')!.value
            const annualCashFlow = results.find(r => r.label === 'Annual Cash Flow')!.value
            const annualROI = results.find(r => r.label === 'Annual ROI (Cash-on-Cash)')!.value
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const totalCashInvested = results.find(r => r.label === 'Total Cash Invested')!.value
            const capRate = results.find(r => r.label === 'Cap Rate')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            
            // Calculate expected values
            const expectedLoanAmount = propertyPrice - downPayment
            
            // Expected monthly P&I payment
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = 30 * 12 // 30-year term
            let expectedMonthlyPI: number
            
            if (expectedLoanAmount === 0) {
              expectedMonthlyPI = 0
            } else if (monthlyInterestRate < 0.000001) {
              expectedMonthlyPI = expectedLoanAmount / numberOfPayments
            } else {
              expectedMonthlyPI = expectedLoanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
            }
            
            // Expected Net Operating Income
            const expectedNOI = monthlyRent - monthlyExpenses
            
            // Expected DSCR ratio
            let expectedDSCR: number
            if (expectedMonthlyPI === 0) {
              expectedDSCR = expectedNOI > 0 ? 999 : 0
            } else {
              expectedDSCR = expectedNOI / expectedMonthlyPI
            }
            
            // Expected monthly cash flow
            const expectedMonthlyCashFlow = expectedNOI - expectedMonthlyPI
            
            // Expected annual cash flow
            const expectedAnnualCashFlow = expectedMonthlyCashFlow * 12
            
            // Expected total cash invested (down payment + 3% closing costs)
            const expectedClosingCosts = propertyPrice * 0.03
            const expectedTotalCashInvested = downPayment + expectedClosingCosts
            
            // Expected annual ROI
            let expectedAnnualROI: number
            if (expectedTotalCashInvested === 0) {
              expectedAnnualROI = 0
            } else {
              expectedAnnualROI = (expectedAnnualCashFlow / expectedTotalCashInvested) * 100
            }
            
            // Expected cap rate
            const expectedCapRate = propertyPrice > 0 ? ((expectedNOI * 12) / propertyPrice) * 100 : 0
            
            // Expected total interest
            const expectedTotalPayments = expectedMonthlyPI * numberOfPayments
            const expectedTotalInterest = expectedTotalPayments - expectedLoanAmount
            
            // Verify calculations are accurate within $0.01 tolerance
            expect(Math.abs(loanAmount - expectedLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            
            // DSCR ratio should match (handle the 999 special case)
            if (expectedDSCR >= 999) {
              expect(dscrRatio).toBe(999)
            } else {
              expect(Math.abs(dscrRatio - expectedDSCR)).toBeLessThan(0.01)
            }
            
            expect(Math.abs(monthlyCashFlow - expectedMonthlyCashFlow)).toBeLessThan(0.01)
            expect(Math.abs(annualCashFlow - expectedAnnualCashFlow)).toBeLessThan(0.01)
            expect(Math.abs(totalCashInvested - expectedTotalCashInvested)).toBeLessThan(0.01)
            expect(Math.abs(annualROI - expectedAnnualROI / 100)).toBeLessThan(0.0001)
            expect(Math.abs(capRate - expectedCapRate / 100)).toBeLessThan(0.0001)
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: DSCR = NOI / Debt Service', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000, max: 10000000 }), // Use larger property prices to avoid edge cases
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 100, max: 2000 }).map(n => n / 100), // Use 1-20% to avoid very low rates
          fc.integer({ min: 100, max: 50000 }), // Ensure some rent
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment >= propertyPrice) return true // Skip cash purchases
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const dscrRatio = results.find(r => r.label === 'DSCR Ratio')!.value
            const noi = results.find(r => r.label === 'Net Operating Income')!.value
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            
            const expectedDSCR = noi / monthlyPI
            
            // The implementation caps DSCR at 999 when it's >= 999
            const expectedCappedDSCR = expectedDSCR >= 999 ? 999 : expectedDSCR
            
            // Use relative tolerance for better handling of floating-point precision
            const tolerance = Math.max(0.01, Math.abs(expectedCappedDSCR) * 0.0001)
            expect(Math.abs(dscrRatio - expectedCappedDSCR)).toBeLessThan(tolerance)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: NOI = Monthly Rent - Monthly Expenses', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const noi = results.find(r => r.label === 'Net Operating Income')!.value
            const rent = results.find(r => r.label === 'Monthly Rent Income')!.value
            const expenses = results.find(r => r.label === 'Monthly Expenses')!.value
            
            const expectedNOI = rent - expenses
            expect(Math.abs(noi - expectedNOI)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: Monthly Cash Flow = NOI - Debt Service', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')!.value
            const noi = results.find(r => r.label === 'Net Operating Income')!.value
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            
            const expectedCashFlow = noi - monthlyPI
            expect(Math.abs(monthlyCashFlow - expectedCashFlow)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: Annual Cash Flow = Monthly Cash Flow × 12', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const annualCashFlow = results.find(r => r.label === 'Annual Cash Flow')!.value
            const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')!.value
            
            const expectedAnnualCashFlow = monthlyCashFlow * 12
            expect(Math.abs(annualCashFlow - expectedAnnualCashFlow)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate cap rate as (Annual NOI / Property Price) × 100', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const capRate = results.find(r => r.label === 'Cap Rate')!.value
            const noi = results.find(r => r.label === 'Net Operating Income')!.value
            
            const expectedCapRate = propertyPrice > 0 ? ((noi * 12) / propertyPrice) : 0
            expect(Math.abs(capRate - expectedCapRate)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate total cash invested as down payment + 3% closing costs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const totalCashInvested = results.find(r => r.label === 'Total Cash Invested')!.value
            const downPaymentResult = results.find(r => r.label === 'Down Payment')!.value
            
            const expectedClosingCosts = propertyPrice * 0.03
            const expectedTotalCashInvested = downPaymentResult + expectedClosingCosts
            
            expect(Math.abs(totalCashInvested - expectedTotalCashInvested)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate ROI as (Annual Cash Flow / Total Cash Invested) × 100', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 1000, max: 5000000 }), // Ensure some down payment
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const annualROI = results.find(r => r.label === 'Annual ROI (Cash-on-Cash)')!.value
            const annualCashFlow = results.find(r => r.label === 'Annual Cash Flow')!.value
            const totalCashInvested = results.find(r => r.label === 'Total Cash Invested')!.value
            
            const expectedROI = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) : 0
            expect(Math.abs(annualROI - expectedROI)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice,
              downPayment,
              interestRate: 0,
              monthlyRent,
              monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            
            // Calculate expected values for 0% interest
            const numberOfPayments = 30 * 12
            const expectedMonthlyPI = loanAmount > 0 ? loanAmount / numberOfPayments : 0
            
            expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            expect(isFinite(monthlyPI)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: 100% down payment (cash purchase)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, interestRate, monthlyRent, monthlyExpenses) => {
            const inputs: DSCRInputs = {
              propertyPrice,
              downPayment: propertyPrice, // 100% cash
              interestRate,
              monthlyRent,
              monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const dscrRatio = results.find(r => r.label === 'DSCR Ratio')!.value
            const qualificationStatus = results.find(r => r.label === 'Qualification Status')!
            
            // With 100% down payment, there should be no loan
            expect(loanAmount).toBe(0)
            expect(monthlyPI).toBe(0)
            
            // DSCR should be 999 for cash purchases with positive NOI
            const noi = monthlyRent - monthlyExpenses
            if (noi > 0) {
              expect(dscrRatio).toBe(999)
            } else {
              expect(dscrRatio).toBe(0)
            }
            
            // Should indicate cash purchase
            expect(qualificationStatus.description).toContain('Cash Purchase')
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero monthly rent', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice,
              downPayment,
              interestRate,
              monthlyRent: 0,
              monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const noi = results.find(r => r.label === 'Net Operating Income')!.value
            const dscrRatio = results.find(r => r.label === 'DSCR Ratio')!.value
            
            // NOI should be negative (or zero if no expenses)
            expect(noi).toBeLessThanOrEqual(0)
            
            // All results should be finite
            results.forEach(result => {
              expect(isFinite(result.value)).toBe(true)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate total interest correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 10, max: 2000 }).map(n => n / 100), // Avoid 0% for this test
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment >= propertyPrice) return true // Skip cash purchases
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            
            const numberOfPayments = 30 * 12
            const expectedTotalPayments = monthlyPI * numberOfPayments
            const expectedTotalInterest = expectedTotalPayments - loanAmount
            
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
            
            // Total interest should be positive for loans with interest
            if (loanAmount > 0 && interestRate > 0) {
              expect(totalInterest).toBeGreaterThan(0)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should produce consistent results for the same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            // Calculate twice with same inputs
            const results1 = calculateDSCR(inputs)
            const results2 = calculateDSCR(inputs)
            
            // Verify results are identical
            expect(results1).toHaveLength(results2.length)
            
            results1.forEach((result1, index) => {
              const result2 = results2[index]
              expect(result1.label).toBe(result2.label)
              expect(result1.value).toBe(result2.value)
              expect(result1.format).toBe(result2.format)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should ensure all result values are finite numbers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 5000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 30000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            // Verify all numeric results are finite
            results.forEach(result => {
              expect(isFinite(result.value)).toBe(true)
              expect(isNaN(result.value)).toBe(false)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should verify mortgage formula accuracy for standard amortization', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100000, max: 5000000 }),
          fc.integer({ min: 20000, max: 1000000 }),
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100), // 2-10%
          fc.integer({ min: 1000, max: 20000 }),
          fc.integer({ min: 200, max: 5000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            
            // Verify using standard mortgage formula
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = 30 * 12
            
            if (loanAmount > 0 && monthlyInterestRate > 0) {
              const expectedMonthlyPI = loanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
              
              expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle minimum valid values', () => {
      fc.assert(
        fc.property(
          fc.constant(1000), // Minimum property price
          fc.constant(0), // Minimum down payment
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.constant(0), // Minimum rent
          fc.constant(0), // Minimum expenses
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            // Should not throw and should return valid results
            expect(results).toBeDefined()
            expect(results.length).toBeGreaterThan(0)
            
            results.forEach(result => {
              expect(isFinite(result.value)).toBe(true)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle negative cash flow correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100000, max: 5000000 }),
          fc.integer({ min: 10000, max: 1000000 }),
          fc.integer({ min: 500, max: 1500 }).map(n => n / 100), // 5-15%
          fc.integer({ min: 500, max: 2000 }), // Low rent
          fc.integer({ min: 2000, max: 5000 }), // High expenses
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment > propertyPrice) return true
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')!.value
            const annualCashFlow = results.find(r => r.label === 'Annual Cash Flow')!.value
            const dscrRatio = results.find(r => r.label === 'DSCR Ratio')!.value
            
            // If expenses exceed rent, cash flow should be negative
            if (monthlyExpenses > monthlyRent) {
              expect(monthlyCashFlow).toBeLessThan(0)
              expect(annualCashFlow).toBeLessThan(0)
            }
            
            // All results should still be finite
            results.forEach(result => {
              expect(isFinite(result.value)).toBe(true)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should verify DSCR qualification thresholds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100000, max: 5000000 }),
          fc.integer({ min: 10000, max: 1000000 }),
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 1000, max: 20000 }),
          fc.integer({ min: 200, max: 5000 }),
          (propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses) => {
            if (downPayment >= propertyPrice) return true // Skip cash purchases
            
            const inputs: DSCRInputs = {
              propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses
            }
            
            const results = calculateDSCR(inputs)
            
            const dscrRatio = results.find(r => r.label === 'DSCR Ratio')!.value
            const qualificationStatus = results.find(r => r.label === 'Qualification Status')!
            
            // Verify qualification status matches DSCR ratio
            if (dscrRatio >= 1.25) {
              expect(qualificationStatus.description).toContain('Excellent')
            } else if (dscrRatio >= 1.0) {
              expect(qualificationStatus.description).toContain('Good')
            } else if (dscrRatio >= 0.75) {
              expect(qualificationStatus.description).toContain('Marginal')
            } else {
              expect(qualificationStatus.description).toContain('Poor')
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
