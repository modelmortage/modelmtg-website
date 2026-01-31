// VA Purchase Calculator Configuration

import { CalculatorConfig } from '@/lib/types/calculator'
import { calculateVAPurchase } from '@/lib/calculators/vaPurchase'

export const vaPurchaseConfig: CalculatorConfig = {
  id: 'va-purchase',
  title: 'VA Purchase Calculator',
  description: 'Calculate your monthly VA loan payment with no PMI required. Includes VA funding fee, property taxes, and insurance. Perfect for eligible veterans and service members.',
  icon: '🎖️',
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
      placeholder: '0',
      defaultValue: 0,
      min: 0,
      max: 100000000,
      step: 1000,
      required: true,
      helpText: 'VA loans allow 0% down payment (optional down payment reduces loan amount)'
    },
    {
      label: 'Interest Rate (%)',
      name: 'interestRate',
      type: 'percentage',
      placeholder: '6.5',
      defaultValue: 6.5,
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      helpText: 'Current VA loan interest rate'
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
      helpText: 'VA funding fee (typically 2.15% for first-time use with 0% down, can be financed)'
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
    }
  ],
  calculate: (inputs: Record<string, number>) => {
    return calculateVAPurchase({
      homePrice: inputs.homePrice,
      downPayment: inputs.downPayment,
      interestRate: inputs.interestRate,
      vaFundingFee: inputs.vaFundingFee,
      propertyTaxRate: inputs.propertyTaxRate,
      insurance: inputs.insurance
    })
  },
  metadata: {
    title: 'VA Loan Purchase Calculator | No PMI Required | Model Mortgage',
    description: 'Calculate your VA loan monthly payment with 0% down and no PMI. Free VA purchase calculator for veterans and service members. Includes funding fee and instant results.',
    keywords: [
      'VA loan calculator',
      'VA purchase calculator',
      'VA mortgage calculator',
      'veterans home loan calculator',
      'VA loan payment calculator',
      'no PMI calculator',
      'VA funding fee calculator',
      'Houston VA loan calculator',
      'Texas VA mortgage calculator'
    ]
  }
}
