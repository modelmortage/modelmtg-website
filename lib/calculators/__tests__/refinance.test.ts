// Unit tests for refinance calculator

import { calculateRefinance, validateRefinanceInputs } from '../refinance'
import type { RefinanceInputs } from '@/lib/utils/validators'

describe('Refinance Calculator', () => {
  describe('calculateRefinance', () => {
    it('should calculate refinance savings correctly for a typical scenario', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 300000,
        currentRate: 6.0,
        newRate: 4.5,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 5000
      }
      
      const results = calculateRefinance(inputs)
      
      // Find specific results
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const currentPayment = results.find(r => r.label === 'Current Monthly Payment')
      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      const breakEven = results.find(r => r.label === 'Break-Even Point')
      const newLoanAmount = results.find(r => r.label === 'New Loan Amount')
      
      // Verify results exist
      expect(newPayment).toBeDefined()
      expect(currentPayment).toBeDefined()
      expect(monthlySavings).toBeDefined()
      expect(breakEven).toBeDefined()
      expect(newLoanAmount).toBeDefined()
      
      // Verify new loan amount includes closing costs
      expect(newLoanAmount?.value).toBe(305000)
      
      // Verify current payment is higher than new payment (rate decreased)
      expect(currentPayment!.value).toBeGreaterThan(newPayment!.value)
      
      // Verify monthly savings is positive
      expect(monthlySavings!.value).toBeGreaterThan(0)
      
      // Verify break-even point is reasonable (should be positive and finite)
      expect(breakEven!.value).toBeGreaterThan(0)
      expect(breakEven!.value).toBeLessThan(Infinity)
      
      // Verify formats
      expect(newPayment?.format).toBe('currency')
      expect(monthlySavings?.format).toBe('currency')
      expect(breakEven?.format).toBe('number')
    })
    
    it('should handle refinance with higher rate (negative savings)', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 200000,
        currentRate: 4.0,
        newRate: 5.5,
        remainingTerm: 20,
        newTerm: 30,
        closingCosts: 3000
      }
      
      const results = calculateRefinance(inputs)
      
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const currentPayment = results.find(r => r.label === 'Current Monthly Payment')
      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      const breakEven = results.find(r => r.label === 'Break-Even Point')
      
      // With higher rate, new payment might be lower due to longer term
      // But monthly savings could be negative or positive depending on term extension
      expect(monthlySavings).toBeDefined()
      
      // Break-even should be infinity if savings are negative
      if (monthlySavings!.value < 0) {
        expect(breakEven!.value).toBe(Infinity)
      }
    })
    
    it('should handle zero interest rate edge case', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 100000,
        currentRate: 0,
        newRate: 0,
        remainingTerm: 10,
        newTerm: 10,
        closingCosts: 1000
      }
      
      const results = calculateRefinance(inputs)
      
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const currentPayment = results.find(r => r.label === 'Current Monthly Payment')
      
      // With 0% interest, payment should be principal / months
      expect(currentPayment!.value).toBeCloseTo(100000 / 120, 2)
      expect(newPayment!.value).toBeCloseTo(101000 / 120, 2) // includes closing costs
    })
    
    it('should calculate break-even point correctly', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 250000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 20,
        newTerm: 20,
        closingCosts: 6000
      }
      
      const results = calculateRefinance(inputs)
      
      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      const breakEven = results.find(r => r.label === 'Break-Even Point')
      
      // Break-even should be closing costs / monthly savings
      if (monthlySavings!.value > 0) {
        const expectedBreakEven = 6000 / monthlySavings!.value
        expect(breakEven!.value).toBeCloseTo(expectedBreakEven, 2)
      }
    })
    
    it('should handle small loan amounts', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 50000,
        currentRate: 6.0,
        newRate: 4.5,
        remainingTerm: 10,
        newTerm: 10,
        closingCosts: 2000
      }
      
      const results = calculateRefinance(inputs)
      
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const currentPayment = results.find(r => r.label === 'Current Monthly Payment')
      
      expect(newPayment).toBeDefined()
      expect(currentPayment).toBeDefined()
      expect(newPayment!.value).toBeGreaterThan(0)
      expect(currentPayment!.value).toBeGreaterThan(0)
    })
    
    it('should handle large loan amounts', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 1500000,
        currentRate: 5.0,
        newRate: 3.5,
        remainingTerm: 30,
        newTerm: 30,
        closingCosts: 15000
      }
      
      const results = calculateRefinance(inputs)
      
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      
      expect(newPayment).toBeDefined()
      expect(monthlySavings).toBeDefined()
      expect(monthlySavings!.value).toBeGreaterThan(0)
    })
    
    it('should include all required result fields', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 300000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 5000
      }
      
      const results = calculateRefinance(inputs)
      
      const expectedLabels = [
        'New Monthly Payment',
        'Current Monthly Payment',
        'Monthly Savings',
        'Break-Even Point',
        'Lifetime Savings',
        'Closing Costs',
        'New Loan Amount',
        'Interest Rate Reduction',
        'Total Interest (Current Loan)',
        'Total Interest (New Loan)'
      ]
      
      expectedLabels.forEach(label => {
        const result = results.find(r => r.label === label)
        expect(result).toBeDefined()
      })
    })
    
    it('should highlight key results', () => {
      const inputs: RefinanceInputs = {
        currentBalance: 300000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 5000
      }
      
      const results = calculateRefinance(inputs)
      
      const newPayment = results.find(r => r.label === 'New Monthly Payment')
      const monthlySavings = results.find(r => r.label === 'Monthly Savings')
      const breakEven = results.find(r => r.label === 'Break-Even Point')
      
      expect(newPayment?.highlight).toBe(true)
      expect(monthlySavings?.highlight).toBe(true)
      expect(breakEven?.highlight).toBe(true)
    })
  })
  
  describe('validateRefinanceInputs', () => {
    it('should validate correct inputs', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 5000
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })
    
    it('should reject negative current balance', () => {
      const inputs = {
        currentBalance: -100000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 5000
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors?.currentBalance).toBeDefined()
    })
    
    it('should reject invalid interest rates', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 25, // Too high
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 5000
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors?.currentRate).toBeDefined()
    })
    
    it('should reject invalid loan terms', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 0, // Too low
        newTerm: 30,
        closingCosts: 5000
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors?.remainingTerm).toBeDefined()
    })
    
    it('should reject negative closing costs', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: -1000
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors?.closingCosts).toBeDefined()
    })
    
    it('should accept zero closing costs', () => {
      const inputs = {
        currentBalance: 300000,
        currentRate: 5.5,
        newRate: 4.0,
        remainingTerm: 25,
        newTerm: 30,
        closingCosts: 0
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(true)
    })
    
    it('should accept minimum valid values', () => {
      const inputs = {
        currentBalance: 1000,
        currentRate: 0,
        newRate: 0,
        remainingTerm: 1,
        newTerm: 1,
        closingCosts: 0
      }
      
      const result = validateRefinanceInputs(inputs)
      
      expect(result.success).toBe(true)
    })
  })
})
