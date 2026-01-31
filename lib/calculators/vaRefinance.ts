// VA Refinance Calculator Logic

import { vaRefinanceSchema, type VARefinanceInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate VA refinance savings and cash out analysis
 * Includes VA funding fee which is typically financed into the new loan
 * VA refinance loans (IRRRL or cash-out) have specific funding fee structures
 * 
 * Formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
 * Where: M = monthly payment, P = principal (loan amount), r = monthly interest rate, n = number of payments
 * 
 * @param inputs - Validated VA refinance calculator inputs
 * @returns Array of calculation results
 */
export function calculateVARefinance(inputs: VARefinanceInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = vaRefinanceSchema.parse(inputs)
  
  const { currentBalance, currentRate, newRate, cashOutAmount, vaFundingFee } = validated
  
  // Convert annual interest rates to monthly rates
  const currentMonthlyRate = currentRate / 100 / 12
  const newMonthlyRate = newRate / 100 / 12
  
  // VA loans typically use 30-year terms
  const loanTerm = 30
  const numberOfPayments = loanTerm * 12
  
  // Calculate current monthly payment (P&I)
  let currentMonthlyPayment: number
  
  if (currentMonthlyRate === 0) {
    // Handle edge case: 0% interest rate
    currentMonthlyPayment = currentBalance / numberOfPayments
  } else {
    // Standard mortgage formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    currentMonthlyPayment = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, numberOfPayments)) / (Math.pow(1 + currentMonthlyRate, numberOfPayments) - 1)
  }
  
  // Calculate base new loan amount (current balance + cash out)
  const baseNewLoanAmount = currentBalance + cashOutAmount
  
  // Calculate VA funding fee amount (percentage of base new loan amount)
  const fundingFeeAmount = baseNewLoanAmount * (vaFundingFee / 100)
  
  // Total new loan amount includes the funding fee (typically financed into the loan)
  const totalNewLoanAmount = baseNewLoanAmount + fundingFeeAmount
  
  // Calculate new monthly payment (P&I)
  let newMonthlyPayment: number
  
  if (newMonthlyRate === 0) {
    // Handle edge case: 0% interest rate
    newMonthlyPayment = totalNewLoanAmount / numberOfPayments
  } else {
    // Standard mortgage formula
    newMonthlyPayment = totalNewLoanAmount * (newMonthlyRate * Math.pow(1 + newMonthlyRate, numberOfPayments)) / (Math.pow(1 + newMonthlyRate, numberOfPayments) - 1)
  }
  
  // Calculate monthly savings (or additional cost if negative)
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment
  
  // Calculate total interest paid on current loan (full term)
  const totalCurrentPayments = currentMonthlyPayment * numberOfPayments
  const totalCurrentInterest = totalCurrentPayments - currentBalance
  
  // Calculate total interest paid on new loan
  const totalNewPayments = newMonthlyPayment * numberOfPayments
  const totalNewInterest = totalNewPayments - totalNewLoanAmount
  
  // Calculate lifetime savings (comparing full terms)
  // Note: This is a simplified comparison assuming both loans run full term
  const lifetimeSavings = totalCurrentPayments - totalNewPayments
  
  // Calculate interest rate reduction
  const rateReduction = currentRate - newRate
  
  // Calculate effective cash received (cash out minus funding fee if paid upfront)
  // In most cases, funding fee is financed, so cash received equals cash out amount
  const effectiveCashReceived = cashOutAmount
  
  // Calculate loan increase (how much the loan balance increased)
  const loanIncrease = totalNewLoanAmount - currentBalance
  
  return [
    {
      label: 'New Monthly Payment',
      value: newMonthlyPayment,
      format: 'currency',
      highlight: true,
      description: 'Your new monthly principal and interest payment'
    },
    {
      label: 'Current Monthly Payment',
      value: currentMonthlyPayment,
      format: 'currency',
      description: 'Your current monthly principal and interest payment'
    },
    {
      label: 'Monthly Savings',
      value: monthlySavings,
      format: 'currency',
      highlight: true,
      description: monthlySavings >= 0 ? 'Amount you save each month' : 'Additional monthly cost (negative savings)'
    },
    {
      label: 'Cash Out Amount',
      value: effectiveCashReceived,
      format: 'currency',
      highlight: cashOutAmount > 0,
      description: 'Cash you receive from the refinance'
    },
    {
      label: 'VA Funding Fee',
      value: fundingFeeAmount,
      format: 'currency',
      description: `VA funding fee (${vaFundingFee.toFixed(2)}% of loan amount, typically financed into loan)`
    },
    {
      label: 'New Loan Amount',
      value: totalNewLoanAmount,
      format: 'currency',
      description: 'Total new loan amount including cash out and funding fee'
    },
    {
      label: 'Current Loan Balance',
      value: currentBalance,
      format: 'currency',
      description: 'Your current mortgage balance'
    },
    {
      label: 'Loan Increase',
      value: loanIncrease,
      format: 'currency',
      description: 'Amount your loan balance will increase (cash out + funding fee)'
    },
    {
      label: 'Interest Rate Reduction',
      value: rateReduction / 100,
      format: 'percentage',
      description: rateReduction >= 0 ? 'Reduction in interest rate' : 'Increase in interest rate'
    },
    {
      label: 'Lifetime Savings',
      value: lifetimeSavings,
      format: 'currency',
      description: lifetimeSavings >= 0 ? `Total savings over ${loanTerm} years` : `Additional cost over ${loanTerm} years`
    },
    {
      label: 'Total Interest (Current Loan)',
      value: totalCurrentInterest,
      format: 'currency',
      description: `Total interest over ${loanTerm} years at current rate`
    },
    {
      label: 'Total Interest (New Loan)',
      value: totalNewInterest,
      format: 'currency',
      description: `Total interest over ${loanTerm} years at new rate`
    }
  ]
}

/**
 * Validate VA refinance calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validateVARefinanceInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: VARefinanceInputs
} {
  const result = vaRefinanceSchema.safeParse(inputs)
  
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
