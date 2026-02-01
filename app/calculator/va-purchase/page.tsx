'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaHome, FaDollarSign, FaPercent, FaFlag, FaFileInvoiceDollar, FaShieldAlt, FaCalculator } from 'react-icons/fa'
import { vaPurchaseConfig } from '@/lib/calculators/configs/vaPurchase.config'
import { validateVAPurchaseInputs } from '@/lib/calculators/vaPurchase'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

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
      vaFundingFee: parseFloat(values.vaFundingFee) || 0,
      propertyTaxRate: parseFloat(values.propertyTaxRate) || 0,
      insurance: parseFloat(values.insurance) || 0
    }

    const validation = validateVAPurchaseInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

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

  const getChartData = (): ChartData[] => {
    if (!results) return []
    
    const principalInterest = results.find(r => r.label === 'Principal & Interest')?.value as number || 0
    const propertyTax = results.find(r => r.label === 'Property Taxes')?.value as number || 0
    const insurance = results.find(r => r.label === 'Homeowners Insurance')?.value as number || 0
    
    return [
      { category: 'Principal & Interest', amount: principalInterest },
      { category: 'Property Taxes', amount: propertyTax },
      { category: 'Insurance', amount: insurance }
    ].filter(item => item.amount > 0)
  }

  const getDisplayResults = () => {
    if (!results) return []
    
    return results.slice(0, 5).map(result => ({
      ...result,
      icon: result.label.includes('Total Monthly') ? <Icon icon={FaDollarSign} size="lg" color="#8B6F14" /> :
            result.label.includes('Principal') ? <Icon icon={FaHome} size="lg" color="#8B6F14" /> :
            result.label.includes('Tax') ? <Icon icon={FaFileInvoiceDollar} size="lg" color="#8B6F14" /> :
            result.label.includes('Insurance') ? <Icon icon={FaShieldAlt} size="lg" color="#8B6F14" /> :
            <Icon icon={FaFlag} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={vaPurchaseConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>VA Loan Details</h2>
          
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
              placeholder="0"
              icon={<Icon icon={FaDollarSign} size="sm" color="#8B6F14" />}
              error={errors.downPayment}
              helperText="VA loans typically require no down payment"
              required
              fullWidth
            />
            
            <Input
              label="Interest Rate (%)"
              type="number"
              value={values.interestRate}
              onChange={(value) => handleChange('interestRate', value)}
              placeholder="6.5"
              icon={<Icon icon={FaPercent} size="sm" color="#8B6F14" />}
              error={errors.interestRate}
              helperText="Current VA loan interest rate"
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
              helperText="VA funding fee percentage (typically 2.15% for first-time use)"
              required
              fullWidth
            />
            
            <Input
              label="Property Tax Rate (%)"
              type="number"
              value={values.propertyTaxRate}
              onChange={(value) => handleChange('propertyTaxRate', value)}
              placeholder="1.2"
              icon={<Icon icon={FaFileInvoiceDollar} size="sm" color="#8B6F14" />}
              error={errors.propertyTaxRate}
              helperText="Annual property tax as percentage of home price"
              required
              fullWidth
            />
            
            <Input
              label="Annual Insurance"
              type="number"
              value={values.insurance}
              onChange={(value) => handleChange('insurance', value)}
              placeholder="1200"
              icon={<Icon icon={FaShieldAlt} size="sm" color="#8B6F14" />}
              error={errors.insurance}
              helperText="Annual homeowners insurance premium"
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
              Calculate VA Loan
            </Button>
          </div>
        </Card>

        {results && results.length > 0 ? (
          <ResultDisplay
            title="VA Loan Payment"
            results={getDisplayResults()}
            chartType="pie"
            chartData={getChartData()}
            chartConfig={{
              xAxisKey: 'category',
              yAxisKey: 'amount',
              showLegend: true,
              title: 'Monthly Payment Breakdown'
            }}
          />
        ) : (
          <Card variant="elevated" padding="lg">
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>VA Loan Payment</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Calculate to see your VA loan payment
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
