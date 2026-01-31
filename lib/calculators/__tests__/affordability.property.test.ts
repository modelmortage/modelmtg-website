// Property-based tests for affordability calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculateAffordability } from '../affordability'
import type { AffordabilityInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('Affordability Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate maximum home price using correct mortgage formula', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }), // annualIncome
          fc.integer({ min: 0, max: 5000 }), // monthlyDebts
          fc.integer({ min: 0, max: 200000 }), // downPayment
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }), // interestRate
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs: AffordabilityInputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            const results = calculateAffordability(inputs)
            
            // Extract results
            const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')!.value
            const maxLoanAmount = results.find(r => r.label === 'Maximum Loan Amount')!.value
            const estimatedMonthlyPayment = results.find(r => r.label === 'Estimated Monthly Payment')!.value
            const downPaymentResult = results.find(r => r.label === 'Down Payment')!.value
            
            // Calculate expected values using industry-standard formulas
            const monthlyIncome = annualIncome / 12
            const DTI_RATIO = 0.43
            const maxMonthlyPayment = monthlyIncome * DTI_RATIO - monthlyDebts
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = 360
            
            // Expected max loan amount using mortgage formula
            let expectedMaxLoanAmount: number
            if (monthlyInterestRate === 0) {
              expectedMaxLoanAmount = maxMonthlyPayment * numberOfPayments
            } else {
              expectedMaxLoanAmount = maxMonthlyPayment * 
                ((1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)) / monthlyInterestRate)
            }
            
            // Expected max home price
            const expectedMaxHomePrice = expectedMaxLoanAmount + downPayment
            
            // Expected monthly payment (P&I)
            let expectedMonthlyPayment: number
            if (monthlyInterestRate === 0 || expectedMaxLoanAmount <= 0) {
              expectedMonthlyPayment = expectedMaxLoanAmount > 0 ? expectedMaxLoanAmount / numberOfPayments : 0
            } else {
              expectedMonthlyPayment = expectedMaxLoanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
            }
            
            // Verify calculations are accurate within $0.01 tolerance
            expect(Math.abs(maxHomePrice - expectedMaxHomePrice)).toBeLessThan(0.01)
            expect(Math.abs(maxLoanAmount - expectedMaxLoanAmount)).toBeLessThan(0.01)
            
            // Only check monthly payment if loan amount is positive and payment is valid
            if (expectedMaxLoanAmount > 0 && isFinite(expectedMonthlyPayment) && isFinite(estimatedMonthlyPayment)) {
              expect(Math.abs(estimatedMonthlyPayment - expectedMonthlyPayment)).toBeLessThan(0.01)
            }
            expect(Math.abs(downPaymentResult - downPayment)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: maxHomePrice = maxLoanAmount + downPayment', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs: AffordabilityInputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            const results = calculateAffordability(inputs)
            
            const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')!.value
            const maxLoanAmount = results.find(r => r.label === 'Maximum Loan Amount')!.value
            const downPaymentResult = results.find(r => r.label === 'Down Payment')!.value
            
            // Verify the fundamental relationship
            expect(Math.abs(maxHomePrice - (maxLoanAmount + downPaymentResult))).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate DTI ratio correctly at 43%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }), // Avoid 0% for this test
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs: AffordabilityInputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            const results = calculateAffordability(inputs)
            
            const dtiRatio = results.find(r => r.label === 'Debt-to-Income Ratio')!.value
            const estimatedMonthlyPayment = results.find(r => r.label === 'Estimated Monthly Payment')!.value
            const monthlyIncome = annualIncome / 12
            
            // Calculate expected DTI
            const totalMonthlyDebt = estimatedMonthlyPayment + monthlyDebts
            const expectedDTI = totalMonthlyDebt / monthlyIncome
            
            // Verify DTI calculation is accurate
            expect(Math.abs(dtiRatio - expectedDTI)).toBeLessThan(0.0001)
            
            // Verify DTI is approximately 43% (within reasonable tolerance)
            // Note: It should be close to 43% but may vary slightly due to rounding
            expect(dtiRatio).toBeGreaterThanOrEqual(0.42)
            expect(dtiRatio).toBeLessThanOrEqual(0.44)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate loan-to-value ratio correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 1000, max: 200000 }), // Ensure non-zero down payment
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs: AffordabilityInputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            const results = calculateAffordability(inputs)
            
            const ltvRatio = results.find(r => r.label === 'Loan-to-Value Ratio')!.value
            const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')!.value
            const maxLoanAmount = results.find(r => r.label === 'Maximum Loan Amount')!.value
            
            // Calculate expected LTV
            const expectedLTV = maxHomePrice > 0 ? maxLoanAmount / maxHomePrice : 0
            
            // Verify LTV calculation is accurate
            expect(Math.abs(ltvRatio - expectedLTV)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          (annualIncome, monthlyDebts, downPayment) => {
            const inputs: AffordabilityInputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate: 0
            }
            
            const results = calculateAffordability(inputs)
            
            const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')!.value
            const maxLoanAmount = results.find(r => r.label === 'Maximum Loan Amount')!.value
            const estimatedMonthlyPayment = results.find(r => r.label === 'Estimated Monthly Payment')!.value
            
            // Calculate expected values for 0% interest
            const monthlyIncome = annualIncome / 12
            const DTI_RATIO = 0.43
            const maxMonthlyPayment = monthlyIncome * DTI_RATIO - monthlyDebts
            const numberOfPayments = 360
            const expectedMaxLoanAmount = maxMonthlyPayment * numberOfPayments
            const expectedMaxHomePrice = expectedMaxLoanAmount + downPayment
            const expectedMonthlyPayment = expectedMaxLoanAmount / numberOfPayments
            
            // Verify calculations are accurate
            expect(Math.abs(maxHomePrice - expectedMaxHomePrice)).toBeLessThan(0.01)
            expect(Math.abs(maxLoanAmount - expectedMaxLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(estimatedMonthlyPayment - expectedMonthlyPayment)).toBeLessThan(0.01)
            
            // Verify no infinite or NaN values
            expect(isFinite(maxHomePrice)).toBe(true)
            expect(isFinite(maxLoanAmount)).toBe(true)
            expect(isFinite(estimatedMonthlyPayment)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should produce consistent results for the same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs: AffordabilityInputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Calculate twice with same inputs
            const results1 = calculateAffordability(inputs)
            const results2 = calculateAffordability(inputs)
            
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
  })

  /**
   * **Validates: Requirements 1.4**
   * 
   * Property 4: Input Validation
   * For any invalid input (negative numbers, non-numeric values, out-of-range values), 
   * the calculator should reject the input and display a validation error without performing calculation.
   */
  describe('Property 4: Input Validation', () => {
    it('should reject negative annual income', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000000, max: -1 }), // Negative income
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject negative monthly debts', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: -100000, max: -1 }), // Negative debts
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject negative down payment', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: -10000000, max: -1 }), // Negative down payment
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject interest rate above 20%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(20.01), max: Math.fround(100), noNaN: true }), // Rate > 20%
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject interest rate below 0%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(-50), max: Math.fround(-0.01), noNaN: true }), // Negative rate
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject annual income exceeding maximum (10,000,000)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000001, max: 50000000 }), // Income > max
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject monthly debts exceeding maximum (100,000)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 100001, max: 500000 }), // Debts > max
          fc.integer({ min: 0, max: 200000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject down payment exceeding maximum (10,000,000)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20000, max: 500000 }),
          fc.integer({ min: 0, max: 5000 }),
          fc.integer({ min: 10000001, max: 50000000 }), // Down payment > max
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should throw validation error
            expect(() => calculateAffordability(inputs as any)).toThrow()
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should reject NaN values for any input field', () => {
      const validInputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      // Test NaN for each field
      const fieldsToTest: Array<keyof typeof validInputs> = ['annualIncome', 'monthlyDebts', 'downPayment', 'interestRate']
      
      fieldsToTest.forEach(field => {
        const inputs = { ...validInputs, [field]: NaN }
        expect(() => calculateAffordability(inputs as any)).toThrow()
      })
    })
    
    it('should reject Infinity values for any input field', () => {
      const validInputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      // Test Infinity for each field
      const fieldsToTest: Array<keyof typeof validInputs> = ['annualIncome', 'monthlyDebts', 'downPayment', 'interestRate']
      
      fieldsToTest.forEach(field => {
        const inputs = { ...validInputs, [field]: Infinity }
        expect(() => calculateAffordability(inputs as any)).toThrow()
      })
    })
    
    it('should accept all valid inputs within specified ranges', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10000000 }), // Valid income range
          fc.integer({ min: 0, max: 100000 }), // Valid debts range
          fc.integer({ min: 0, max: 10000000 }), // Valid down payment range
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }), // Valid rate range
          (annualIncome, monthlyDebts, downPayment, interestRate) => {
            const inputs = {
              annualIncome,
              monthlyDebts,
              downPayment,
              interestRate
            }
            
            // Should NOT throw for valid inputs
            expect(() => calculateAffordability(inputs as any)).not.toThrow()
            
            // Should return valid results
            const results = calculateAffordability(inputs as any)
            expect(results).toBeDefined()
            expect(Array.isArray(results)).toBe(true)
            expect(results.length).toBe(6)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
