'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import CalculatorForm from '@/components/calculators/CalculatorForm'
import CalculatorResults from '@/components/calculators/CalculatorResults'
import { vaPurchaseConfig } from '@/lib/calculators/configs/vaPurchase.config'
import { validateVAPurchaseInputs } from '@/lib/calculators/vaPurchase'
import type { CalculatorResult } from '@/lib/types/calculator'

export default function VAPurchaseCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    homePrice: '',
    downPayment: '0',
    interestRate: '6.5',
    vaFundingFee: '2.15',
    propertyTaxRate: '1.2',
    insurance: '1200'
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
      vaFundingFee: parseFloat(values.vaFundingFee) || 0,
      propertyTaxRate: parseFloat(values.propertyTaxRate) || 0,
      insurance: parseFloat(values.insurance) || 0
    }

    // Validate inputs
    const validation = validateVAPurchaseInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    // Calculate results
    try {
      const calculatedResults = vaPurchaseConfig.calculate(numericInputs)
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
    <CalculatorLayout config={vaPurchaseConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <CalculatorForm
          inputs={vaPurchaseConfig.inputs}
          values={values}
          errors={errors}
          onChange={handleChange}
          onCalculate={handleCalculate}
          title="VA Loan Details"
        />
        <CalculatorResults
          results={results}
          loading={loading}
          title="VA Loan Payment"
        />
      </div>
    </CalculatorLayout>
  )
}
