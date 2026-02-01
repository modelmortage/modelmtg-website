// DSCR Investment Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculateDSCR } from '@/lib/calculators/dscr'

export const dscrConfig: CalculatorConfig = {
  id: 'dscr',
  title: 'DSCR Investment Calculator',
  description: 'Calculate Debt Service Coverage Ratio (DSCR) for investment property loans. Determine if your rental income covers mortgage payments and analyze cash flow and ROI.',
  icon: '🏢',
  inputs: [
    {
      label: 'Property Price',
      name: 'propertyPrice',
      type: 'currency',
      placeholder: '300000',
      min: 1000,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'The purchase price of the investment property'
    },
    {
      label: 'Down Payment',
      name: 'downPayment',
      type: 'currency',
      placeholder: '60000',
      min: 0,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'Amount you plan to put down (typically 20-25% for investment properties)'
    },
    {
      label: 'Interest Rate (%)',
      name: 'interestRate',
      type: 'percentage',
      placeholder: '7.5',
      defaultValue: 7.5,
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'Current interest rate for investment property loans'
    },
    {
      label: 'Monthly Rent',
      name: 'monthlyRent',
      type: 'currency',
      placeholder: '2500',
      min: 0,
      max: 100000,
      step: 50,
      required: true,
      helpText: 'Expected monthly rental income from the property'
    },
    {
      label: 'Monthly Expenses',
      name: 'monthlyExpenses',
      type: 'currency',
      placeholder: '800',
      min: 0,
      max: 100000,
      step: 50,
      required: true,
      helpText: 'Property taxes, insurance, maintenance, HOA, property management, etc.'
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculateDSCR({
      propertyPrice: inputs.propertyPrice,
      downPayment: inputs.downPayment,
      interestRate: inputs.interestRate,
      monthlyRent: inputs.monthlyRent,
      monthlyExpenses: inputs.monthlyExpenses
    })
  },
  metadata: {
    title: 'DSCR Calculator | Investment Property Loan Calculator | Model Mortgage',
    description: 'Calculate DSCR for investment property loans. Analyze rental income, cash flow, and ROI. Get instant qualification status with our free calculator.',
    keywords: [
      'DSCR calculator',
      'debt service coverage ratio',
      'investment property calculator',
      'rental property calculator',
      'DSCR loan calculator',
      'investment property loan',
      'rental income calculator',
      'cash flow calculator',
      'Houston investment property',
      'Texas rental property calculator'
    ]
  }
}
