// Refinance Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculateRefinance } from '@/lib/calculators/refinance'

export const refinanceConfig: CalculatorConfig = {
  id: 'refinance',
  title: 'Refinance Calculator',
  description: 'Calculate your potential savings from refinancing your mortgage. Compare your current loan to a new loan and see your break-even point.',
  icon: '🔄',
  inputs: [
    {
      label: 'Current Loan Balance',
      name: 'currentBalance',
      type: 'currency',
      placeholder: '250000',
      min: 1000,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'Your current outstanding mortgage balance'
    },
    {
      label: 'Current Interest Rate (%)',
      name: 'currentRate',
      type: 'percentage',
      placeholder: '7.5',
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'Your current mortgage interest rate'
    },
    {
      label: 'New Interest Rate (%)',
      name: 'newRate',
      type: 'percentage',
      placeholder: '6.5',
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'The new interest rate you qualify for'
    },
    {
      label: 'Remaining Term (years)',
      name: 'remainingTerm',
      type: 'number',
      placeholder: '25',
      min: 1,
      max: 30,
      step: 1,
      required: true,
      helpText: 'Years remaining on your current mortgage'
    },
    {
      label: 'New Loan Term (years)',
      name: 'newTerm',
      type: 'number',
      placeholder: '30',
      defaultValue: 30,
      min: 1,
      max: 30,
      step: 1,
      required: true,
      helpText: 'Length of the new mortgage in years'
    },
    {
      label: 'Closing Costs',
      name: 'closingCosts',
      type: 'currency',
      placeholder: '5000',
      defaultValue: 5000,
      min: 0,
      max: 100000,
      step: 500,
      required: true,
      helpText: 'Upfront costs to refinance (rolled into new loan)'
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculateRefinance({
      currentBalance: inputs.currentBalance,
      currentRate: inputs.currentRate,
      newRate: inputs.newRate,
      remainingTerm: inputs.remainingTerm,
      newTerm: inputs.newTerm,
      closingCosts: inputs.closingCosts
    })
  },
  metadata: {
    title: 'Mortgage Refinance Calculator | Calculate Refinance Savings | Model Mortgage',
    description: 'Calculate potential savings from refinancing. Compare monthly payments, break-even point, and lifetime savings. Free calculator with instant results.',
    keywords: [
      'refinance calculator',
      'mortgage refinance',
      'refinance savings calculator',
      'break-even calculator',
      'should I refinance',
      'refinance comparison',
      'Houston refinance calculator',
      'Texas mortgage refinance'
    ]
  }
}
