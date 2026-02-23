'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Icon } from '@/components/design-system/Icon'
import {
  FaDollarSign,
  FaPercent,
  FaCalendar
} from 'react-icons/fa'
import { vaRefinanceConfig } from '@/lib/calculators/configs/vaRefinance.config'
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
import styles from './va-refinance.module.css'

type TermMode = 'year' | 'month'
type Priority = 'payment' | 'interest'

export default function VARefinanceCalculator() {
  const { chartRef, getExportData } = useCalculatorExport('VA Refinance')
  
  const [loanTermMode, setLoanTermMode] = useState<TermMode>('year')
  const [priority, setPriority] = useState<Priority>('interest')
  const [loanStartDate, setLoanStartDate] = useState('2022-03')
  const [values, setValues] = useState({
    currentBalance: '300000',
    currentRate: '5',
    currentTermYears: '30',
    currentTermMonths: '360',
    newRate: '5',
    cashOut: '0'
  })

  const [results, setResults] = useState({
    currentPayment: 0,
    newPayment: 0,
    monthlyIncrease: 0,
    totalInterestDiff: 0,
    monthsToRecoup: 0,
    remainingTerm: 360,
    newLoanTerm: 360
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Auto-sync loan term
  useEffect(() => {
    if (loanTermMode === 'year') {
      const months = parseFloat(values.currentTermMonths) || 0
      setValues(prev => ({ ...prev, currentTermYears: (months / 12).toFixed(0) }))
    } else {
      const years = parseFloat(values.currentTermYears) || 0
      setValues(prev => ({ ...prev, currentTermMonths: (years * 12).toFixed(0) }))
    }
  }, [loanTermMode])

  // Auto-calculate
  useEffect(() => {
    calculateResults()
  }, [values, loanTermMode, priority, loanStartDate])

  const calculateResults = () => {
    const currentBalance = parseFloat(values.currentBalance) || 0
    const currentRate = (parseFloat(values.currentRate) || 0) / 100 / 12
    const newRate = (parseFloat(values.newRate) || 0) / 100 / 12
    const originalTerm = loanTermMode === 'year'
      ? (parseFloat(values.currentTermYears) || 30) * 12
      : parseFloat(values.currentTermMonths) || 360

    // Calculate months elapsed since loan start date
    const [startYear, startMonth] = loanStartDate.split('-').map(Number)
    const startDate = new Date(startYear, startMonth - 1)
    const currentDate = new Date()
    const monthsElapsed = Math.max(0, 
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
      (currentDate.getMonth() - startDate.getMonth())
    )

    // Calculate remaining term for current loan
    const remainingTerm = Math.max(1, originalTerm - monthsElapsed)

    // Calculate current payment based on original loan
    const currentPayment = currentRate === 0
      ? currentBalance / remainingTerm
      : currentBalance * (currentRate * Math.pow(1 + currentRate, remainingTerm)) / (Math.pow(1 + currentRate, remainingTerm) - 1)

    // Determine new loan term based on priority
    let newLoanTerm = originalTerm
    if (priority === 'payment') {
      // Lower monthly payment: use full original term
      newLoanTerm = originalTerm
    } else {
      // Lower interest paid: use remaining term to pay off faster
      newLoanTerm = remainingTerm
    }

    // Calculate new payment
    const newPayment = newRate === 0
      ? currentBalance / newLoanTerm
      : currentBalance * (newRate * Math.pow(1 + newRate, newLoanTerm)) / (Math.pow(1 + newRate, newLoanTerm) - 1)

    const monthlyIncrease = newPayment - currentPayment
    
    // Calculate total interest for remaining term
    const currentRemainingInterest = (currentPayment * remainingTerm) - currentBalance
    const newTotalInterest = (newPayment * newLoanTerm) - currentBalance
    const totalInterestDiff = newTotalInterest - currentRemainingInterest

    // Calculate time to recoup closing costs
    const closingCosts = parseFloat(values.cashOut) || 0
    const monthlySavings = Math.abs(monthlyIncrease)
    const monthsToRecoup = monthlySavings > 0 ? closingCosts / monthlySavings : 0

    setResults({
      currentPayment,
      newPayment,
      monthlyIncrease,
      totalInterestDiff,
      monthsToRecoup,
      remainingTerm,
      newLoanTerm
    })
  }

  const maxPayment = Math.max(results.currentPayment, results.newPayment)

  return (
    <CalculatorLayout config={vaRefinanceConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h2 className={styles.cardTitle}>VA Refinance Calculator</h2>

            <div className={styles.inputFields}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e7eb', marginBottom: '-0.5rem' }}>
                What is most important to you?
              </h3>
              <div className={styles.selectField}>
                <select 
                  className={styles.select}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  <option value="interest">Lower Interest Paid</option>
                  <option value="payment">Low Monthly Payment</option>
                </select>
              </div>

              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e7eb', marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Current Loan
              </h3>

              <Input
                label="Original Loan Amount"
                type="number"
                value={values.currentBalance}
                onChange={(value) => handleChange('currentBalance', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Original Rate"
                type="number"
                value={values.currentRate}
                onChange={(value) => handleChange('currentRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Original Loan Term</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: loanTermMode === 'year' ? '#8B6F14' : '#374151',
                      color: loanTermMode === 'year' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setLoanTermMode('year')}
                  >
                    Year
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: loanTermMode === 'month' ? '#8B6F14' : '#374151',
                      color: loanTermMode === 'month' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setLoanTermMode('month')}
                  >
                    Month
                  </button>
                </div>
                {loanTermMode === 'year' ? (
                  <Input
                    label=""
                    type="number"
                    value={values.currentTermYears}
                    onChange={(value) => handleChange('currentTermYears', value)}
                    placeholder="30"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.currentTermMonths}
                    onChange={(value) => handleChange('currentTermMonths', value)}
                    placeholder="360"
                    fullWidth
                  />
                )}
              </div>

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Loan Start Date</label>
                <input
                  type="month"
                  className={styles.select}
                  value={loanStartDate}
                  onChange={(e) => setLoanStartDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 7)}
                />
              </div>

              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e5e7eb', marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                New Loan
              </h3>

              <Input
                label="New Interest Rate"
                type="number"
                value={values.newRate}
                onChange={(value) => handleChange('newRate', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Estimated Closing Costs</label>
                <Input
                  label=""
                  type="number"
                  value={values.cashOut}
                  onChange={(value) => handleChange('cashOut', value)}
                  placeholder="0"
                  fullWidth
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Center Panel - Payment Comparison */}
        <div className={styles.centerPanel}>
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Monthly Payment Comparison</h3>

            <div className={styles.comparisonBars}>
              <div className={styles.barRow}>
                <div className={styles.barLabel}>
                  <span>Current Loan</span>
                  <span className={styles.barAmount}>${results.currentPayment.toFixed(2)}</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={`${styles.barFill} ${styles.currentBar}`}
                    style={{ width: maxPayment > 0 ? `${(results.currentPayment / maxPayment) * 100}%` : '0%' }}
                  >
                    ${results.currentPayment.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className={styles.barRow}>
                <div className={styles.barLabel}>
                  <span>New Loan</span>
                  <span className={styles.barAmount}>${results.newPayment.toFixed(2)}</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={`${styles.barFill} ${styles.newBar}`}
                    style={{ width: maxPayment > 0 ? `${(results.newPayment / maxPayment) * 100}%` : '0%' }}
                  >
                    ${results.newPayment.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.breakdownSection}>
              <h4 className={styles.breakdownTitle}>Total Interest Comparison</h4>
              <div className={styles.breakdownLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#ef4444' }}></span>
                  <span className={styles.legendLabel}>Current Loan Remaining Interest</span>
                  <span className={styles.legendValue}>${((results.currentPayment * results.remainingTerm) - parseFloat(values.currentBalance) || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></span>
                  <span className={styles.legendLabel}>New Loan Interest</span>
                  <span className={styles.legendValue}>${((results.newPayment * results.newLoanTerm) - parseFloat(values.currentBalance) || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }}></span>
                  <span className={styles.legendLabel}>Monthly Payment Difference</span>
                  <span className={styles.legendValue}>${Math.abs(results.monthlyIncrease).toFixed(2)}</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#8b5cf6' }}></span>
                  <span className={styles.legendLabel}>Total Interest Difference</span>
                  <span className={styles.legendValue}>${Math.abs(results.totalInterestDiff).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.resultsPanel}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <ExportPDFButton 
              getCalculatorData={() => getExportData(values, results)}
            />
          </div>
          <div className={styles.resultCards}>
            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Monthly Payment Increase</div>
              <div className={styles.resultValue}>
                {results.monthlyIncrease >= 0 ? '+' : ''}$ {results.monthlyIncrease.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Total Interest Difference</div>
              <div className={styles.resultValue}>
                {results.totalInterestDiff >= 0 ? '+' : '-'}$ {Math.abs(results.totalInterestDiff).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Refinance Costs</div>
              <div className={styles.resultValue}>$ {parseFloat(values.cashOut || '0').toLocaleString()}</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Time to Recoup Fees</div>
              <div className={styles.resultValue}>
                {results.monthsToRecoup > 0 && results.monthsToRecoup < 1000
                  ? `${Math.ceil(results.monthsToRecoup)} months`
                  : '--'}
              </div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Summary:</div>
            <p className={styles.summaryText}>
              Your monthly payment will {results.monthlyIncrease >= 0 ? 'increase' : 'decrease'} by <strong>${Math.abs(results.monthlyIncrease).toFixed(2)}</strong> per month.
              Overall expenses (incurred and interest) are significantly <strong>{results.totalInterestDiff >= 0 ? 'higher' : 'lower'}</strong>{results.monthsToRecoup > 0 && results.monthsToRecoup < 1000 ? `, and you'll recoup closing costs in ${Math.ceil(results.monthsToRecoup)} months` : ''}.
            </p>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
