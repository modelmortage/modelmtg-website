'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaDollarSign, FaCreditCard, FaHome, FaPercent, FaCalculator, FaChartPie } from 'react-icons/fa'
import { affordabilityConfig } from '@/lib/calculators/configs/affordability.config'
import { validateAffordabilityInputs } from '@/lib/calculators/affordability'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

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

  // Prepare chart data from results
  const getChartData = (): ChartData[] => {
    if (!results) return []

    const maxHomePrice = results.find(r => r.label === 'Maximum Home Price')?.value as number || 0
    const downPayment = parseFloat(values.downPayment) || 0
    const loanAmount = maxHomePrice - downPayment

    return [
      { category: 'Down Payment', amount: downPayment },
      { category: 'Loan Amount', amount: loanAmount }
    ]
  }

  // Get key metrics for display
  const getDisplayResults = () => {
    if (!results) return []

    return results.slice(0, 4).map(result => ({
      ...result,
      icon: result.label.includes('Home Price') ? <Icon icon={FaHome} size="lg" color="#8B6F14" /> :
        result.label.includes('Payment') ? <Icon icon={FaDollarSign} size="lg" color="#8B6F14" /> :
          result.label.includes('Income') ? <Icon icon={FaCreditCard} size="lg" color="#8B6F14" /> :
            <Icon icon={FaChartPie} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={affordabilityConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        {/* Input Form */}
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Your Information</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Annual Gross Income"
              type="number"
              value={values.annualIncome}
              onChange={(value) => handleChange('annualIncome', value)}
              placeholder="80000"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.annualIncome}
              helperText="Your total annual income before taxes"
              required
              fullWidth
            />

            <Input
              label="Monthly Debts"
              type="number"
              value={values.monthlyDebts}
              onChange={(value) => handleChange('monthlyDebts', value)}
              placeholder="500"
              icon={<Icon icon={FaCreditCard} size="sm" color="#8B6F14" />}
              error={errors.monthlyDebts}
              helperText="Car payments, credit cards, student loans, etc."
              required
              fullWidth
            />

            <Input
              label="Down Payment"
              type="number"
              value={values.downPayment}
              onChange={(value) => handleChange('downPayment', value)}
              placeholder="20000"
              icon={<Icon icon={FaHome} size="sm" color="#8B6F14" />}
              error={errors.downPayment}
              helperText="Amount you plan to put down on the home"
              required
              fullWidth
            />

            <Input
              label="Interest Rate (%)"
              type="number"
              value={values.interestRate}
              onChange={(value) => handleChange('interestRate', value)}
              placeholder="7.0"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.interestRate}
              helperText="Current mortgage interest rate"
              required
              fullWidth
            />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCalculate}
              icon={<Icon icon={FaCalculator} size="md" color="#FFFFFF" />}
              iconPosition="left"
              disabled={loading}
              loading={loading}
            >
              Calculate Affordability
            </Button>
          </div>
        </Card>

        {/* Results Display */}
        {results && results.length > 0 ? (
          <ResultDisplay
            title="Your Results"
            results={getDisplayResults()}
            chartType="pie"
            chartData={getChartData()}
            chartConfig={{
              xAxisKey: 'category',
              yAxisKey: 'amount',
              showLegend: true,
              title: 'Home Price Breakdown',
              valueFormatter: (value: number) => new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)
            }}
          />
        ) : (
          <Card variant="elevated" padding="lg">
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Your Results</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Calculate to see how much home you can afford
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
