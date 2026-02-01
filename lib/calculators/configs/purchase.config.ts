// Purchase Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculatePurchase } from '@/lib/calculators/purchase'

export const purchaseConfig: CalculatorConfig = {
  id: 'purchase',
  title: 'Purchase Calculator',
  description: 'Estimate your monthly mortgage payment including principal, interest, taxes, insurance, and HOA fees.',
  icon: '🏠',
  inputs: [
    {
      label: 'Home Price',
      name: 'homePrice',
      type: 'currency',
      placeholder: '350000',
      min: 1000,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'The purchase price of the home'
    },
    {
      label: 'Down Payment',
      name: 'downPayment',
      type: 'currency',
      placeholder: '70000',
      min: 0,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'Amount you plan to put down on the home'
    },
    {
      label: 'Interest Rate (%)',
      name: 'interestRate',
      type: 'percentage',
      placeholder: '7.0',
      defaultValue: 7.0,
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'Current mortgage interest rate'
    },
    {
      label: 'Loan Term (years)',
      name: 'loanTerm',
      type: 'number',
      placeholder: '30',
      defaultValue: 30,
      min: 1,
      max: 30,
      step: 1,
      required: true,
      helpText: 'Length of the mortgage in years'
    },
    {
      label: 'Property Tax Rate (%)',
      name: 'propertyTaxRate',
      type: 'percentage',
      placeholder: '1.2',
      defaultValue: 1.2,
      min: 0,
      max: 10,
      step: 0.1,
      required: true,
      helpText: 'Annual property tax as percentage of home price'
    },
    {
      label: 'Annual Insurance',
      name: 'insurance',
      type: 'currency',
      placeholder: '1200',
      defaultValue: 1200,
      min: 0,
      max: 100000,
      step: 100,
      required: true,
      helpText: 'Annual homeowners insurance premium'
    },
    {
      label: 'Monthly HOA Fees',
      name: 'hoa',
      type: 'currency',
      placeholder: '0',
      defaultValue: 0,
      min: 0,
      max: 10000,
      step: 50,
      required: true,
      helpText: 'Monthly homeowners association fees'
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculatePurchase({
      homePrice: inputs.homePrice,
      downPayment: inputs.downPayment,
      interestRate: inputs.interestRate,
      loanTerm: inputs.loanTerm,
      propertyTaxRate: inputs.propertyTaxRate,
      insurance: inputs.insurance,
      hoa: inputs.hoa
    })
  },
  metadata: {
    title: 'Mortgage Purchase Calculator | Monthly Payment Estimator | Model Mortgage',
    description: 'Calculate monthly mortgage payment including principal, interest, taxes, insurance, and HOA fees. Free calculator with instant results.',
    keywords: [
      'mortgage calculator',
      'home purchase calculator',
      'monthly payment calculator',
      'mortgage payment estimator',
      'home loan calculator',
      'PITI calculator',
      'Houston mortgage calculator',
      'Texas home purchase calculator'
    ]
  }
}
