'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaDollarSign, FaPercent, FaCalendar, FaSync, FaCalculator, FaChartLine } from 'react-icons/fa'
import { refinanceConfig } from '@/lib/calculators/configs/refinance.config'
import { validateRefinanceInputs } from '@/lib/calculators/refinance'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

export default function RefinanceCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    currentBalance: '',
    currentRate: '',
    newRate: '',
    remainingTerm: '',
    newTerm: '30',
    closingCosts: '5000'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [results, setResults] = useState<CalculatorResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
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

    const numericInputs = {
      currentBalance: parseFloat(values.currentBalance) || 0,
      currentRate: parseFloat(values.currentRate) || 0,
      newRate: parseFloat(values.newRate) || 0,
      remainingTerm: parseFloat(values.remainingTerm) || 0,
      newTerm: parseFloat(values.newTerm) || 0,
      closingCosts: parseFloat(values.closingCosts) || 0
    }

    const validation = validateRefinanceInputs(numericInputs)

    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    try {
      const calculatedResults = refinanceConfig.calculate(numericInputs)
      setResults(calculatedResults)
      setErrors({})
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors({ general: 'An error occurred during calculation. Please check your inputs.' })
    } finally {
      setLoading(false)
    }
  }

  const getChartData = (): ChartData[] => {
    if (!results) return []

    const currentPayment = results.find(r => r.label === 'Current Monthly Payment')?.value as number || 0
    const newPayment = results.find(r => r.label === 'New Monthly Payment')?.value as number || 0

    return [
      { category: 'Current Payment', amount: currentPayment },
      { category: 'New Payment', amount: newPayment }
    ]
  }

  const getDisplayResults = () => {
    if (!results) return []

    return results.slice(0, 4).map(result => ({
      ...result,
      icon: result.label.includes('Savings') ? <Icon icon={FaChartLine} size="lg" color="#0D9668" /> :
        result.label.includes('New') ? <Icon icon={FaSync} size="lg" color="#8B6F14" /> :
          <Icon icon={FaDollarSign} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={refinanceConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Current & New Loan Details</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Current Loan Balance"
              type="number"
              value={values.currentBalance}
              onChange={(value) => handleChange('currentBalance', value)}
              placeholder="250000"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.currentBalance}
              helperText="Your current mortgage balance"
              required
              fullWidth
            />

            <Input
              label="Current Interest Rate (%)"
              type="number"
              value={values.currentRate}
              onChange={(value) => handleChange('currentRate', value)}
              placeholder="7.5"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.currentRate}
              helperText="Your current mortgage rate"
              required
              fullWidth
            />

            <Input
              label="New Interest Rate (%)"
              type="number"
              value={values.newRate}
              onChange={(value) => handleChange('newRate', value)}
              placeholder="6.5"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.newRate}
              helperText="The new refinance rate"
              required
              fullWidth
            />

            <Input
              label="Remaining Term (years)"
              type="number"
              value={values.remainingTerm}
              onChange={(value) => handleChange('remainingTerm', value)}
              placeholder="25"
              icon={<Icon icon={FaCalendar} size="sm" color="#8B6F14" />}
              error={errors.remainingTerm}
              helperText="Years left on current mortgage"
              required
              fullWidth
            />

            <Input
              label="New Loan Term (years)"
              type="number"
              value={values.newTerm}
              onChange={(value) => handleChange('newTerm', value)}
              placeholder="30"
              icon={<Icon icon={FaCalendar} size="sm" color="#8B6F14" />}
              error={errors.newTerm}
              helperText="Length of new mortgage"
              required
              fullWidth
            />

            <Input
              label="Closing Costs"
              type="number"
              value={values.closingCosts}
              onChange={(value) => handleChange('closingCosts', value)}
              placeholder="5000"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.closingCosts}
              helperText="Estimated refinance closing costs"
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
              Calculate Refinance
            </Button>
          </div>
        </Card>

        {results && results.length > 0 ? (
          <ResultDisplay
            title="Refinance Analysis"
            results={getDisplayResults()}
            chartType="bar"
            chartData={getChartData()}
            chartConfig={{
              xAxisKey: 'category',
              yAxisKey: 'amount',
              showLegend: false,
              title: 'Payment Comparison',
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
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Refinance Analysis</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Calculate to see if refinancing makes sense
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
