// Affordability Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculateAffordability } from '@/lib/calculators/affordability'

export const affordabilityConfig: CalculatorConfig = {
  id: 'affordability',
  title: 'How Much Can I Afford?',
  description: 'Calculate your maximum home purchase price based on your income, debts, and down payment.',
  icon: 'dollar',
  inputs: [
    {
      label: 'Annual Gross Income',
      name: 'annualIncome',
      type: 'currency',
      placeholder: '80000',
      min: 0,
      max: 10000000,
      step: 1000,
      required: true,
      helpText: 'Your total annual income before taxes'
    },
    {
      label: 'Monthly Debts',
      name: 'monthlyDebts',
      type: 'currency',
      placeholder: '500',
      min: 0,
      max: 100000,
      step: 50,
      required: true,
      helpText: 'Car payments, credit cards, student loans, etc.'
    },
    {
      label: 'Down Payment',
      name: 'downPayment',
      type: 'currency',
      placeholder: '20000',
      min: 0,
      max: 10000000,
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
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculateAffordability({
      annualIncome: inputs.annualIncome,
      monthlyDebts: inputs.monthlyDebts,
      downPayment: inputs.downPayment,
      interestRate: inputs.interestRate
    })
  },
  metadata: {
    title: 'Home Affordability Calculator | How Much House Can I Afford? | Model Mortgage',
    description: 'Calculate how much house you can afford based on income, debts, and down payment. Free affordability calculator with instant results.',
    keywords: [
      'home affordability calculator',
      'how much house can I afford',
      'mortgage affordability',
      'home buying calculator',
      'DTI calculator',
      'debt to income ratio',
      'Houston mortgage calculator',
      'Texas home affordability'
    ]
  }
}
