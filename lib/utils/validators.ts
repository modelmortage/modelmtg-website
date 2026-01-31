// Validation schemas using Zod

import { z } from 'zod'

// Affordability Calculator Schema
export const affordabilitySchema = z.object({
  annualIncome: z.number().min(0, 'Income must be positive').max(10000000, 'Income exceeds maximum'),
  monthlyDebts: z.number().min(0, 'Debts cannot be negative').max(100000, 'Debts exceed maximum'),
  downPayment: z.number().min(0, 'Down payment cannot be negative').max(10000000, 'Down payment exceeds maximum'),
  interestRate: z.number().min(0, 'Interest rate must be positive').max(20, 'Interest rate must be between 0% and 20%'),
})

export type AffordabilityInputs = z.infer<typeof affordabilitySchema>

// Purchase Calculator Schema
export const purchaseSchema = z.object({
  homePrice: z.number().min(1000, 'Home price must be at least $1,000').max(100000000, 'Home price exceeds maximum'),
  downPayment: z.number().min(0, 'Down payment cannot be negative').max(100000000, 'Down payment exceeds maximum'),
  interestRate: z.number().min(0, 'Interest rate must be positive').max(20, 'Interest rate must be between 0% and 20%'),
  loanTerm: z.number().min(1, 'Loan term must be at least 1 year').max(30, 'Loan term cannot exceed 30 years'),
  propertyTaxRate: z.number().min(0, 'Property tax rate cannot be negative').max(10, 'Property tax rate exceeds maximum'),
  insurance: z.number().min(0, 'Insurance cannot be negative').max(100000, 'Insurance exceeds maximum'),
  hoa: z.number().min(0, 'HOA fees cannot be negative').max(10000, 'HOA fees exceed maximum'),
})

export type PurchaseInputs = z.infer<typeof purchaseSchema>

// Refinance Calculator Schema
export const refinanceSchema = z.object({
  currentBalance: z.number().min(1000, 'Current balance must be at least $1,000').max(100000000, 'Balance exceeds maximum'),
  currentRate: z.number().min(0, 'Current rate must be positive').max(20, 'Current rate must be between 0% and 20%'),
  newRate: z.number().min(0, 'New rate must be positive').max(20, 'New rate must be between 0% and 20%'),
  remainingTerm: z.number().min(1, 'Remaining term must be at least 1 year').max(30, 'Remaining term cannot exceed 30 years'),
  newTerm: z.number().min(1, 'New term must be at least 1 year').max(30, 'New term cannot exceed 30 years'),
  closingCosts: z.number().min(0, 'Closing costs cannot be negative').max(100000, 'Closing costs exceed maximum'),
})

export type RefinanceInputs = z.infer<typeof refinanceSchema>

// Rent vs Buy Calculator Schema
export const rentVsBuySchema = z.object({
  homePrice: z.number().min(1000, 'Home price must be at least $1,000').max(100000000, 'Home price exceeds maximum'),
  downPayment: z.number().min(0, 'Down payment cannot be negative').max(100000000, 'Down payment exceeds maximum'),
  interestRate: z.number().min(0, 'Interest rate must be positive').max(20, 'Interest rate must be between 0% and 20%'),
  rentAmount: z.number().min(0, 'Rent amount cannot be negative').max(50000, 'Rent amount exceeds maximum'),
  yearsToStay: z.number().min(1, 'Years to stay must be at least 1').max(30, 'Years to stay cannot exceed 30'),
  appreciationRate: z.number().min(-10, 'Appreciation rate too low').max(20, 'Appreciation rate too high'),
})

export type RentVsBuyInputs = z.infer<typeof rentVsBuySchema>

// VA Purchase Calculator Schema
export const vaPurchaseSchema = z.object({
  homePrice: z.number().min(1000, 'Home price must be at least $1,000').max(100000000, 'Home price exceeds maximum'),
  downPayment: z.number().min(0, 'Down payment cannot be negative').max(100000000, 'Down payment exceeds maximum'),
  interestRate: z.number().min(0, 'Interest rate must be positive').max(20, 'Interest rate must be between 0% and 20%'),
  vaFundingFee: z.number().min(0, 'VA funding fee cannot be negative').max(10, 'VA funding fee exceeds maximum'),
  propertyTaxRate: z.number().min(0, 'Property tax rate cannot be negative').max(10, 'Property tax rate exceeds maximum'),
  insurance: z.number().min(0, 'Insurance cannot be negative').max(100000, 'Insurance exceeds maximum'),
})

export type VAPurchaseInputs = z.infer<typeof vaPurchaseSchema>

// VA Refinance Calculator Schema
export const vaRefinanceSchema = z.object({
  currentBalance: z.number().min(1000, 'Current balance must be at least $1,000').max(100000000, 'Balance exceeds maximum'),
  currentRate: z.number().min(0, 'Current rate must be positive').max(20, 'Current rate must be between 0% and 20%'),
  newRate: z.number().min(0, 'New rate must be positive').max(20, 'New rate must be between 0% and 20%'),
  cashOutAmount: z.number().min(0, 'Cash out amount cannot be negative').max(10000000, 'Cash out amount exceeds maximum'),
  vaFundingFee: z.number().min(0, 'VA funding fee cannot be negative').max(10, 'VA funding fee exceeds maximum'),
})

export type VARefinanceInputs = z.infer<typeof vaRefinanceSchema>

// DSCR Investment Calculator Schema
export const dscrSchema = z.object({
  propertyPrice: z.number().min(1000, 'Property price must be at least $1,000').max(100000000, 'Property price exceeds maximum'),
  downPayment: z.number().min(0, 'Down payment cannot be negative').max(100000000, 'Down payment exceeds maximum'),
  interestRate: z.number().min(0, 'Interest rate must be positive').max(20, 'Interest rate must be between 0% and 20%'),
  monthlyRent: z.number().min(0, 'Monthly rent cannot be negative').max(100000, 'Monthly rent exceeds maximum'),
  monthlyExpenses: z.number().min(0, 'Monthly expenses cannot be negative').max(100000, 'Monthly expenses exceeds maximum'),
})

export type DSCRInputs = z.infer<typeof dscrSchema>
