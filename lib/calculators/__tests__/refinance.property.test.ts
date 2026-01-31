// Property-based tests for refinance calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculateRefinance } from '../refinance'
import type { RefinanceInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('Refinance Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate monthly payments using correct mortgage formula', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }), // currentBalance
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }), // currentRate
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }), // newRate
          fc.integer({ min: 1, max: 30 }), // remainingTerm
          fc.integer({ min: 1, max: 30 }), // newTerm
          fc.integer({ min: 0, max: 100000 }), // closingCosts
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            // Skip edge cases with very small interest rates that cause numerical instability
            if (currentRate > 0 && currentRate < 0.001) return true
            if (newRate > 0 && newRate < 0.001) return true
            
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            const breakEvenMonths = results.find(r => r.label === 'Break-Even Point')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const rateReduction = results.find(r => r.label === 'Interest Rate Reduction')!.value
            
            // Calculate expected values
            const currentMonthlyRate = currentRate / 100 / 12
            const newMonthlyRate = newRate / 100 / 12
            const currentPayments = remainingTerm * 12
            const newPayments = newTerm * 12
            
            // Expected current monthly payment
            let expectedCurrentPayment: number
            if (currentMonthlyRate === 0) {
              expectedCurrentPayment = currentBalance / currentPayments
            } else {
              expectedCurrentPayment = currentBalance * 
                (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) / 
                (Math.pow(1 + currentMonthlyRate, currentPayments) - 1)
            }
            
            // Expected new loan amount
            const expectedNewLoanAmount = currentBalance + closingCosts
            
            // Expected new monthly payment
            let expectedNewPayment: number
            if (newMonthlyRate === 0) {
              expectedNewPayment = expectedNewLoanAmount / newPayments
            } else {
              expectedNewPayment = expectedNewLoanAmount * 
                (newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) / 
                (Math.pow(1 + newMonthlyRate, newPayments) - 1)
            }
            
            // Expected monthly savings
            const expectedMonthlySavings = expectedCurrentPayment - expectedNewPayment
            
            // Expected break-even
            let expectedBreakEven: number
            if (expectedMonthlySavings > 0) {
              expectedBreakEven = closingCosts / expectedMonthlySavings
            } else {
              expectedBreakEven = Infinity
            }
            
            // Expected rate reduction
            const expectedRateReduction = (currentRate - newRate) / 100
            
            // Verify calculations
            expect(Math.abs(currentMonthlyPayment - expectedCurrentPayment)).toBeLessThan(0.01)
            expect(Math.abs(newMonthlyPayment - expectedNewPayment)).toBeLessThan(0.01)
            expect(Math.abs(newLoanAmount - expectedNewLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(monthlySavings - expectedMonthlySavings)).toBeLessThan(0.01)
            expect(Math.abs(rateReduction - expectedRateReduction)).toBeLessThan(0.0001)
            
            // Break-even can be Infinity, so handle that case
            if (isFinite(expectedBreakEven)) {
              expect(Math.abs(breakEvenMonths - expectedBreakEven)).toBeLessThan(0.01)
            } else {
              expect(breakEvenMonths).toBe(Infinity)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: monthlySavings = currentPayment - newPayment', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            if (currentRate > 0 && currentRate < 0.001) return true
            if (newRate > 0 && newRate < 0.001) return true
            
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            
            const expectedSavings = currentMonthlyPayment - newMonthlyPayment
            expect(Math.abs(monthlySavings - expectedSavings)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: newLoanAmount = currentBalance + closingCosts', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            if (currentRate > 0 && currentRate < 0.001) return true
            if (newRate > 0 && newRate < 0.001) return true
            
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const closingCostsResult = results.find(r => r.label === 'Closing Costs')!.value
            
            expect(Math.abs(newLoanAmount - (currentBalance + closingCostsResult))).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate break-even point correctly when there are savings', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 100000 }), // Non-zero closing costs
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            const breakEvenMonths = results.find(r => r.label === 'Break-Even Point')!.value
            
            if (monthlySavings > 0) {
              // If there are savings, break-even should be closingCosts / monthlySavings
              const expectedBreakEven = closingCosts / monthlySavings
              expect(Math.abs(breakEvenMonths - expectedBreakEven)).toBeLessThan(0.01)
              expect(breakEvenMonths).toBeGreaterThan(0)
              expect(isFinite(breakEvenMonths)).toBe(true)
            } else {
              // If no savings or negative savings, break-even should be Infinity
              expect(breakEvenMonths).toBe(Infinity)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate interest rate reduction correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            if (currentRate > 0 && currentRate < 0.001) return true
            if (newRate > 0 && newRate < 0.001) return true
            
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const rateReduction = results.find(r => r.label === 'Interest Rate Reduction')!.value
            
            const expectedReduction = (currentRate - newRate) / 100
            expect(Math.abs(rateReduction - expectedReduction)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate total interest correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const totalCurrentInterest = results.find(r => r.label === 'Total Interest (Current Loan)')!.value
            const totalNewInterest = results.find(r => r.label === 'Total Interest (New Loan)')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            
            const currentPayments = remainingTerm * 12
            const newPayments = newTerm * 12
            
            // Total interest = (monthly payment × number of payments) - principal
            const expectedCurrentInterest = (currentMonthlyPayment * currentPayments) - currentBalance
            const expectedNewInterest = (newMonthlyPayment * newPayments) - newLoanAmount
            
            expect(Math.abs(totalCurrentInterest - expectedCurrentInterest)).toBeLessThan(0.01)
            expect(Math.abs(totalNewInterest - expectedNewInterest)).toBeLessThan(0.01)
            expect(totalCurrentInterest).toBeGreaterThanOrEqual(0)
            expect(totalNewInterest).toBeGreaterThanOrEqual(0)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate lifetime savings correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const lifetimeSavings = results.find(r => r.label === 'Lifetime Savings')!.value
            
            const currentPayments = remainingTerm * 12
            const newPayments = newTerm * 12
            
            // Lifetime savings = total current cost - total new cost
            const totalCurrentCost = currentMonthlyPayment * currentPayments
            const totalNewCost = newMonthlyPayment * newPayments
            const expectedLifetimeSavings = totalCurrentCost - totalNewCost
            
            expect(Math.abs(lifetimeSavings - expectedLifetimeSavings)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, remainingTerm, newTerm, closingCosts) => {
            const inputs: RefinanceInputs = {
              currentBalance,
              currentRate: 0,
              newRate: 0,
              remainingTerm,
              newTerm,
              closingCosts
            }
            
            const results = calculateRefinance(inputs)
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const totalCurrentInterest = results.find(r => r.label === 'Total Interest (Current Loan)')!.value
            const totalNewInterest = results.find(r => r.label === 'Total Interest (New Loan)')!.value
            
            const currentPayments = remainingTerm * 12
            const newPayments = newTerm * 12
            const newLoanAmount = currentBalance + closingCosts
            
            // With 0% interest, payment should be principal / months
            const expectedCurrentPayment = currentBalance / currentPayments
            const expectedNewPayment = newLoanAmount / newPayments
            
            expect(Math.abs(currentMonthlyPayment - expectedCurrentPayment)).toBeLessThan(0.01)
            expect(Math.abs(newMonthlyPayment - expectedNewPayment)).toBeLessThan(0.01)
            expect(Math.abs(totalCurrentInterest)).toBeLessThan(0.01) // Should be ~0
            expect(Math.abs(totalNewInterest)).toBeLessThan(0.01) // Should be ~0
            expect(isFinite(currentMonthlyPayment)).toBe(true)
            expect(isFinite(newMonthlyPayment)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero closing costs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm) => {
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts: 0
            }
            
            const results = calculateRefinance(inputs)
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const closingCostsResult = results.find(r => r.label === 'Closing Costs')!.value
            const breakEvenMonths = results.find(r => r.label === 'Break-Even Point')!.value
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            
            // With zero closing costs, new loan amount should equal current balance
            expect(Math.abs(newLoanAmount - currentBalance)).toBeLessThan(0.01)
            expect(closingCostsResult).toBe(0)
            
            // Break-even should be 0 if there are savings (no costs to recover)
            if (monthlySavings > 0) {
              expect(breakEvenMonths).toBe(0)
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
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 1, max: 30 }),
          fc.integer({ min: 0, max: 100000 }),
          (currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts) => {
            if (currentRate > 0 && currentRate < 0.001) return true
            if (newRate > 0 && newRate < 0.001) return true
            
            const inputs: RefinanceInputs = {
              currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts
            }
            
            const results1 = calculateRefinance(inputs)
            const results2 = calculateRefinance(inputs)
            
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
