'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaHome, FaDollarSign, FaPercent, FaCalendar, FaKey, FaCalculator, FaChartLine } from 'react-icons/fa'
import { rentVsBuyConfig } from '@/lib/calculators/configs/rentVsBuy.config'
import { validateRentVsBuyInputs } from '@/lib/calculators/rentVsBuy'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

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
      homePrice: parseFloat(values.homePrice) || 0,
      downPayment: parseFloat(values.downPayment) || 0,
      interestRate: parseFloat(values.interestRate) || 0,
      rentAmount: parseFloat(values.rentAmount) || 0,
      yearsToStay: parseFloat(values.yearsToStay) || 0,
      appreciationRate: parseFloat(values.appreciationRate) || 0
    }

    const validation = validateRentVsBuyInputs(numericInputs)

    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

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

  const getChartData = (): ChartData[] => {
    if (!results) return []

    const totalRentCost = results.find(r => r.label === 'Total Rent Cost')?.value as number || 0
    const totalBuyCost = results.find(r => r.label === 'Total Buy Cost')?.value as number || 0

    return [
      { category: 'Renting', amount: totalRentCost },
      { category: 'Buying', amount: totalBuyCost }
    ]
  }

  const getDisplayResults = () => {
    if (!results) return []

    return results.slice(0, 4).map(result => ({
      ...result,
      icon: result.label.includes('Rent') ? <Icon icon={FaKey} size="lg" color="#8B6F14" /> :
        result.label.includes('Buy') ? <Icon icon={FaHome} size="lg" color="#8B6F14" /> :
          result.label.includes('Savings') || result.label.includes('Better') ? <Icon icon={FaChartLine} size="lg" color="#0D9668" /> :
            <Icon icon={FaDollarSign} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={rentVsBuyConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Comparison Details</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Home Price"
              type="number"
              value={values.homePrice}
              onChange={(value) => handleChange('homePrice', value)}
              placeholder="350000"
              icon={<Icon icon={FaHome} size="sm" color="#8B6F14" />}
              error={errors.homePrice}
              helperText="The purchase price of the home"
              required
              fullWidth
            />

            <Input
              label="Down Payment"
              type="number"
              value={values.downPayment}
              onChange={(value) => handleChange('downPayment', value)}
              placeholder="70000"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.downPayment}
              helperText="Amount you plan to put down"
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
              helperText="Mortgage interest rate"
              required
              fullWidth
            />

            <Input
              label="Monthly Rent"
              type="number"
              value={values.rentAmount}
              onChange={(value) => handleChange('rentAmount', value)}
              placeholder="2000"
              icon={<Icon icon={FaKey} size="sm" color="#8B6F14" />}
              error={errors.rentAmount}
              helperText="Current or expected monthly rent"
              required
              fullWidth
            />

            <Input
              label="Years to Stay"
              type="number"
              value={values.yearsToStay}
              onChange={(value) => handleChange('yearsToStay', value)}
              placeholder="7"
              icon={<Icon icon={FaCalendar} size="sm" color="#8B6F14" />}
              error={errors.yearsToStay}
              helperText="How long you plan to stay"
              required
              fullWidth
            />

            <Input
              label="Home Appreciation Rate (%)"
              type="number"
              value={values.appreciationRate}
              onChange={(value) => handleChange('appreciationRate', value)}
              placeholder="3.0"
              icon={<Icon icon={FaChartLine} size="sm" color="#8B6F14" />}
              error={errors.appreciationRate}
              helperText="Expected annual home value increase"
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
              Compare Rent vs Buy
            </Button>
          </div>
        </Card>

        {results && results.length > 0 ? (
          <ResultDisplay
            title="Cost Comparison"
            results={getDisplayResults()}
            chartType="bar"
            chartData={getChartData()}
            chartConfig={{
              xAxisKey: 'category',
              yAxisKey: 'amount',
              showLegend: false,
              title: 'Total Cost Comparison',
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
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Cost Comparison</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Compare to see whether renting or buying is better
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
