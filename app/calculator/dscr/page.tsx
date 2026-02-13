'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Icon } from '@/components/design-system/Icon'
import {
  FaBuilding,
  FaDollarSign,
  FaPercent,
  FaKey
} from 'react-icons/fa'
import { dscrConfig } from '@/lib/calculators/configs/dscr.config'
import styles from './dscr.module.css'

export default function DSCRCalculator() {
  const [values, setValues] = useState({
    units: '1',
    purchaseOrRefi: 'purchase',
    propertyPrice: '500000',
    loanToValue: '80',
    unitRent: '2500',
    annualTaxes: '4000',
    annualInsurance: '3000',
    monthlyHOA: '0',
    vacancyRate: '5',
    repairs: '800',
    utilities: '5000',
    loanToValue2: '80'
  })

  const [results, setResults] = useState({
    cashFlow: 0,
    capRate: 0,
    cashOnCashReturn: 0,
    dscr: 0,
    loanAmount: 0,
    downPayment: 0,
    mortgagePayment: 0,
    monthlyPayment: 0,
    totalClosingCosts: 0,
    cashNeeded: 0
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Auto-calculate
  useEffect(() => {
    calculateResults()
  }, [values])

  const calculateResults = () => {
    const propertyPrice = parseFloat(values.propertyPrice) || 0
    const ltv = parseFloat(values.loanToValue) || 80
    const units = parseFloat(values.units) || 1
    const unitRent = parseFloat(values.unitRent) || 0
    const annualTaxes = parseFloat(values.annualTaxes) || 0
    const annualInsurance = parseFloat(values.annualInsurance) || 0
    const monthlyHOA = parseFloat(values.monthlyHOA) || 0
    const vacancyRate = (parseFloat(values.vacancyRate) || 0) / 100
    const repairs = parseFloat(values.repairs) || 0
    const annualUtilities = parseFloat(values.utilities) || 0

    const loanAmount = propertyPrice * (ltv / 100)
    const downPayment = propertyPrice - loanAmount
    const rate = 0.075 / 12 // 7.5% annual
    const term = 30 * 12

    const mortgagePayment = rate === 0
      ? loanAmount / term
      : loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

    const monthlyRent = unitRent * units
    const monthlyTax = annualTaxes / 12
    const monthlyIns = annualInsurance / 12
    const monthlyUtilities = annualUtilities / 12
    const vacancyLoss = monthlyRent * vacancyRate

    const totalMonthlyPayment = mortgagePayment + monthlyTax + monthlyIns + monthlyHOA

    const netOperatingIncome = monthlyRent - vacancyLoss - monthlyTax - monthlyIns - repairs - monthlyUtilities - monthlyHOA
    const cashFlow = netOperatingIncome - mortgagePayment

    const dscr = totalMonthlyPayment > 0 ? netOperatingIncome / mortgagePayment : 0
    const capRate = propertyPrice > 0 ? (netOperatingIncome * 12 / propertyPrice) * 100 : 0
    const cashOnCashReturn = downPayment > 0 ? (cashFlow * 12 / downPayment) * 100 : 0

    const originationFee = loanAmount * 0.02
    const totalClosingCosts = originationFee + 14500
    const cashNeeded = downPayment + totalClosingCosts

    setResults({
      cashFlow,
      capRate,
      cashOnCashReturn,
      dscr,
      loanAmount,
      downPayment,
      mortgagePayment,
      monthlyPayment: totalMonthlyPayment,
      totalClosingCosts,
      cashNeeded
    })
  }

  return (
    <CalculatorLayout config={dscrConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h2 className={styles.cardTitle}>Debt-Service (DSCR)</h2>

            <div className={styles.inputFields}>
              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Number of Units</label>
                <select
                  className={styles.select}
                  value={values.units}
                  onChange={(e) => handleChange('units', e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Purchase or Refinance</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: values.purchaseOrRefi === 'purchase' ? '#10b981' : '#374151',
                      color: values.purchaseOrRefi === 'purchase' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleChange('purchaseOrRefi', 'purchase')}
                  >
                    Purchase
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: values.purchaseOrRefi === 'refinance' ? '#10b981' : '#374151',
                      color: values.purchaseOrRefi === 'refinance' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleChange('purchaseOrRefi', 'refinance')}
                  >
                    Refin...
                  </button>
                </div>
              </div>

              <Input
                label={`Unit ${values.units === '1' ? '' : '1'} Monthly Rent`}
                type="number"
                value={values.unitRent}
                onChange={(value) => handleChange('unitRent', value)}
                icon={<Icon icon={FaKey} size="sm" />}
                fullWidth
              />

              <Input
                label="Annual Property Taxes"
                type="number"
                value={values.annualTaxes}
                onChange={(value) => handleChange('annualTaxes', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Annual Insurance"
                type="number"
                value={values.annualInsurance}
                onChange={(value) => handleChange('annualInsurance', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Monthly HOA Fee"
                type="number"
                value={values.monthlyHOA}
                onChange={(value) => handleChange('monthlyHOA', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Vacancy Rate</label>
                <select
                  className={styles.select}
                  value={values.vacancyRate}
                  onChange={(e) => handleChange('vacancyRate', e.target.value)}
                >
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                </select>
              </div>

              <Input
                label="Annual Repairs & Mainten..."
                type="number"
                value={values.repairs}
                onChange={(value) => handleChange('repairs', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Annual Utilities"
                type="number"
                value={values.utilities}
                onChange={(value) => handleChange('utilities', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Loan to Value</label>
                <select
                  className={styles.select}
                  value={values.loanToValue2}
                  onChange={(e) => handleChange('loanToValue2', e.target.value)}
                >
                  <option value="80">80%</option>
                  <option value="75">75%</option>
                  <option value="70">70%</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Panel - Metrics */}
        <div className={styles.centerPanel}>
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Return Metrics</h3>

            <div className={styles.metricsGrid}>
              <div className={`${styles.metricCard} ${results.capRate >= 5 ? styles.metricGood : styles.metricBad}`}>
                <div className={styles.metricLabel}>Cap Rate</div>
                <div className={styles.metricValue}>{results.capRate.toFixed(1)} %</div>
              </div>

              <div className={`${styles.metricCard} ${results.cashOnCashReturn >= 0 ? styles.metricGood : styles.metricBad}`}>
                <div className={styles.metricLabel}>Cash on Cash Return</div>
                <div className={styles.metricValue}>{results.cashOnCashReturn >= 0 ? '' : '-'}{Math.abs(results.cashOnCashReturn).toFixed(2)} %</div>
              </div>

              <div className={`${styles.metricCard} ${results.dscr >= 1.25 ? styles.metricGood : results.dscr >= 1 ? styles.metricNeutral : styles.metricBad}`}>
                <div className={styles.metricLabel}>DSCR</div>
                <div className={styles.metricValue}>{results.dscr.toFixed(2)}</div>
              </div>

              <div className={`${styles.metricCard} ${results.cashFlow >= 0 ? styles.metricGood : styles.metricBad}`}>
                <div className={styles.metricLabel}>Cash Flow</div>
                <div className={styles.metricValue}>{results.cashFlow >= 0 ? '' : '-'}$ {Math.abs(results.cashFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            <div className={styles.breakdownSection}>
              <h4 className={styles.breakdownTitle}>Deal Breakdown</h4>
              <div className={styles.breakdownGrid}>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Loan Amount:</div>
                  <div className={styles.breakdownValue}>${results.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Down Payment:</div>
                  <div className={styles.breakdownValue}>${results.downPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Mortgage Payment:</div>
                  <div className={styles.breakdownValue}>${results.mortgagePayment.toFixed(2)}</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Monthly Extra Payment:</div>
                  <div className={styles.breakdownValue}>$0.00</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Origination Fee Amount:</div>
                  <div className={styles.breakdownValue}>${(results.loanAmount * 0.02).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Other Closing Costs Amount:</div>
                  <div className={styles.breakdownValue}>$15,000.00</div>
                </div>
              </div>
            </div>

            <div className={styles.breakdownSection}>
              <h4 className={styles.breakdownTitle}>Deal Metrics</h4>
              <div className={styles.breakdownGrid}>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Total Closing Costs:</div>
                  <div className={styles.breakdownValue}>${results.totalClosingCosts.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>Cash Needed to Close:</div>
                  <div className={styles.breakdownValue}>${results.cashNeeded.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultCards}>
            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Cash Flow</div>
              <div className={styles.resultValue}>{results.cashFlow >= 0 ? '' : '-'}${Math.abs(results.cashFlow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Cap Rate</div>
              <div className={styles.resultValue}>{results.capRate.toFixed(2)} %</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>Cash on Cash Return</div>
              <div className={styles.resultValue}>{results.cashOnCashReturn >= 0 ? '' : '-'}{Math.abs(results.cashOnCashReturn).toFixed(2)} %</div>
            </Card>

            <Card variant="elevated" padding="md" className={`${styles.resultCard} ${styles.singleResultCard}`}>
              <div className={styles.resultLabel}>DSCR</div>
              <div className={styles.resultValue}>{results.dscr.toFixed(2)}</div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Summary:</div>
            <p className={styles.summaryText}>
              Your debt service coverage ratio ({results.dscr.toFixed(2)}) shows your property {results.dscr >= 1.25 ? 'generates strong' : results.dscr >= 1 ? 'adequately covers' : 'does not adequately cover'} cash flow to cover debt obligations.
              The property {results.cashFlow >= 0 ? 'generates positive' : 'has negative'} cash flow of <strong>${Math.abs(results.cashFlow).toFixed(2)}</strong> per month.
            </p>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
