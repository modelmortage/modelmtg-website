// Affordability Calculator Logic

import { affordabilitySchema, type AffordabilityInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate maximum home affordability based on income, debts, and down payment
 * Uses industry-standard DTI ratio of 43% and 30-year mortgage formula
 * 
 * Formula: Max loan = (monthly payment capacity) × ((1 - (1 + r)^-n) / r)
 * Where: r = monthly interest rate, n = 360 months (30 years)
 * 
 * @param inputs - Validated affordability calculator inputs
 * @returns Array of calculation results
 */
export function calculateAffordability(inputs: AffordabilityInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = affordabilitySchema.parse(inputs)
  
  const { annualIncome, monthlyDebts, downPayment, interestRate } = validated
  
  // Calculate monthly income
  const monthlyIncome = annualIncome / 12
  
  // DTI ratio of 43% (conservative standard)
  const DTI_RATIO = 0.43
  
  // Calculate maximum monthly payment capacity (income * DTI - existing debts)
  const maxMonthlyPayment = monthlyIncome * DTI_RATIO - monthlyDebts
  
  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRate / 100 / 12
  
  // Number of payments (30-year mortgage)
  const numberOfPayments = 360
  
  // Calculate maximum loan amount using mortgage formula
  // P = M × ((1 - (1 + r)^-n) / r)
  // Where P = principal (loan amount), M = monthly payment, r = monthly rate, n = number of payments
  let maxLoanAmount: number
  
  if (monthlyInterestRate === 0) {
    // Handle edge case: 0% interest rate
    maxLoanAmount = maxMonthlyPayment * numberOfPayments
  } else {
    maxLoanAmount = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)) / monthlyInterestRate)
  }
  
  // Calculate maximum home price (loan + down payment)
  const maxHomePrice = maxLoanAmount + downPayment
  
  // Calculate estimated monthly payment (P&I only)
  let estimatedMonthlyPayment: number
  
  if (monthlyInterestRate === 0) {
    estimatedMonthlyPayment = maxLoanAmount / numberOfPayments
  } else {
    estimatedMonthlyPayment = maxLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
  }
  
  // Calculate loan-to-value ratio
  const loanToValue = maxHomePrice > 0 ? (maxLoanAmount / maxHomePrice) * 100 : 0
  
  // Calculate total debt-to-income ratio
  const totalMonthlyDebt = estimatedMonthlyPayment + monthlyDebts
  const dtiRatio = monthlyIncome > 0 ? (totalMonthlyDebt / monthlyIncome) * 100 : 0
  
  return [
    {
      label: 'Maximum Home Price',
      value: maxHomePrice,
      format: 'currency',
      highlight: true,
      description: 'The maximum home price you can afford based on your income and debts'
    },
    {
      label: 'Maximum Loan Amount',
      value: maxLoanAmount,
      format: 'currency',
      description: 'The maximum mortgage loan amount you qualify for'
    },
    {
      label: 'Down Payment',
      value: downPayment,
      format: 'currency',
      description: 'Your planned down payment amount'
    },
    {
      label: 'Estimated Monthly Payment',
      value: estimatedMonthlyPayment,
      format: 'currency',
      description: 'Estimated principal and interest payment (excludes taxes and insurance)'
    },
    {
      label: 'Loan-to-Value Ratio',
      value: loanToValue / 100,
      format: 'percentage',
      description: 'The ratio of your loan amount to the home price'
    },
    {
      label: 'Debt-to-Income Ratio',
      value: dtiRatio / 100,
      format: 'percentage',
      description: 'Your total monthly debt payments as a percentage of gross income'
    }
  ]
}

/**
 * Validate affordability calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validateAffordabilityInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: AffordabilityInputs
} {
  const result = affordabilitySchema.safeParse(inputs)
  
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
