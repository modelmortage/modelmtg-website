'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Icon } from '@/components/design-system/Icon'
import {
  FaDollarSign,
  FaPercent,
  FaHome
} from 'react-icons/fa'
import dynamic from 'next/dynamic'
const ExportPDFButton = dynamic(() => import('@/components/ExportPDFButton'), { ssr: false })
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
import styles from './fix-flip.module.css'

const fixFlipConfig = {
  id: 'fix-flip-calculator',
  title: 'Fix & Flip Calculator',
  description: 'Calculate potential returns on fix and flip investment properties',
  icon: 'FaHome',
  inputs: [],
  calculate: () => [],
  metadata: {
    title: 'Fix & Flip Calculator',
    description: 'Calculate potential returns on fix and flip investment properties',
    keywords: ['fix and flip', 'calculator', 'real estate', 'investment']
  }
}

export default function FixFlipCalculator() {
  const { chartRef, getExportData } = useCalculatorExport('Fix & Flip')
  
  const [values, setValues] = useState({
    purchasePrice: '500000',
    renovationCost: '75000',
    afterRepairValue: '750000',
    loanLength: '6',
    annualPropertyTaxes: '4000',
    annualInsurance: '3000',
    purchasePriceLTV: '80',
    interestRate: '10.00',
    originationFee: '2.00',
    otherClosingCosts: '3.0',
    costToSell: '5'
  })

  const [results, setResults] = useState({
    borrowedEquityNeeded: 0,
    netProfit: 0,
    returnOnInvestment: 0,
    loanToAfterRepairValue: 0,
    loanAmount: 0,
    downPayment: 0,
    monthlyInterestPayment: 0,
    totalInterestOverTerm: 0,
    originationFeeAmount: 0,
    otherClosingCostsAmount: 0,
    costToSellAmount: 0,
    closingCosts: 0,
    carryingCosts: 0
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    calculateResults()
  }, [values])

  const calculateResults = () => {
    const purchasePrice = parseFloat(values.purchasePrice) || 0
    const renovationCost = parseFloat(values.renovationCost) || 0
    const afterRepairValue = parseFloat(values.afterRepairValue) || 0
    const loanLength = parseFloat(values.loanLength) || 6
    const annualTaxes = parseFloat(values.annualPropertyTaxes) || 0
    const annualInsurance = parseFloat(values.annualInsurance) || 0
    const ltv = parseFloat(values.purchasePriceLTV) || 80
    const interestRate = parseFloat(values.interestRate) || 10
    const originationFeePercent = parseFloat(values.originationFee) || 2
    const otherClosingPercent = parseFloat(values.otherClosingCosts) || 3
    const costToSellPercent = parseFloat(values.costToSell) || 5

    // Loan calculations
    const loanAmount = purchasePrice * (ltv / 100)
    const downPayment = purchasePrice - loanAmount

    // Interest calculations
    const monthlyInterestRate = (interestRate / 100) / 12
    const monthlyInterestPayment = loanAmount * monthlyInterestRate
    const totalInterestOverTerm = monthlyInterestPayment * loanLength

    // Fees and costs
    const originationFeeAmount = loanAmount * (originationFeePercent / 100)
    const otherClosingCostsAmount = purchasePrice * (otherClosingPercent / 100)
    const costToSellAmount = afterRepairValue * (costToSellPercent / 100)

    // Carrying costs (taxes + insurance for loan period)
    const monthlyTaxes = annualTaxes / 12
    const monthlyInsurance = annualInsurance / 12
    const carryingCosts = (monthlyTaxes + monthlyInsurance) * loanLength

    // Closing costs
    const closingCosts = originationFeeAmount + otherClosingCostsAmount

    // Total costs
    const totalCosts = purchasePrice + renovationCost + totalInterestOverTerm + closingCosts + carryingCosts + costToSellAmount

    // Net profit
    const netProfit = afterRepairValue - totalCosts

    // Borrowed equity needed (down payment + renovation + closing costs)
    const borrowedEquityNeeded = downPayment + renovationCost + closingCosts

    // ROI
    const returnOnInvestment = borrowedEquityNeeded > 0 ? (netProfit / borrowedEquityNeeded) * 100 : 0

    // Loan to After Repair Value
    const loanToAfterRepairValue = afterRepairValue > 0 ? (loanAmount / afterRepairValue) * 100 : 0

    setResults({
      borrowedEquityNeeded,
      netProfit,
      returnOnInvestment,
      loanToAfterRepairValue,
      loanAmount,
      downPayment,
      monthlyInterestPayment,
      totalInterestOverTerm,
      originationFeeAmount,
      otherClosingCostsAmount,
      costToSellAmount,
      closingCosts,
      carryingCosts
    })
  }

  return (
    <CalculatorLayout config={fixFlipConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h2 className={styles.cardTitle}>Fix & Flip Calculator</h2>

            <div className={styles.inputFields}>
              <Input
                label="Purchase Price"
                type="number"
                value={values.purchasePrice}
                onChange={(value) => handleChange('purchasePrice', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="Renovation Cost"
                type="number"
                value={values.renovationCost}
                onChange={(value) => handleChange('renovationCost', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <Input
                label="After Repaired Value"
                type="number"
                value={values.afterRepairValue}
                onChange={(value) => handleChange('afterRepairValue', value)}
                icon={<Icon icon={FaDollarSign} size="sm" />}
                fullWidth
              />

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Length of Loan</label>
                <select
                  className={styles.select}
                  value={values.loanLength}
                  onChange={(e) => handleChange('loanLength', e.target.value)}
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="9">9 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>

              <Input
                label="Annual Property Taxes"
                type="number"
                value={values.annualPropertyTaxes}
                onChange={(value) => handleChange('annualPropertyTaxes', value)}
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

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Purchase Price LTV</label>
                <select
                  className={styles.select}
                  value={values.purchasePriceLTV}
                  onChange={(e) => handleChange('purchasePriceLTV', e.target.value)}
                >
                  <option value="70">70%</option>
                  <option value="75">75%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                  <option value="90">90%</option>
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Interest Rate</label>
                <select
                  className={styles.select}
                  value={values.interestRate}
                  onChange={(e) => handleChange('interestRate', e.target.value)}
                >
                  <option value="8.00">8.00%</option>
                  <option value="9.00">9.00%</option>
                  <option value="10.00">10.00%</option>
                  <option value="11.00">11.00%</option>
                  <option value="12.00">12.00%</option>
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Origination Fee</label>
                <select
                  className={styles.select}
                  value={values.originationFee}
                  onChange={(e) => handleChange('originationFee', e.target.value)}
                >
                  <option value="1.00">1.00%</option>
                  <option value="1.50">1.50%</option>
                  <option value="2.00">2.00%</option>
                  <option value="2.50">2.50%</option>
                  <option value="3.00">3.00%</option>
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Other Closing Costs</label>
                <select
                  className={styles.select}
                  value={values.otherClosingCosts}
                  onChange={(e) => handleChange('otherClosingCosts', e.target.value)}
                >
                  <option value="2.0">2.0%</option>
                  <option value="2.5">2.5%</option>
                  <option value="3.0">3.0%</option>
                  <option value="3.5">3.5%</option>
                  <option value="4.0">4.0%</option>
                </select>
              </div>

              <div className={styles.selectField}>
                <label className={styles.fieldLabel}>Cost To Sell</label>
                <select
                  className={styles.select}
                  value={values.costToSell}
                  onChange={(e) => handleChange('costToSell', e.target.value)}
                >
                  <option value="4">4%</option>
                  <option value="5">5%</option>
                  <option value="6">6%</option>
                  <option value="7">7%</option>
                  <option value="8">8%</option>
                </select>
              </div>
            </div>

            <button className={styles.quoteButton}>GET A QUOTE</button>
          </Card>
        </div>

        {/* Center Panel - Metrics */}
        <div className={styles.centerPanel}>
          {/* Top Metrics */}
          <div className={styles.topMetrics}>
            <Card variant="elevated" padding="md" className={styles.metricCardTop}>
              <div className={styles.metricLabelTop}>Borrowed Equity Needed</div>
              <div className={styles.metricValueTop}>$ {results.borrowedEquityNeeded.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.metricCardTop}>
              <div className={styles.metricLabelTop}>Net Profit</div>
              <div className={styles.metricValueTop}>$ {results.netProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.metricCardTop}>
              <div className={styles.metricLabelTop}>Return on Investment</div>
              <div className={styles.metricValueTop}>{results.returnOnInvestment.toFixed(2)} %</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.metricCardTop}>
              <div className={styles.metricLabelTop}>Loan to After Repaired Value</div>
              <div className={styles.metricValueTop}>{results.loanToAfterRepairValue.toFixed(2)} %</div>
            </Card>
          </div>

          {/* Deal Breakdown */}
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Deal Breakdown</h3>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Loan Amount:</div>
                <div className={styles.breakdownValue}>${results.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Down Payment:</div>
                <div className={styles.breakdownValue}>${results.downPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Monthly Interest Payment:</div>
                <div className={styles.breakdownValue}>${results.monthlyInterestPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Total Interest Over Term:</div>
                <div className={styles.breakdownValue}>${results.totalInterestOverTerm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Origination Fee Amount:</div>
                <div className={styles.breakdownValue}>${results.originationFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Other Closing Costs Amount:</div>
                <div className={styles.breakdownValue}>${results.otherClosingCostsAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Cost To Sell Amount:</div>
                <div className={styles.breakdownValue}>${results.costToSellAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </Card>

          {/* Deal Metrics */}
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Deal Metrics</h3>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Closing Costs:</div>
                <div className={styles.breakdownValue}>${results.closingCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Carrying Costs:</div>
                <div className={styles.breakdownValue}>${results.carryingCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Return Metrics */}
        <div className={styles.resultsPanel}>
          <Card variant="elevated" padding="lg" className={styles.returnMetricsCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className={styles.cardTitle}>Return Metrics</h3>
              <ExportPDFButton 
                getCalculatorData={() => getExportData(values, results)}
              />
            </div>
            <div className={styles.returnMetrics}>
              <div className={styles.returnMetricItem}>
                <div className={styles.returnMetricLabel}>Net Profit:</div>
                <div className={styles.returnMetricValue}>${results.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className={styles.returnMetricItem}>
                <div className={styles.returnMetricLabel}>Loan to After Repaired Value:</div>
                <div className={styles.returnMetricValue}>{results.loanToAfterRepairValue.toFixed(2)}%</div>
              </div>
              <div className={styles.returnMetricItem}>
                <div className={styles.returnMetricLabel}>ROI:</div>
                <div className={styles.returnMetricValue}>{results.returnOnInvestment.toFixed(2)}%</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
