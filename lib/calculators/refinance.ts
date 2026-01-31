// Refinance Calculator Logic

import { refinanceSchema, type RefinanceInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate refinance savings and break-even analysis
 * Compares current mortgage to new refinanced mortgage
 * 
 * Formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
 * Where: M = monthly payment, P = principal (loan amount), r = monthly interest rate, n = number of payments
 * 
 * @param inputs - Validated refinance calculator inputs
 * @returns Array of calculation results
 */
export function calculateRefinance(inputs: RefinanceInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = refinanceSchema.parse(inputs)
  
  const { currentBalance, currentRate, newRate, remainingTerm, newTerm, closingCosts } = validated
  
  // Convert annual interest rates to monthly rates
  const currentMonthlyRate = currentRate / 100 / 12
  const newMonthlyRate = newRate / 100 / 12
  
  // Number of payments
  const currentPayments = remainingTerm * 12
  const newPayments = newTerm * 12
  
  // Calculate current monthly payment (P&I)
  let currentMonthlyPayment: number
  
  if (currentMonthlyRate === 0) {
    // Handle edge case: 0% interest rate
    currentMonthlyPayment = currentBalance / currentPayments
  } else {
    // Standard mortgage formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    currentMonthlyPayment = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) / (Math.pow(1 + currentMonthlyRate, currentPayments) - 1)
  }
  
  // Calculate new loan amount (current balance + closing costs rolled into loan)
  const newLoanAmount = currentBalance + closingCosts
  
  // Calculate new monthly payment (P&I)
  let newMonthlyPayment: number
  
  if (newMonthlyRate === 0) {
    // Handle edge case: 0% interest rate
    newMonthlyPayment = newLoanAmount / newPayments
  } else {
    // Standard mortgage formula
    newMonthlyPayment = newLoanAmount * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) / (Math.pow(1 + newMonthlyRate, newPayments) - 1)
  }
  
  // Calculate monthly savings
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment
  
  // Calculate break-even point (months to recover closing costs)
  let breakEvenMonths: number
  
  if (monthlySavings > 0) {
    breakEvenMonths = closingCosts / monthlySavings
  } else if (monthlySavings === 0) {
    // No savings, never breaks even
    breakEvenMonths = Infinity
  } else {
    // Negative savings (losing money), never breaks even
    breakEvenMonths = Infinity
  }
  
  // Calculate total interest paid on current loan (remaining term)
  const totalCurrentPayments = currentMonthlyPayment * currentPayments
  const totalCurrentInterest = totalCurrentPayments - currentBalance
  
  // Calculate total interest paid on new loan
  const totalNewPayments = newMonthlyPayment * newPayments
  const totalNewInterest = totalNewPayments - newLoanAmount
  
  // Calculate total savings over life of new loan
  // Compare: remaining payments on current loan vs. all payments on new loan (including closing costs)
  const totalCurrentCost = totalCurrentPayments
  const totalNewCost = totalNewPayments // Closing costs already included in loan amount
  const lifetimeSavings = totalCurrentCost - totalNewCost
  
  // Calculate interest rate reduction
  const rateReduction = currentRate - newRate
  
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
      label: 'Break-Even Point',
      value: breakEvenMonths,
      format: 'number',
      highlight: true,
      description: breakEvenMonths !== Infinity ? `Months to recover closing costs through savings` : 'Never breaks even with current parameters'
    },
    {
      label: 'Lifetime Savings',
      value: lifetimeSavings,
      format: 'currency',
      description: lifetimeSavings >= 0 ? `Total savings over ${newTerm} years` : `Additional cost over ${newTerm} years`
    },
    {
      label: 'Closing Costs',
      value: closingCosts,
      format: 'currency',
      description: 'Upfront costs to refinance (rolled into new loan)'
    },
    {
      label: 'New Loan Amount',
      value: newLoanAmount,
      format: 'currency',
      description: 'Current balance plus closing costs'
    },
    {
      label: 'Interest Rate Reduction',
      value: rateReduction / 100,
      format: 'percentage',
      description: rateReduction >= 0 ? 'Reduction in interest rate' : 'Increase in interest rate'
    },
    {
      label: 'Total Interest (Current Loan)',
      value: totalCurrentInterest,
      format: 'currency',
      description: `Total interest over remaining ${remainingTerm} years`
    },
    {
      label: 'Total Interest (New Loan)',
      value: totalNewInterest,
      format: 'currency',
      description: `Total interest over ${newTerm} years`
    }
  ]
}

/**
 * Validate refinance calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validateRefinanceInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: RefinanceInputs
} {
  const result = refinanceSchema.safeParse(inputs)
  
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
