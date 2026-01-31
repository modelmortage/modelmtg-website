// DSCR Investment Calculator Logic

import { dscrSchema, type DSCRInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate DSCR (Debt Service Coverage Ratio) for investment property loans
 * DSCR is the ratio of net operating income to debt service (mortgage payment)
 * Lenders typically require DSCR of 1.0 or higher (1.25 is common for investment properties)
 * 
 * Formula: DSCR = Net Operating Income / Total Debt Service
 * Where: NOI = Monthly Rent - Monthly Expenses, Debt Service = Monthly P&I Payment
 * 
 * Mortgage Formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
 * Where: M = monthly payment, P = principal (loan amount), r = monthly interest rate, n = number of payments
 * 
 * @param inputs - Validated DSCR calculator inputs
 * @returns Array of calculation results
 */
export function calculateDSCR(inputs: DSCRInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = dscrSchema.parse(inputs)
  
  const { propertyPrice, downPayment, interestRate, monthlyRent, monthlyExpenses } = validated
  
  // Calculate loan amount (property price - down payment)
  const loanAmount = propertyPrice - downPayment
  
  // Ensure loan amount is not negative
  if (loanAmount < 0) {
    throw new Error('Down payment cannot exceed property price')
  }
  
  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRate / 100 / 12
  
  // Number of payments (30-year mortgage is standard for investment properties)
  const loanTerm = 30
  const numberOfPayments = loanTerm * 12
  
  // Calculate monthly principal & interest payment (debt service)
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
  
  // Calculate Net Operating Income (NOI)
  const netOperatingIncome = monthlyRent - monthlyExpenses
  
  // Calculate DSCR ratio
  // DSCR = NOI / Debt Service
  let dscrRatio: number
  
  if (monthlyPI === 0) {
    // No debt service (paid in cash), DSCR is effectively infinite
    // We'll represent this as a very high number for display purposes
    dscrRatio = netOperatingIncome > 0 ? 999 : 0
  } else {
    dscrRatio = netOperatingIncome / monthlyPI
  }
  
  // Calculate monthly cash flow (NOI - debt service)
  const monthlyCashFlow = netOperatingIncome - monthlyPI
  
  // Calculate annual cash flow
  const annualCashFlow = monthlyCashFlow * 12
  
  // Calculate total cash invested (down payment + typical closing costs)
  // Closing costs for investment properties are typically 2-5% (using 3%)
  const closingCosts = propertyPrice * 0.03
  const totalCashInvested = downPayment + closingCosts
  
  // Calculate annual ROI (Cash-on-Cash Return)
  // ROI = Annual Cash Flow / Total Cash Invested
  let annualROI: number
  
  if (totalCashInvested === 0) {
    annualROI = 0
  } else {
    annualROI = (annualCashFlow / totalCashInvested) * 100
  }
  
  // Determine loan qualification status
  // Most lenders require DSCR of at least 1.0, with 1.25 being common
  let qualificationStatus: string
  let qualificationDescription: string
  
  if (loanAmount === 0) {
    qualificationStatus = 'Cash Purchase'
    qualificationDescription = 'No loan required - purchasing with cash'
  } else if (dscrRatio >= 1.25) {
    qualificationStatus = 'Excellent'
    qualificationDescription = 'Strong DSCR - likely to qualify with favorable terms'
  } else if (dscrRatio >= 1.0) {
    qualificationStatus = 'Good'
    qualificationDescription = 'Meets minimum DSCR requirements - should qualify'
  } else if (dscrRatio >= 0.75) {
    qualificationStatus = 'Marginal'
    qualificationDescription = 'Below minimum DSCR - may need larger down payment or higher rent'
  } else {
    qualificationStatus = 'Poor'
    qualificationDescription = 'DSCR too low - property does not generate sufficient income'
  }
  
  // Calculate down payment percentage
  const downPaymentPercent = propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0
  
  // Calculate loan-to-value ratio
  const loanToValue = propertyPrice > 0 ? (loanAmount / propertyPrice) * 100 : 0
  
  // Calculate total interest paid over life of loan
  const totalPayments = monthlyPI * numberOfPayments
  const totalInterest = totalPayments - loanAmount
  
  // Calculate cap rate (annual NOI / property price)
  const capRate = propertyPrice > 0 ? ((netOperatingIncome * 12) / propertyPrice) * 100 : 0
  
  return [
    {
      label: 'DSCR Ratio',
      value: dscrRatio >= 999 ? 999 : dscrRatio,
      format: 'number',
      highlight: true,
      description: dscrRatio >= 999 ? 'No debt service (cash purchase)' : `Debt Service Coverage Ratio (${dscrRatio.toFixed(2)})`
    },
    {
      label: 'Qualification Status',
      value: 0,
      format: 'number',
      highlight: true,
      description: `${qualificationStatus}: ${qualificationDescription}`
    },
    {
      label: 'Monthly Cash Flow',
      value: monthlyCashFlow,
      format: 'currency',
      highlight: true,
      description: monthlyCashFlow >= 0 ? 'Positive monthly cash flow' : 'Negative monthly cash flow (cash drain)'
    },
    {
      label: 'Annual Cash Flow',
      value: annualCashFlow,
      format: 'currency',
      description: `Total cash flow over 12 months`
    },
    {
      label: 'Annual ROI (Cash-on-Cash)',
      value: annualROI / 100,
      format: 'percentage',
      highlight: true,
      description: 'Return on investment based on cash invested'
    },
    {
      label: 'Monthly Rent Income',
      value: monthlyRent,
      format: 'currency',
      description: 'Gross monthly rental income'
    },
    {
      label: 'Monthly Expenses',
      value: monthlyExpenses,
      format: 'currency',
      description: 'Operating expenses (taxes, insurance, maintenance, etc.)'
    },
    {
      label: 'Net Operating Income',
      value: netOperatingIncome,
      format: 'currency',
      description: 'Monthly rent minus monthly expenses'
    },
    {
      label: 'Monthly Debt Service (P&I)',
      value: monthlyPI,
      format: 'currency',
      description: 'Monthly principal and interest payment'
    },
    {
      label: 'Loan Amount',
      value: loanAmount,
      format: 'currency',
      description: `Mortgage loan amount (${loanToValue.toFixed(1)}% LTV)`
    },
    {
      label: 'Down Payment',
      value: downPayment,
      format: 'currency',
      description: `Your down payment (${downPaymentPercent.toFixed(1)}% of property price)`
    },
    {
      label: 'Total Cash Invested',
      value: totalCashInvested,
      format: 'currency',
      description: 'Down payment plus estimated closing costs (3%)'
    },
    {
      label: 'Cap Rate',
      value: capRate / 100,
      format: 'percentage',
      description: 'Capitalization rate (annual NOI / property price)'
    },
    {
      label: 'Total Interest Paid',
      value: totalInterest,
      format: 'currency',
      description: `Total interest paid over ${loanTerm} years`
    }
  ]
}

/**
 * Validate DSCR calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validateDSCRInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: DSCRInputs
} {
  const result = dscrSchema.safeParse(inputs)
  
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
