'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
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
import { refinanceConfig } from '@/lib/calculators/configs/refinance.config'
import styles from './refinance.module.css'

type LoanType = 'conventional' | 'fha' | 'va' | 'usda' | 'jumbo'
type TermMode = 'year' | 'month'

export default function RefinanceCalculator() {
  const [activeLoanType, setActiveLoanType] = useState<LoanType>('conventional')
  const [loanTermMode, setLoanTermMode] = useState<TermMode>('year')

  const [values, setValues] = useState({
    currentLoanBalance: '200000',
    currentInterestRate: '7',
    currentRemainingTermYear: '25',
    currentRemainingTermMonth: '300',
    newInterestRate: '5',
    newLoanTermYear: '30',
    newLoanTermMonth: '360',
    closingCosts: '5000',
    propertyTaxYearly: '1200',
    homeownersInsurance: '1200',
    pmi: '0',
    hoaDues: '0'
  })

  const [results, setResults] = useState({
    currentMonthlyPayment: 0,
    newMonthlyPayment: 0,
    monthlySavings: 0,
    totalSavings: 0,
    breakEvenMonths: 0,
    currentPrincipalInterest: 0,
    newPrincipalInterest: 0,
    currentTaxes: 0,
    newTaxes: 0,
    currentInsurance: 0,
    newInsurance: 0,
    currentHOA: 0,
    newHOA: 0,
    currentPMI: 0,
    newPMI: 0
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Auto-calculate when loan term mode changes
  useEffect(() => {
    if (loanTermMode === 'year') {
      const currentMonths = parseFloat(values.currentRemainingTermMonth) || 300
      const newMonths = parseFloat(values.newLoanTermMonth) || 360
      setValues(prev => ({
        ...prev,
        currentRemainingTermYear: (currentMonths / 12).toFixed(0),
        newLoanTermYear: (newMonths / 12).toFixed(0)
      }))
    } else {
      const currentYears = parseFloat(values.currentRemainingTermYear) || 25
      const newYears = parseFloat(values.newLoanTermYear) || 30
      setValues(prev => ({
        ...prev,
        currentRemainingTermMonth: (currentYears * 12).toFixed(0),
        newLoanTermMonth: (newYears * 12).toFixed(0)
      }))
    }
  }, [loanTermMode])

  // Auto-calculate results whenever values change
  useEffect(() => {
    calculateResults()
  }, [values, activeLoanType, loanTermMode])

  const calculateResults = () => {
    const loanBalance = parseFloat(values.currentLoanBalance) || 0

    // Current loan calculations
    const currentRate = (parseFloat(values.currentInterestRate) || 0) / 100 / 12
    const currentTerm = loanTermMode === 'year'
      ? (parseFloat(values.currentRemainingTermYear) || 25) * 12
      : parseFloat(values.currentRemainingTermMonth) || 300

    const currentMonthlyPI = currentRate === 0
      ? loanBalance / currentTerm
      : loanBalance * (currentRate * Math.pow(1 + currentRate, currentTerm)) / (Math.pow(1 + currentRate, currentTerm) - 1)

    // New loan calculations
    const newRate = (parseFloat(values.newInterestRate) || 0) / 100 / 12
    const newTerm = loanTermMode === 'year'
      ? (parseFloat(values.newLoanTermYear) || 30) * 12
      : parseFloat(values.newLoanTermMonth) || 360

    const newMonthlyPI = newRate === 0
      ? loanBalance / newTerm
      : loanBalance * (newRate * Math.pow(1 + newRate, newTerm)) / (Math.pow(1 + newRate, newTerm) - 1)

    // Property tax, insurance, HOA (same for both)
    const monthlyTax = (parseFloat(values.propertyTaxYearly) || 0) / 12
    const monthlyInsurance = (parseFloat(values.homeownersInsurance) || 0) / 12
    const monthlyHOA = parseFloat(values.hoaDues) || 0

    // PMI/MIP calculations based on loan type
    let currentPMI = 0
    let newPMI = 0

    // User can manually input PMI for all loan types
    const manualPMI = (parseFloat(values.pmi) || 0) / 12

    if (activeLoanType === 'conventional') {
      // Conventional: Use manual PMI if provided, otherwise estimate at 0.5% annually
      // Note: PMI typically required if LTV > 80%, but we don't have home value to calculate LTV
      currentPMI = manualPMI > 0 ? manualPMI : (loanBalance * 0.005) / 12
      newPMI = manualPMI > 0 ? manualPMI : (loanBalance * 0.005) / 12
    } else if (activeLoanType === 'fha') {
      // FHA: Mortgage Insurance Premium (MIP) - 0.85% annual for most loans
      // FHA MIP is required for the life of the loan if down payment < 10%
      // Use manual input if provided, otherwise use standard 0.85% rate
      currentPMI = manualPMI > 0 ? manualPMI : (loanBalance * 0.0085) / 12
      newPMI = manualPMI > 0 ? manualPMI : (loanBalance * 0.0085) / 12
    } else if (activeLoanType === 'va') {
      // VA: No monthly PMI/MIP
      // VA loans have a one-time funding fee (not monthly), so no PMI
      currentPMI = 0
      newPMI = 0
    } else if (activeLoanType === 'usda') {
      // USDA: Annual guarantee fee of 0.35%
      // Use manual input if provided, otherwise use standard 0.35% rate
      currentPMI = manualPMI > 0 ? manualPMI : (loanBalance * 0.0035) / 12
      newPMI = manualPMI > 0 ? manualPMI : (loanBalance * 0.0035) / 12
    } else if (activeLoanType === 'jumbo') {
      // Jumbo: Typically no PMI if borrower has 20% equity
      // Use manual input if provided, otherwise assume no PMI (most jumbo borrowers have sufficient equity)
      currentPMI = manualPMI
      newPMI = manualPMI
    }

    const currentTotal = currentMonthlyPI + monthlyTax + monthlyInsurance + currentPMI + monthlyHOA
    const newTotal = newMonthlyPI + monthlyTax + monthlyInsurance + newPMI + monthlyHOA

    const monthlySavings = currentTotal - newTotal
    const closingCosts = parseFloat(values.closingCosts) || 0
    const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : 0
    const totalSavingsOverLife = monthlySavings * newTerm - closingCosts

    setResults({
      currentMonthlyPayment: currentTotal,
      newMonthlyPayment: newTotal,
      monthlySavings,
      totalSavings: totalSavingsOverLife,
      breakEvenMonths,
      currentPrincipalInterest: currentMonthlyPI,
      newPrincipalInterest: newMonthlyPI,
      currentTaxes: monthlyTax,
      newTaxes: monthlyTax,
      currentInsurance: monthlyInsurance,
      newInsurance: monthlyInsurance,
      currentHOA: monthlyHOA,
      newHOA: monthlyHOA,
      currentPMI,
      newPMI
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
    currentPI: '#E97451',
    newPI: '#51C2E9',
    tax: '#E94D8A',
    insurance: '#51E9B4',
    hoa: '#F4D03F'
  }

  const getDonutGradient = () => {
    const total = results.currentPrincipalInterest + results.newPrincipalInterest + results.currentTaxes + results.currentInsurance + results.currentHOA
    if (total === 0) return 'conic-gradient(#e5e7eb 100%)'

    let currentPIPercent = (results.currentPrincipalInterest / total) * 100
    let newPIPercent = (results.newPrincipalInterest / total) * 100
    let taxPercent = (results.currentTaxes / total) * 100
    let insPercent = (results.currentInsurance / total) * 100
    let hoaPercent = (results.currentHOA / total) * 100

    let accumulated = 0
    const segments = []

    if (currentPIPercent > 0) {
      segments.push(`${chartColors.currentPI} 0% ${currentPIPercent}%`)
      accumulated = currentPIPercent
    }
    if (newPIPercent > 0) {
      segments.push(`${chartColors.newPI} ${accumulated}% ${accumulated + newPIPercent}%`)
      accumulated += newPIPercent
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
    <CalculatorLayout config={refinanceConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h2 className={styles.cardTitle}>Refinance Calculator</h2>

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
                label="Current Loan Balance"
                type="number"
                value={values.currentLoanBalance}
                onChange={(value) => handleChange('currentLoanBalance', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Current Interest Rate"
                type="number"
                value={values.currentInterestRate}
                onChange={(value) => handleChange('currentInterestRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>Current Remaining Term</label>
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
                    value={values.currentRemainingTermYear}
                    onChange={(value) => handleChange('currentRemainingTermYear', value)}
                    placeholder="25"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.currentRemainingTermMonth}
                    onChange={(value) => handleChange('currentRemainingTermMonth', value)}
                    placeholder="300"
                    fullWidth
                  />
                )}
              </div>

              <Input
                label="New Interest Rate"
                type="number"
                value={values.newInterestRate}
                onChange={(value) => handleChange('newInterestRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.toggleField}>
                <label className={styles.fieldLabel}>New Loan Term</label>
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
                    value={values.newLoanTermYear}
                    onChange={(value) => handleChange('newLoanTermYear', value)}
                    placeholder="30"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.newLoanTermMonth}
                    onChange={(value) => handleChange('newLoanTermMonth', value)}
                    placeholder="360"
                    fullWidth
                  />
                )}
              </div>

              <Input
                label="Closing Costs"
                type="number"
                value={values.closingCosts}
                onChange={(value) => handleChange('closingCosts', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Property Tax (Yearly)"
                type="number"
                value={values.propertyTaxYearly}
                onChange={(value) => handleChange('propertyTaxYearly', value)}
                placeholder="1200"
                fullWidth
              />

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

        {/* Center Panel - Payment Comparison */}
        <div className={styles.centerPanel}>
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Payment Comparison</h3>

            <div className={styles.pieChart}>
              <div className={styles.donut} style={{ background: getDonutGradient() }}>
                <div className={styles.centerAmount}>
                  <div className={styles.paymentAmount}>
                    ${results.monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={styles.perMonth}>monthly savings</div>
                </div>
              </div>
            </div>

            <div className={styles.breakdownLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.currentPI }}></span>
                <span className={styles.legendLabel}>Current P&I</span>
                <span className={styles.legendValue}>${results.currentPrincipalInterest.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.newPI }}></span>
                <span className={styles.legendLabel}>New P&I</span>
                <span className={styles.legendValue}>${results.newPrincipalInterest.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.tax }}></span>
                <span className={styles.legendLabel}>Taxes (Both)</span>
                <span className={styles.legendValue}>${results.currentTaxes.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.insurance }}></span>
                <span className={styles.legendLabel}>Insurance (Both)</span>
                <span className={styles.legendValue}>${results.currentInsurance.toFixed(2)}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: chartColors.hoa }}></span>
                <span className={styles.legendLabel}>HOA (Both)</span>
                <span className={styles.legendValue}>${results.currentHOA.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultCards}>
            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Current Payment</div>
              <div className={styles.resultValue}>${results.currentMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>New Payment</div>
              <div className={styles.resultValue}>${results.newMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Monthly Savings</div>
              <div className={styles.resultValue}>${results.monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Break-Even Point</div>
              <div className={styles.resultValue}>{results.breakEvenMonths.toFixed(0)} months</div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.sliderCard}>
            <div className={styles.sliderLabel}>
              <span>Closing Costs</span>
              <span className={styles.sliderValue}>${parseFloat(values.closingCosts).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={values.closingCosts}
              onChange={(e) => handleChange('closingCosts', e.target.value)}
              className={styles.slider}
            />
          </Card>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Summary:</div>
            <p className={styles.summaryText}>
              By refinancing your current{' '}
              <strong style={{ color: '#5B9BD5' }}>
                {activeLoanType === 'conventional' && 'Conventional Loan'}
                {activeLoanType === 'fha' && 'FHA Loan'}
                {activeLoanType === 'va' && 'VA Loan'}
                {activeLoanType === 'usda' && 'USDA Loan'}
                {activeLoanType === 'jumbo' && 'Jumbo Loan'}
              </strong>{' '}
              from <strong>{values.currentInterestRate}%</strong> to{' '}
              <strong>{values.newInterestRate}%</strong>, you would save{' '}
              <strong>${results.monthlySavings.toFixed(2)}/month</strong>. Your break-even point
              is <strong>{results.breakEvenMonths.toFixed(0)} months</strong> with closing costs of{' '}
              <strong>${parseFloat(values.closingCosts).toLocaleString()}</strong>.
              {results.totalSavings > 0 && (
                <> You would save <strong>${results.totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> over the life of the loan.</>
              )}
            </p>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
