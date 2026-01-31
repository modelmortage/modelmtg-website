'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import CalculatorForm from '@/components/calculators/CalculatorForm'
import CalculatorResults from '@/components/calculators/CalculatorResults'
import { affordabilityConfig } from '@/lib/calculators/configs/affordability.config'
import { validateAffordabilityInputs } from '@/lib/calculators/affordability'
import type { CalculatorResult } from '@/lib/types/calculator'

export default function AffordabilityCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    annualIncome: '',
    monthlyDebts: '',
    downPayment: '',
    interestRate: '7.0'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [results, setResults] = useState<CalculatorResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCalculate = () => {
    setLoading(true)
    
    // Convert string values to numbers
    const numericInputs = {
      annualIncome: parseFloat(values.annualIncome) || 0,
      monthlyDebts: parseFloat(values.monthlyDebts) || 0,
      downPayment: parseFloat(values.downPayment) || 0,
      interestRate: parseFloat(values.interestRate) || 0
    }

    // Validate inputs
    const validation = validateAffordabilityInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    // Calculate results
    try {
      const calculatedResults = affordabilityConfig.calculate(numericInputs)
      setResults(calculatedResults)
      setErrors({})
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors({ general: 'An error occurred during calculation. Please check your inputs.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CalculatorLayout config={affordabilityConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <CalculatorForm
          inputs={affordabilityConfig.inputs}
          values={values}
          errors={errors}
          onChange={handleChange}
          onCalculate={handleCalculate}
        />
        <CalculatorResults
          results={results}
          loading={loading}
        />
      </div>
    </CalculatorLayout>
  )
}
