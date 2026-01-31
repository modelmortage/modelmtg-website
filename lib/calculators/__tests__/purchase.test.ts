// Unit tests for Purchase Calculator

import { calculatePurchase, validatePurchaseInputs } from '../purchase'
import type { PurchaseInputs } from '@/lib/utils/validators'

describe('Purchase Calculator', () => {
  describe('calculatePurchase', () => {
    it('should calculate monthly payment correctly for a standard mortgage', () => {
      const inputs: PurchaseInputs = {
        homePrice: 300000,
        downPayment: 60000, // 20% down
        interestRate: 6.5,
        loanTerm: 30,
        propertyTaxRate: 1.2, // 1.2% annual
        insurance: 1200, // $1200 annual
        hoa: 100 // $100 monthly
      }
      
      const results = calculatePurchase(inputs)
      
      // Find specific results
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      const principalInterest = results.find(r => r.label === 'Principal & Interest')
      const propertyTax = results.find(r => r.label === 'Property Taxes')
      const insurance = results.find(r => r.label === 'Homeowners Insurance')
      const hoa = results.find(r => r.label === 'HOA Fees')
      const loanAmount = results.find(r => r.label === 'Loan Amount')
      
      // Verify loan amount
      expect(loanAmount?.value).toBe(240000) // 300000 - 60000
      
      // Verify P&I calculation (using standard mortgage formula)
      // For $240,000 at 6.5% for 30 years, monthly P&I should be approximately $1516.96
      expect(principalInterest?.value).toBeCloseTo(1516.96, 1)
      
      // Verify property tax: (300000 * 0.012) / 12 = 300
      expect(propertyTax?.value).toBeCloseTo(300, 2)
      
      // Verify insurance: 1200 / 12 = 100
      expect(insurance?.value).toBe(100)
      
      // Verify HOA
      expect(hoa?.value).toBe(100)
      
      // Verify total monthly payment
      const expectedTotal = 1516.96 + 300 + 100 + 100
      expect(totalMonthly?.value).toBeCloseTo(expectedTotal, 1)
    })
    
    it('should handle 100% down payment (no loan)', () => {
      const inputs: PurchaseInputs = {
        homePrice: 200000,
        downPayment: 200000, // 100% down
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1000,
        hoa: 0
      }
      
      const results = calculatePurchase(inputs)
      
      const principalInterest = results.find(r => r.label === 'Principal & Interest')
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      
      // P&I should be 0 with no loan
      expect(principalInterest?.value).toBe(0)
      
      // Total should only include taxes and insurance
      // Property tax: (200000 * 0.01) / 12 = 166.67
      // Insurance: 1000 / 12 = 83.33
      expect(totalMonthly?.value).toBeCloseTo(250, 0)
    })
    
    it('should handle 0% interest rate', () => {
      const inputs: PurchaseInputs = {
        homePrice: 240000,
        downPayment: 40000,
        interestRate: 0,
        loanTerm: 20,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 50
      }
      
      const results = calculatePurchase(inputs)
      
      const principalInterest = results.find(r => r.label === 'Principal & Interest')
      const loanAmount = results.find(r => r.label === 'Loan Amount')
      
      expect(loanAmount?.value).toBe(200000)
      
      // With 0% interest, P&I = loan amount / number of payments
      // 200000 / (20 * 12) = 833.33
      expect(principalInterest?.value).toBeCloseTo(833.33, 2)
    })
    
    it('should calculate total interest correctly', () => {
      const inputs: PurchaseInputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const results = calculatePurchase(inputs)
      
      const totalInterest = results.find(r => r.label === 'Total Interest Paid')
      const loanAmount = results.find(r => r.label === 'Loan Amount')
      
      expect(loanAmount?.value).toBe(240000)
      
      // Total interest should be positive and substantial for a 30-year loan
      expect(totalInterest?.value).toBeGreaterThan(0)
      expect(totalInterest?.value).toBeGreaterThan(loanAmount!.value * 0.5) // At least 50% of loan amount
    })
    
    it('should calculate loan-to-value ratio correctly', () => {
      const inputs: PurchaseInputs = {
        homePrice: 400000,
        downPayment: 80000, // 20% down
        interestRate: 6.5,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insurance: 1500,
        hoa: 200
      }
      
      const results = calculatePurchase(inputs)
      
      const ltv = results.find(r => r.label === 'Loan-to-Value Ratio')
      
      // LTV should be 80% (320000 / 400000)
      expect(ltv?.value).toBeCloseTo(0.80, 4)
      expect(ltv?.format).toBe('percentage')
    })
    
    it('should handle minimum values', () => {
      const inputs: PurchaseInputs = {
        homePrice: 1000,
        downPayment: 0,
        interestRate: 0,
        loanTerm: 1,
        propertyTaxRate: 0,
        insurance: 0,
        hoa: 0
      }
      
      const results = calculatePurchase(inputs)
      
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      
      // Should not throw and should return valid results
      expect(totalMonthly).toBeDefined()
      expect(totalMonthly?.value).toBeGreaterThanOrEqual(0)
    })
    
    it('should throw error if down payment exceeds home price', () => {
      const inputs: PurchaseInputs = {
        homePrice: 200000,
        downPayment: 250000, // More than home price
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      expect(() => calculatePurchase(inputs)).toThrow('Down payment cannot exceed home price')
    })
    
    it('should format all results correctly', () => {
      const inputs: PurchaseInputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.5,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insurance: 1200,
        hoa: 100
      }
      
      const results = calculatePurchase(inputs)
      
      // Check that all results have required properties
      results.forEach(result => {
        expect(result).toHaveProperty('label')
        expect(result).toHaveProperty('value')
        expect(result).toHaveProperty('format')
        expect(result).toHaveProperty('description')
        expect(['currency', 'percentage', 'number']).toContain(result.format)
      })
      
      // Check that Total Monthly Payment is highlighted
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      expect(totalMonthly?.highlight).toBe(true)
    })
  })
  
  describe('validatePurchaseInputs', () => {
    it('should validate correct inputs', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.5,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insurance: 1200,
        hoa: 100
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })
    
    it('should reject negative home price', () => {
      const inputs = {
        homePrice: -100000,
        downPayment: 20000,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('homePrice')
    })
    
    it('should reject home price below minimum', () => {
      const inputs = {
        homePrice: 500, // Below $1,000 minimum
        downPayment: 0,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('homePrice')
    })
    
    it('should reject negative down payment', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: -10000,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('downPayment')
    })
    
    it('should reject interest rate above maximum', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 25, // Above 20% maximum
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('interestRate')
    })
    
    it('should reject loan term outside valid range', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        loanTerm: 0, // Below minimum
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('loanTerm')
    })
    
    it('should reject negative property tax rate', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: -1.0,
        insurance: 1200,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('propertyTaxRate')
    })
    
    it('should reject negative insurance', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: -500,
        hoa: 0
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('insurance')
    })
    
    it('should reject negative HOA fees', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        loanTerm: 30,
        propertyTaxRate: 1.0,
        insurance: 1200,
        hoa: -100
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('hoa')
    })
    
    it('should handle multiple validation errors', () => {
      const inputs = {
        homePrice: -100000,
        downPayment: -20000,
        interestRate: 25,
        loanTerm: 0,
        propertyTaxRate: -1.0,
        insurance: -500,
        hoa: -100
      }
      
      const result = validatePurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(Object.keys(result.errors || {}).length).toBeGreaterThan(1)
    })
  })
})
