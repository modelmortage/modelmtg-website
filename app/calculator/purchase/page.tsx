'use client'

import { useState } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { ResultDisplay } from '@/components/design-system/ResultDisplay'
import { Icon } from '@/components/design-system/Icon'
import { FaHome, FaDollarSign, FaPercent, FaCalendar, FaFileInvoiceDollar, FaShieldAlt, FaBuilding, FaCalculator } from 'react-icons/fa'
import { purchaseConfig } from '@/lib/calculators/configs/purchase.config'
import { validatePurchaseInputs } from '@/lib/calculators/purchase'
import type { CalculatorResult } from '@/lib/types/calculator'
import type { ChartData } from '@/components/design-system/Chart'

export default function PurchaseCalculator() {
  const [values, setValues] = useState<Record<string, string>>({
    homePrice: '',
    downPayment: '',
    interestRate: '7.0',
    loanTerm: '30',
    propertyTaxRate: '1.2',
    insurance: '1200',
    hoa: '0'
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
      loanTerm: parseFloat(values.loanTerm) || 0,
      propertyTaxRate: parseFloat(values.propertyTaxRate) || 0,
      insurance: parseFloat(values.insurance) || 0,
      hoa: parseFloat(values.hoa) || 0
    }

    // Validate inputs
    const validation = validatePurchaseInputs(numericInputs)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      setLoading(false)
      return
    }

    // Calculate results
    try {
      const calculatedResults = purchaseConfig.calculate(numericInputs)
      setResults(calculatedResults)
      setErrors({})
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors({ general: 'An error occurred during calculation. Please check your inputs.' })
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data for monthly payment breakdown
  const getChartData = (): ChartData[] => {
    if (!results) return []
    
    const principalInterest = results.find(r => r.label === 'Principal & Interest')?.value as number || 0
    const propertyTax = results.find(r => r.label === 'Property Taxes')?.value as number || 0
    const insurance = results.find(r => r.label === 'Homeowners Insurance')?.value as number || 0
    const hoa = results.find(r => r.label === 'HOA Fees')?.value as number || 0
    
    return [
      { category: 'Principal & Interest', amount: principalInterest },
      { category: 'Property Taxes', amount: propertyTax },
      { category: 'Insurance', amount: insurance },
      { category: 'HOA Fees', amount: hoa }
    ].filter(item => item.amount > 0)
  }

  // Get key metrics for display
  const getDisplayResults = () => {
    if (!results) return []
    
    return results.slice(0, 5).map(result => ({
      ...result,
      icon: result.label.includes('Total Monthly') ? <Icon icon={FaDollarSign} size="lg" color="#8B6F14" /> :
            result.label.includes('Principal') ? <Icon icon={FaHome} size="lg" color="#8B6F14" /> :
            result.label.includes('Tax') ? <Icon icon={FaFileInvoiceDollar} size="lg" color="#8B6F14" /> :
            result.label.includes('Insurance') ? <Icon icon={FaShieldAlt} size="lg" color="#8B6F14" /> :
            <Icon icon={FaBuilding} size="lg" color="#8B6F14" />
    }))
  }

  return (
    <CalculatorLayout config={purchaseConfig}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        {/* Input Form */}
        <Card variant="elevated" padding="lg">
          <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Loan Details</h2>
          
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
            
            <Input
              label="Loan Term (years)"
              type="number"
              value={values.loanTerm}
              onChange={(value) => handleChange('loanTerm', value)}
              placeholder="30"
              icon={<Icon icon={FaCalendar} size="sm" color="#8B6F14" />}
              error={errors.loanTerm}
              helperText="Length of the mortgage in years"
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
            
            <Input
              label="Monthly HOA Fees"
              type="number"
              value={values.hoa}
              onChange={(value) => handleChange('hoa', value)}
              placeholder="0"
              icon={<Icon icon={FaBuilding} size="sm" color="#8B6F14" />}
              error={errors.hoa}
              helperText="Monthly homeowners association fees"
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
              Calculate Payment
            </Button>
          </div>
        </Card>

        {/* Results Display */}
        {results && results.length > 0 ? (
          <ResultDisplay
            title="Monthly Payment"
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
            <h2 style={{ marginBottom: '2rem', color: '#36454F' }}>Monthly Payment</h2>
            <p style={{ opacity: 0.6, textAlign: 'center', padding: '3rem 0' }}>
              Enter your information and click Calculate to see your monthly payment
            </p>
          </Card>
        )}
      </div>
    </CalculatorLayout>
  )
}
