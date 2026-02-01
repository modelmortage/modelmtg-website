// Rent vs Buy Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculateRentVsBuy } from '@/lib/calculators/rentVsBuy'

export const rentVsBuyConfig: CalculatorConfig = {
  id: 'rent-vs-buy',
  title: 'Rent vs Buy Calculator',
  description: 'Compare the total costs of renting versus buying a home over time. See which option makes more financial sense for your situation.',
  icon: 'home',
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
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'Mortgage interest rate'
    },
    {
      label: 'Monthly Rent',
      name: 'rentAmount',
      type: 'currency',
      placeholder: '2000',
      min: 0,
      max: 100000,
      step: 50,
      required: true,
      helpText: 'Your current monthly rent payment'
    },
    {
      label: 'Years to Stay',
      name: 'yearsToStay',
      type: 'number',
      placeholder: '7',
      min: 1,
      max: 30,
      step: 1,
      required: true,
      helpText: 'How long you plan to stay in the home'
    },
    {
      label: 'Home Appreciation Rate (%)',
      name: 'appreciationRate',
      type: 'percentage',
      placeholder: '3.0',
      min: -10,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'Expected annual home value appreciation'
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculateRentVsBuy({
      homePrice: inputs.homePrice,
      downPayment: inputs.downPayment,
      interestRate: inputs.interestRate,
      rentAmount: inputs.rentAmount,
      yearsToStay: inputs.yearsToStay,
      appreciationRate: inputs.appreciationRate
    })
  },
  metadata: {
    title: 'Rent vs Buy Calculator | Should I Rent or Buy a Home? | Model Mortgage',
    description: 'Compare costs of renting versus buying. Calculate total costs, equity building, and break-even point. Free calculator with instant results.',
    keywords: [
      'rent vs buy calculator',
      'should I rent or buy',
      'rent or buy comparison',
      'home buying calculator',
      'rent vs own calculator',
      'cost of renting vs buying',
      'Houston rent vs buy',
      'Texas home buying calculator'
    ]
  }
}
