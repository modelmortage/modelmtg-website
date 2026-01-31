// VA Refinance Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculateVARefinance } from '@/lib/calculators/vaRefinance'

export const vaRefinanceConfig: CalculatorConfig = {
  id: 'va-refinance',
  title: 'VA Refinance Calculator',
  description: 'Calculate your VA refinance savings with IRRRL or cash-out refinance options. Compare your current loan to a new VA loan with lower rates. Includes VA funding fee and cash-out analysis.',
  icon: '🏠',
  inputs: [
    {
      label: 'Current Loan Balance',
      name: 'currentBalance',
      type: 'currency',
      placeholder: '300000',
      min: 1000,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'Your current mortgage balance'
    },
    {
      label: 'Current Interest Rate (%)',
      name: 'currentRate',
      type: 'percentage',
      placeholder: '7.0',
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
      placeholder: '6.0',
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'The new VA loan interest rate'
    },
    {
      label: 'Cash Out Amount',
      name: 'cashOutAmount',
      type: 'currency',
      placeholder: '0',
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'Amount of cash you want to take out (0 for rate-and-term refinance)'
    },
    {
      label: 'VA Funding Fee (%)',
      name: 'vaFundingFee',
      type: 'percentage',
      placeholder: '2.15',
      defaultValue: 2.15,
      min: 0,
      max: 10,
      step: 0.05,
      required: true,
      helpText: 'VA funding fee (typically 2.15% for IRRRL, 2.3% for cash-out, can be financed)'
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculateVARefinance({
      currentBalance: inputs.currentBalance,
      currentRate: inputs.currentRate,
      newRate: inputs.newRate,
      cashOutAmount: inputs.cashOutAmount,
      vaFundingFee: inputs.vaFundingFee
    })
  },
  metadata: {
    title: 'VA Refinance Calculator | IRRRL & Cash-Out | Model Mortgage',
    description: 'Calculate your VA refinance savings with our free calculator. Compare IRRRL and cash-out refinance options. See monthly savings, cash out amounts, and funding fees instantly.',
    keywords: [
      'VA refinance calculator',
      'VA IRRRL calculator',
      'VA cash out refinance calculator',
      'VA streamline refinance calculator',
      'VA loan refinance calculator',
      'veterans refinance calculator',
      'VA funding fee calculator',
      'Houston VA refinance calculator',
      'Texas VA refinance calculator'
    ]
  }
}
