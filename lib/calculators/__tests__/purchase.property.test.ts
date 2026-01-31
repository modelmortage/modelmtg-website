// Property-based tests for purchase calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculatePurchase } from '../purchase'
import type { PurchaseInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('Purchase Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate monthly payment using correct mortgage formula', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }), // homePrice
          fc.integer({ min: 0, max: 1000000 }), // downPayment
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }), // interestRate
          fc.integer({ min: 1, max: 30 }), // loanTerm
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }), // propertyTaxRate
          fc.integer({ min: 0, max: 50000 }), // insurance (annual)
          fc.integer({ min: 0, max: 5000 }), // hoa (monthly)
          (homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            if (interestRate > 0 && interestRate < 0.001) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            
            const totalMonthlyPayment = results.find(r => r.label === 'Total Monthly Payment')!.value
            const principalInterest = results.find(r => r.label === 'Principal & Interest')!.value
            const propertyTax = results.find(r => r.label === 'Property Taxes')!.value
            const insuranceResult = results.find(r => r.label === 'Homeowners Insurance')!.value
            const hoaResult = results.find(r => r.label === 'HOA Fees')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            
            const expectedLoanAmount = homePrice - downPayment
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = loanTerm * 12
            
            let expectedPI: number
            if (expectedLoanAmount === 0) {
              expectedPI = 0
            } else if (monthlyInterestRate === 0) {
              expectedPI = expectedLoanAmount / numberOfPayments
            } else {
              expectedPI = expectedLoanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
            }
            
            const expectedPropertyTax = (homePrice * propertyTaxRate / 100) / 12
            const expectedInsurance = insurance / 12
            const expectedHOA = hoa
            const expectedTotalMonthly = expectedPI + expectedPropertyTax + expectedInsurance + expectedHOA
            const expectedTotalInterest = (expectedPI * numberOfPayments) - expectedLoanAmount
            
            expect(Math.abs(loanAmount - expectedLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(principalInterest - expectedPI)).toBeLessThan(0.01)
            expect(Math.abs(propertyTax - expectedPropertyTax)).toBeLessThan(0.01)
            expect(Math.abs(insuranceResult - expectedInsurance)).toBeLessThan(0.01)
            expect(Math.abs(hoaResult - expectedHOA)).toBeLessThan(0.01)
            expect(Math.abs(totalMonthlyPayment - expectedTotalMonthly)).toBeLessThan(0.01)
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: totalMonthly = P&I + taxes + insurance + HOA', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            if (interestRate > 0 && interestRate < 0.001) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            const totalMonthlyPayment = results.find(r => r.label === 'Total Monthly Payment')!.value
            const principalInterest = results.find(r => r.label === 'Principal & Interest')!.value
            const propertyTax = results.find(r => r.label === 'Property Taxes')!.value
            const insuranceResult = results.find(r => r.label === 'Homeowners Insurance')!.value
            const hoaResult = results.find(r => r.label === 'HOA Fees')!.value
            
            const sumOfComponents = principalInterest + propertyTax + insuranceResult + hoaResult
            expect(Math.abs(totalMonthlyPayment - sumOfComponents)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: loanAmount = homePrice - downPayment', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            if (interestRate > 0 && interestRate < 0.001) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const downPaymentResult = results.find(r => r.label === 'Down Payment')!.value
            
            expect(Math.abs(loanAmount - (homePrice - downPaymentResult))).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate loan-to-value ratio correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.integer({ min: 1000, max: 1000000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            const ltvRatio = results.find(r => r.label === 'Loan-to-Value Ratio')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            
            const expectedLTV = homePrice > 0 ? loanAmount / homePrice : 0
            expect(Math.abs(ltvRatio - expectedLTV)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate total interest correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            const principalInterest = results.find(r => r.label === 'Principal & Interest')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const numberOfPayments = loanTerm * 12
            
            const totalPayments = principalInterest * numberOfPayments
            const expectedTotalInterest = totalPayments - loanAmount
            
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
            expect(totalInterest).toBeGreaterThanOrEqual(0)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, downPayment, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate: 0, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            const principalInterest = results.find(r => r.label === 'Principal & Interest')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            const numberOfPayments = loanTerm * 12
            
            const expectedLoanAmount = homePrice - downPayment
            const expectedPI = expectedLoanAmount > 0 ? expectedLoanAmount / numberOfPayments : 0
            const expectedTotalInterest = 0
            
            expect(Math.abs(loanAmount - expectedLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(principalInterest - expectedPI)).toBeLessThan(0.01)
            expect(Math.abs(totalInterest - expectedTotalInterest)).toBeLessThan(0.01)
            expect(isFinite(principalInterest)).toBe(true)
            expect(isFinite(loanAmount)).toBe(true)
            expect(isFinite(totalInterest)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: 100% down payment (no loan)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            const inputs: PurchaseInputs = {
              homePrice, downPayment: homePrice, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results = calculatePurchase(inputs)
            const principalInterest = results.find(r => r.label === 'Principal & Interest')!.value
            const loanAmount = results.find(r => r.label === 'Loan Amount')!.value
            const totalInterest = results.find(r => r.label === 'Total Interest Paid')!.value
            const ltvRatio = results.find(r => r.label === 'Loan-to-Value Ratio')!.value
            
            expect(loanAmount).toBe(0)
            expect(principalInterest).toBe(0)
            expect(totalInterest).toBe(0)
            expect(ltvRatio).toBe(0)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should produce consistent results for the same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 5000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(0), max: Math.fround(10), noNaN: true }),
          fc.integer({ min: 0, max: 50000 }),
          fc.integer({ min: 0, max: 5000 }),
          (homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa) => {
            if (downPayment > homePrice) return true
            if (interestRate > 0 && interestRate < 0.001) return true
            
            const inputs: PurchaseInputs = {
              homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa
            }
            
            const results1 = calculatePurchase(inputs)
            const results2 = calculatePurchase(inputs)
            
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
  })
})
