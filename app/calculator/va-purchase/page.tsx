'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Icon } from '@/components/design-system/Icon'
import {
  FaHome,
  FaDollarSign,
  FaPercent,
  FaFlag,
  FaFileInvoiceDollar,
  FaShieldAlt
} from 'react-icons/fa'
import { vaPurchaseConfig } from '@/lib/calculators/configs/vaPurchase.config'
import styles from './va-purchase.module.css'

type ToggleMode = 'dollar' | 'percent'
type TermMode = 'year' | 'month'

export default function VAPurchaseCalculator() {
  const [downPaymentMode, setDownPaymentMode] = useState<ToggleMode>('dollar')
  const [loanTermMode, setLoanTermMode] = useState<TermMode>('year')
  const [propertyTaxMode, setPropertyTaxMode] = useState<ToggleMode>('dollar')

  const [values, setValues] = useState({
    homePrice: '200000',
    downPaymentDollar: '0',
    downPaymentPercent: '0',
    vaFundingFee: '2.15',
    interestRate: '5',
    loanTermYears: '30',
    loanTermMonths: '360',
    propertyTaxDollar: '2400',
    propertyTaxPercent: '1.2',
    insurance: '1200',
    hoaDues: '0'
  })

  const [results, setResults] = useState({
    totalMonthlyPayment: 0,
    principalInterest: 0,
    propertyTax: 0,
    insurance: 0,
    hoaDues: 0,
    loanAmount: 0
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Auto-sync down payment
  useEffect(() => {
    const homePrice = parseFloat(values.homePrice) || 0
    if (downPaymentMode === 'percent') {
      const downPaymentDollar = parseFloat(values.downPaymentDollar) || 0
      const percent = homePrice > 0 ? (downPaymentDollar / homePrice) * 100 : 0
      setValues(prev => ({ ...prev, downPaymentPercent: percent.toFixed(2) }))
    } else {
      const percent = parseFloat(values.downPaymentPercent) || 0
      const dollar = (homePrice * percent) / 100
      setValues(prev => ({ ...prev, downPaymentDollar: dollar.toFixed(2) }))
    }
  }, [downPaymentMode])

  // Auto-sync loan term
  useEffect(() => {
    if (loanTermMode === 'year') {
      const months = parseFloat(values.loanTermMonths) || 0
      setValues(prev => ({ ...prev, loanTermYears: (months / 12).toFixed(0) }))
    } else {
      const years = parseFloat(values.loanTermYears) || 0
      setValues(prev => ({ ...prev, loanTermMonths: (years * 12).toFixed(0) }))
    }
  }, [loanTermMode])

  // Auto-sync property tax
  useEffect(() => {
    const homePrice = parseFloat(values.homePrice) || 0
    if (propertyTaxMode === 'percent') {
      const taxDollar = parseFloat(values.propertyTaxDollar) || 0
      const percent = homePrice > 0 ? (taxDollar / homePrice) * 100 : 0
      setValues(prev => ({ ...prev, propertyTaxPercent: percent.toFixed(4) }))
    } else {
      const percent = parseFloat(values.propertyTaxPercent) || 0
      const dollar = (homePrice * percent) / 100
      setValues(prev => ({ ...prev, propertyTaxDollar: dollar.toFixed(2) }))
    }
  }, [propertyTaxMode])

  // Auto-calculate
  useEffect(() => {
    calculateResults()
  }, [values, downPaymentMode, loanTermMode, propertyTaxMode])

  const calculateResults = () => {
    const homePrice = parseFloat(values.homePrice) || 0
    const downPayment = downPaymentMode === 'dollar'
      ? parseFloat(values.downPaymentDollar) || 0
      : (homePrice * (parseFloat(values.downPaymentPercent) || 0)) / 100

    const vaFundingFee = (homePrice - downPayment) * ((parseFloat(values.vaFundingFee) || 0) / 100)
    const loanAmount = homePrice - downPayment + vaFundingFee

    const rate = (parseFloat(values.interestRate) || 0) / 100 / 12
    const term = loanTermMode === 'year'
      ? (parseFloat(values.loanTermYears) || 30) * 12
      : parseFloat(values.loanTermMonths) || 360

    const monthlyPI = rate === 0
      ? loanAmount / term
      : loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

    const monthlyTax = propertyTaxMode === 'dollar'
      ? (parseFloat(values.propertyTaxDollar) || 0) / 12
      : (homePrice * (parseFloat(values.propertyTaxPercent) || 0) / 100) / 12

    const monthlyInsurance = (parseFloat(values.insurance) || 0) / 12
    const monthlyHOA = parseFloat(values.hoaDues) || 0

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA

    setResults({
      totalMonthlyPayment: totalMonthly,
      principalInterest: monthlyPI,
      propertyTax: monthlyTax,
      insurance: monthlyInsurance,
      hoaDues: monthlyHOA,
      loanAmount
    })
  }

  // Colors for donut chart
  const chartColors = {
    pi: '#E97451',
    tax: '#51C2E9',
    insurance: '#E94D8A',
    hoa: '#51E9B4'
  }

  const getDonutGradient = () => {
    const total = results.principalInterest + results.propertyTax + results.insurance + results.hoaDues
    if (total === 0) return 'conic-gradient(#e5e7eb 100%)'

    let piPercent = (results.principalInterest / total) * 100
    let taxPercent = (results.propertyTax / total) * 100
    let insPercent = (results.insurance / total) * 100
    let hoaPercent = (results.hoaDues / total) * 100

    let accumulated = 0
    const segments = []

    if (piPercent > 0) {
      segments.push(`${chartColors.pi} 0% ${piPercent}%`)
      accumulated = piPercent
    }
    if (taxPercent > 0) {
      segments.push(`${chartColors.tax} ${accumulated}% ${accumulated + taxPercent}%`)
      accumulated += taxPercent
    }
    if (insPercent > 0) {
      segments.push(`${chartColors.insurance} ${accumulated}% ${accumulated + insPercent}%`)
      accumulated += insPercent
    }
    if (hoaPercent > 0) {
      segments.push(`${chartColors.hoa} ${accumulated}% 100%`)
    }

    return `conic-gradient(${segments.join(', ')})`
  }

  return (
    <CalculatorLayout config={vaPurchaseConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h2 className={styles.cardTitle}>VA Purchase Calculator</h2>

            <div className={styles.inputFields}>
              <Input
                label="Home Value"
                type="number"
                value={values.homePrice}
                onChange={(value) => handleChange('homePrice', value)}
                icon={<Icon icon={FaHome} size="sm" />}
                fullWidth
              />

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Down Payment</label>
                <div className={styles.toggleButtons}>
                  <button
                    className={`${styles.toggleBtn} ${downPaymentMode === 'dollar' ? styles.active : ''}`}
                    onClick={() => setDownPaymentMode('dollar')}
                  >
                    $
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${downPaymentMode === 'percent' ? styles.active : ''}`}
                    onClick={() => setDownPaymentMode('percent')}
                  >
                    %
                  </button>
                </div>
                {downPaymentMode === 'dollar' ? (
                  <Input
                    label=""
                    type="number"
                    value={values.downPaymentDollar}
                    onChange={(value) => handleChange('downPaymentDollar', value)}
                    placeholder="0"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.downPaymentPercent}
                    onChange={(value) => handleChange('downPaymentPercent', value)}
                    placeholder="0"
                    fullWidth
                  />
                )}
              </div>

              <Input
                label="Base Mortgage Amount"
                type="number"
                value={values.homePrice}
                onChange={(value) => handleChange('homePrice', value)}
                fullWidth
              />

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Loan Terms</label>
                <div className={styles.toggleButtons}>
                  <button
                    className={`${styles.toggleBtn} ${loanTermMode === 'year' ? styles.active : ''}`}
                    onClick={() => setLoanTermMode('year')}
                  >
                    Year
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${loanTermMode === 'month' ? styles.active : ''}`}
                    onClick={() => setLoanTermMode('month')}
                  >
                    Month
                  </button>
                </div>
                {loanTermMode === 'year' ? (
                  <Input
                    label=""
                    type="number"
                    value={values.loanTermYears}
                    onChange={(value) => handleChange('loanTermYears', value)}
                    placeholder="30"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.loanTermMonths}
                    onChange={(value) => handleChange('loanTermMonths', value)}
                    placeholder="360"
                    fullWidth
                  />
                )}
              </div>

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Payment Frequency</label>
                <div className={styles.toggleButtons}>
                  <button className={`${styles.toggleBtn} ${styles.active}`}>
                    Year
                  </button>
                  <button className={styles.toggleBtn}>
                    Month
                  </button>
                </div>
              </div>

              <Input
                label="Interest Rate"
                type="number"
                value={values.interestRate}
                onChange={(value) => handleChange('interestRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>This is my...</label>
                <div className={styles.toggleButtons}>
                  <button className={styles.toggleBtn}>
                    Low Monthly Payment
                  </button>
                  <button className={styles.toggleBtn}>
                    Lower Interest Paid
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Panel - Payment Breakdown */}
        <div className={styles.centerPanel}>
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Payment Breakdown</h3>

            <div className={styles.pieChart}>
              <div className={styles.donut} style={{ background: getDonutGradient() }}>
                <div className={styles.centerAmount}>
                  <div className={styles.centerLabel}>Monthly Payment</div>
                  <div className={styles.centerValue}>
                    ${results.totalMonthlyPayment.toFixed(2)}
                  </div>
                  <div className={styles.centerPerMonth}>per month</div>
                </div>
              </div>
            </div>

            <div className={styles.breakdownLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.pi }}></span>
                <span className={styles.legendLabel}>Principal & Interest</span>
                <span className={styles.legendValue}>${results.principalInterest.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.tax }}></span>
                <span className={styles.legendLabel}>Taxes</span>
                <span className={styles.legendValue}>${results.propertyTax.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.insurance }}></span>
                <span className={styles.legendLabel}>Insurance</span>
                <span className={styles.legendValue}>${results.insurance.toFixed(2)}</span>
              </div>
              {results.hoaDues > 0 && (
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: chartColors.hoa }}></span>
                  <span className={styles.legendLabel}>HOA Dues</span>
                  <span className={styles.legendValue}>${results.hoaDues.toFixed(2)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultCards}>
            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>All Payment</div>
              <div className={styles.resultValue}>${(results.totalMonthlyPayment * 360).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Total Loan Amount</div>
              <div className={styles.resultValue}>${results.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Total Interest Paid</div>
              <div className={styles.resultValue}>${((results.principalInterest * 360) - results.loanAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Savings</div>
              <div className={styles.resultValue}>$0</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Payment Amount</div>
              <div className={styles.resultValue}>${results.totalMonthlyPayment.toFixed(2)}</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Shorten Loan Term By</div>
              <div className={styles.resultValue}>--</div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Early Payoff Strategy</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#374151' }}>Additional Monthly</label>
              <input
                type="text"
                placeholder="You can add below $500.00"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#374151' }}>Increase Frequency</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  Monthly
                </button>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  Bi Weekly
                </button>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  Weekly
                </button>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Lump Sum Payment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#374151' }}>Lump Sum Addition</label>
              <input
                type="text"
                placeholder="You can add below $100k"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#374151' }}>Frequency</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  One time
                </button>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  Yearly
                </button>
                <button style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  Quarterly
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
