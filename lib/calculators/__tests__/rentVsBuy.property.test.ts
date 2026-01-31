// Property-based tests for rent vs buy calculator
// Feature: website-structure-migration, Property 3: Calculation Accuracy

import fc from 'fast-check'
import { calculateRentVsBuy } from '../rentVsBuy'
import type { RentVsBuyInputs } from '@/lib/utils/validators'

/**
 * **Validates: Requirements 1.3, 1.6**
 * 
 * Property 3: Calculation Accuracy
 * For any valid input set to a calculator, the computed results should match 
 * the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
 */
describe('Rent vs Buy Calculator - Property-Based Tests', () => {
  describe('Property 3: Calculation Accuracy', () => {
    it('should calculate rent vs buy comparison using correct formulas', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }), // homePrice
          fc.integer({ min: 0, max: 500000 }), // downPayment
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }), // interestRate
          fc.integer({ min: 500, max: 10000 }), // rentAmount
          fc.integer({ min: 1, max: 30 }), // yearsToStay
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }), // appreciationRate
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            // Skip if down payment exceeds home price
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice,
              downPayment,
              interestRate,
              rentAmount,
              yearsToStay,
              appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            // Extract results
            const totalBuyingCost = results.find(r => r.label === 'Total Cost of Buying')!.value
            const totalRentingCost = results.find(r => r.label === 'Total Cost of Renting')!.value
            const netDifference = results.find(r => r.label === 'Net Difference')!.value
            const monthlyPI = results.find(r => r.label === 'Monthly Mortgage Payment')!.value
            const totalMonthlyOwning = results.find(r => r.label === 'Total Monthly Homeownership Cost')!.value
            const equityBuilt = results.find(r => r.label === 'Equity Built')!.value
            const futureHomeValue = results.find(r => r.label === 'Home Value After Period')!.value
            const totalAppreciation = results.find(r => r.label === 'Total Appreciation')!.value
            const closingCosts = results.find(r => r.label === 'Closing Costs')!.value
            
            // Calculate expected values
            const loanAmount = homePrice - downPayment
            const monthlyInterestRate = interestRate / 100 / 12
            const numberOfPayments = 360
            const monthsToStay = yearsToStay * 12
            
            // Expected monthly P&I payment
            let expectedMonthlyPI: number
            if (loanAmount === 0) {
              expectedMonthlyPI = 0
            } else if (monthlyInterestRate < 0.000001) {
              expectedMonthlyPI = loanAmount / numberOfPayments
            } else {
              expectedMonthlyPI = loanAmount * 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
            }
            
            // Expected additional monthly costs
            const expectedMonthlyPropertyTax = (homePrice * 0.012) / 12
            const expectedMonthlyInsurance = (homePrice * 0.005) / 12
            const expectedMonthlyMaintenance = (homePrice * 0.01) / 12
            const expectedTotalMonthlyOwning = expectedMonthlyPI + expectedMonthlyPropertyTax + 
                                               expectedMonthlyInsurance + expectedMonthlyMaintenance
            
            // Expected closing costs (3% of home price)
            const expectedClosingCosts = homePrice * 0.03
            
            // Expected total buying cost
            const expectedTotalBuyingCostBeforeEquity = downPayment + expectedClosingCosts + 
                                                        (expectedTotalMonthlyOwning * monthsToStay)
            
            // Expected home appreciation
            const annualAppreciationRate = appreciationRate / 100
            const expectedFutureHomeValue = homePrice * Math.pow(1 + annualAppreciationRate, yearsToStay)
            const expectedTotalAppreciation = expectedFutureHomeValue - homePrice
            
            // Expected remaining balance
            let expectedRemainingBalance: number
            if (loanAmount === 0) {
              expectedRemainingBalance = 0
            } else if (monthlyInterestRate < 0.000001) {
              expectedRemainingBalance = Math.max(0, loanAmount - (expectedMonthlyPI * monthsToStay))
            } else {
              const paymentsRemaining = numberOfPayments - monthsToStay
              if (paymentsRemaining <= 0) {
                expectedRemainingBalance = 0
              } else {
                expectedRemainingBalance = expectedMonthlyPI * 
                  ((1 - Math.pow(1 + monthlyInterestRate, -paymentsRemaining)) / monthlyInterestRate)
              }
            }
            
            // Expected equity built
            const expectedPrincipalPaid = loanAmount - expectedRemainingBalance
            const expectedEquityBuilt = downPayment + expectedPrincipalPaid + expectedTotalAppreciation
            
            // Expected net buying cost
            const expectedNetBuyingCost = expectedTotalBuyingCostBeforeEquity - expectedEquityBuilt
            
            // Expected total renting cost (with 3% annual inflation)
            const annualRentInflation = 0.03
            let expectedTotalRentingCost = 0
            let currentRent = rentAmount
            for (let year = 1; year <= yearsToStay; year++) {
              expectedTotalRentingCost += currentRent * 12
              currentRent = currentRent * (1 + annualRentInflation)
            }
            
            // Expected net difference
            const expectedNetDifference = Math.abs(expectedTotalRentingCost - expectedNetBuyingCost)
            
            // Verify calculations are accurate within $0.01 tolerance
            expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            expect(Math.abs(totalMonthlyOwning - expectedTotalMonthlyOwning)).toBeLessThan(0.01)
            expect(Math.abs(closingCosts - expectedClosingCosts)).toBeLessThan(0.01)
            expect(Math.abs(futureHomeValue - expectedFutureHomeValue)).toBeLessThan(0.01)
            expect(Math.abs(totalAppreciation - expectedTotalAppreciation)).toBeLessThan(0.01)
            expect(Math.abs(equityBuilt - expectedEquityBuilt)).toBeLessThan(0.01)
            expect(Math.abs(totalBuyingCost - expectedNetBuyingCost)).toBeLessThan(0.01)
            expect(Math.abs(totalRentingCost - expectedTotalRentingCost)).toBeLessThan(0.01)
            expect(Math.abs(netDifference - expectedNetDifference)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should maintain correct relationship: netDifference = |totalRenting - totalBuying|', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const totalBuyingCost = results.find(r => r.label === 'Total Cost of Buying')!.value
            const totalRentingCost = results.find(r => r.label === 'Total Cost of Renting')!.value
            const netDifference = results.find(r => r.label === 'Net Difference')!.value
            
            const expectedDifference = Math.abs(totalRentingCost - totalBuyingCost)
            expect(Math.abs(netDifference - expectedDifference)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate home appreciation correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const futureHomeValue = results.find(r => r.label === 'Home Value After Period')!.value
            const totalAppreciation = results.find(r => r.label === 'Total Appreciation')!.value
            
            const annualAppreciationRate = appreciationRate / 100
            const expectedFutureValue = homePrice * Math.pow(1 + annualAppreciationRate, yearsToStay)
            const expectedAppreciation = expectedFutureValue - homePrice
            
            expect(Math.abs(futureHomeValue - expectedFutureValue)).toBeLessThan(0.01)
            expect(Math.abs(totalAppreciation - expectedAppreciation)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate rent inflation correctly at 3% annually', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const totalRentingCost = results.find(r => r.label === 'Total Cost of Renting')!.value
            
            // Calculate expected total rent with 3% annual inflation
            const annualRentInflation = 0.03
            let expectedTotalRent = 0
            let currentRent = rentAmount
            
            for (let year = 1; year <= yearsToStay; year++) {
              expectedTotalRent += currentRent * 12
              currentRent = currentRent * (1 + annualRentInflation)
            }
            
            expect(Math.abs(totalRentingCost - expectedTotalRent)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should calculate closing costs as 3% of home price', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const closingCosts = results.find(r => r.label === 'Closing Costs')!.value
            const expectedClosingCosts = homePrice * 0.03
            
            expect(Math.abs(closingCosts - expectedClosingCosts)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: zero interest rate without division by zero', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice,
              downPayment,
              interestRate: 0,
              rentAmount,
              yearsToStay,
              appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Monthly Mortgage Payment')!.value
            const totalBuyingCost = results.find(r => r.label === 'Total Cost of Buying')!.value
            const totalRentingCost = results.find(r => r.label === 'Total Cost of Renting')!.value
            
            // Calculate expected values for 0% interest
            const loanAmount = homePrice - downPayment
            const numberOfPayments = 360
            const expectedMonthlyPI = loanAmount > 0 ? loanAmount / numberOfPayments : 0
            
            expect(Math.abs(monthlyPI - expectedMonthlyPI)).toBeLessThan(0.01)
            expect(isFinite(monthlyPI)).toBe(true)
            expect(isFinite(totalBuyingCost)).toBe(true)
            expect(isFinite(totalRentingCost)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle edge case: 100% down payment (no loan)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            const inputs: RentVsBuyInputs = {
              homePrice,
              downPayment: homePrice, // 100% down
              interestRate,
              rentAmount,
              yearsToStay,
              appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const monthlyPI = results.find(r => r.label === 'Monthly Mortgage Payment')!.value
            
            // With 100% down payment, there should be no mortgage payment
            expect(monthlyPI).toBe(0)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should handle negative appreciation rates correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(-0.1), noNaN: true }), // Negative appreciation
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const futureHomeValue = results.find(r => r.label === 'Home Value After Period')!.value
            const totalAppreciation = results.find(r => r.label === 'Total Appreciation')!.value
            
            // With negative appreciation, future value should be less than current value
            expect(futureHomeValue).toBeLessThan(homePrice)
            expect(totalAppreciation).toBeLessThan(0)
            
            // Verify the calculation is correct
            const annualAppreciationRate = appreciationRate / 100
            const expectedFutureValue = homePrice * Math.pow(1 + annualAppreciationRate, yearsToStay)
            expect(Math.abs(futureHomeValue - expectedFutureValue)).toBeLessThan(0.01)
          }
        ),
        { numRuns: 100 }
      )
    })
    
    it('should produce consistent results for the same inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            // Calculate twice with same inputs
            const results1 = calculateRentVsBuy(inputs)
            const results2 = calculateRentVsBuy(inputs)
            
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
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 0, max: 500000 }),
          fc.float({ min: Math.fround(0), max: Math.fround(20), noNaN: true }),
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
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
    
    it('should calculate equity built correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50000, max: 2000000 }),
          fc.integer({ min: 10000, max: 500000 }), // Ensure some down payment
          fc.float({ min: Math.fround(0.1), max: Math.fround(20), noNaN: true }), // Avoid 0% for this test
          fc.integer({ min: 500, max: 10000 }),
          fc.integer({ min: 1, max: 30 }),
          fc.float({ min: Math.fround(-10), max: Math.fround(20), noNaN: true }),
          (homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate) => {
            if (downPayment > homePrice) return true
            
            const inputs: RentVsBuyInputs = {
              homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate
            }
            
            const results = calculateRentVsBuy(inputs)
            
            const equityBuilt = results.find(r => r.label === 'Equity Built')!.value
            const totalAppreciation = results.find(r => r.label === 'Total Appreciation')!.value
            
            // Equity should include at least the down payment
            expect(equityBuilt).toBeGreaterThanOrEqual(downPayment + totalAppreciation - 0.01)
            
            // Equity should be finite
            expect(isFinite(equityBuilt)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
