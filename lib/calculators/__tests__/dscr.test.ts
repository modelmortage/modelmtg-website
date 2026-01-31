// DSCR Investment Calculator Unit Tests

import { calculateDSCR, validateDSCRInputs } from '../dscr'
import type { DSCRInputs } from '@/lib/utils/validators'

describe('DSCR Investment Calculator', () => {
  describe('calculateDSCR', () => {
    test('calculates DSCR for typical investment property', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 300000,
        downPayment: 75000, // 25% down
        interestRate: 7.5,
        monthlyRent: 2500,
        monthlyExpenses: 800, // taxes, insurance, maintenance
      }

      const results = calculateDSCR(inputs)
      
      // Find specific results
      const dscrRatio = results.find(r => r.label === 'DSCR Ratio')
      const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')
      const annualROI = results.find(r => r.label === 'Annual ROI (Cash-on-Cash)')
      const qualificationStatus = results.find(r => r.label === 'Qualification Status')
      
      // Loan amount: $225,000 (300k - 75k)
      // Monthly P&I at 7.5% for 30 years: ~$1,573
      // NOI: $2,500 - $800 = $1,700
      // DSCR: $1,700 / $1,573 = ~1.08
      
      expect(dscrRatio).toBeDefined()
      expect(dscrRatio!.value).toBeGreaterThan(1.0)
      expect(dscrRatio!.value).toBeLessThan(1.2)
      
      // Monthly cash flow should be positive
      expect(monthlyCashFlow).toBeDefined()
      expect(monthlyCashFlow!.value).toBeGreaterThan(0)
      
      // Should have qualification status
      expect(qualificationStatus).toBeDefined()
      expect(qualificationStatus!.description).toContain('Good')
      
      // ROI should be calculated
      expect(annualROI).toBeDefined()
      expect(annualROI!.value).toBeGreaterThan(0)
    })

    test('calculates DSCR with excellent ratio (>1.25)', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 200000,
        downPayment: 50000, // 25% down
        interestRate: 6.5,
        monthlyRent: 2000,
        monthlyExpenses: 500,
      }

      const results = calculateDSCR(inputs)
      
      const dscrRatio = results.find(r => r.label === 'DSCR Ratio')
      const qualificationStatus = results.find(r => r.label === 'Qualification Status')
      
      // NOI: $2,000 - $500 = $1,500
      // Loan: $150,000 at 6.5% = ~$948/month
      // DSCR: $1,500 / $948 = ~1.58
      
      expect(dscrRatio!.value).toBeGreaterThan(1.25)
      expect(qualificationStatus!.description).toContain('Excellent')
    })

    test('calculates DSCR with marginal ratio (0.75-1.0)', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 300000,
        downPayment: 60000, // 20% down
        interestRate: 8.0,
        monthlyRent: 2000,
        monthlyExpenses: 800,
      }

      const results = calculateDSCR(inputs)
      
      const dscrRatio = results.find(r => r.label === 'DSCR Ratio')
      const qualificationStatus = results.find(r => r.label === 'Qualification Status')
      
      // NOI: $2,000 - $800 = $1,200
      // Loan: $240,000 at 8% = ~$1,761/month
      // DSCR: $1,200 / $1,761 = ~0.68
      
      expect(dscrRatio!.value).toBeLessThan(1.0)
      expect(qualificationStatus!.description).toContain('Poor')
    })

    test('handles cash purchase (no loan)', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 200000,
        downPayment: 200000, // 100% cash
        interestRate: 7.0,
        monthlyRent: 2000,
        monthlyExpenses: 600,
      }

      const results = calculateDSCR(inputs)
      
      const dscrRatio = results.find(r => r.label === 'DSCR Ratio')
      const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')
      const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')
      const qualificationStatus = results.find(r => r.label === 'Qualification Status')
      
      // No loan, so no debt service
      expect(monthlyPI!.value).toBe(0)
      
      // DSCR should be very high (represented as 999)
      expect(dscrRatio!.value).toBe(999)
      
      // Cash flow equals NOI
      expect(monthlyCashFlow!.value).toBe(1400) // 2000 - 600
      
      // Should indicate cash purchase
      expect(qualificationStatus!.description).toContain('Cash Purchase')
    })

    test('handles zero interest rate', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 300000,
        downPayment: 60000,
        interestRate: 0,
        monthlyRent: 2500,
        monthlyExpenses: 800,
      }

      const results = calculateDSCR(inputs)
      
      const monthlyPI = results.find(r => r.label === 'Monthly Debt Service (P&I)')
      const dscrRatio = results.find(r => r.label === 'DSCR Ratio')
      
      // With 0% interest, payment is just principal divided by months
      // $240,000 / 360 = $666.67
      expect(monthlyPI!.value).toBeCloseTo(666.67, 2)
      
      // NOI: $2,500 - $800 = $1,700
      // DSCR: $1,700 / $666.67 = ~2.55
      expect(dscrRatio!.value).toBeGreaterThan(2.5)
    })

    test('calculates negative cash flow correctly', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 400000,
        downPayment: 80000, // 20% down
        interestRate: 8.5,
        monthlyRent: 2000,
        monthlyExpenses: 1000,
      }

      const results = calculateDSCR(inputs)
      
      const monthlyCashFlow = results.find(r => r.label === 'Monthly Cash Flow')
      const annualCashFlow = results.find(r => r.label === 'Annual Cash Flow')
      
      // NOI: $2,000 - $1,000 = $1,000
      // Loan: $320,000 at 8.5% = ~$2,461/month
      // Cash flow: $1,000 - $2,461 = -$1,461
      
      expect(monthlyCashFlow!.value).toBeLessThan(0)
      expect(monthlyCashFlow!.description).toContain('Negative')
      expect(annualCashFlow!.value).toBeLessThan(0)
    })

    test('calculates all required metrics', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 250000,
        downPayment: 50000,
        interestRate: 7.0,
        monthlyRent: 2200,
        monthlyExpenses: 700,
      }

      const results = calculateDSCR(inputs)
      
      // Verify all expected results are present
      const expectedLabels = [
        'DSCR Ratio',
        'Qualification Status',
        'Monthly Cash Flow',
        'Annual Cash Flow',
        'Annual ROI (Cash-on-Cash)',
        'Monthly Rent Income',
        'Monthly Expenses',
        'Net Operating Income',
        'Monthly Debt Service (P&I)',
        'Loan Amount',
        'Down Payment',
        'Total Cash Invested',
        'Cap Rate',
        'Total Interest Paid'
      ]
      
      expectedLabels.forEach(label => {
        const result = results.find(r => r.label === label)
        expect(result).toBeDefined()
      })
    })

    test('calculates cap rate correctly', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 200000,
        downPayment: 40000,
        interestRate: 7.0,
        monthlyRent: 1800,
        monthlyExpenses: 600,
      }

      const results = calculateDSCR(inputs)
      
      const capRate = results.find(r => r.label === 'Cap Rate')
      const noi = results.find(r => r.label === 'Net Operating Income')
      
      // NOI: $1,800 - $600 = $1,200/month = $14,400/year
      // Cap Rate: $14,400 / $200,000 = 7.2%
      
      expect(noi!.value).toBe(1200)
      expect(capRate!.value).toBeCloseTo(0.072, 4)
    })

    test('throws error when down payment exceeds property price', () => {
      const inputs: DSCRInputs = {
        propertyPrice: 200000,
        downPayment: 250000, // More than property price
        interestRate: 7.0,
        monthlyRent: 2000,
        monthlyExpenses: 600,
      }

      expect(() => calculateDSCR(inputs)).toThrow('Down payment cannot exceed property price')
    })
  })

  describe('validateDSCRInputs', () => {
    test('validates correct inputs', () => {
      const inputs = {
        propertyPrice: 300000,
        downPayment: 60000,
        interestRate: 7.5,
        monthlyRent: 2500,
        monthlyExpenses: 800,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(inputs)
      expect(result.errors).toBeUndefined()
    })

    test('rejects negative property price', () => {
      const inputs = {
        propertyPrice: -100000,
        downPayment: 20000,
        interestRate: 7.0,
        monthlyRent: 2000,
        monthlyExpenses: 600,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.propertyPrice).toContain('at least $1,000')
    })

    test('rejects negative down payment', () => {
      const inputs = {
        propertyPrice: 300000,
        downPayment: -10000,
        interestRate: 7.0,
        monthlyRent: 2000,
        monthlyExpenses: 600,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors!.downPayment).toContain('cannot be negative')
    })

    test('rejects interest rate above 20%', () => {
      const inputs = {
        propertyPrice: 300000,
        downPayment: 60000,
        interestRate: 25,
        monthlyRent: 2000,
        monthlyExpenses: 600,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors!.interestRate).toContain('between 0% and 20%')
    })

    test('rejects negative monthly rent', () => {
      const inputs = {
        propertyPrice: 300000,
        downPayment: 60000,
        interestRate: 7.0,
        monthlyRent: -1000,
        monthlyExpenses: 600,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors!.monthlyRent).toContain('cannot be negative')
    })

    test('rejects negative monthly expenses', () => {
      const inputs = {
        propertyPrice: 300000,
        downPayment: 60000,
        interestRate: 7.0,
        monthlyRent: 2000,
        monthlyExpenses: -500,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors!.monthlyExpenses).toContain('cannot be negative')
    })

    test('accepts zero values for optional fields', () => {
      const inputs = {
        propertyPrice: 300000,
        downPayment: 0, // No down payment
        interestRate: 7.0,
        monthlyRent: 2000,
        monthlyExpenses: 0, // No expenses
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(true)
    })

    test('rejects property price below minimum', () => {
      const inputs = {
        propertyPrice: 500, // Below $1,000 minimum
        downPayment: 100,
        interestRate: 7.0,
        monthlyRent: 100,
        monthlyExpenses: 50,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors!.propertyPrice).toContain('at least $1,000')
    })

    test('rejects property price above maximum', () => {
      const inputs = {
        propertyPrice: 150000000, // Above $100M maximum
        downPayment: 30000000,
        interestRate: 7.0,
        monthlyRent: 100000,
        monthlyExpenses: 30000,
      }

      const result = validateDSCRInputs(inputs)
      
      expect(result.success).toBe(false)
      expect(result.errors!.propertyPrice).toContain('exceeds maximum')
    })
  })
})
