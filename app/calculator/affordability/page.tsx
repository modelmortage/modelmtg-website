'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Button } from '@/components/design-system/Button'
import { Icon } from '@/components/design-system/Icon'
import {
  FaDollarSign,
  FaCreditCard,
  FaHome,
  FaPercent,
  FaCalculator,
  FaChartPie,
  FaUniversity,
  FaFlag
} from 'react-icons/fa'
import { affordabilityConfig } from '@/lib/calculators/configs/affordability.config'
import dynamic from 'next/dynamic'
const ExportPDFButton = dynamic(() => import('@/components/ExportPDFButton'), { ssr: false })
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
import styles from './affordability.module.css'

type LoanType = 'conventional' | 'fha' | 'va' | 'usda' | 'jumbo'
type ToggleMode = 'dollar' | 'percent'
type TermMode = 'year' | 'month'

export default function AffordabilityCalculator() {
  const { chartRef, getExportData } = useCalculatorExport('Affordability')
  
  const [activeLoanType, setActiveLoanType] = useState<LoanType>('conventional')
  const [downPaymentMode, setDownPaymentMode] = useState<ToggleMode>('dollar')
  const [propertyTaxMode, setPropertyTaxMode] = useState<ToggleMode>('percent')
  const [loanTermMode, setLoanTermMode] = useState<TermMode>('year')

  const [values, setValues] = useState({
    grossIncome: '5000',
    monthlyDebts: '1500',
    homePrice: '200000',
    downPaymentDollar: '0',
    downPaymentPercent: '0',
    loanAmount: '200000',
    loanTermYear: '30',
    loanTermMonth: '360',
    interestRate: '5',
    creditScore: '620-639',
    propertyTaxYearly: '1200',
    propertyTaxPercent: '0.6',
    homeownersInsurance: '1200',
    pmi: '0',
    hoaDues: '0'
  })

  const [results, setResults] = useState({
    monthlyPayment: 0,
    loanAmount: 0,
    debtToIncome: 0,
    allowableDebtToIncome: 50,
    purchasePrice: 0,
    downPayment: 0,
    principalInterest: 0,
    taxes: 0,
    insurance: 0,
    hoaDues: 0,
    pmi: 0
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Auto-calculate loan amount when home price or down payment changes
  useEffect(() => {
    const homePrice = parseFloat(values.homePrice) || 0
    const downPayment = downPaymentMode === 'dollar'
      ? parseFloat(values.downPaymentDollar) || 0
      : (homePrice * (parseFloat(values.downPaymentPercent) || 0)) / 100

    const calculatedLoanAmount = homePrice - downPayment
    setValues(prev => ({ ...prev, loanAmount: calculatedLoanAmount.toFixed(2) }))
  }, [values.homePrice, values.downPaymentDollar, values.downPaymentPercent, downPaymentMode])

  // Auto-calculate when down payment mode changes
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

  // Auto-calculate when loan term mode changes
  useEffect(() => {
    if (loanTermMode === 'year') {
      const months = parseFloat(values.loanTermMonth) || 360
      setValues(prev => ({ ...prev, loanTermYear: (months / 12).toFixed(0) }))
    } else {
      const years = parseFloat(values.loanTermYear) || 30
      setValues(prev => ({ ...prev, loanTermMonth: (years * 12).toFixed(0) }))
    }
  }, [loanTermMode])

  // Auto-calculate results whenever values change
  useEffect(() => {
    calculateResults()
  }, [values, activeLoanType, downPaymentMode, propertyTaxMode, loanTermMode])

  const calculateResults = () => {
    const homePrice = parseFloat(values.homePrice) || 0
    const downPayment = downPaymentMode === 'dollar'
      ? parseFloat(values.downPaymentDollar) || 0
      : (homePrice * (parseFloat(values.downPaymentPercent) || 0)) / 100

    const loanAmount = homePrice - downPayment
    const rate = (parseFloat(values.interestRate) || 0) / 100 / 12
    const term = loanTermMode === 'year'
      ? (parseFloat(values.loanTermYear) || 30) * 12
      : parseFloat(values.loanTermMonth) || 360

    // Calculate monthly P&I
    const monthlyPI = rate === 0
      ? loanAmount / term
      : loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

    // Calculate monthly property tax
    const monthlyTax = propertyTaxMode === 'percent'
      ? (homePrice * (parseFloat(values.propertyTaxPercent) || 0) / 100) / 12
      : (parseFloat(values.propertyTaxYearly) || 0) / 12

    // Calculate monthly insurance
    const monthlyInsurance = (parseFloat(values.homeownersInsurance) || 0) / 12

    // Calculate monthly HOA
    const monthlyHOA = parseFloat(values.hoaDues) || 0

    // Calculate PMI/MIP based on loan type
    let monthlyPMI = 0
    const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0

    if (activeLoanType === 'conventional') {
      // Conventional: PMI if down payment < 20%
      if (downPaymentPercent < 20) {
        monthlyPMI = (parseFloat(values.pmi) || 0) / 12
        if (monthlyPMI === 0) {
          // Default PMI calculation: ~0.5-1% of loan amount annually
          monthlyPMI = (loanAmount * 0.005) / 12
        }
      }
    } else if (activeLoanType === 'fha') {
      // FHA: Mortgage Insurance Premium (MIP) - 0.85% annual for most loans
      if (downPaymentPercent < 10) {
        monthlyPMI = (loanAmount * 0.0085) / 12
      } else {
        monthlyPMI = (loanAmount * 0.008) / 12
      }
    } else if (activeLoanType === 'va') {
      // VA: No monthly PMI, but has funding fee (paid upfront, not monthly)
      monthlyPMI = 0
    } else if (activeLoanType === 'usda') {
      // USDA: Annual guarantee fee of 0.35%
      monthlyPMI = (loanAmount * 0.0035) / 12
    } else if (activeLoanType === 'jumbo') {
      // Jumbo: Usually no PMI if 20% down, but higher if less
      if (downPaymentPercent < 20) {
        monthlyPMI = (loanAmount * 0.01) / 12
      }
    }

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA

    const grossIncome = parseFloat(values.grossIncome) || 0
    const monthlyDebts = parseFloat(values.monthlyDebts) || 0
    const dti = grossIncome > 0 ? ((totalMonthlyPayment + monthlyDebts) / grossIncome) * 100 : 0

    // Set allowable DTI based on loan type
    let allowableDTI = 50
    if (activeLoanType === 'conventional') allowableDTI = 50
    if (activeLoanType === 'fha') allowableDTI = 50
    if (activeLoanType === 'va') allowableDTI = 55
    if (activeLoanType === 'usda') allowableDTI = 50
    if (activeLoanType === 'jumbo') allowableDTI = 43

    setResults({
      monthlyPayment: totalMonthlyPayment,
      loanAmount,
      debtToIncome: dti,
      allowableDebtToIncome: allowableDTI,
      purchasePrice: homePrice,
      downPayment,
      principalInterest: monthlyPI,
      taxes: monthlyTax,
      insurance: monthlyInsurance,
      hoaDues: monthlyHOA,
      pmi: monthlyPMI
    })
  }

  const loanTypes = [
    { id: 'conventional' as LoanType, label: 'Conventional', icon: FaUniversity },
    { id: 'fha' as LoanType, label: 'FHA', icon: FaHome },
    { id: 'va' as LoanType, label: 'VA', icon: FaFlag },
    { id: 'usda' as LoanType, label: 'USDA', icon: FaHome },
    { id: 'jumbo' as LoanType, label: 'Jumbo', icon: FaDollarSign }
  ]

  // Colors for donut chart
  const chartColors = {
    pi: '#E97451',
    tax: '#51C2E9',
    insurance: '#E94D8A',
    hoa: '#51E9B4',
    pmi: '#F4D03F'
  }

  const getDonutGradient = () => {
    const total = results.principalInterest + results.taxes + results.insurance + results.hoaDues + results.pmi
    if (total === 0) return 'conic-gradient(#e5e7eb 100%)'

    let piPercent = (results.principalInterest / total) * 100
    let taxPercent = (results.taxes / total) * 100
    let insPercent = (results.insurance / total) * 100
    let hoaPercent = (results.hoaDues / total) * 100
    let pmiPercent = (results.pmi / total) * 100

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
      segments.push(`${chartColors.hoa} ${accumulated}% ${accumulated + hoaPercent}%`)
      accumulated += hoaPercent
    }
    if (pmiPercent > 0) {
      segments.push(`${chartColors.pmi} ${accumulated}% 100%`)
    }

    return `conic-gradient(${segments.join(', ')})`
  }

  return (
    <CalculatorLayout config={affordabilityConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h2 className={styles.cardTitle}>Affordability Calculator</h2>

            {/* Loan Type Tabs */}
            <div className={styles.loanTypeTabs}>
              {loanTypes.map(type => (
                <button
                  key={type.id}
                  className={`${styles.loanTypeTab} ${activeLoanType === type.id ? styles.active : ''}`}
                  onClick={() => setActiveLoanType(type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className={styles.inputFields}>
              <Input
                label="Gross Income (Monthly)"
                type="number"
                value={values.grossIncome}
                onChange={(value) => handleChange('grossIncome', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Monthly Debts"
                type="number"
                value={values.monthlyDebts}
                onChange={(value) => handleChange('monthlyDebts', value)}
                icon={<Icon icon={FaCreditCard} size="sm" />}
                fullWidth
              />

              <Input
                label="Home Price"
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
                    placeholder="0.00"
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
                label="Loan Amount"
                type="number"
                value={values.loanAmount}
                onChange={(value) => handleChange('loanAmount', value)}
                fullWidth
              />

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Loan Term</label>
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
                    value={values.loanTermYear}
                    onChange={(value) => handleChange('loanTermYear', value)}
                    placeholder="30"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.loanTermMonth}
                    onChange={(value) => handleChange('loanTermMonth', value)}
                    placeholder="360"
                    fullWidth
                  />
                )}
              </div>

              <Input
                label="Interest Rate"
                type="number"
                value={values.interestRate}
                onChange={(value) => handleChange('interestRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Credit Score</label>
                <select
                  value={values.creditScore}
                  onChange={(e) => handleChange('creditScore', e.target.value)}
                  className={styles.select}
                >
                  <option value="620-639">620-639</option>
                  <option value="640-659">640-659</option>
                  <option value="660-679">660-679</option>
                  <option value="680-699">680-699</option>
                  <option value="700-719">700-719</option>
                  <option value="720-739">720-739</option>
                  <option value="740-759">740-759</option>
                  <option value="760-779">760-779</option>
                  <option value="780-799">780-799</option>
                  <option value="800+">800+</option>
                </select>
              </div>

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Prop Tax (Yearly)</label>
                <div className={styles.toggleButtons}>
                  <button
                    className={`${styles.toggleBtn} ${propertyTaxMode === 'dollar' ? styles.active : ''}`}
                    onClick={() => setPropertyTaxMode('dollar')}
                  >
                    $
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${propertyTaxMode === 'percent' ? styles.active : ''}`}
                    onClick={() => setPropertyTaxMode('percent')}
                  >
                    %
                  </button>
                </div>
                {propertyTaxMode === 'dollar' ? (
                  <Input
                    label=""
                    type="number"
                    value={values.propertyTaxYearly}
                    onChange={(value) => handleChange('propertyTaxYearly', value)}
                    placeholder="1200"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.propertyTaxPercent}
                    onChange={(value) => handleChange('propertyTaxPercent', value)}
                    placeholder="0.6"
                    fullWidth
                  />
                )}
              </div>

              <Input
                label="Homeowners Insurance (Yearly)"
                type="number"
                value={values.homeownersInsurance}
                onChange={(value) => handleChange('homeownersInsurance', value)}
                placeholder="1200"
                fullWidth
              />

              <Input
                label="PMI (Yearly)"
                type="number"
                value={values.pmi}
                onChange={(value) => handleChange('pmi', value)}
                placeholder="0"
                fullWidth
              />

              <Input
                label="HOA Dues (Monthly)"
                type="number"
                value={values.hoaDues}
                onChange={(value) => handleChange('hoaDues', value)}
                placeholder="0"
                fullWidth
              />
            </div>
          </Card>
        </div>

        {/* Center Panel - Payment Breakdown */}
        <div className={styles.centerPanel}>
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className={styles.cardTitle}>Payment Breakdown</h3>
              <ExportPDFButton 
                getCalculatorData={() => {
                  const exportData = getExportData(values, results)
                  const chartSegments = []
                  if (results.principalInterest > 0) {
                    chartSegments.push({ label: 'Principal & Interest', value: results.principalInterest, color: chartColors.pi })
                  }
                  if (results.taxes > 0) {
                    chartSegments.push({ label: 'Taxes', value: results.taxes, color: chartColors.tax })
                  }
                  if (results.insurance > 0) {
                    chartSegments.push({ label: 'Insurance', value: results.insurance, color: chartColors.insurance })
                  }
                  if (results.hoaDues > 0) {
                    chartSegments.push({ label: 'HOA Dues', value: results.hoaDues, color: chartColors.hoa })
                  }
                  if (results.pmi > 0) {
                    chartSegments.push({ label: 'PMI', value: results.pmi, color: chartColors.pmi })
                  }
                  return { ...exportData, chartData: { segments: chartSegments } }
                }}
              />
            </div>

            <div ref={chartRef} className={styles.pieChart}>
              <div className={styles.donut} style={{ background: getDonutGradient() }}>
                <div className={styles.centerAmount}>
                  <div className={styles.paymentAmount}>
                    ${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={styles.perMonth}>per month</div>
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
                <span className={styles.legendValue}>${results.taxes.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.insurance }}></span>
                <span className={styles.legendLabel}>Insurance</span>
                <span className={styles.legendValue}>${results.insurance.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.hoa }}></span>
                <span className={styles.legendLabel}>HOA Dues</span>
                <span className={styles.legendValue}>${results.hoaDues.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.pmi }}></span>
                <span className={styles.legendLabel}>PMI</span>
                <span className={styles.legendValue}>${results.pmi.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultCards}>
            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Monthly Mortgage Payment</div>
              <div className={styles.resultValue}>${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Loan Amount</div>
              <div className={styles.resultValue}>${results.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Your Debt-to Income Ratio</div>
              <div className={styles.resultValue}>
                {results.debtToIncome.toFixed(2)}%/ {results.allowableDebtToIncome.toFixed(2)}%
              </div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Allowable Debt to Income Ratio</div>
              <div className={styles.resultValue}>50%/50%</div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.sliderCard}>
            <div className={styles.sliderLabel}>
              <span>Purchase Price</span>
              <span className={styles.sliderValue}>${results.purchasePrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="10000"
              value={values.homePrice}
              onChange={(e) => handleChange('homePrice', e.target.value)}
              className={styles.slider}
            />
          </Card>

          <Card variant="elevated" padding="md" className={styles.sliderCard}>
            <div className={styles.sliderLabel}>
              <span>Down Payment</span>
              <span className={styles.sliderValue}>${results.downPayment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max={parseFloat(values.homePrice) || 0}
              step="1000"
              value={values.downPaymentDollar}
              onChange={(e) => handleChange('downPaymentDollar', e.target.value)}
              className={styles.slider}
            />
          </Card>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Summary:</div>
            <p className={styles.summaryText}>
              Based on what you input into today your Total Payment would be{' '}
              <strong>${results.monthlyPayment.toFixed(2)}</strong> on a{' '}
              <strong style={{ color: '#5B9BD5' }}>
                {activeLoanType === 'conventional' && 'Conventional Loan'}
                {activeLoanType === 'fha' && 'FHA Loan'}
                {activeLoanType === 'va' && 'VA Loan'}
                {activeLoanType === 'usda' && 'USDA Loan'}
                {activeLoanType === 'jumbo' && 'Jumbo Loan'}
              </strong> with a{' '}
              <strong>
                {results.purchasePrice > 0
                  ? ((results.downPayment / results.purchasePrice) * 100).toFixed(2)
                  : '0.00'}% Down Payment
              </strong>. Your{' '}
              <strong>Debt-to-Income Ratio is {results.debtToIncome.toFixed(2)}%</strong> and{' '}
              the maximum allowable on this program type is <strong>{results.allowableDebtToIncome}%/{results.allowableDebtToIncome}%</strong>.
            </p>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
