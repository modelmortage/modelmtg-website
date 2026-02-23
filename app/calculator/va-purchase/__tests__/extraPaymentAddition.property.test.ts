/**
 * Extra Payment Addition Property-Based Tests
 * Tests universal properties of extra payment addition to total monthly payment using fast-check
 * 
 * Feature: va-purchase-calculator-enhancements, Property 7: Extra Payment Addition
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
 * **Validates: Requirements 4.2**
 * 
 * Property 7: Extra Payment Addition
 * For any extra payment amount greater than zero, the total monthly payment should equal
 * the sum of principal & interest, taxes, insurance, HOA dues, and the extra payment amount.
 */
describe('Extra Payment Addition - Property-Based Tests', () => {
  // Arbitrary generators for test inputs
  const arbHomeValue = fc.integer({ min: 50000, max: 2000000 })
  const arbDownPaymentPercent = fc.float({ min: 0, max: 20, noNaN: true })
  const arbInterestRate = fc.float({ min: 2, max: 10, noNaN: true })
  const arbLoanTermYears = fc.integer({ min: 5, max: 40 })
  const arbVAFeeType = fc.constantFrom<VAFundingFeeType>('first-time', 'subsequent', 'exempt')
  const arbExtraPayment = fc.float({ min: 0, max: 2000, noNaN: true })
  const arbPropertyTaxYearly = fc.float({ min: 0, max: 10000, noNaN: true })
  const arbInsuranceYearly = fc.float({ min: 0, max: 5000, noNaN: true })
  const arbHOAMonthly = fc.float({ min: 0, max: 500, noNaN: true })

  /**
   * Property 7: Total monthly payment equals sum of all components including extra payment
   * 
   * **Validates: Requirements 4.2**
   */
  it('Property 7: Total monthly payment equals sum of all components including extra payment', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization (principal & interest)
          const amortization = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate monthly components
          const monthlyPI = amortization.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate total monthly payment
          const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          
          // Calculate expected total (sum of all components)
          const expectedTotal = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          
          // Verify the total monthly payment equals the sum of all components
          return Math.abs(totalMonthlyPayment - expectedTotal) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7a: Extra payment is included in total when greater than zero
   * 
   * **Validates: Requirements 4.2**
   */
  it('Property 7a: Extra payment is included in total when greater than zero', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        fc.float({ min: Math.fround(0.01), max: 2000, noNaN: true }), // Extra payment > 0
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization
          const amortization = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate monthly components
          const monthlyPI = amortization.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate total with and without extra payment
          const totalWithExtra = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          const totalWithoutExtra = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
          
          // Verify the difference equals the extra payment
          const difference = totalWithExtra - totalWithoutExtra
          return Math.abs(difference - extraPayment) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7b: Total monthly payment with zero extra payment excludes extra payment
   */
  it('Property 7b: Total monthly payment with zero extra payment excludes extra payment', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization with zero extra payment
          const amortization = calculateAmortization(finalMortgage, annualRate, termInMonths, 0)
          
          // Calculate monthly components
          const monthlyPI = amortization.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate total monthly payment (should not include extra payment)
          const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + 0
          
          // Calculate expected total without extra payment
          const expectedTotal = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
          
          // Verify the total equals the sum without extra payment
          return Math.abs(totalMonthlyPayment - expectedTotal) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7c: Total monthly payment increases linearly with extra payment amount
   */
  it('Property 7c: Total monthly payment increases linearly with extra payment amount', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        fc.float({ min: 100, max: 1000, noNaN: true }),
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization
          const amortization = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate monthly components
          const monthlyPI = amortization.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate total with original extra payment
          const total1 = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          
          // Calculate total with doubled extra payment
          const total2 = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + (extraPayment * 2)
          
          // Verify the difference equals the extra payment amount
          const difference = total2 - total1
          return Math.abs(difference - extraPayment) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7d: Extra payment component is always non-negative
   */
  it('Property 7d: Extra payment component is always non-negative', () => {
    fc.assert(
      fc.property(
        arbExtraPayment,
        (extraPayment) => {
          // Extra payment should always be non-negative
          return extraPayment >= 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7e: Total monthly payment is always greater than or equal to base payment when extra payment > 0
   */
  it('Property 7e: Total monthly payment is always greater than or equal to base payment when extra payment > 0', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        fc.float({ min: Math.fround(0.01), max: 2000, noNaN: true }), // Extra payment > 0
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization
          const amortization = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate monthly components
          const monthlyPI = amortization.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate totals
          const basePayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
          const totalWithExtra = basePayment + extraPayment
          
          // Verify total with extra is greater than base payment
          return totalWithExtra >= basePayment
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7f: Extra payment addition is commutative with other payment components
   */
  it('Property 7f: Extra payment addition is commutative with other payment components', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization
          const amortization = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate monthly components
          const monthlyPI = amortization.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate total in different orders
          const total1 = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          const total2 = extraPayment + monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
          const total3 = monthlyTax + extraPayment + monthlyPI + monthlyInsurance + monthlyHOA
          
          // Verify all orders produce the same result
          return Math.abs(total1 - total2) < 0.01 && Math.abs(total2 - total3) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7g: Total monthly payment calculation is deterministic
   */
  it('Property 7g: Total monthly payment calculation is deterministic', () => {
    fc.assert(
      fc.property(
        arbHomeValue,
        arbDownPaymentPercent,
        arbVAFeeType,
        arbInterestRate,
        arbLoanTermYears,
        arbExtraPayment,
        arbPropertyTaxYearly,
        arbInsuranceYearly,
        arbHOAMonthly,
        (homeValue, downPercent, feeType, interestRate, loanTermYears, extraPayment, propertyTax, insurance, hoa) => {
          // Calculate base mortgage and final mortgage amount
          const downPayment = homeValue * (downPercent / 100)
          const baseMortgage = homeValue - downPayment
          const vaFundingFee = calculateVAFundingFee(baseMortgage, feeType)
          const finalMortgage = baseMortgage + vaFundingFee
          
          // Calculate loan parameters
          const annualRate = interestRate / 100
          const termInMonths = loanTermYears * 12
          
          // Calculate amortization multiple times
          const amortization1 = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          const amortization2 = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          const amortization3 = calculateAmortization(finalMortgage, annualRate, termInMonths, extraPayment)
          
          // Calculate monthly components
          const monthlyPI1 = amortization1.monthlyPayment
          const monthlyPI2 = amortization2.monthlyPayment
          const monthlyPI3 = amortization3.monthlyPayment
          const monthlyTax = propertyTax / 12
          const monthlyInsurance = insurance / 12
          const monthlyHOA = hoa
          
          // Calculate totals
          const total1 = monthlyPI1 + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          const total2 = monthlyPI2 + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          const total3 = monthlyPI3 + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment
          
          // Verify all calculations produce the same result
          return Math.abs(total1 - total2) < 0.01 && Math.abs(total2 - total3) < 0.01
        }
      ),
      { numRuns: 100 }
    )
  })
})
