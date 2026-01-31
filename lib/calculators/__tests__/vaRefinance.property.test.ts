// Property-based tests for VA refinance calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculateVARefinance } from '../vaRefinance'
import type { VARefinanceInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('VA Refinance Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate VA refinance using correct formulas', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }), // currentBalance
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100), // currentRate (0-20%)
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100), // newRate (0-20%)
          fc.integer({ min: 0, max: 1000000 }), // cashOutAmount
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100), // vaFundingFee (0-10%)
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance,
              currentRate,
              newRate,
              cashOutAmount,
              vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            // Extract results
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            const cashOut = results.find(r => r.label === 'Cash Out Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const currentLoanBalance = results.find(r => r.label === 'Current Loan Balance')!.value
            const loanIncrease = results.find(r => r.label === 'Loan Increase')!.value
            const rateReduction = results.find(r => r.label === 'Interest Rate Reduction')!.value
            const lifetimeSavings = results.find(r => r.label === 'Lifetime Savings')!.value
            const totalCurrentInterest = results.find(r => r.label === 'Total Interest (Current Loan)')!.value
            const totalNewInterest = results.find(r => r.label === 'Total Interest (New Loan)')!.value
            
            // Calculate expected values
            const loanTerm = 30
            const numberOfPayments = loanTerm * 12
            
            // Expected current monthly payment
            const currentMonthlyRate = currentRate / 100 / 12
            let expectedCurrentMonthlyPayment: number
            
            if (currentMonthlyRate < 0.000001) {
              expectedCurrentMonthlyPayment = currentBalance / numberOfPayments
            } else {
              expectedCurrentMonthlyPayment = currentBalance * 
                (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, numberOfPayments)) / 
                (Math.pow(1 + currentMonthlyRate, numberOfPayments) - 1)
            }
            
            // Expected new loan calculations
            const baseNewLoanAmount = currentBalance + cashOutAmount
            const expectedFundingFeeAmount = baseNewLoanAmount * (vaFundingFee / 100)
            const expectedNewLoanAmount = baseNewLoanAmount + expectedFundingFeeAmount
            
            // Expected new monthly payment
            const newMonthlyRate = newRate / 100 / 12
            let expectedNewMonthlyPayment: number
            
            if (newMonthlyRate < 0.000001) {
              expectedNewMonthlyPayment = expectedNewLoanAmount / numberOfPayments
            } else {
              expectedNewMonthlyPayment = expectedNewLoanAmount * 
                (newMonthlyRate * Math.pow(1 + newMonthlyRate, numberOfPayments)) / 
                (Math.pow(1 + newMonthlyRate, numberOfPayments) - 1)
            }
            
            // Expected monthly savings
            const expectedMonthlySavings = expectedCurrentMonthlyPayment - expectedNewMonthlyPayment
            
            // Expected loan increase
            const expectedLoanIncrease = expectedNewLoanAmount - currentBalance
            
            // Expected rate reduction
            const expectedRateReduction = (currentRate - newRate) / 100
            
            // Expected total interest
            const expectedTotalCurrentPayments = expectedCurrentMonthlyPayment * numberOfPayments
            const expectedTotalCurrentInterest = expectedTotalCurrentPayments - currentBalance
            
            const expectedTotalNewPayments = expectedNewMonthlyPayment * numberOfPayments
            const expectedTotalNewInterest = expectedTotalNewPayments - expectedNewLoanAmount
            
            // Expected lifetime savings
            const expectedLifetimeSavings = expectedTotalCurrentPayments - expectedTotalNewPayments
            
            // Verify calculations are accurate within $0.01 tolerance
            expect(Math.abs(currentMonthlyPayment - expectedCurrentMonthlyPayment)).toBeLessThan(0.01)
            expect(Math.abs(newMonthlyPayment - expectedNewMonthlyPayment)).toBeLessThan(0.01)
            expect(Math.abs(monthlySavings - expectedMonthlySavings)).toBeLessThan(0.01)
            expect(Math.abs(cashOut - cashOutAmount)).toBeLessThan(0.01)
            expect(Math.abs(fundingFeeAmount - expectedFundingFeeAmount)).toBeLessThan(0.01)
            expect(Math.abs(newLoanAmount - expectedNewLoanAmount)).toBeLessThan(0.01)
            expect(Math.abs(currentLoanBalance - currentBalance)).toBeLessThan(0.01)
            expect(Math.abs(loanIncrease - expectedLoanIncrease)).toBeLessThan(0.01)
            expect(Math.abs(rateReduction - expectedRateReduction)).toBeLessThan(0.0001)
            expect(Math.abs(totalCurrentInterest - expectedTotalCurrentInterest)).toBeLessThan(0.01)
            expect(Math.abs(totalNewInterest - expectedTotalNewInterest)).toBeLessThan(0.01)
            expect(Math.abs(lifetimeSavings - expectedLifetimeSavings)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain correct relationship: newLoanAmount = currentBalance + cashOut + fundingFee', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const cashOut = results.find(r => r.label === 'Cash Out Amount')!.value
            
            const expectedNewLoanAmount = currentBalance + cashOut + fundingFeeAmount
            expect(Math.abs(newLoanAmount - expectedNewLoanAmount)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: monthlySavings = currentPayment - newPayment', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            
            const expectedMonthlySavings = currentMonthlyPayment - newMonthlyPayment
            expect(Math.abs(monthlySavings - expectedMonthlySavings)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should calculate VA funding fee as percentage of base new loan amount', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const cashOut = results.find(r => r.label === 'Cash Out Amount')!.value
            
            const baseNewLoanAmount = currentBalance + cashOut
            const expectedFundingFee = baseNewLoanAmount * (vaFundingFee / 100)
            expect(Math.abs(fundingFeeAmount - expectedFundingFee)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate loan increase correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const loanIncrease = results.find(r => r.label === 'Loan Increase')!.value
            
            const expectedLoanIncrease = newLoanAmount - currentBalance
            expect(Math.abs(loanIncrease - expectedLoanIncrease)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should calculate interest rate reduction correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const rateReduction = results.find(r => r.label === 'Interest Rate Reduction')!.value
            
            const expectedRateReduction = (currentRate - newRate) / 100
            expect(Math.abs(rateReduction - expectedRateReduction)).toBeLessThan(0.0001)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance,
              currentRate: 0,
              newRate: 0,
              cashOutAmount,
              vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            
            // Calculate expected values for 0% interest
            const numberOfPayments = 30 * 12
            const expectedCurrentMonthlyPayment = currentBalance / numberOfPayments
            const expectedNewMonthlyPayment = newLoanAmount / numberOfPayments
            
            expect(Math.abs(currentMonthlyPayment - expectedCurrentMonthlyPayment)).toBeLessThan(0.01)
            expect(Math.abs(newMonthlyPayment - expectedNewMonthlyPayment)).toBeLessThan(0.01)
            expect(isFinite(currentMonthlyPayment)).toBe(true)
            expect(isFinite(newMonthlyPayment)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should handle edge case: zero funding fee (disabled veteran)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          (currentBalance, currentRate, newRate, cashOutAmount) => {
            const inputs: VARefinanceInputs = {
              currentBalance,
              currentRate,
              newRate,
              cashOutAmount,
              vaFundingFee: 0 // Disabled veterans are exempt
            }
            
            const results = calculateVARefinance(inputs)
            
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            
            expect(fundingFeeAmount).toBe(0)
            
            const expectedNewLoanAmount = currentBalance + cashOutAmount
            expect(Math.abs(newLoanAmount - expectedNewLoanAmount)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: no cash out (IRRRL streamline refinance)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance,
              currentRate,
              newRate,
              cashOutAmount: 0,
              vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const cashOut = results.find(r => r.label === 'Cash Out Amount')!.value
            const fundingFeeAmount = results.find(r => r.label === 'VA Funding Fee')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            
            expect(cashOut).toBe(0)
            
            const expectedFundingFee = currentBalance * (vaFundingFee / 100)
            const expectedNewLoanAmount = currentBalance + expectedFundingFee
            
            expect(Math.abs(fundingFeeAmount - expectedFundingFee)).toBeLessThan(0.01)
            expect(Math.abs(newLoanAmount - expectedNewLoanAmount)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should calculate total interest correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 10, max: 2000 }).map(n => n / 100), // Avoid 0% for this test (0.1-20%)
          fc.integer({ min: 10, max: 2000 }).map(n => n / 100), // Avoid 0% for this test (0.1-20%)
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const totalCurrentInterest = results.find(r => r.label === 'Total Interest (Current Loan)')!.value
            const totalNewInterest = results.find(r => r.label === 'Total Interest (New Loan)')!.value
            
            const numberOfPayments = 30 * 12
            
            // Verify current loan interest
            const expectedTotalCurrentPayments = currentMonthlyPayment * numberOfPayments
            const expectedTotalCurrentInterest = expectedTotalCurrentPayments - currentBalance
            expect(Math.abs(totalCurrentInterest - expectedTotalCurrentInterest)).toBeLessThan(0.01)
            
            // Verify new loan interest
            const expectedTotalNewPayments = newMonthlyPayment * numberOfPayments
            const expectedTotalNewInterest = expectedTotalNewPayments - newLoanAmount
            expect(Math.abs(totalNewInterest - expectedTotalNewInterest)).toBeLessThan(0.01)
            
            // Total interest should be positive for loans with interest
            expect(totalCurrentInterest).toBeGreaterThan(0)
            expect(totalNewInterest).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate lifetime savings correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const lifetimeSavings = results.find(r => r.label === 'Lifetime Savings')!.value
            
            const numberOfPayments = 30 * 12
            const expectedTotalCurrentPayments = currentMonthlyPayment * numberOfPayments
            const expectedTotalNewPayments = newMonthlyPayment * numberOfPayments
            const expectedLifetimeSavings = expectedTotalCurrentPayments - expectedTotalNewPayments
            
            expect(Math.abs(lifetimeSavings - expectedLifetimeSavings)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should produce consistent results for the same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            // Calculate twice with same inputs
            const results1 = calculateVARefinance(inputs)
            const results2 = calculateVARefinance(inputs)
            
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
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
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
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100), // 2-10%
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100), // 2-10%
          fc.integer({ min: 0, max: 200000 }),
          fc.integer({ min: 50, max: 500 }).map(n => n / 100), // 0.5-5%
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const currentMonthlyPayment = results.find(r => r.label === 'Current Monthly Payment')!.value
            const newMonthlyPayment = results.find(r => r.label === 'New Monthly Payment')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            
            // Verify using standard mortgage formula for current loan
            const currentMonthlyRate = currentRate / 100 / 12
            const numberOfPayments = 30 * 12
            
            const expectedCurrentMonthlyPayment = currentBalance * 
              (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, numberOfPayments)) / 
              (Math.pow(1 + currentMonthlyRate, numberOfPayments) - 1)
            
            expect(Math.abs(currentMonthlyPayment - expectedCurrentMonthlyPayment)).toBeLessThan(0.01)
            
            // Verify using standard mortgage formula for new loan
            const newMonthlyRate = newRate / 100 / 12
            
            const expectedNewMonthlyPayment = newLoanAmount * 
              (newMonthlyRate * Math.pow(1 + newMonthlyRate, numberOfPayments)) / 
              (Math.pow(1 + newMonthlyRate, numberOfPayments) - 1)
            
            expect(Math.abs(newMonthlyPayment - expectedNewMonthlyPayment)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle minimum valid values', () => {
      fc.assert(
        fc.property(
          fc.constant(1000), // Minimum current balance
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.integer({ min: 0, max: 2000 }).map(n => n / 100),
          fc.constant(0), // Minimum cash out
          fc.constant(0), // Minimum funding fee
          (currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee) => {
            const inputs: VARefinanceInputs = {
              currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
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

    it('should handle rate increases (negative savings)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000000 }),
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100), // 2-10%
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000 }).map(n => n / 100),
          (currentBalance, currentRate, cashOutAmount, vaFundingFee) => {
            // New rate is higher than current rate
            const newRate = currentRate + 1.0 // Add 1% to current rate
            
            const inputs: VARefinanceInputs = {
              currentBalance,
              currentRate,
              newRate,
              cashOutAmount,
              vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const monthlySavings = results.find(r => r.label === 'Monthly Savings')!.value
            const rateReduction = results.find(r => r.label === 'Interest Rate Reduction')!.value
            const lifetimeSavings = results.find(r => r.label === 'Lifetime Savings')!.value
            
            // When rate increases, savings should be negative (or close to negative accounting for cash out)
            expect(rateReduction).toBeLessThan(0)
            
            // All values should still be finite
            expect(isFinite(monthlySavings)).toBe(true)
            expect(isFinite(lifetimeSavings)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle large cash out amounts', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100000, max: 1000000 }),
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 200, max: 1000 }).map(n => n / 100),
          fc.integer({ min: 100, max: 500 }).map(n => n / 100),
          (currentBalance, currentRate, newRate, vaFundingFee) => {
            // Large cash out (50% of current balance)
            const cashOutAmount = Math.floor(currentBalance * 0.5)
            
            const inputs: VARefinanceInputs = {
              currentBalance,
              currentRate,
              newRate,
              cashOutAmount,
              vaFundingFee
            }
            
            const results = calculateVARefinance(inputs)
            
            const cashOut = results.find(r => r.label === 'Cash Out Amount')!.value
            const newLoanAmount = results.find(r => r.label === 'New Loan Amount')!.value
            const loanIncrease = results.find(r => r.label === 'Loan Increase')!.value
            
            // Verify cash out is correct
            expect(Math.abs(cashOut - cashOutAmount)).toBeLessThan(0.01)
            
            // New loan should be significantly larger than current balance
            expect(newLoanAmount).toBeGreaterThan(currentBalance)
            
            // Loan increase should be positive and include cash out + funding fee
            expect(loanIncrease).toBeGreaterThan(cashOutAmount)
            
            // All values should be finite
            results.forEach(result => {
              expect(isFinite(result.value)).toBe(true)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
