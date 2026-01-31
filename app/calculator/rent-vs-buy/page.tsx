'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import CalculatorForm from '@/components/calculators/CalculatorForm'
import CalculatorResults from '@/components/calculators/CalculatorResults'
import { rentVsBuyConfig } from '@/lib/calculators/configs/rentVsBuy.config'
import { validateRentVsBuyInputs } from '@/lib/calculators/rentVsBuy'
import type { CalculatorResult } from '@/lib/types/calculator'

export default function RentVsBuyCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    homePrice: '',
    downPayment: '',
    interestRate: '7.0',
    rentAmount: '',
    yearsToStay: '7',
    appreciationRate: '3.0'
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
      homePrice: parseFloat(values.homePrice) || 0,
      downPayment: parseFloat(values.downPayment) || 0,
      interestRate: parseFloat(values.interestRate) || 0,
      rentAmount: parseFloat(values.rentAmount) || 0,
      yearsToStay: parseFloat(values.yearsToStay) || 0,
      appreciationRate: parseFloat(values.appreciationRate) || 0
    }

    // Validate inputs
    const validation = validateRentVsBuyInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    // Calculate results
    try {
      const calculatedResults = rentVsBuyConfig.calculate(numericInputs)
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
    <CalculatorLayout config={rentVsBuyConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <CalculatorForm
          inputs={rentVsBuyConfig.inputs}
          values={values}
          errors={errors}
          onChange={handleChange}
          onCalculate={handleCalculate}
          title="Comparison Details"
        />
        <CalculatorResults
          results={results}
          loading={loading}
          title="Cost Comparison"
        />
      </div>
    </CalculatorLayout>
  )
}
