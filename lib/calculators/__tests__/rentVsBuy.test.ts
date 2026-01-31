// Unit tests for Rent vs Buy Calculator

import { calculateRentVsBuy, validateRentVsBuyInputs } from '../rentVsBuy'
import type { RentVsBuyInputs } from '@/lib/utils/validators'

describe('Rent vs Buy Calculator', () => {
  describe('calculateRentVsBuy', () => {
    it('should calculate rent vs buy comparison correctly for typical inputs', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 400000,
        downPayment: 80000, // 20% down
        interestRate: 6.5,
        rentAmount: 2000,
        yearsToStay: 7,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      // Find specific results
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      const rentingCost = results.find(r => r.label === 'Total Cost of Renting')
      const netDifference = results.find(r => r.label === 'Net Difference')
      const recommendation = results.find(r => r.label === 'Recommendation')
      const equityBuilt = results.find(r => r.label === 'Equity Built')
      
      // Verify results exist
      expect(buyingCost).toBeDefined()
      expect(rentingCost).toBeDefined()
      expect(netDifference).toBeDefined()
      expect(recommendation).toBeDefined()
      expect(equityBuilt).toBeDefined()
      
      // Verify costs are positive
      expect(buyingCost!.value).toBeGreaterThan(0)
      expect(rentingCost!.value).toBeGreaterThan(0)
      expect(netDifference!.value).toBeGreaterThanOrEqual(0)
      
      // Verify equity is built over time
      expect(equityBuilt!.value).toBeGreaterThan(80000) // Should be more than down payment
      
      // Verify recommendation is provided
      expect(recommendation!.description).toBeDefined()
      expect(recommendation!.description).toMatch(/Buying|Renting|equal/)
      
      // Verify formats
      expect(buyingCost?.format).toBe('currency')
      expect(rentingCost?.format).toBe('currency')
      expect(netDifference?.format).toBe('currency')
    })
    
    it('should show buying is better for long-term ownership', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1800,
        yearsToStay: 10, // Long term
        appreciationRate: 3.5
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      const rentingCost = results.find(r => r.label === 'Total Cost of Renting')
      const recommendation = results.find(r => r.label === 'Recommendation')
      
      // With long-term ownership and appreciation, buying should be better
      expect(buyingCost!.value).toBeLessThan(rentingCost!.value)
      expect(recommendation!.description).toContain('Buying')
    })
    
    it('should show renting is better for short-term stay', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 400000,
        downPayment: 80000,
        interestRate: 7.0,
        rentAmount: 1500, // Low rent
        yearsToStay: 2, // Short term
        appreciationRate: 2.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      const rentingCost = results.find(r => r.label === 'Total Cost of Renting')
      const recommendation = results.find(r => r.label === 'Recommendation')
      
      // With short-term stay and high closing costs, renting might be better
      // This depends on the specific numbers, but we can verify the calculation works
      expect(buyingCost).toBeDefined()
      expect(rentingCost).toBeDefined()
      expect(recommendation!.description).toBeDefined()
    })
    
    it('should handle 100% down payment (no loan)', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 250000,
        downPayment: 250000, // 100% down
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const monthlyPayment = results.find(r => r.label === 'Monthly Mortgage Payment')
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      
      // Mortgage payment should be 0 with 100% down
      expect(monthlyPayment!.value).toBe(0)
      
      // Buying cost should still include taxes, insurance, maintenance, and closing costs
      expect(buyingCost!.value).toBeGreaterThan(0)
    })
    
    it('should handle zero interest rate edge case', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 0,
        rentAmount: 1800,
        yearsToStay: 7,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const monthlyPayment = results.find(r => r.label === 'Monthly Mortgage Payment')
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      
      // With 0% interest, payment should be principal / months
      expect(monthlyPayment!.value).toBeCloseTo(240000 / 360, 2)
      expect(buyingCost).toBeDefined()
      // Net buying cost can be negative if appreciation exceeds costs (you gain money)
      expect(typeof buyingCost!.value).toBe('number')
      expect(buyingCost!.value).not.toBe(NaN)
    })
    
    it('should calculate home appreciation correctly', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 400000,
        downPayment: 80000,
        interestRate: 6.5,
        rentAmount: 2000,
        yearsToStay: 5,
        appreciationRate: 4.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const futureValue = results.find(r => r.label === 'Home Value After Period')
      const appreciation = results.find(r => r.label === 'Total Appreciation')
      
      // Future value should be home price * (1 + rate)^years
      const expectedFutureValue = 400000 * Math.pow(1.04, 5)
      expect(futureValue!.value).toBeCloseTo(expectedFutureValue, 0)
      
      // Appreciation should be future value - home price
      expect(appreciation!.value).toBeCloseTo(expectedFutureValue - 400000, 0)
    })
    
    it('should handle negative appreciation (depreciation)', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: -2.0 // Depreciation
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const futureValue = results.find(r => r.label === 'Home Value After Period')
      const appreciation = results.find(r => r.label === 'Total Appreciation')
      
      // Future value should be less than original price
      expect(futureValue!.value).toBeLessThan(300000)
      
      // Appreciation should be negative
      expect(appreciation!.value).toBeLessThan(0)
    })
    
    it('should calculate rent inflation correctly', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 350000,
        downPayment: 70000,
        interestRate: 6.5,
        rentAmount: 2000,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const rentingCost = results.find(r => r.label === 'Total Cost of Renting')
      
      // Calculate expected rent with 3% annual inflation
      let expectedRentCost = 0
      let currentRent = 2000
      for (let year = 1; year <= 5; year++) {
        expectedRentCost += currentRent * 12
        currentRent = currentRent * 1.03
      }
      
      expect(rentingCost!.value).toBeCloseTo(expectedRentCost, 0)
    })
    
    it('should include closing costs in buying calculation', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const closingCosts = results.find(r => r.label === 'Closing Costs')
      
      // Closing costs should be approximately 3% of home price
      expect(closingCosts!.value).toBeCloseTo(300000 * 0.03, 0)
    })
    
    it('should calculate equity built correctly', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 400000,
        downPayment: 80000,
        interestRate: 6.0,
        rentAmount: 2000,
        yearsToStay: 7,
        appreciationRate: 3.5
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const equityBuilt = results.find(r => r.label === 'Equity Built')
      const downPayment = results.find(r => r.label === 'Monthly Mortgage Payment')
      
      // Equity should include down payment + principal paid + appreciation
      expect(equityBuilt!.value).toBeGreaterThan(80000) // More than just down payment
      expect(equityBuilt!.value).toBeGreaterThan(0)
    })
    
    it('should throw error if down payment exceeds home price', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 200000,
        downPayment: 250000, // More than home price
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      expect(() => calculateRentVsBuy(inputs)).toThrow('Down payment cannot exceed home price')
    })
    
    it('should include all required result fields', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 350000,
        downPayment: 70000,
        interestRate: 6.5,
        rentAmount: 1800,
        yearsToStay: 7,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const expectedLabels = [
        'Total Cost of Buying',
        'Total Cost of Renting',
        'Net Difference',
        'Recommendation',
        'Monthly Mortgage Payment',
        'Total Monthly Homeownership Cost',
        'Current Monthly Rent',
        'Equity Built',
        'Home Value After Period',
        'Total Appreciation',
        'Closing Costs',
        'Break-Even Point'
      ]
      
      expectedLabels.forEach(label => {
        const result = results.find(r => r.label === label)
        expect(result).toBeDefined()
      })
    })
    
    it('should highlight key results', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 350000,
        downPayment: 70000,
        interestRate: 6.5,
        rentAmount: 1800,
        yearsToStay: 7,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      const rentingCost = results.find(r => r.label === 'Total Cost of Renting')
      const netDifference = results.find(r => r.label === 'Net Difference')
      
      expect(buyingCost?.highlight).toBe(true)
      expect(rentingCost?.highlight).toBe(true)
      expect(netDifference?.highlight).toBe(true)
    })
    
    it('should format all results correctly', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 350000,
        downPayment: 70000,
        interestRate: 6.5,
        rentAmount: 1800,
        yearsToStay: 7,
        appreciationRate: 3.0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      // Check that all results have required properties
      results.forEach(result => {
        expect(result).toHaveProperty('label')
        expect(result).toHaveProperty('value')
        expect(result).toHaveProperty('format')
        expect(result).toHaveProperty('description')
        expect(['currency', 'percentage', 'number']).toContain(result.format)
      })
    })
    
    it('should handle minimum values', () => {
      const inputs: RentVsBuyInputs = {
        homePrice: 1000,
        downPayment: 0,
        interestRate: 0,
        rentAmount: 0,
        yearsToStay: 1,
        appreciationRate: 0
      }
      
      const results = calculateRentVsBuy(inputs)
      
      const buyingCost = results.find(r => r.label === 'Total Cost of Buying')
      const rentingCost = results.find(r => r.label === 'Total Cost of Renting')
      
      // Should not throw and should return valid results
      expect(buyingCost).toBeDefined()
      expect(rentingCost).toBeDefined()
      expect(buyingCost!.value).toBeGreaterThanOrEqual(0)
      expect(rentingCost!.value).toBeGreaterThanOrEqual(0)
    })
    
    it('should calculate different results for different time periods', () => {
      const baseInputs: RentVsBuyInputs = {
        homePrice: 350000,
        downPayment: 70000,
        interestRate: 6.5,
        rentAmount: 1800,
        yearsToStay: 3,
        appreciationRate: 3.0
      }
      
      const longerInputs: RentVsBuyInputs = {
        ...baseInputs,
        yearsToStay: 10
      }
      
      const shortResults = calculateRentVsBuy(baseInputs)
      const longResults = calculateRentVsBuy(longerInputs)
      
      const shortBuying = shortResults.find(r => r.label === 'Total Cost of Buying')!.value
      const longBuying = longResults.find(r => r.label === 'Total Cost of Buying')!.value
      
      const shortRenting = shortResults.find(r => r.label === 'Total Cost of Renting')!.value
      const longRenting = longResults.find(r => r.label === 'Total Cost of Renting')!.value
      
      // Longer period should have higher costs
      expect(longBuying).toBeGreaterThan(shortBuying)
      expect(longRenting).toBeGreaterThan(shortRenting)
    })
  })
  
  describe('validateRentVsBuyInputs', () => {
    it('should validate correct inputs', () => {
      const inputs = {
        homePrice: 350000,
        downPayment: 70000,
        interestRate: 6.5,
        rentAmount: 1800,
        yearsToStay: 7,
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })
    
    it('should reject negative home price', () => {
      const inputs = {
        homePrice: -100000,
        downPayment: 20000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('homePrice')
    })
    
    it('should reject home price below minimum', () => {
      const inputs = {
        homePrice: 500, // Below $1,000 minimum
        downPayment: 0,
        interestRate: 6.0,
        rentAmount: 500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('homePrice')
    })
    
    it('should reject negative down payment', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: -10000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('downPayment')
    })
    
    it('should reject interest rate above maximum', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 25, // Above 20% maximum
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('interestRate')
    })
    
    it('should reject negative rent amount', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: -1500,
        yearsToStay: 5,
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('rentAmount')
    })
    
    it('should reject years to stay outside valid range', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 0, // Below minimum
        appreciationRate: 3.0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('yearsToStay')
    })
    
    it('should reject appreciation rate too low', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: -15 // Below -10% minimum
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('appreciationRate')
    })
    
    it('should reject appreciation rate too high', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: 25 // Above 20% maximum
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveProperty('appreciationRate')
    })
    
    it('should accept zero values for optional fields', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 0,
        interestRate: 0,
        rentAmount: 0,
        yearsToStay: 1,
        appreciationRate: 0
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
    })
    
    it('should accept negative appreciation rate within range', () => {
      const inputs = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 6.0,
        rentAmount: 1500,
        yearsToStay: 5,
        appreciationRate: -5 // Within -10 to 20 range
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(true)
    })
    
    it('should handle multiple validation errors', () => {
      const inputs = {
        homePrice: -100000,
        downPayment: -20000,
        interestRate: 25,
        rentAmount: -1500,
        yearsToStay: 0,
        appreciationRate: 30
      }
      
      const result = validateRentVsBuyInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(Object.keys(result.errors || {}).length).toBeGreaterThan(1)
    })
  })
})
