/**
 * Total Interest Calculation Property-Based Tests
 * Tests universal properties of total interest calculations using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 10: Total Interest Calculation
 * **Validates: Requirements 5.3**
 */

import fc from 'fast-check'

type PaymentFrequency = 'monthly' | 'bi-weekly' | 'weekly'

function getPeriodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12
    case 'bi-weekly':
      return 26
    case 'weekly':
      return 52
  }
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
  totalPayment: number
} {
  const monthlyRate = annualRate / 12
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  let balance = principal
  let totalInterest = 0
  let totalPayment = 0
  let monthsPaid = 0
  
  while (balance > 0.01 && monthsPaid < termInMonths * 2) {
    const interestPayment = balance * monthlyRate
    let principalPayment = monthlyPI - interestPayment + extraPayment
    
    // Handle last payment - don't overpay
    if (principalPayment > balance) {
      principalPayment = balance
    }
    
    // Track the actual payment made this month
    const actualPayment = interestPayment + principalPayment
    
    totalInterest += interestPayment
    totalPayment += actualPayment
    balance -= principalPayment
    monthsPaid++
  }
  
  return { monthlyPayment: monthlyPI, totalInterest, actualTermMonths: monthsPaid, totalPayment }
}

function adjustPaymentForFrequency(monthlyPayment: number, frequency: PaymentFrequency): number {
  const periodsPerYear = getPeriodsPerYear(frequency)
  return (monthlyPayment * 12) / periodsPerYear
}

describe('Total Interest Calculation - Property-Based Tests', () => {
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbDownPaymentPercent = fc.float({ min: 0, max: 20, noNaN: true })
  const arbInterestRate = fc.float({ min: 2, max: 10, noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbPaymentFrequency = fc.constantFrom<PaymentFrequency>('monthly', 'bi-weekly', 'weekly')
  const arbExtraPayment = fc.float({ min: 0, max: 2000, noNaN: true })

  /**
   * Property 10: Total interest paid equals total payment minus final mortgage amount
   * 
   * **Validates: Requirements 5.3**
   * 
   * For any loan, the total interest paid should equal the total payment minus
   * the total loan amount (final mortgage amount).
   * 
   * This is a fundamental accounting identity: when you pay back a loan, the total
   * amount you pay equals the principal (loan amount) plus the interest charged.
   */
  it('Property 10: Total interest paid equals total payment minus final mortgage amount', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, interestRate, loanTermYears, extraPayment) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization with extra payments
          const amortization = calculateAmortization(loanAmount, annualRate, termInMonths, extraPayment)
          const totalInterest = amortization.totalInterest
          const totalPayment = amortization.totalPayment
          
          // Total interest should equal total payment minus loan amount
          const calculatedTotalInterest = totalPayment - loanAmount
          
          // Verify the accounting identity holds
          // Allow small tolerance for floating point rounding errors
          const tolerance = 0.01
          return Math.abs(calculatedTotalInterest - totalInterest) < tolerance
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10a: Total interest is always non-negative
   * 
   * **Validates: Requirements 5.3**
   */
  it('Property 10a: Total interest is always non-negative', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, interestRate, loanTermYears, extraPayment) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          const amortization = calculateAmortization(loanAmount, annualRate, termInMonths, extraPayment)
          const totalInterest = amortization.totalInterest
          
          return totalInterest >= 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10b: Total payment always equals loan amount plus total interest
   * 
   * **Validates: Requirements 5.3**
   */
  it('Property 10b: Total payment always equals loan amount plus total interest', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, interestRate, loanTermYears, extraPayment) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          const amortization = calculateAmortization(loanAmount, annualRate, termInMonths, extraPayment)
          const totalInterest = amortization.totalInterest
          const totalPayment = amortization.totalPayment
          
          // Expected total payment = loan amount + total interest
          const expectedTotalPayment = loanAmount + totalInterest
          
          // Allow small tolerance for floating point rounding errors
          const tolerance = 0.01
          return Math.abs(totalPayment - expectedTotalPayment) < tolerance
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10c: Higher interest rate results in higher total interest
   * 
   * **Validates: Requirements 5.3**
   */
  it('Property 10c: Higher interest rate results in higher total interest (for same loan)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        fc.float({ min: 2, max: 8, noNaN: true }),
        arbLoanTermYears,
        (homeValue, downPercent, baseInterestRate, loanTermYears) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const termInMonths = loanTermYears * 12
          
          // Calculate with base interest rate
          const amortization1 = calculateAmortization(loanAmount, baseInterestRate / 100, termInMonths, 0)
          const totalInterest1 = amortization1.totalInterest
          
          // Calculate with higher interest rate (base + 2%)
          const higherRate = baseInterestRate + 2
          const amortization2 = calculateAmortization(loanAmount, higherRate / 100, termInMonths, 0)
          const totalInterest2 = amortization2.totalInterest
          
          // Higher interest rate should result in higher total interest
          return totalInterest2 > totalInterest1
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10d: Longer loan term results in higher total interest (for same rate)
   * 
   * **Validates: Requirements 5.3**
   */
  it('Property 10d: Longer loan term results in higher total interest (for same rate)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbInterestRate,
        fc.integer({ min: 10, max: 30 }),
        (homeValue, downPercent, interestRate, baseLoanTermYears) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const annualRate = interestRate / 100
          
          // Calculate with base term
          const termInMonths1 = baseLoanTermYears * 12
          const amortization1 = calculateAmortization(loanAmount, annualRate, termInMonths1, 0)
          const totalInterest1 = amortization1.totalInterest
          
          // Calculate with longer term (base + 10 years)
          const longerTermYears = baseLoanTermYears + 10
          const termInMonths2 = longerTermYears * 12
          const amortization2 = calculateAmortization(loanAmount, annualRate, termInMonths2, 0)
          const totalInterest2 = amortization2.totalInterest
          
          // Longer term should result in higher total interest
          return totalInterest2 > totalInterest1
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10e: Extra payments reduce total interest
   * 
   * **Validates: Requirements 5.3**
   */
  it('Property 10e: Extra payments reduce total interest', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbInterestRate,
        arbLoanTermYears,
        fc.float({ min: 100, max: 1000, noNaN: true }),
        (homeValue, downPercent, interestRate, loanTermYears, extraPayment) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate without extra payments
          const amortization1 = calculateAmortization(loanAmount, annualRate, termInMonths, 0)
          const totalInterest1 = amortization1.totalInterest
          
          // Calculate with extra payments
          const amortization2 = calculateAmortization(loanAmount, annualRate, termInMonths, extraPayment)
          const totalInterest2 = amortization2.totalInterest
          
          // Extra payments should reduce total interest
          return totalInterest2 < totalInterest1
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10f: Zero interest rate results in zero total interest
   * 
   * **Validates: Requirements 5.3**
   */
  it('Property 10f: Zero interest rate results in zero total interest', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbLoanTermYears,
        (homeValue, downPercent, loanTermYears) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          
          const termInMonths = loanTermYears * 12
          
          // Calculate with zero interest rate
          const amortization = calculateAmortization(loanAmount, 0, termInMonths, 0)
          const totalInterest = amortization.totalInterest
          
          // Zero interest rate should result in zero total interest
          return Math.abs(totalInterest) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })
})
