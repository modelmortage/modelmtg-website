// Property-based tests for VA purchase calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculateVAPurchase } from '../vaPurchase'
import type { VAPurchaseInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('VA Purchase Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate VA purchase using correct formulas', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }), // homePrice
          fc.integer({ min: 0, max: 500000 }), // downPayment
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100), // interestRate (0-20%)
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100), // vaFundingFee (0-10%)
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100), // propertyTaxRate (0-10%)
          fc.integer({ min: 0, max: 100000 }), // insurance
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            // Skip if down payment exceeds home price
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice,
              downPayment,
              interestRate,
              vaFundingFee,
              propertyTaxRate,
              insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            // Extract results
            const totalMonthlyPayment = results.find(r => r.label === 'Total Monthly Payment')!.value
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const monthlyPropertyTax = results.find(r => r.label === 'Property Taxes')!.value
            const monthlyInsurance = results.find(r => r.label === 'Homeowners Insurance')!.value
            const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            const downPaymentResult = results.find(r => r.label === 'Down Payment')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            const totalCost = results.find(r => r.label === 'Total Cost')!.value
            const loanToValue = results.find(r => r.label === 'Loan-to-Value Ratio')!.value
            
            // Calculate expected values
            const expectedBaseLoanAmount = homePrice - downPayment
            const expectedFundingFeeAmount = expectedBaseLoanAmount * (vaFundingFee / 100)
            const expectedTotalLoanAmount = expectedBaseLoanAmount + expectedFundingFeeAmount
            
            // Expected monthly P&I payment
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = 30 * 12 // 30-year term
            let expectedMonthlyPI: number
            
            if (expectedTotalLoanAmount === 0) {
              expectedMonthlyPI = 0
            } else if (monthlyInterestRate < 0.000001) {
              expectedMonthlyPI = expectedTotalLoanAmount / numberOfPayments
            } else {
              expectedMonthlyPI = expectedTotalLoanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
            }
            
            // Expected monthly property tax
            const expectedMonthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12
            
            // Expected monthly insurance
            const expectedMonthlyInsurance = insurance / 12
            
            // Expected total monthly payment (no PMI for VA loans)
            const expectedTotalMonthlyPayment = expectedMonthlyPI + expectedMonthlyPropertyTax + expectedMonthlyInsurance
            
            // Expected total interest
            const expectedTotalPayments = expectedMonthlyPI * numberOfPayments
            const expectedTotalInterest = expectedTotalPayments - expectedTotalLoanAmount
            
            // Expected total cost
            const expectedTotalCost = downPayment + expectedTotalPayments + 
                                     (expectedMonthlyPropertyTax * numberOfPayments) + 
                                     (expectedMonthlyInsurance * numberOfPayments)
            
            // Expected LTV (based on base loan amount, not including funding fee)
            const expectedLTV = homePrice > 0 ? (expectedBaseLoanAmount / homePrice) : 0
            
            // Verify calculations are accurate within $0.01 tolerance
            expect(Math.abs(baseLoanAmount - expectedBaseLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(fundingFeeAmount - expectedFundingFeeAmount)).toBeLessThan(0.01)
            expect(Math.abs(totalLoanAmount - expectedTotalLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            expect(Math.abs(monthlyPropertyTax - expectedMonthlyPropertyTax)).toBeLessThan(0.01)
            expect(Math.abs(monthlyInsurance - expectedMonthlyInsurance)).toBeLessThan(0.01)
            expect(Math.abs(totalMonthlyPayment - expectedTotalMonthlyPayment)).toBeLessThan(0.01)
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
            expect(Math.abs(totalCost - expectedTotalCost)).toBeLessThan(0.01)
            expect(Math.abs(loanToValue - expectedLTV)).toBeLessThan(0.0001)
            expect(Math.abs(downPaymentResult - downPayment)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: totalLoanAmount = baseLoanAmount + fundingFee', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            
            const expectedTotal = baseLoanAmount + fundingFeeAmount
            expect(Math.abs(totalLoanAmount - expectedTotal)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: totalMonthly = P&I + taxes + insurance (no PMI)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const totalMonthlyPayment = results.find(r => r.label === 'Total Monthly Payment')!.value
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const monthlyPropertyTax = results.find(r => r.label === 'Property Taxes')!.value
            const monthlyInsurance = results.find(r => r.label === 'Homeowners Insurance')!.value
            
            // Verify no PMI result exists
            const pmiResult = results.find(r => r.label.toLowerCase().includes('pmi'))
            expect(pmiResult).toBeUndefined()
            
            const expectedTotal = monthlyPI + monthlyPropertyTax + monthlyInsurance
            expect(Math.abs(totalMonthlyPayment - expectedTotal)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate VA funding fee as percentage of base loan amount', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            
            const expectedFundingFee = baseLoanAmount * (vaFundingFee / 100)
            expect(Math.abs(fundingFeeAmount - expectedFundingFee)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate LTV based on base loan amount (excluding funding fee)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')!.value
            const loanToValue = results.find(r => r.label === 'Loan-to-Value Ratio')!.value
            
            const expectedLTV = homePrice > 0 ? (baseLoanAmount / homePrice) : 0
            expect(Math.abs(loanToValue - expectedLTV)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice,
              downPayment,
              interestRate: 0,
              vaFundingFee,
              propertyTaxRate,
              insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            
            // Calculate expected values for 0% interest
            const numberOfPayments = 30 * 12
            const expectedMonthlyPI = totalLoanAmount > 0 ? totalLoanAmount / numberOfPayments : 0
            
            expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            expect(isFinite(monthlyPI)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: 100% down payment (no loan)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            const inputs: VAPurchaseInputs = {
              homePrice,
              downPayment: homePrice, // 100% down
              interestRate,
              vaFundingFee,
              propertyTaxRate,
              insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            
            // With 100% down payment, there should be no loan
            expect(baseLoanAmount).toBe(0)
            expect(fundingFeeAmount).toBe(0)
            expect(totalLoanAmount).toBe(0)
            expect(monthlyPI).toBe(0)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero funding fee (disabled veteran)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice,
              downPayment,
              interestRate,
              vaFundingFee: 0, // Disabled veterans are exempt
              propertyTaxRate,
              insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            
            expect(fundingFeeAmount).toBe(0)
            expect(Math.abs(totalLoanAmount - baseLoanAmount)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate total interest correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 10, max: 2000 }).map(n => n / 100), // Avoid 0% for this test (0.1-20%)
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment >= homePrice) return true // Skip if no loan
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            
            const numberOfPayments = 30 * 12
            const expectedTotalPayments = monthlyPI * numberOfPayments
            const expectedTotalInterest = expectedTotalPayments - totalLoanAmount
            
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
            
            // Total interest should be positive for loans with interest
            if (totalLoanAmount > 0 && interestRate > 0) {
              expect(totalInterest).toBeGreaterThan(0)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate total cost correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const monthlyPropertyTax = results.find(r => r.label === 'Property Taxes')!.value
            const monthlyInsurance = results.find(r => r.label === 'Homeowners Insurance')!.value
            const totalCost = results.find(r => r.label === 'Total Cost')!.value
            
            const numberOfPayments = 30 * 12
            const expectedTotalCost = downPayment + 
                                     (monthlyPI * numberOfPayments) + 
                                     (monthlyPropertyTax * numberOfPayments) + 
                                     (monthlyInsurance * numberOfPayments)
            
            expect(Math.abs(totalCost - expectedTotalCost)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should produce consistent results for the same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            // Calculate twice with same inputs
            const results1 = calculateVAPurchase(inputs)
            const results2 = calculateVAPurchase(inputs)
            
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
          fc.integer({ min: 1000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 100000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
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
          fc.integer({ min: 100000, max: 1000000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100), // 2-10%
          fc.integer({ min: 100, max: 500 }).map(n => n / 100), // 1-5%
          fc.integer({ min: 50, max: 300 }).map(n => n / 100), // 0.5-3%
          fc.integer({ min: 500, max: 5000 }),
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            if (downPayment > homePrice) return true
            
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Principal & Interest')!.value
            const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')!.value
            
            // Verify using standard mortgage formula
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = 30 * 12
            
            if (totalLoanAmount > 0 && monthlyInterestRate > 0) {
              const expectedMonthlyPI = totalLoanAmount * 
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
          fc.constant(1000), // Minimum home price
          fc.constant(0), // Minimum down payment
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          fc.constant(0), // Minimum insurance
          (homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance) => {
            const inputs: VAPurchaseInputs = {
              homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance
            }
            
            const results = calculateVAPurchase(inputs)
            
            // Should not throw and should return valid results
            expect(results).toBeDefined()
            expect(results.length).toBeGreaterThan(0)
            
            results.forEach(result => {
              expect(isFinite(result.value)).toBe(true)
              expect(result.value).toBeGreaterThanOrEqual(0)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
