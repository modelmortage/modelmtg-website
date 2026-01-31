// VA Purchase Calculator Logic

import { vaPurchaseSchema, type VAPurchaseInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate monthly mortgage payment and total costs for a VA home purchase
 * Includes principal & interest, VA funding fee, property taxes, and insurance
 * VA loans typically allow 0% down payment and do not require PMI
 * 
 * Formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
 * Where: M = monthly payment, P = principal (loan amount + funding fee), r = monthly interest rate, n = number of payments
 * 
 * @param inputs - Validated VA purchase calculator inputs
 * @returns Array of calculation results
 */
export function calculateVAPurchase(inputs: VAPurchaseInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = vaPurchaseSchema.parse(inputs)
  
  const { homePrice, downPayment, interestRate, vaFundingFee, propertyTaxRate, insurance } = validated
  
  // Calculate base loan amount (home price - down payment)
  const baseLoanAmount = homePrice - downPayment
  
  // Ensure loan amount is not negative
  if (baseLoanAmount < 0) {
    throw new Error('Down payment cannot exceed home price')
  }
  
  // Calculate VA funding fee amount (percentage of base loan amount)
  const fundingFeeAmount = baseLoanAmount * (vaFundingFee / 100)
  
  // Total loan amount includes the funding fee (typically financed into the loan)
  const totalLoanAmount = baseLoanAmount + fundingFeeAmount
  
  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRate / 100 / 12
  
  // Number of payments (30-year mortgage is standard for VA loans)
  const loanTerm = 30
  const numberOfPayments = loanTerm * 12
  
  // Calculate monthly principal & interest payment
  let monthlyPI: number
  
  if (totalLoanAmount === 0) {
    // No loan needed (100% down payment)
    monthlyPI = 0
  } else if (monthlyInterestRate === 0) {
    // Handle edge case: 0% interest rate
    monthlyPI = totalLoanAmount / numberOfPayments
  } else {
    // Standard mortgage formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    monthlyPI = totalLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
  }
  
  // Calculate monthly property tax (annual rate as percentage of home price / 12)
  const monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12
  
  // Monthly insurance (already provided as annual amount, convert to monthly)
  const monthlyInsurance = insurance / 12
  
  // Calculate total monthly payment (no PMI for VA loans)
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance
  
  // Calculate total interest paid over life of loan
  const totalPayments = monthlyPI * numberOfPayments
  const totalInterest = totalPayments - totalLoanAmount
  
  // Calculate total cost of the home (down payment + all payments + taxes + insurance)
  const totalCost = downPayment + totalPayments + (monthlyPropertyTax * numberOfPayments) + (monthlyInsurance * numberOfPayments)
  
  // Calculate loan-to-value ratio (based on base loan amount, not including funding fee)
  const loanToValue = homePrice > 0 ? (baseLoanAmount / homePrice) * 100 : 0
  
  // Calculate down payment percentage
  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0
  
  return [
    {
      label: 'Total Monthly Payment',
      value: totalMonthlyPayment,
      format: 'currency',
      highlight: true,
      description: 'Your total monthly payment including P&I, taxes, and insurance (no PMI required)'
    },
    {
      label: 'Principal & Interest',
      value: monthlyPI,
      format: 'currency',
      description: 'Monthly principal and interest payment on the loan'
    },
    {
      label: 'Property Taxes',
      value: monthlyPropertyTax,
      format: 'currency',
      description: 'Estimated monthly property tax payment'
    },
    {
      label: 'Homeowners Insurance',
      value: monthlyInsurance,
      format: 'currency',
      description: 'Monthly homeowners insurance payment'
    },
    {
      label: 'Base Loan Amount',
      value: baseLoanAmount,
      format: 'currency',
      description: 'The mortgage loan amount before funding fee (home price minus down payment)'
    },
    {
      label: 'VA Funding Fee',
      value: fundingFeeAmount,
      format: 'currency',
      description: `VA funding fee (${vaFundingFee.toFixed(2)}% of loan amount, typically financed into loan)`
    },
    {
      label: 'Total Loan Amount',
      value: totalLoanAmount,
      format: 'currency',
      description: 'Total loan amount including VA funding fee'
    },
    {
      label: 'Down Payment',
      value: downPayment,
      format: 'currency',
      description: `Your down payment (${downPaymentPercent.toFixed(1)}% of home price)`
    },
    {
      label: 'Total Interest Paid',
      value: totalInterest,
      format: 'currency',
      description: `Total interest paid over ${loanTerm} years`
    },
    {
      label: 'Total Cost',
      value: totalCost,
      format: 'currency',
      description: `Total cost including down payment, all payments, taxes, and insurance over ${loanTerm} years`
    },
    {
      label: 'Loan-to-Value Ratio',
      value: loanToValue / 100,
      format: 'percentage',
      description: 'The ratio of your base loan amount to the home price'
    }
  ]
}

/**
 * Validate VA purchase calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validateVAPurchaseInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: VAPurchaseInputs
} {
  const result = vaPurchaseSchema.safeParse(inputs)
  
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    const errors: Record<string, string> = {}
    
    if (result.error && result.error.issues) {
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string
        errors[field] = err.message
      })
    }
    
    return { success: false, errors }
  }
}
