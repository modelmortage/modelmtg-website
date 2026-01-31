// Calculator type definitions

export interface CalculatorInput {
  label: string
  name: string
  type: 'number' | 'currency' | 'percentage'
  placeholder: string
  defaultValue?: string | number
  min?: number
  max?: number
  step?: number
  required: boolean
  helpText?: string
}

export interface CalculatorResult {
  label: string
  value: number
  format: 'currency' | 'percentage' | 'number'
  highlight?: boolean
  description?: string
}

export interface CalculatorConfig {
  id: string
  title: string
  description: string
  icon: string
  inputs: CalculatorInput[]
  calculate: (inputs: Record<string, number>) => CalculatorResult[]
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
}
