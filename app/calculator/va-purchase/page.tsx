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
import dynamic from 'next/dynamic'
const ExportPDFButton = dynamic(() => import('@/components/ExportPDFButton'), { ssr: false })
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
import styles from './va-purchase.module.css'

type ToggleMode = 'dollar' | 'percent'
type TermMode = 'year' | 'month'
type VAFundingFeeType = 'first-time' | 'subsequent' | 'exempt'
type PaymentFrequency = 'monthly' | 'bi-weekly' | 'weekly'
type LumpSumFrequency = 'one-time' | 'yearly' | 'quarterly'

function calculateVAFundingFee(
  baseMortgageAmount: number,
  feeType: VAFundingFeeType
): number {
  switch (feeType) {
    case 'first-time':
      return baseMortgageAmount * 0.0215
    case 'subsequent':
      return baseMortgageAmount * 0.033
    case 'exempt':
      return 0
  }
}

function getPeriodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12
    case 'bi-weekly':
      return 26
    case 'weekly':
      return 52
  }
}

function adjustPaymentForFrequency(
  monthlyPayment: number,
  frequency: PaymentFrequency
): number {
  const periodsPerYear = getPeriodsPerYear(frequency)
  return (monthlyPayment * 12) / periodsPerYear
}

function getFrequencyLabel(frequency: PaymentFrequency): string {
  switch (frequency) {
    case 'monthly':
      return 'per month'
    case 'bi-weekly':
      return 'per bi-weekly period'
    case 'weekly':
      return 'per week'
  }
}

function getDefaultFirstPaymentDate(): Date {
  const today = new Date()
  today.setDate(today.getDate() + 30)
  return today
}

function calculatePaymentSchedule(
  firstPaymentDate: Date,
  frequency: PaymentFrequency,
  numberOfPayments: number
): Date[] {
  const schedule: Date[] = []
  let currentDate = new Date(firstPaymentDate)
  
  for (let i = 0; i < numberOfPayments; i++) {
    schedule.push(new Date(currentDate))
    
    switch (frequency) {
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
      case 'bi-weekly':
        currentDate.setDate(currentDate.getDate() + 14)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7)
        break
    }
  }
  
  return schedule
}

function calculateAmortization(
  principal: number,
  annualRate: number,
  termInMonths: number,
  extraPayment: number = 0
): {
  monthlyPayment: number
  totalInterest: number
  actualTermMonths: number
} {
  // Handle edge cases
  if (principal <= 0 || termInMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      actualTermMonths: 0
    }
  }

  const monthlyRate = annualRate / 12
  
  // Standard monthly payment (principal + interest)
  const monthlyPI = monthlyRate === 0
    ? principal / termInMonths
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
      (Math.pow(1 + monthlyRate, termInMonths) - 1)
  
  // If no extra payment, use simple calculation
  if (extraPayment === 0) {
    const totalInterest = (monthlyPI * termInMonths) - principal
    return {
      monthlyPayment: monthlyPI,
      totalInterest,
      actualTermMonths: termInMonths
    }
  }
  
  // With extra payments, simulate month by month
  let balance = principal
  let totalInterest = 0
  let monthsPaid = 0
  
  while (balance > 0.01 && monthsPaid < termInMonths) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPI - interestPayment + extraPayment
    
    totalInterest += interestPayment
    balance = Math.max(0, balance - principalPayment)
    monthsPaid++
  }
  
  return {
    monthlyPayment: monthlyPI,
    totalInterest,
    actualTermMonths: monthsPaid
  }
}

function calculateEarlyPayoffStrategy(
  principal: number,
  annualRate: number,
  termInMonths: number,
  additionalMonthly: number,
  frequency: PaymentFrequency,
  lumpSumAmount: number,
  lumpSumFrequency: LumpSumFrequency
): {
  savings: number
  newPaymentAmount: number
  termReduction: number
} {
  // Calculate baseline (no extra payments)
  const baseline = calculateAmortization(principal, annualRate, termInMonths, 0)
  
  // Calculate with additional monthly payment
  const extraMonthly = additionalMonthly
  
  // Adjust for payment frequency
  const periodsPerYear = getPeriodsPerYear(frequency)
  const adjustedExtra = (extraMonthly * 12) / periodsPerYear
  
  // Calculate lump sum contribution per month
  let lumpSumPerMonth = 0
  if (lumpSumAmount > 0) {
    switch (lumpSumFrequency) {
      case 'one-time':
        lumpSumPerMonth = lumpSumAmount / termInMonths
        break
      case 'yearly':
        lumpSumPerMonth = lumpSumAmount / 12
        break
      case 'quarterly':
        lumpSumPerMonth = lumpSumAmount / 3
        break
    }
  }
  
  // Calculate with early payoff strategy
  const withStrategy = calculateAmortization(
    principal,
    annualRate,
    termInMonths,
    adjustedExtra + lumpSumPerMonth
  )
  
  return {
    savings: baseline.totalInterest - withStrategy.totalInterest,
    newPaymentAmount: withStrategy.monthlyPayment + adjustedExtra + lumpSumPerMonth,
    termReduction: baseline.actualTermMonths - withStrategy.actualTermMonths
  }
}
function convertInsuranceDollarToPercent(
  dollarAmount: number,
  homeValue: number
): number {
  return homeValue > 0 ? (dollarAmount / homeValue) * 100 : 0
}

function convertInsurancePercentToDollar(
  percent: number,
  homeValue: number
): number {
  return (homeValue * percent) / 100
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatPercent(value: number, decimals: number = 4): string {
  return value.toFixed(decimals) + '%'
}

function parseNumericInput(value: string, defaultValue: number = 0): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) || parsed < 0 ? defaultValue : parsed
}

export default function VAPurchaseCalculator() {
  const { chartRef, getExportData } = useCalculatorExport('VA Purchase')
  
  const [downPaymentMode, setDownPaymentMode] = useState<ToggleMode>('dollar')
  const [loanTermMode, setLoanTermMode] = useState<TermMode>('year')
  const [propertyTaxMode, setPropertyTaxMode] = useState<ToggleMode>('dollar')
  const [insuranceMode, setInsuranceMode] = useState<ToggleMode>('dollar')
  const [vaFundingFeeType, setVaFundingFeeType] = useState<VAFundingFeeType>('first-time')
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly')
  const [firstPaymentDate, setFirstPaymentDate] = useState<Date | null>(getDefaultFirstPaymentDate())
  
  // Early payoff strategy state
  const [earlyPayoffFrequency, setEarlyPayoffFrequency] = useState<PaymentFrequency>('monthly')
  const [lumpSumFrequency, setLumpSumFrequency] = useState<LumpSumFrequency>('one-time')

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
    insuranceDollar: '1200',
    insurancePercent: '0.6',
    hoaDues: '0',
    extraPaymentPerMonth: '0',
    additionalMonthly: '0',
    lumpSumAmount: '0'
  })

  const [results, setResults] = useState({
    totalMonthlyPayment: 0,
    principalInterest: 0,
    propertyTax: 0,
    insurance: 0,
    hoaDues: 0,
    loanAmount: 0,
    vaFundingFeeAmount: 0,
    finalMortgageAmount: 0,
    paymentPerPeriod: 0,
    periodsPerYear: 12,
    extraPayment: 0,
    totalInterestPaid: 0,
    actualTermMonths: 0,
    earlyPayoffSavings: 0,
    earlyPayoffPaymentAmount: 0,
    loanTermReduction: 0
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

  // Auto-sync insurance when mode changes
  useEffect(() => {
    const homePrice = parseFloat(values.homePrice) || 0
    if (insuranceMode === 'percent') {
      const insuranceDollar = parseFloat(values.insuranceDollar) || 0
      const percent = convertInsuranceDollarToPercent(insuranceDollar, homePrice)
      setValues(prev => ({ ...prev, insurancePercent: percent.toFixed(4) }))
    } else {
      const percent = parseFloat(values.insurancePercent) || 0
      const dollar = convertInsurancePercentToDollar(percent, homePrice)
      setValues(prev => ({ ...prev, insuranceDollar: dollar.toFixed(2) }))
    }
  }, [insuranceMode])

  // Recalculate insurance dollar when home value changes in percent mode
  useEffect(() => {
    if (insuranceMode === 'percent') {
      const homePrice = parseFloat(values.homePrice) || 0
      const percent = parseFloat(values.insurancePercent) || 0
      const dollar = convertInsurancePercentToDollar(percent, homePrice)
      setValues(prev => ({ ...prev, insuranceDollar: dollar.toFixed(2) }))
    }
  }, [values.homePrice, insuranceMode])

  // Auto-calculate
  useEffect(() => {
    calculateResults()
  }, [values, downPaymentMode, loanTermMode, propertyTaxMode, insuranceMode, vaFundingFeeType, paymentFrequency, earlyPayoffFrequency, lumpSumFrequency])

  const calculateResults = () => {
    // Parse and validate all inputs to prevent negative values
    const homePrice = parseNumericInput(values.homePrice, 0)
    const downPayment = downPaymentMode === 'dollar'
      ? parseNumericInput(values.downPaymentDollar, 0)
      : (homePrice * parseNumericInput(values.downPaymentPercent, 0)) / 100

    const baseMortgageAmount = Math.max(0, homePrice - downPayment)
    const vaFundingFeeAmount = calculateVAFundingFee(baseMortgageAmount, vaFundingFeeType)
    const finalMortgageAmount = baseMortgageAmount + vaFundingFeeAmount
    const loanAmount = finalMortgageAmount

    const annualRate = parseNumericInput(values.interestRate, 0) / 100
    const term = loanTermMode === 'year'
      ? parseNumericInput(values.loanTermYears, 30) * 12
      : parseNumericInput(values.loanTermMonths, 360)

    const extraPayment = parseNumericInput(values.extraPaymentPerMonth, 0)

    // Use calculateAmortization to get accurate results with extra payments
    const amortization = calculateAmortization(loanAmount, annualRate, term, extraPayment)

    const monthlyTax = propertyTaxMode === 'dollar'
      ? parseNumericInput(values.propertyTaxDollar, 0) / 12
      : (homePrice * parseNumericInput(values.propertyTaxPercent, 0) / 100) / 12

    const monthlyInsurance = insuranceMode === 'dollar'
      ? parseNumericInput(values.insuranceDollar, 0) / 12
      : (homePrice * parseNumericInput(values.insurancePercent, 0) / 100) / 12
    const monthlyHOA = parseNumericInput(values.hoaDues, 0)

    const totalMonthly = amortization.monthlyPayment + monthlyTax + monthlyInsurance + monthlyHOA + extraPayment

    // Calculate payment per period based on frequency
    const periodsPerYear = getPeriodsPerYear(paymentFrequency)
    const paymentPerPeriod = adjustPaymentForFrequency(totalMonthly, paymentFrequency)

    // Calculate early payoff strategy
    const additionalMonthly = parseNumericInput(values.additionalMonthly, 0)
    const lumpSumAmount = parseNumericInput(values.lumpSumAmount, 0)
    
    const earlyPayoffStrategy = calculateEarlyPayoffStrategy(
      loanAmount,
      annualRate,
      term,
      additionalMonthly,
      earlyPayoffFrequency,
      lumpSumAmount,
      lumpSumFrequency
    )

    setResults({
      totalMonthlyPayment: totalMonthly,
      principalInterest: amortization.monthlyPayment,
      propertyTax: monthlyTax,
      insurance: monthlyInsurance,
      hoaDues: monthlyHOA,
      loanAmount,
      vaFundingFeeAmount,
      finalMortgageAmount,
      paymentPerPeriod,
      periodsPerYear,
      extraPayment,
      totalInterestPaid: amortization.totalInterest,
      actualTermMonths: amortization.actualTermMonths,
      earlyPayoffSavings: earlyPayoffStrategy.savings,
      earlyPayoffPaymentAmount: earlyPayoffStrategy.newPaymentAmount,
      loanTermReduction: earlyPayoffStrategy.termReduction
    })
  }

  // Colors for donut chart
  const chartColors = {
    pi: '#E97451',
    tax: '#51C2E9',
    insurance: '#E94D8A',
    hoa: '#51E9B4',
    extra: '#9333EA'
  }

  const getDonutGradient = () => {
    const total = results.principalInterest + results.propertyTax + results.insurance + results.hoaDues + results.extraPayment
    if (total === 0) return 'conic-gradient(#e5e7eb 100%)'

    let piPercent = (results.principalInterest / total) * 100
    let taxPercent = (results.propertyTax / total) * 100
    let insPercent = (results.insurance / total) * 100
    let hoaPercent = (results.hoaDues / total) * 100
    let extraPercent = (results.extraPayment / total) * 100

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
    if (extraPercent > 0) {
      segments.push(`${chartColors.extra} ${accumulated}% 100%`)
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
                  <button
                    className={`${styles.toggleBtn} ${paymentFrequency === 'monthly' ? styles.active : ''}`}
                    onClick={() => setPaymentFrequency('monthly')}
                  >
                    Monthly
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${paymentFrequency === 'bi-weekly' ? styles.active : ''}`}
                    onClick={() => setPaymentFrequency('bi-weekly')}
                  >
                    Bi-weekly
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${paymentFrequency === 'weekly' ? styles.active : ''}`}
                    onClick={() => setPaymentFrequency('weekly')}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <div className={styles.dateField}>
                <label className={styles.fieldLabel}>First Payment Date</label>
                <input
                  type="date"
                  value={firstPaymentDate ? firstPaymentDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    try {
                      const selectedDate = e.target.value ? new Date(e.target.value) : getDefaultFirstPaymentDate()
                      // Validate date is not invalid
                      if (isNaN(selectedDate.getTime())) {
                        setFirstPaymentDate(getDefaultFirstPaymentDate())
                      } else {
                        setFirstPaymentDate(selectedDate)
                      }
                    } catch {
                      // Handle invalid dates by using default
                      setFirstPaymentDate(getDefaultFirstPaymentDate())
                    }
                  }}
                  className={styles.dateInput}
                />
              </div>

              <Input
                label="Extra Payment Per Month"
                type="number"
                value={values.extraPaymentPerMonth}
                onChange={(value) => handleChange('extraPaymentPerMonth', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Interest Rate"
                type="number"
                value={values.interestRate}
                onChange={(value) => handleChange('interestRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.radioField}>
                <label className={styles.fieldLabel}>This is my...</label>
                <div className={styles.radioOptions}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="vaFundingFeeType"
                      value="first-time"
                      checked={vaFundingFeeType === 'first-time'}
                      onChange={(e) => setVaFundingFeeType(e.target.value as VAFundingFeeType)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>First Time Use of a VA Loan</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="vaFundingFeeType"
                      value="subsequent"
                      checked={vaFundingFeeType === 'subsequent'}
                      onChange={(e) => setVaFundingFeeType(e.target.value as VAFundingFeeType)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>I have used a VA loan before</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="vaFundingFeeType"
                      value="exempt"
                      checked={vaFundingFeeType === 'exempt'}
                      onChange={(e) => setVaFundingFeeType(e.target.value as VAFundingFeeType)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>I am exempt from the VA funding fee</span>
                  </label>
                </div>
              </div>

              <div className={styles.displayField}>
                <label className={styles.fieldLabel}>VA Funding Fee</label>
                <div className={styles.displayValue}>
                  ${formatCurrency(results.vaFundingFeeAmount)}
                </div>
              </div>

              <div className={styles.displayField}>
                <label className={styles.fieldLabel}>Final Mortgage Amount</label>
                <div className={styles.displayValue}>
                  ${formatCurrency(results.finalMortgageAmount)}
                </div>
              </div>

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Property Tax</label>
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
                    value={values.propertyTaxDollar}
                    onChange={(value) => handleChange('propertyTaxDollar', value)}
                    placeholder="0"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.propertyTaxPercent}
                    onChange={(value) => handleChange('propertyTaxPercent', value)}
                    placeholder="0"
                    fullWidth
                  />
                )}
              </div>

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Homeowners Insurance</label>
                <div className={styles.toggleButtons}>
                  <button
                    className={`${styles.toggleBtn} ${insuranceMode === 'dollar' ? styles.active : ''}`}
                    onClick={() => setInsuranceMode('dollar')}
                  >
                    $
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${insuranceMode === 'percent' ? styles.active : ''}`}
                    onClick={() => setInsuranceMode('percent')}
                  >
                    %
                  </button>
                </div>
                {insuranceMode === 'dollar' ? (
                  <Input
                    label=""
                    type="number"
                    value={values.insuranceDollar}
                    onChange={(value) => handleChange('insuranceDollar', value)}
                    placeholder="0"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.insurancePercent}
                    onChange={(value) => handleChange('insurancePercent', value)}
                    placeholder="0"
                    fullWidth
                  />
                )}
              </div>

              <Input
                label="HOA Dues"
                type="number"
                value={values.hoaDues}
                onChange={(value) => handleChange('hoaDues', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
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
                  // Add chart data for PDF generation
                  const chartSegments = []
                  if (results.principalInterest > 0) {
                    chartSegments.push({
                      label: 'Principal & Interest',
                      value: results.principalInterest,
                      color: chartColors.pi
                    })
                  }
                  if (results.propertyTax > 0) {
                    chartSegments.push({
                      label: 'Taxes',
                      value: results.propertyTax,
                      color: chartColors.tax
                    })
                  }
                  if (results.insurance > 0) {
                    chartSegments.push({
                      label: 'Insurance',
                      value: results.insurance,
                      color: chartColors.insurance
                    })
                  }
                  if (results.hoaDues > 0) {
                    chartSegments.push({
                      label: 'HOA Dues',
                      value: results.hoaDues,
                      color: chartColors.hoa
                    })
                  }
                  if (results.extraPayment > 0) {
                    chartSegments.push({
                      label: 'Extra Payment',
                      value: results.extraPayment,
                      color: chartColors.extra
                    })
                  }
                  return {
                    ...exportData,
                    chartData: { segments: chartSegments }
                  }
                }}
              />
            </div>

            <div ref={chartRef} className={styles.pieChart}>
              <div className={styles.donut} style={{ background: getDonutGradient() }}>
                <div className={styles.centerAmount}>
                  <div className={styles.centerLabel}>Payment</div>
                  <div className={styles.centerValue}>
                    ${formatCurrency(results.paymentPerPeriod)}
                  </div>
                  <div className={styles.centerPerMonth}>{getFrequencyLabel(paymentFrequency)}</div>
                </div>
              </div>
            </div>

            <div className={styles.breakdownLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.pi }}></span>
                <span className={styles.legendLabel}>Principal & Interest</span>
                <span className={styles.legendValue}>${formatCurrency(adjustPaymentForFrequency(results.principalInterest, paymentFrequency))}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.tax }}></span>
                <span className={styles.legendLabel}>Taxes</span>
                <span className={styles.legendValue}>${formatCurrency(adjustPaymentForFrequency(results.propertyTax, paymentFrequency))}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.insurance }}></span>
                <span className={styles.legendLabel}>Insurance</span>
                <span className={styles.legendValue}>${formatCurrency(adjustPaymentForFrequency(results.insurance, paymentFrequency))}</span>
              </div>
              {results.hoaDues > 0 && (
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: chartColors.hoa }}></span>
                  <span className={styles.legendLabel}>HOA Dues</span>
                  <span className={styles.legendValue}>${formatCurrency(adjustPaymentForFrequency(results.hoaDues, paymentFrequency))}</span>
                </div>
              )}
              {results.extraPayment > 0 && (
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: chartColors.extra }}></span>
                  <span className={styles.legendLabel}>Extra Payment</span>
                  <span className={styles.legendValue}>${formatCurrency(adjustPaymentForFrequency(results.extraPayment, paymentFrequency))}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultCards}>
            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Total Payment</div>
              <div className={styles.resultValue}>${formatCurrency(results.totalMonthlyPayment * results.actualTermMonths)}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Total Loan Amount</div>
              <div className={styles.resultValue}>${formatCurrency(results.finalMortgageAmount)}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Total Interest Paid</div>
              <div className={styles.resultValue}>${formatCurrency(results.totalInterestPaid)}</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Monthly Payment</div>
              <div className={styles.resultValue}>${formatCurrency(results.totalMonthlyPayment)}</div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Monthly Payment Summary</div>
            <div className={styles.summaryItems}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Home Value</span>
                <span className={styles.summaryItemValue}>
                  ${formatCurrency(parseNumericInput(values.homePrice, 0))}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Mortgage Amount</span>
                <span className={styles.summaryItemValue}>
                  ${formatCurrency(results.finalMortgageAmount)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Monthly Principal & Interest</span>
                <span className={styles.summaryItemValue}>
                  ${formatCurrency(results.principalInterest)}
                </span>
              </div>
              {results.extraPayment > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>Monthly Extra Payment</span>
                  <span className={styles.summaryItemValue}>
                    ${formatCurrency(results.extraPayment)}
                  </span>
                </div>
              )}
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Monthly Property Tax</span>
                <span className={styles.summaryItemValue}>
                  ${formatCurrency(results.propertyTax)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryItemLabel}>Monthly Home Insurance</span>
                <span className={styles.summaryItemValue}>
                  ${formatCurrency(results.insurance)}
                </span>
              </div>
              {results.hoaDues > 0 && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>Monthly HOA Fees</span>
                  <span className={styles.summaryItemValue}>
                    ${formatCurrency(results.hoaDues)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Early Payoff Strategy</div>
            
            <div className={styles.earlyPayoffResults}>
              <div className={styles.earlyPayoffResultItem}>
                <span className={styles.earlyPayoffResultLabel}>Savings</span>
                <span className={styles.earlyPayoffResultValue}>
                  ${formatCurrency(results.earlyPayoffSavings)}
                </span>
              </div>
              <div className={styles.earlyPayoffResultItem}>
                <span className={styles.earlyPayoffResultLabel}>Payment Amount</span>
                <span className={styles.earlyPayoffResultValue}>
                  ${formatCurrency(results.earlyPayoffPaymentAmount)}
                </span>
              </div>
              <div className={styles.earlyPayoffResultItem}>
                <span className={styles.earlyPayoffResultLabel}>Shorten Loan Term By</span>
                <span className={styles.earlyPayoffResultValue}>
                  {(() => {
                    const months = Math.abs(results.loanTermReduction)
                    const years = Math.floor(months / 12)
                    const remainingMonths = months % 12
                    if (years === 0) return `${remainingMonths} months`
                    if (remainingMonths === 0) return `${years} years`
                    return `${years} years, ${remainingMonths} months`
                  })()}
                </span>
              </div>
            </div>

            <div className={styles.earlyPayoffInputs}>
              <div className={styles.earlyPayoffInputField}>
                <Input
                  label="Additional Monthly"
                  type="number"
                  value={values.additionalMonthly}
                  onChange={(value) => handleChange('additionalMonthly', value)}
                  icon={<Icon icon={FaDollarSign} size="sm" />}
                  fullWidth
                />
              </div>

              <div className={styles.earlyPayoffDropdown}>
                <label className={styles.fieldLabel}>Increase Frequency</label>
                <select
                  value={earlyPayoffFrequency}
                  onChange={(e) => setEarlyPayoffFrequency(e.target.value as PaymentFrequency)}
                  className={styles.selectInput}
                >
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className={styles.earlyPayoffSubsection}>
                <div className={styles.subsectionTitle}>Lump Sum Payment</div>
                
                <div className={styles.earlyPayoffInputField}>
                  <Input
                    label="Lump Sum Addition"
                    type="number"
                    value={values.lumpSumAmount}
                    onChange={(value) => handleChange('lumpSumAmount', value)}
                    icon={<Icon icon={FaDollarSign} size="sm" />}
                    fullWidth
                  />
                </div>

                <div className={styles.earlyPayoffDropdown}>
                  <label className={styles.fieldLabel}>Frequency</label>
                  <select
                    value={lumpSumFrequency}
                    onChange={(e) => setLumpSumFrequency(e.target.value as LumpSumFrequency)}
                    className={styles.selectInput}
                  >
                    <option value="one-time">One time</option>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>VA Loan Benefits</div>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#1f2937' }}>
              <p style={{ marginBottom: '0.75rem', color: '#1f2937' }}>
                VA loans offer significant advantages for eligible veterans and service members:
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#1f2937' }}>
                <li style={{ marginBottom: '0.5rem' }}>No down payment required (0% down)</li>
                <li style={{ marginBottom: '0.5rem' }}>No private mortgage insurance (PMI)</li>
                <li style={{ marginBottom: '0.5rem' }}>Competitive interest rates</li>
                <li style={{ marginBottom: '0.5rem' }}>Limited closing costs</li>
                <li>Easier qualification requirements</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
