// Unit tests for VA Purchase Calculator

import { calculateVAPurchase, validateVAPurchaseInputs } from '../vaPurchase'
import type { VAPurchaseInputs } from '@/lib/utils/validators'

describe('VA Purchase Calculator', () => {
  describe('calculateVAPurchase', () => {
    it('should calculate monthly payment correctly for a standard VA loan', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 300000,
        downPayment: 0, // VA loans allow 0% down
        interestRate: 6.5,
        vaFundingFee: 2.3, // Standard first-time use funding fee
        propertyTaxRate: 1.2, // 1.2% annual
        insurance: 1200 // $1200 annual
      }
      
      const results = calculateVAPurchase(inputs)
      
      // Find specific results
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      const principalInterest = results.find(r => r.label === 'Principal & Interest')
      const propertyTax = results.find(r => r.label === 'Property Taxes')
      const insurance = results.find(r => r.label === 'Homeowners Insurance')
      const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')
      
      // Verify base loan amount
      expect(baseLoanAmount?.value).toBe(300000) // 300000 - 0
      
      // Verify funding fee: 300000 * 0.023 = 6900
      expect(fundingFee?.value).toBeCloseTo(6900, 2)
      
      // Verify total loan amount: 300000 + 6900 = 306900
      expect(totalLoanAmount?.value).toBeCloseTo(306900, 2)
      
      // Verify P&I calculation (using standard mortgage formula)
      // For $306,900 at 6.5% for 30 years, monthly P&I should be approximately $1939.82
      expect(principalInterest?.value).toBeCloseTo(1939.82, 1)
      
      // Verify property tax: (300000 * 0.012) / 12 = 300
      expect(propertyTax?.value).toBeCloseTo(300, 2)
      
      // Verify insurance: 1200 / 12 = 100
      expect(insurance?.value).toBe(100)
      
      // Verify total monthly payment (no PMI for VA loans)
      const expectedTotal = 1939.82 + 300 + 100
      expect(totalMonthly?.value).toBeCloseTo(expectedTotal, 1)
    })
    
    it('should handle VA loan with down payment', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 400000,
        downPayment: 40000, // 10% down
        interestRate: 6.0,
        vaFundingFee: 1.65, // Reduced funding fee with down payment
        propertyTaxRate: 1.0,
        insurance: 1500
      }
      
      const results = calculateVAPurchase(inputs)
      
      const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')
      
      // Base loan: 400000 - 40000 = 360000
      expect(baseLoanAmount?.value).toBe(360000)
      
      // Funding fee: 360000 * 0.0165 = 5940
      expect(fundingFee?.value).toBeCloseTo(5940, 2)
      
      // Total loan: 360000 + 5940 = 365940
      expect(totalLoanAmount?.value).toBeCloseTo(365940, 2)
    })
    
    it('should handle 100% down payment (no loan)', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 200000,
        downPayment: 200000, // 100% down
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1000
      }
      
      const results = calculateVAPurchase(inputs)
      
      const principalInterest = results.find(r => r.label === 'Principal & Interest')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      
      // P&I should be 0 with no loan
      expect(principalInterest?.value).toBe(0)
      
      // Funding fee should be 0 with no loan
      expect(fundingFee?.value).toBe(0)
      
      // Total should only include taxes and insurance
      // Property tax: (200000 * 0.01) / 12 = 166.67
      // Insurance: 1000 / 12 = 83.33
      expect(totalMonthly?.value).toBeCloseTo(250, 0)
    })
    
    it('should handle 0% interest rate', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 240000,
        downPayment: 0,
        interestRate: 0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const results = calculateVAPurchase(inputs)
      
      const principalInterest = results.find(r => r.label === 'Principal & Interest')
      const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')
      
      expect(baseLoanAmount?.value).toBe(240000)
      
      // Funding fee: 240000 * 0.023 = 5520
      expect(fundingFee?.value).toBeCloseTo(5520, 2)
      
      // Total loan: 240000 + 5520 = 245520
      expect(totalLoanAmount?.value).toBeCloseTo(245520, 2)
      
      // With 0% interest, P&I = total loan amount / number of payments
      // 245520 / (30 * 12) = 682
      expect(principalInterest?.value).toBeCloseTo(682, 2)
    })
    
    it('should handle zero funding fee (disabled veteran)', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.5,
        vaFundingFee: 0, // Disabled veterans are exempt
        propertyTaxRate: 1.2,
        insurance: 1200
      }
      
      const results = calculateVAPurchase(inputs)
      
      const baseLoanAmount = results.find(r => r.label === 'Base Loan Amount')
      const fundingFee = results.find(r => r.label === 'VA Funding Fee')
      const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')
      
      expect(baseLoanAmount?.value).toBe(300000)
      expect(fundingFee?.value).toBe(0)
      expect(totalLoanAmount?.value).toBe(300000) // No funding fee added
    })
    
    it('should calculate total interest correctly', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const results = calculateVAPurchase(inputs)
      
      const totalInterest = results.find(r => r.label === 'Total Interest Paid')
      const totalLoanAmount = results.find(r => r.label === 'Total Loan Amount')
      
      // Total interest should be positive and substantial for a 30-year loan
      expect(totalInterest?.value).toBeGreaterThan(0)
      expect(totalInterest?.value).toBeGreaterThan(totalLoanAmount!.value * 0.5) // At least 50% of loan amount
    })
    
    it('should calculate loan-to-value ratio correctly', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 400000,
        downPayment: 80000, // 20% down
        interestRate: 6.5,
        vaFundingFee: 1.65,
        propertyTaxRate: 1.2,
        insurance: 1500
      }
      
      const results = calculateVAPurchase(inputs)
      
      const ltv = results.find(r => r.label === 'Loan-to-Value Ratio')
      
      // LTV should be 80% (320000 / 400000) - based on base loan, not including funding fee
      expect(ltv?.value).toBeCloseTo(0.80, 4)
      expect(ltv?.format).toBe('percentage')
    })
    
    it('should handle minimum values', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 1000,
        downPayment: 0,
        interestRate: 0,
        vaFundingFee: 0,
        propertyTaxRate: 0,
        insurance: 0
      }
      
      const results = calculateVAPurchase(inputs)
      
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      
      // Should not throw and should return valid results
      expect(totalMonthly).toBeDefined()
      expect(totalMonthly?.value).toBeGreaterThanOrEqual(0)
    })
    
    it('should throw error if down payment exceeds home price', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 200000,
        downPayment: 250000, // More than home price
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      expect(() => calculateVAPurchase(inputs)).toThrow('Down payment cannot exceed home price')
    })
    
    it('should format all results correctly', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.5,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.2,
        insurance: 1200
      }
      
      const results = calculateVAPurchase(inputs)
      
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
    
    it('should verify no PMI is included in VA loan calculations', () => {
      const inputs: VAPurchaseInputs = {
        homePrice: 300000,
        downPayment: 0, // 0% down would require PMI on conventional loan
        interestRate: 6.5,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.2,
        insurance: 1200
      }
      
      const results = calculateVAPurchase(inputs)
      
      // Verify no PMI result exists
      const pmiResult = results.find(r => r.label.toLowerCase().includes('pmi'))
      expect(pmiResult).toBeUndefined()
      
      // Verify description mentions no PMI
      const totalMonthly = results.find(r => r.label === 'Total Monthly Payment')
      expect(totalMonthly?.description).toContain('no PMI')
    })
  })
  
  describe('validateVAPurchaseInputs', () => {
    it('should validate correct inputs', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.5,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.2,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })
    
    it('should reject negative home price', () => {
      const inputs = {
        homePrice: -100000,
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('homePrice')
    })
    
    it('should reject home price below minimum', () => {
      const inputs = {
        homePrice: 500, // Below $1,000 minimum
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('homePrice')
    })
    
    it('should reject negative down payment', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: -10000,
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('downPayment')
    })
    
    it('should reject interest rate above maximum', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 25, // Above 20% maximum
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('interestRate')
    })
    
    it('should reject negative VA funding fee', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: -1.0,
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('vaFundingFee')
    })
    
    it('should reject VA funding fee above maximum', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: 15, // Above 10% maximum
        propertyTaxRate: 1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('vaFundingFee')
    })
    
    it('should reject negative property tax rate', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: -1.0,
        insurance: 1200
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('propertyTaxRate')
    })
    
    it('should reject negative insurance', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 6.0,
        vaFundingFee: 2.3,
        propertyTaxRate: 1.0,
        insurance: -500
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('insurance')
    })
    
    it('should handle multiple validation errors', () => {
      const inputs = {
        homePrice: -100000,
        downPayment: -20000,
        interestRate: 25,
        vaFundingFee: -1.0,
        propertyTaxRate: -1.0,
        insurance: -500
      }
      
      const result = validateVAPurchaseInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(Object.keys(result.errors || {}).length).toBeGreaterThan(1)
    })
  })
})
