// Rent vs Buy Calculator Logic

import { rentVsBuySchema, type RentVsBuyInputs } from '@/lib/utils/validators'
import type { CalculatorResult } from '@/lib/types/calculator'

/**
 * Calculate and compare total costs of renting vs buying over a specified time period
 * Includes mortgage payments, property taxes, insurance, maintenance, appreciation, and rent inflation
 * 
 * Formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
 * Where: M = monthly payment, P = principal (loan amount), r = monthly interest rate, n = number of payments
 * 
 * @param inputs - Validated rent vs buy calculator inputs
 * @returns Array of calculation results
 */
export function calculateRentVsBuy(inputs: RentVsBuyInputs): CalculatorResult[] {
  // Validate inputs using Zod schema
  const validated = rentVsBuySchema.parse(inputs)
  
  const { homePrice, downPayment, interestRate, rentAmount, yearsToStay, appreciationRate } = validated
  
  // Calculate loan amount (home price - down payment)
  const loanAmount = homePrice - downPayment
  
  // Ensure loan amount is not negative
  if (loanAmount < 0) {
    throw new Error('Down payment cannot exceed home price')
  }
  
  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRate / 100 / 12
  
  // Number of payments (30-year mortgage)
  const numberOfPayments = 360
  
  // Calculate monthly principal & interest payment
  let monthlyPI: number
  
  if (loanAmount === 0) {
    // No loan needed (100% down payment)
    monthlyPI = 0
  } else if (monthlyInterestRate < 0.000001) {
    // Handle edge case: 0% or near-zero interest rate (< 0.0001% monthly)
    monthlyPI = loanAmount / numberOfPayments
  } else {
    // Standard mortgage formula: M = P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    monthlyPI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
  }
  
  // Estimate additional monthly costs for homeownership
  // Property taxes: typically 1.2% of home value annually
  const monthlyPropertyTax = (homePrice * 0.012) / 12
  
  // Homeowners insurance: typically 0.5% of home value annually
  const monthlyInsurance = (homePrice * 0.005) / 12
  
  // Maintenance and repairs: typically 1% of home value annually
  const monthlyMaintenance = (homePrice * 0.01) / 12
  
  // Closing costs: typically 2-5% of home price (using 3%)
  const closingCosts = homePrice * 0.03
  
  // Total monthly cost of owning
  const totalMonthlyOwning = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance
  
  // Calculate total costs over the years to stay
  const monthsToStay = yearsToStay * 12
  
  // Calculate total buying costs
  let totalBuyingCost = downPayment + closingCosts
  
  // Add up all monthly payments over the period
  for (let month = 1; month <= monthsToStay; month++) {
    totalBuyingCost += totalMonthlyOwning
  }
  
  // Calculate home appreciation
  const annualAppreciationRate = appreciationRate / 100
  const futureHomeValue = homePrice * Math.pow(1 + annualAppreciationRate, yearsToStay)
  const totalAppreciation = futureHomeValue - homePrice
  
  // Calculate remaining loan balance after years to stay
  let remainingBalance: number
  
  if (loanAmount === 0) {
    remainingBalance = 0
  } else if (monthlyInterestRate < 0.000001) {
    remainingBalance = Math.max(0, loanAmount - (monthlyPI * monthsToStay))
  } else {
    // Calculate remaining balance using amortization formula
    const paymentsRemaining = numberOfPayments - monthsToStay
    if (paymentsRemaining <= 0) {
      remainingBalance = 0
    } else {
      remainingBalance = monthlyPI * ((1 - Math.pow(1 + monthlyInterestRate, -paymentsRemaining)) / monthlyInterestRate)
    }
  }
  
  // Calculate equity built (down payment + principal paid)
  const principalPaid = loanAmount - remainingBalance
  const equityBuilt = downPayment + principalPaid + totalAppreciation
  
  // Net cost of buying (total costs - equity built)
  const netBuyingCost = totalBuyingCost - equityBuilt
  
  // Calculate total renting costs with 3% annual rent inflation
  const annualRentInflation = 0.03
  let totalRentingCost = 0
  let currentRent = rentAmount
  
  for (let year = 1; year <= yearsToStay; year++) {
    // Add 12 months of rent at current rate
    totalRentingCost += currentRent * 12
    // Increase rent for next year
    currentRent = currentRent * (1 + annualRentInflation)
  }
  
  // Calculate the difference
  const netDifference = totalRentingCost - netBuyingCost
  
  // Determine recommendation
  let recommendation: string
  if (netDifference > 0) {
    recommendation = 'Buying is more cost-effective'
  } else if (netDifference < 0) {
    recommendation = 'Renting is more cost-effective'
  } else {
    recommendation = 'Costs are equal'
  }
  
  // Calculate break-even point (years until buying becomes cheaper)
  let breakEvenYears = 0
  if (netDifference < 0) {
    // Renting is cheaper, find break-even point
    for (let years = yearsToStay + 1; years <= 30; years++) {
      const months = years * 12
      
      // Recalculate buying cost for this period
      let buyingCost = downPayment + closingCosts + (totalMonthlyOwning * months)
      
      // Recalculate appreciation
      const futureValue = homePrice * Math.pow(1 + annualAppreciationRate, years)
      const appreciation = futureValue - homePrice
      
      // Recalculate remaining balance
      let balance: number
      if (loanAmount === 0) {
        balance = 0
      } else if (monthlyInterestRate === 0) {
        balance = Math.max(0, loanAmount - (monthlyPI * months))
      } else {
        const paymentsLeft = numberOfPayments - months
        if (paymentsLeft <= 0) {
          balance = 0
        } else {
          balance = monthlyPI * ((1 - Math.pow(1 + monthlyInterestRate, -paymentsLeft)) / monthlyInterestRate)
        }
      }
      
      const equity = downPayment + (loanAmount - balance) + appreciation
      const netBuying = buyingCost - equity
      
      // Recalculate renting cost
      let rentingCost = 0
      let rent = rentAmount
      for (let y = 1; y <= years; y++) {
        rentingCost += rent * 12
        rent = rent * (1 + annualRentInflation)
      }
      
      if (rentingCost >= netBuying) {
        breakEvenYears = years
        break
      }
    }
  }
  
  return [
    {
      label: 'Total Cost of Buying',
      value: netBuyingCost,
      format: 'currency',
      highlight: true,
      description: `Net cost of buying over ${yearsToStay} years (after equity and appreciation)`
    },
    {
      label: 'Total Cost of Renting',
      value: totalRentingCost,
      format: 'currency',
      highlight: true,
      description: `Total rent paid over ${yearsToStay} years (with 3% annual inflation)`
    },
    {
      label: 'Net Difference',
      value: Math.abs(netDifference),
      format: 'currency',
      highlight: true,
      description: netDifference > 0 ? 'Buying saves you this amount' : 'Renting saves you this amount'
    },
    {
      label: 'Recommendation',
      value: 0,
      format: 'number',
      description: recommendation
    },
    {
      label: 'Monthly Mortgage Payment',
      value: monthlyPI,
      format: 'currency',
      description: 'Principal and interest payment'
    },
    {
      label: 'Total Monthly Homeownership Cost',
      value: totalMonthlyOwning,
      format: 'currency',
      description: 'Includes P&I, taxes, insurance, and maintenance'
    },
    {
      label: 'Current Monthly Rent',
      value: rentAmount,
      format: 'currency',
      description: 'Your current monthly rent payment'
    },
    {
      label: 'Equity Built',
      value: equityBuilt,
      format: 'currency',
      description: 'Down payment + principal paid + home appreciation'
    },
    {
      label: 'Home Value After Period',
      value: futureHomeValue,
      format: 'currency',
      description: `Estimated home value after ${yearsToStay} years`
    },
    {
      label: 'Total Appreciation',
      value: totalAppreciation,
      format: 'currency',
      description: `Home value increase over ${yearsToStay} years`
    },
    {
      label: 'Closing Costs',
      value: closingCosts,
      format: 'currency',
      description: 'Estimated closing costs (3% of home price)'
    },
    {
      label: 'Break-Even Point',
      value: breakEvenYears,
      format: 'number',
      description: breakEvenYears > 0 ? `Years until buying becomes more cost-effective` : 'Buying is already more cost-effective'
    }
  ]
}

/**
 * Validate rent vs buy calculator inputs
 * @param inputs - Raw input values
 * @returns Validation result with success status and errors if any
 */
export function validateRentVsBuyInputs(inputs: Record<string, any>): {
  success: boolean
  errors?: Record<string, string>
  data?: RentVsBuyInputs
} {
  const result = rentVsBuySchema.safeParse(inputs)
  
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
