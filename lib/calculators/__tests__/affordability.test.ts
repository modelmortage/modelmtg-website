// Unit tests for affordability calculator

import { calculateAffordability, validateAffordabilityInputs } from '../affordability'
import type { AffordabilityInputs } from '@/lib/utils/validators'

describe('Affordability Calculator', () => {
  describe('calculateAffordability', () => {
    it('should calculate correct affordability for typical inputs', () => {
      const inputs: AffordabilityInputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const results = calculateAffordability(inputs)
      
      // Find specific results
      const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')
      const maxLoanAmount = results.find(r => r.label === 'Maximum Loan Amount')
      const dtiRatio = results.find(r => r.label === 'Debt-to-Income Ratio')
      
      expect(maxHomePrice).toBeDefined()
      expect(maxLoanAmount).toBeDefined()
      expect(dtiRatio).toBeDefined()
      
      // Verify max home price is positive and reasonable
      expect(maxHomePrice!.value).toBeGreaterThan(0)
      expect(maxHomePrice!.format).toBe('currency')
      expect(maxHomePrice!.highlight).toBe(true)
      
      // Verify max loan amount is less than max home price (since there's a down payment)
      expect(maxLoanAmount!.value).toBeLessThan(maxHomePrice!.value)
      
      // Verify DTI ratio is close to 43% (0.43)
      expect(dtiRatio!.value).toBeCloseTo(0.43, 2)
      expect(dtiRatio!.format).toBe('percentage')
    })
    
    it('should handle zero down payment', () => {
      const inputs: AffordabilityInputs = {
        annualIncome: 60000,
        monthlyDebts: 300,
        downPayment: 0,
        interestRate: 6.5
      }
      
      const results = calculateAffordability(inputs)
      const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')
      const maxLoanAmount = results.find(r => r.label === 'Maximum Loan Amount')
      
      // With zero down payment, max home price should equal max loan amount
      expect(maxHomePrice!.value).toBeCloseTo(maxLoanAmount!.value, 2)
    })
    
    it('should handle zero monthly debts', () => {
      const inputs: AffordabilityInputs = {
        annualIncome: 100000,
        monthlyDebts: 0,
        downPayment: 30000,
        interestRate: 7.5
      }
      
      const results = calculateAffordability(inputs)
      const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')
      
      // Should calculate successfully with no debts
      expect(maxHomePrice!.value).toBeGreaterThan(30000)
    })
    
    it('should handle zero interest rate edge case', () => {
      const inputs: AffordabilityInputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 0
      }
      
      const results = calculateAffordability(inputs)
      const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')
      
      // Should handle 0% interest rate without division by zero
      expect(maxHomePrice!.value).toBeGreaterThan(0)
      expect(maxHomePrice!.value).toBeLessThan(Infinity)
    })
    
    it('should return all expected result fields', () => {
      const inputs: AffordabilityInputs = {
        annualIncome: 75000,
        monthlyDebts: 400,
        downPayment: 15000,
        interestRate: 6.75
      }
      
      const results = calculateAffordability(inputs)
      
      // Verify all expected results are present
      expect(results).toHaveLength(6)
      
      const labels = results.map(r => r.label)
      expect(labels).toContain('Maximum Home Price')
      expect(labels).toContain('Maximum Loan Amount')
      expect(labels).toContain('Down Payment')
      expect(labels).toContain('Estimated Monthly Payment')
      expect(labels).toContain('Loan-to-Value Ratio')
      expect(labels).toContain('Debt-to-Income Ratio')
      
      // Verify all results have required properties
      results.forEach(result => {
        expect(result).toHaveProperty('label')
        expect(result).toHaveProperty('value')
        expect(result).toHaveProperty('format')
        expect(result).toHaveProperty('description')
        expect(typeof result.value).toBe('number')
        expect(['currency', 'percentage', 'number']).toContain(result.format)
      })
    })
    
    it('should calculate higher affordability with higher income', () => {
      const baseInputs: AffordabilityInputs = {
        annualIncome: 60000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const higherIncomeInputs: AffordabilityInputs = {
        ...baseInputs,
        annualIncome: 120000
      }
      
      const baseResults = calculateAffordability(baseInputs)
      const higherResults = calculateAffordability(higherIncomeInputs)
      
      const baseMaxPrice = baseResults.find(r => r.label === 'Maximum Home Price')!.value
      const higherMaxPrice = higherResults.find(r => r.label === 'Maximum Home Price')!.value
      
      // Higher income should result in higher affordability
      expect(higherMaxPrice).toBeGreaterThan(baseMaxPrice)
    })
    
    it('should calculate lower affordability with higher debts', () => {
      const baseInputs: AffordabilityInputs = {
        annualIncome: 80000,
        monthlyDebts: 300,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const higherDebtInputs: AffordabilityInputs = {
        ...baseInputs,
        monthlyDebts: 1000
      }
      
      const baseResults = calculateAffordability(baseInputs)
      const higherDebtResults = calculateAffordability(higherDebtInputs)
      
      const baseMaxPrice = baseResults.find(r => r.label === 'Maximum Home Price')!.value
      const higherDebtMaxPrice = higherDebtResults.find(r => r.label === 'Maximum Home Price')!.value
      
      // Higher debts should result in lower affordability
      expect(higherDebtMaxPrice).toBeLessThan(baseMaxPrice)
    })
    
    it('should throw error for invalid inputs', () => {
      const invalidInputs = {
        annualIncome: -50000, // Negative income
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      expect(() => calculateAffordability(invalidInputs as any)).toThrow()
    })
  })
  
  describe('validateAffordabilityInputs', () => {
    it('should validate correct inputs', () => {
      const inputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })
    
    it('should reject negative income', () => {
      const inputs = {
        annualIncome: -50000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.annualIncome).toBeDefined()
    })
    
    it('should reject negative debts', () => {
      const inputs = {
        annualIncome: 80000,
        monthlyDebts: -500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.monthlyDebts).toBeDefined()
    })
    
    it('should reject negative down payment', () => {
      const inputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: -20000,
        interestRate: 7.0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.downPayment).toBeDefined()
    })
    
    it('should reject interest rate above 20%', () => {
      const inputs = {
        annualIncome: 80000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 25.0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.interestRate).toBeDefined()
    })
    
    it('should reject income exceeding maximum', () => {
      const inputs = {
        annualIncome: 15000000,
        monthlyDebts: 500,
        downPayment: 20000,
        interestRate: 7.0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.annualIncome).toBeDefined()
    })
    
    it('should accept zero values for optional fields', () => {
      const inputs = {
        annualIncome: 80000,
        monthlyDebts: 0,
        downPayment: 0,
        interestRate: 0
      }
      
      const result = validateAffordabilityInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
    })
  })
})
