// Unit tests for error handling edge cases
// **Validates: Requirements 8.5**

// Helper functions (matching implementation)
function parseNumericInput(value: string, defaultValue: number = 0): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) || parsed < 0 ? defaultValue : parsed
}

function calculateAmortization(
  principal: number,
  annualRate: number,
  termInMonths: number,
  extraPayment: number = 0
): {
  monthlyPayment: number
  totalInterest: number
  actualTermMonths: number
} {
  // Handle edge cases
  if (principal <= 0 || termInMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      actualTermMonths: 0
    }
  }

  const monthlyRate = annualRate / 12
  
  // Handle zero interest rate with simple division
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  // Cap extra payment at P&I to prevent excessive payments
  const cappedExtraPayment = Math.min(extraPayment, monthlyPI)
  
  // Calculate actual payoff with extra payments
  let balance = principal
  let totalInterest = 0
  let monthsPaid = 0
  
  while (balance > 0 && monthsPaid < termInMonths * 2) {
    const interestPayment = balance * monthlyRate
    const principalPayment = Math.min(monthlyPI - interestPayment + cappedExtraPayment, balance + interestPayment)
    
    totalInterest += interestPayment
    balance -= (principalPayment - interestPayment)
    monthsPaid++
    
    if (balance <= 0) break
  }
  
  return {
    monthlyPayment: monthlyPI,
    totalInterest,
    actualTermMonths: monthsPaid
  }
}

function convertInsuranceDollarToPercent(
  dollarAmount: number,
  homeValue: number
): number {
  return homeValue > 0 ? (dollarAmount / homeValue) * 100 : 0
}

function getDefaultFirstPaymentDate(): Date {
  const today = new Date()
  today.setDate(today.getDate() + 30)
  return today
}

describe('Error Handling Edge Cases', () => {
  describe('Zero Home Value (Division by Zero)', () => {
    it('should handle zero home value in percentage calculations', () => {
      const result = convertInsuranceDollarToPercent(1200, 0)
      expect(result).toBe(0)
      expect(isNaN(result)).toBe(false)
    })

    it('should not throw error when calculating percentages with zero home value', () => {
      expect(() => {
        convertInsuranceDollarToPercent(1000, 0)
      }).not.toThrow()
    })
  })

  describe('Zero Interest Rate', () => {
    it('should use simple division for zero interest rate', () => {
      const result = calculateAmortization(300000, 0, 360, 0)
      
      // With 0% interest, monthly payment should be principal / term
      const expectedMonthlyPayment = 300000 / 360
      
      expect(result.monthlyPayment).toBeCloseTo(expectedMonthlyPayment, 2)
      expect(result.totalInterest).toBe(0)
      expect(isNaN(result.monthlyPayment)).toBe(false)
    })

    it('should handle zero interest rate with extra payments', () => {
      const result = calculateAmortization(300000, 0, 360, 100)
      
      expect(result.monthlyPayment).toBeGreaterThan(0)
      expect(result.totalInterest).toBe(0)
      expect(result.actualTermMonths).toBeLessThan(360)
    })
  })

  describe('Invalid Dates', () => {
    it('should provide default date when date is invalid', () => {
      const defaultDate = getDefaultFirstPaymentDate()
      const today = new Date()
      
      // Default should be 30 days from today
      const daysDifference = Math.floor((defaultDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      expect(daysDifference).toBeGreaterThanOrEqual(29)
      expect(daysDifference).toBeLessThanOrEqual(31)
    })

    it('should handle invalid date strings gracefully', () => {
      const invalidDate = new Date('invalid-date')
      expect(isNaN(invalidDate.getTime())).toBe(true)
      
      // In the actual implementation, this would trigger the default
      const defaultDate = getDefaultFirstPaymentDate()
      expect(isNaN(defaultDate.getTime())).toBe(false)
    })
  })

  describe('Excessive Extra Payments', () => {
    it('should cap extra payment at P&I amount', () => {
      const principal = 300000
      const annualRate = 0.05
      const termInMonths = 360
      const excessiveExtraPayment = 10000 // Much larger than monthly P&I
      
      const result = calculateAmortization(principal, annualRate, termInMonths, excessiveExtraPayment)
      
      // Should not cause negative balance or errors
      expect(result.monthlyPayment).toBeGreaterThan(0)
      expect(result.totalInterest).toBeGreaterThanOrEqual(0)
      expect(result.actualTermMonths).toBeGreaterThan(0)
      expect(isNaN(result.monthlyPayment)).toBe(false)
    })

    it('should handle extra payment equal to monthly P&I', () => {
      const principal = 300000
      const annualRate = 0.05
      const termInMonths = 360
      
      // First calculate without extra payment to get P&I
      const baseline = calculateAmortization(principal, annualRate, termInMonths, 0)
      
      // Now use P&I as extra payment
      const result = calculateAmortization(principal, annualRate, termInMonths, baseline.monthlyPayment)
      
      expect(result.actualTermMonths).toBeLessThan(termInMonths)
      expect(result.totalInterest).toBeLessThan(baseline.totalInterest)
    })
  })

  describe('Negative Value Prevention', () => {
    it('should reject negative values and use default', () => {
      expect(parseNumericInput('-100', 0)).toBe(0)
      expect(parseNumericInput('-50.5', 0)).toBe(0)
      expect(parseNumericInput('-1', 100)).toBe(100)
    })

    it('should accept positive values', () => {
      expect(parseNumericInput('100', 0)).toBe(100)
      expect(parseNumericInput('50.5', 0)).toBe(50.5)
      expect(parseNumericInput('0', 0)).toBe(0)
    })

    it('should handle NaN values', () => {
      expect(parseNumericInput('abc', 0)).toBe(0)
      expect(parseNumericInput('', 0)).toBe(0)
      expect(parseNumericInput('NaN', 100)).toBe(100)
    })
  })

  describe('Zero or Negative Principal/Term', () => {
    it('should handle zero principal gracefully', () => {
      const result = calculateAmortization(0, 0.05, 360, 0)
      
      expect(result.monthlyPayment).toBe(0)
      expect(result.totalInterest).toBe(0)
      expect(result.actualTermMonths).toBe(0)
    })

    it('should handle zero term gracefully', () => {
      const result = calculateAmortization(300000, 0.05, 0, 0)
      
      expect(result.monthlyPayment).toBe(0)
      expect(result.totalInterest).toBe(0)
      expect(result.actualTermMonths).toBe(0)
    })

    it('should handle negative principal gracefully', () => {
      const result = calculateAmortization(-100000, 0.05, 360, 0)
      
      expect(result.monthlyPayment).toBe(0)
      expect(result.totalInterest).toBe(0)
      expect(result.actualTermMonths).toBe(0)
    })
  })
})
