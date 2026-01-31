// Purchase Calculator Logic

import { purchaseSchema, type PurchaseInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate monthly mortgage payment and total costs for a home purchase
 * Includes principal & interest, property taxes, insurance, and HOA fees
 * 
 * Formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
 * Where: M = monthly payment, P = principal (loan amount), r = monthly interest rate, n = number of payments
 * 
 * @param inputs - Validated purchase calculator inputs
 * @returns Array of calculation results
 */
export function calculatePurchase(inputs: PurchaseInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = purchaseSchema.parse(inputs)
  
  const { homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, insurance, hoa } = validated
  
  // Calculate loan amount (home price - down payment)
  const loanAmount = homePrice - downPayment
  
  // Ensure loan amount is not negative
  if (loanAmount < 0) {
    throw new Error('Down payment cannot exceed home price')
  }
  
  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRate / 100 / 12
  
  // Number of payments (loan term in years × 12 months)
  const numberOfPayments = loanTerm * 12
  
  // Calculate monthly principal & interest payment
  let monthlyPI: number
  
  if (loanAmount === 0) {
    // No loan needed (100% down payment)
    monthlyPI = 0
  } else if (monthlyInterestRate === 0) {
    // Handle edge case: 0% interest rate
    monthlyPI = loanAmount / numberOfPayments
  } else {
    // Standard mortgage formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    monthlyPI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
  }
  
  // Calculate monthly property tax (annual rate as percentage of home price / 12)
  const monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12
  
  // Monthly insurance (already provided as annual amount, convert to monthly)
  const monthlyInsurance = insurance / 12
  
  // Monthly HOA fees (already provided as monthly amount)
  const monthlyHOA = hoa
  
  // Calculate total monthly payment
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyHOA
  
  // Calculate total interest paid over life of loan
  const totalPayments = monthlyPI * numberOfPayments
  const totalInterest = totalPayments - loanAmount
  
  // Calculate total cost of the home (down payment + all payments + taxes + insurance + HOA)
  const totalCost = downPayment + totalPayments + (monthlyPropertyTax * numberOfPayments) + (monthlyInsurance * numberOfPayments) + (monthlyHOA * numberOfPayments)
  
  // Calculate loan-to-value ratio
  const loanToValue = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0
  
  // Calculate down payment percentage
  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0
  
  return [
    {
      label: 'Total Monthly Payment',
      value: totalMonthlyPayment,
      format: 'currency',
      highlight: true,
      description: 'Your total monthly payment including P&I, taxes, insurance, and HOA'
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
      label: 'HOA Fees',
      value: monthlyHOA,
      format: 'currency',
      description: 'Monthly homeowners association fees'
    },
    {
      label: 'Loan Amount',
      value: loanAmount,
      format: 'currency',
      description: 'The mortgage loan amount (home price minus down payment)'
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
      description: `Total cost including down payment, all payments, taxes, insurance, and HOA over ${loanTerm} years`
    },
    {
      label: 'Loan-to-Value Ratio',
      value: loanToValue / 100,
      format: 'percentage',
      description: 'The ratio of your loan amount to the home price'
    }
  ]
}

/**
 * Validate purchase calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validatePurchaseInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: PurchaseInputs
} {
  const result = purchaseSchema.safeParse(inputs)
  
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
