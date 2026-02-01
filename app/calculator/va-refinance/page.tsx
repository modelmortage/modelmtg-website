'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaDollarSign, FaPercent, FaFlag, FaSync, FaCalculator, FaChartLine } from 'react-icons/fa'
import { vaRefinanceConfig } from '@/lib/calculators/configs/vaRefinance.config'
import { validateVARefinanceInputs } from '@/lib/calculators/vaRefinance'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

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
      cashOutAmount: parseFloat(values.cashOutAmount) || 0,
      vaFundingFee: parseFloat(values.vaFundingFee) || 0
    }

    const validation = validateVARefinanceInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

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
            result.label.includes('VA') ? <Icon icon={FaFlag} size="lg" color="#8B6F14" /> :
            <Icon icon={FaDollarSign} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={vaRefinanceConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>VA Refinance Details</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Current Loan Balance"
              type="number"
              value={values.currentBalance}
              onChange={(value) => handleChange('currentBalance', value)}
              placeholder="250000"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.currentBalance}
              helperText="Your current VA loan balance"
              required
              fullWidth
            />
            
            <Input
              label="Current Interest Rate (%)"
              type="number"
              value={values.currentRate}
              onChange={(value) => handleChange('currentRate', value)}
              placeholder="7.0"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.currentRate}
              helperText="Your current VA loan rate"
              required
              fullWidth
            />
            
            <Input
              label="New Interest Rate (%)"
              type="number"
              value={values.newRate}
              onChange={(value) => handleChange('newRate', value)}
              placeholder="6.0"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.newRate}
              helperText="The new VA refinance rate"
              required
              fullWidth
            />
            
            <Input
              label="Cash Out Amount"
              type="number"
              value={values.cashOutAmount}
              onChange={(value) => handleChange('cashOutAmount', value)}
              placeholder="0"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.cashOutAmount}
              helperText="Amount to cash out (0 for rate/term refinance)"
              required
              fullWidth
            />
            
            <Input
              label="VA Funding Fee (%)"
              type="number"
              value={values.vaFundingFee}
              onChange={(value) => handleChange('vaFundingFee', value)}
              placeholder="2.15"
              icon={<Icon icon={FaFlag} size="sm" color="#8B6F14" />}
              error={errors.vaFundingFee}
              helperText="VA funding fee percentage (varies by use)"
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
              Calculate VA Refinance
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
              title: 'Payment Comparison'
            }}
          />
        ) : (
          <Card variant="elevated" padding="lg">
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Refinance Analysis</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Calculate to see if VA refinancing makes sense
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
