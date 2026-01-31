// Unit tests for VA Refinance Calculator

import { calculateVARefinance, validateVARefinanceInputs } from '../vaRefinance'
import type { VARefinanceInputs } from '@/lib/utils/validators'

describe('VA Refinance Calculator', () => {
  describe('calculateVARefinance', () => {
    it('should calculate VA refinance with rate reduction and no cash out', () => {
      const inputs: VARefinanceInputs = {
        currentBalance: 300000,
        currentRate: 4.5,
        newRate: 3.0,
        cashOutAmount: 0,
        vaFundingFee: 0.5, // 0.5% for IRRRL (streamline refinance)
      }

      const results = calculateVARefinance(inputs)

      // Find specific results
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const currentPayment = results.find(r => r.label === 'Current Monthly Payment')
      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const newLoanAmount = results.find(r => r.label === 'New Loan Amount')

      // Verify results exist
      expect(newPayment).toBeDefined()
      expect(currentPayment).toBeDefined()
      expect(monthlySavings).toBeDefined()
      expect(fundingFee).toBeDefined()
      expect(newLoanAmount).toBeDefined()

      // Current payment at 4.5% for 30 years on $300,000
      expect(currentPayment!.value).toBeCloseTo(1520.06, 1)

      // Funding fee: 0.5% of $300,000 = $1,500
      expect(fundingFee!.value).toBeCloseTo(1500, 0)

      // New loan amount: $300,000 + $1,500 = $301,500
      expect(newLoanAmount!.value).toBeCloseTo(301500, 0)

      // New payment at 3.0% for 30 years on $301,500
      expect(newPayment!.value).toBeCloseTo(1271.14, 1)

      // Monthly savings should be positive (current - new)
      expect(monthlySavings!.value).toBeGreaterThan(0)
      expect(monthlySavings!.value).toBeCloseTo(248.92, 1)
    })

    it('should calculate VA refinance with cash out', () => {
      const inputs: VARefinanceInputs = {
        currentBalance: 250000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 50000,
        vaFundingFee: 2.3, // 2.3% for cash-out refinance
      }

      const results = calculateVARefinance(inputs)

      const cashOut = results.find(r => r.label === 'Cash Out Amount')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const newLoanAmount = results.find(r => r.label === 'New Loan Amount')
      const loanIncrease = results.find(r => r.label === 'Loan Increase')

      // Cash out should equal input
      expect(cashOut!.value).toBe(50000)

      // Base new loan: $250,000 + $50,000 = $300,000
      // Funding fee: 2.3% of $300,000 = $6,900
      expect(fundingFee!.value).toBeCloseTo(6900, 0)

      // New loan amount: $300,000 + $6,900 = $306,900
      expect(newLoanAmount!.value).toBeCloseTo(306900, 0)

      // Loan increase: $306,900 - $250,000 = $56,900
      expect(loanIncrease!.value).toBeCloseTo(56900, 0)
    })

    it('should handle zero interest rate edge case', () => {
      const inputs: VARefinanceInputs = {
        currentBalance: 200000,
        currentRate: 0,
        newRate: 0,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const results = calculateVARefinance(inputs)

      const currentPayment = results.find(r => r.label === 'Current Monthly Payment')
      const newPayment = results.find(r => r.label === 'New Monthly Payment')

      // With 0% interest, payment = principal / number of payments
      // Current: $200,000 / 360 = $555.56
      expect(currentPayment!.value).toBeCloseTo(555.56, 1)

      // New loan: $200,000 + ($200,000 * 0.005) = $201,000
      // New payment: $201,000 / 360 = $558.33
      expect(newPayment!.value).toBeCloseTo(558.33, 1)
    })

    it('should calculate negative savings when rate increases', () => {
      const inputs: VARefinanceInputs = {
        currentBalance: 300000,
        currentRate: 3.0,
        newRate: 4.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const results = calculateVARefinance(inputs)

      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      const rateReduction = results.find(r => r.label === 'Interest Rate Reduction')

      // Monthly savings should be negative (paying more)
      expect(monthlySavings!.value).toBeLessThan(0)

      // Rate reduction should be negative (rate increased)
      expect(rateReduction!.value).toBeLessThan(0)
    })

    it('should calculate all required result fields', () => {
      const inputs: VARefinanceInputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 25000,
        vaFundingFee: 2.3,
      }

      const results = calculateVARefinance(inputs)

      // Verify all expected result labels are present
      const expectedLabels = [
        'New Monthly Payment',
        'Current Monthly Payment',
        'Monthly Savings',
        'Cash Out Amount',
        'VA Funding Fee',
        'New Loan Amount',
        'Current Loan Balance',
        'Loan Increase',
        'Interest Rate Reduction',
        'Lifetime Savings',
        'Total Interest (Current Loan)',
        'Total Interest (New Loan)',
      ]

      expectedLabels.forEach(label => {
        const result = results.find(r => r.label === label)
        expect(result).toBeDefined()
        expect(result!.value).toBeDefined()
        expect(typeof result!.value).toBe('number')
      })
    })

    it('should format results correctly', () => {
      const inputs: VARefinanceInputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const results = calculateVARefinance(inputs)

      // Check currency formatting
      const currencyResults = results.filter(r => r.format === 'currency')
      expect(currencyResults.length).toBeGreaterThan(0)

      // Check percentage formatting
      const percentageResults = results.filter(r => r.format === 'percentage')
      expect(percentageResults.length).toBeGreaterThan(0)

      // Verify highlight flags
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      expect(newPayment!.highlight).toBe(true)

      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      expect(monthlySavings!.highlight).toBe(true)
    })

    it('should highlight cash out when amount is greater than zero', () => {
      const inputsWithCashOut: VARefinanceInputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 50000,
        vaFundingFee: 2.3,
      }

      const resultsWithCashOut = calculateVARefinance(inputsWithCashOut)
      const cashOutWithAmount = resultsWithCashOut.find(r => r.label === 'Cash Out Amount')
      expect(cashOutWithAmount!.highlight).toBe(true)

      const inputsNoCashOut: VARefinanceInputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const resultsNoCashOut = calculateVARefinance(inputsNoCashOut)
      const cashOutNoAmount = resultsNoCashOut.find(r => r.label === 'Cash Out Amount')
      expect(cashOutNoAmount!.highlight).toBe(false)
    })
  })

  describe('validateVARefinanceInputs', () => {
    it('should validate correct inputs', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })

    it('should reject negative current balance', () => {
      const inputs = {
        currentBalance: -100000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.currentBalance).toBeDefined()
    })

    it('should reject current balance below minimum', () => {
      const inputs = {
        currentBalance: 500, // Below $1,000 minimum
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.currentBalance).toBeDefined()
    })

    it('should reject negative interest rates', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: -1,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.currentRate).toBeDefined()
    })

    it('should reject interest rates above maximum', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 25, // Above 20% maximum
        cashOutAmount: 0,
        vaFundingFee: 0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.newRate).toBeDefined()
    })

    it('should reject negative cash out amount', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: -10000,
        vaFundingFee: 0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.cashOutAmount).toBeDefined()
    })

    it('should reject negative VA funding fee', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: -0.5,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.vaFundingFee).toBeDefined()
    })

    it('should reject VA funding fee above maximum', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 15, // Above 10% maximum
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.vaFundingFee).toBeDefined()
    })

    it('should accept zero values for optional amounts', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 4.0,
        newRate: 3.5,
        cashOutAmount: 0,
        vaFundingFee: 0,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
    })

    it('should handle multiple validation errors', () => {
      const inputs = {
        currentBalance: -100000,
        currentRate: -1,
        newRate: 25,
        cashOutAmount: -5000,
        vaFundingFee: -1,
      }

      const result = validateVARefinanceInputs(inputs)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(Object.keys(result.errors!).length).toBeGreaterThan(1)
    })
  })
})
