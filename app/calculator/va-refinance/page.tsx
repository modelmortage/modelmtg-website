'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import CalculatorForm from '@/components/calculators/CalculatorForm'
import CalculatorResults from '@/components/calculators/CalculatorResults'
import { vaRefinanceConfig } from '@/lib/calculators/configs/vaRefinance.config'
import { validateVARefinanceInputs } from '@/lib/calculators/vaRefinance'
import type { CalculatorResult } from '@/lib/types/calculator'

export default function VARefinanceCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    currentBalance: '',
    currentRate: '',
    newRate: '',
    cashOutAmount: '0',
    vaFundingFee: '2.15'
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
      currentBalance: parseFloat(values.currentBalance) || 0,
      currentRate: parseFloat(values.currentRate) || 0,
      newRate: parseFloat(values.newRate) || 0,
      cashOutAmount: parseFloat(values.cashOutAmount) || 0,
      vaFundingFee: parseFloat(values.vaFundingFee) || 0
    }

    // Validate inputs
    const validation = validateVARefinanceInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    // Calculate results
    try {
      const calculatedResults = vaRefinanceConfig.calculate(numericInputs)
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
    <CalculatorLayout config={vaRefinanceConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <CalculatorForm
          inputs={vaRefinanceConfig.inputs}
          values={values}
          errors={errors}
          onChange={handleChange}
          onCalculate={handleCalculate}
          title="VA Refinance Details"
        />
        <CalculatorResults
          results={results}
          loading={loading}
          title="Refinance Analysis"
        />
      </div>
    </CalculatorLayout>
  )
}
