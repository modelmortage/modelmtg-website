'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaBuilding, FaDollarSign, FaPercent, FaKey, FaFileInvoiceDollar, FaCalculator, FaChartPie } from 'react-icons/fa'
import { dscrConfig } from '@/lib/calculators/configs/dscr.config'
import { validateDSCRInputs } from '@/lib/calculators/dscr'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

export default function DSCRCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    propertyPrice: '',
    downPayment: '',
    interestRate: '7.5',
    monthlyRent: '',
    monthlyExpenses: ''
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
      propertyPrice: parseFloat(values.propertyPrice) || 0,
      downPayment: parseFloat(values.downPayment) || 0,
      interestRate: parseFloat(values.interestRate) || 0,
      monthlyRent: parseFloat(values.monthlyRent) || 0,
      monthlyExpenses: parseFloat(values.monthlyExpenses) || 0
    }

    const validation = validateDSCRInputs(numericInputs)

    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    try {
      const calculatedResults = dscrConfig.calculate(numericInputs)
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

    const monthlyRent = parseFloat(values.monthlyRent) || 0
    const monthlyExpenses = parseFloat(values.monthlyExpenses) || 0
    const monthlyPayment = results.find(r => r.label === 'Monthly Payment')?.value as number || 0

    return [
      { category: 'Rental Income', amount: monthlyRent },
      { category: 'Expenses', amount: monthlyExpenses },
      { category: 'Mortgage Payment', amount: monthlyPayment }
    ].filter(item => item.amount > 0)
  }

  const getDisplayResults = () => {
    if (!results) return []

    return results.slice(0, 4).map(result => ({
      ...result,
      icon: result.label.includes('DSCR') ? <Icon icon={FaChartPie} size="lg" color="#8B6F14" /> :
        result.label.includes('Income') ? <Icon icon={FaKey} size="lg" color="#0D9668" /> :
          result.label.includes('Payment') ? <Icon icon={FaDollarSign} size="lg" color="#8B6F14" /> :
            <Icon icon={FaBuilding} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={dscrConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Investment Property Details</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Property Price"
              type="number"
              value={values.propertyPrice}
              onChange={(value) => handleChange('propertyPrice', value)}
              placeholder="400000"
              icon={<Icon icon={FaBuilding} size="sm" color="#8B6F14" />}
              error={errors.propertyPrice}
              helperText="The purchase price of the investment property"
              required
              fullWidth
            />

            <Input
              label="Down Payment"
              type="number"
              value={values.downPayment}
              onChange={(value) => handleChange('downPayment', value)}
              placeholder="100000"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.downPayment}
              helperText="Amount you plan to put down (typically 20-25%)"
              required
              fullWidth
            />

            <Input
              label="Interest Rate (%)"
              type="number"
              value={values.interestRate}
              onChange={(value) => handleChange('interestRate', value)}
              placeholder="7.5"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.interestRate}
              helperText="DSCR loan interest rate"
              required
              fullWidth
            />

            <Input
              label="Monthly Rent"
              type="number"
              value={values.monthlyRent}
              onChange={(value) => handleChange('monthlyRent', value)}
              placeholder="3000"
              icon={<Icon icon={FaKey} size="sm" color="#8B6F14" />}
              error={errors.monthlyRent}
              helperText="Expected monthly rental income"
              required
              fullWidth
            />

            <Input
              label="Monthly Expenses"
              type="number"
              value={values.monthlyExpenses}
              onChange={(value) => handleChange('monthlyExpenses', value)}
              placeholder="500"
              icon={<Icon icon={FaFileInvoiceDollar} size="sm" color="#8B6F14" />}
              error={errors.monthlyExpenses}
              helperText="Property taxes, insurance, HOA, maintenance"
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
              Calculate DSCR
            </Button>
          </div>
        </Card>

        {results && results.length > 0 ? (
          <ResultDisplay
            title="DSCR Analysis"
            results={getDisplayResults()}
            chartType="bar"
            chartData={getChartData()}
            chartConfig={{
              xAxisKey: 'category',
              yAxisKey: 'amount',
              showLegend: false,
              title: 'Monthly Cash Flow Breakdown',
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
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>DSCR Analysis</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Calculate to see your DSCR ratio and cash flow
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
