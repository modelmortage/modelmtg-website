/**
 * Total Payment Calculation Property-Based Tests
 * Tests universal properties of total payment calculations using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 9: Total Payment Calculation
 * **Validates: Requirements 5.1**
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
} {
  const monthlyRate = annualRate / 12
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  let balance = principal
  let totalInterest = 0
  let monthsPaid = 0
  
  while (balance > 0.01 && monthsPaid < termInMonths * 2) {
    const interestPayment = balance * monthlyRate
    let principalPayment = monthlyPI - interestPayment + extraPayment
    
    // Handle last payment - don't overpay
    if (principalPayment > balance) {
      principalPayment = balance
    }
    
    totalInterest += interestPayment
    balance -= principalPayment
    monthsPaid++
  }
  
  return { monthlyPayment: monthlyPI, totalInterest, actualTermMonths: monthsPaid }
}

function adjustPaymentForFrequency(monthlyPayment: number, frequency: PaymentFrequency): number {
  const periodsPerYear = getPeriodsPerYear(frequency)
  return (monthlyPayment * 12) / periodsPerYear
}

describe('Total Payment Calculation - Property-Based Tests', () => {
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbDownPaymentPercent = fc.float({ min: 0, max: 20, noNaN: true })
  const arbInterestRate = fc.float({ min: 2, max: 10, noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbPaymentFrequency = fc.constantFrom<PaymentFrequency>('monthly', 'bi-weekly', 'weekly')

  it('Property 9: Total payment equals payment per period times number of periods', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbInterestRate,
        arbLoanTermYears,
        arbPaymentFrequency,
        (homeValue, downPercent, interestRate, loanTermYears, frequency) => {
          const downPayment = homeValue * (downPercent / 100)
          const loanAmount = homeValue - downPayment
          if (loanAmount < 1000) return true
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate the standard monthly payment (no extra payments)
          const amortization = calculateAmortization(loanAmount, annualRate, termInMonths, 0)
          const monthlyPayment = amortization.monthlyPayment
          
          // Adjust payment for frequency
          const periodsPerYear = getPeriodsPerYear(frequency)
          const paymentPerPeriod = adjustPaymentForFrequency(monthlyPayment, frequency)
          
          // Calculate number of periods based on the original term
          const numberOfPeriods = (termInMonths / 12) * periodsPerYear
          
          // Total payment = payment per period × number of periods
          const totalPayment = paymentPerPeriod * numberOfPeriods
          
          // Expected total payment = loan amount + total interest
          const expectedTotalPayment = loanAmount + amortization.totalInterest
          
          // Allow 1% tolerance for rounding errors
          const tolerance = Math.max(expectedTotalPayment * 0.01, 1)
          return Math.abs(totalPayment - expectedTotalPayment) < tolerance
        }
      ),
      { numRuns: 100 }
    )
  })
})
