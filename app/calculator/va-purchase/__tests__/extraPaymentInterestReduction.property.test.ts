/**
 * Extra Payment Interest Reduction Property-Based Tests
 * Tests universal properties of extra payment impact on interest and loan term using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 8: Extra Payment Interest Reduction
 */

import fc from 'fast-check'

// Type definitions
type VAFundingFeeType = 'first-time' | 'subsequent' | 'exempt'

// Calculation functions (redefined for testing)
function calculateVAFundingFee(
  baseMortgageAmount: number,
  feeType: VAFundingFeeType
): number {
  switch (feeType) {
    case 'first-time':
      return baseMortgageAmount * 0.0215
    case 'subsequent':
      return baseMortgageAmount * 0.033
    case 'exempt':
      return 0
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
  
  // Standard monthly payment (principal + interest)
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  // Calculate actual payoff with extra payments
  let balance = principal
  let totalInterest = 0
  let monthsPaid = 0
  
  while (balance > 0 && monthsPaid < termInMonths * 2) {
    const interestPayment = balance * monthlyRate
    const principalPayment = Math.min(monthlyPI - interestPayment + extraPayment, balance + interestPayment)
    
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

/**
 * **Validates: Requirements 4.4**
 * 
 * Property 8: Extra Payment Interest Reduction
 * For any extra payment amount greater than zero, the total interest paid should be less than
 * the total interest paid with zero extra payment, and the loan term should be shorter.
 */
describe('Extra Payment Interest Reduction - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbDownPaymentPercent = fc.float({ min: 0, max: 20, noNaN: true })
  const arbInterestRate = fc.float({ min: 2, max: 10, noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbVAFeeType = fc.constantFrom<VAFundingFeeType>('first-time', 'subsequent', 'exempt')
  const arbExtraPayment = fc.float({ min: Math.fround(0.01), max: 2000, noNaN: true })

  /**
   * Property 8: Extra payment reduces total interest paid
   * 
   * **Validates: Requirements 4.4**
   */
  it('Property 8: Extra payment reduces total interest paid', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization without extra payment
          const withoutExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          
          // Calculate amortization with extra payment
          const withExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Verify total interest with extra payment is less than without
          return withExtra.totalInterest < withoutExtra.totalInterest
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8a: Extra payment shortens or maintains loan term (never extends it)
   * 
   * **Validates: Requirements 4.4**
   */
  it('Property 8a: Extra payment shortens or maintains loan term (never extends it)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization without extra payment
          const withoutExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          
          // Calculate amortization with extra payment
          const withExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Verify loan term with extra payment is shorter than or equal to without
          // (very small extra payments may not shorten the term in practice)
          return withExtra.actualTermMonths <= withoutExtra.actualTermMonths
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8b: Interest reduction is proportional to extra payment amount
   */
  it('Property 8b: Larger extra payments result in greater interest reduction', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        fc.float({ min: 100, max: 500, noNaN: true }),
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization without extra payment
          const withoutExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          
          // Calculate amortization with smaller extra payment
          const withSmallExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate amortization with larger extra payment (double)
          const withLargeExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment * 2)
          
          // Calculate interest reductions
          const smallReduction = withoutExtra.totalInterest - withSmallExtra.totalInterest
          const largeReduction = withoutExtra.totalInterest - withLargeExtra.totalInterest
          
          // Verify larger extra payment results in greater interest reduction
          return largeReduction > smallReduction
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8c: Interest reduction is always non-negative
   */
  it('Property 8c: Interest reduction is always non-negative (extra payment never increases interest)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization without extra payment
          const withoutExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          
          // Calculate amortization with extra payment
          const withExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate interest reduction
          const interestReduction = withoutExtra.totalInterest - withExtra.totalInterest
          
          // Verify interest reduction is non-negative
          return interestReduction >= 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8d: Term reduction is always non-negative
   */
  it('Property 8d: Term reduction is always non-negative (extra payment never extends loan)', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization without extra payment
          const withoutExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          
          // Calculate amortization with extra payment
          const withExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate term reduction
          const termReduction = withoutExtra.actualTermMonths - withExtra.actualTermMonths
          
          // Verify term reduction is non-negative
          return termReduction >= 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8e: Interest savings increase as loan term increases (for same extra payment)
   */
  it('Property 8e: Longer loan terms benefit more from extra payments', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        fc.integer({ min: 10, max: 20 }), // Shorter term
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, shortTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const shortTermMonths = shortTermYears * 12
          const longTermMonths = shortTermYears * 2 * 12 // Double the term
          
          // Calculate for shorter term
          const shortWithoutExtra = calculateAmortization(finalMortgage, annualRate, shortTermMonths, 0)
          const shortWithExtra = calculateAmortization(finalMortgage, annualRate, shortTermMonths, extraPayment)
          const shortSavings = shortWithoutExtra.totalInterest - shortWithExtra.totalInterest
          
          // Calculate for longer term
          const longWithoutExtra = calculateAmortization(finalMortgage, annualRate, longTermMonths, 0)
          const longWithExtra = calculateAmortization(finalMortgage, annualRate, longTermMonths, extraPayment)
          const longSavings = longWithoutExtra.totalInterest - longWithExtra.totalInterest
          
          // Verify longer term has greater savings (or equal if extra payment is very small)
          return longSavings >= shortSavings
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8f: Interest savings increase as interest rate increases (for same extra payment)
   */
  it('Property 8f: Higher interest rates benefit more from extra payments', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        fc.float({ min: 3, max: 6, noNaN: true }), // Lower interest rate
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, lowInterestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const lowAnnualRate = lowInterestRate / 100
          const highAnnualRate = (lowInterestRate + 2) / 100 // Add 2% to get higher rate
          const termInMonths = loanTermYears * 12
          
          // Calculate for lower interest rate
          const lowWithoutExtra = calculateAmortization(finalMortgage, lowAnnualRate, termInMonths, 0)
          const lowWithExtra = calculateAmortization(finalMortgage, lowAnnualRate, termInMonths, extraPayment)
          const lowSavings = lowWithoutExtra.totalInterest - lowWithExtra.totalInterest
          
          // Calculate for higher interest rate
          const highWithoutExtra = calculateAmortization(finalMortgage, highAnnualRate, termInMonths, 0)
          const highWithExtra = calculateAmortization(finalMortgage, highAnnualRate, termInMonths, extraPayment)
          const highSavings = highWithoutExtra.totalInterest - highWithExtra.totalInterest
          
          // Verify higher interest rate has greater savings
          return highSavings >= lowSavings
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8g: Total payment (principal + interest) with extra payment is less than without
   */
  it('Property 8g: Total amount paid over loan life is less with extra payments', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization without extra payment
          const withoutExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          const totalWithoutExtra = finalMortgage + withoutExtra.totalInterest
          
          // Calculate amortization with extra payment
          const withExtra = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          const totalWithExtra = finalMortgage + withExtra.totalInterest
          
          // Verify total payment with extra is less than without
          // (since we're paying off principal faster, we pay less interest overall)
          return totalWithExtra < totalWithoutExtra
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8h: Extra payment effect is deterministic
   */
  it('Property 8h: Extra payment calculations are deterministic', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization multiple times
          const result1 = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          const result2 = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          const result3 = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Verify all calculations produce the same results
          return (
            Math.abs(result1.totalInterest - result2.totalInterest) < 0.01 &&
            Math.abs(result2.totalInterest - result3.totalInterest) < 0.01 &&
            result1.actualTermMonths === result2.actualTermMonths &&
            result2.actualTermMonths === result3.actualTermMonths
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})
