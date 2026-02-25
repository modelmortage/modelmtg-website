'use client'

import { useState, useEffect } from 'react'
import CalculatorLayout from '@/components/calculators/CalculatorLayout'
import { Card } from '@/components/design-system/Card'
import { Input } from '@/components/design-system/Input'
import { Icon } from '@/components/design-system/Icon'
import {
  FaDollarSign,
  FaHome,
  FaPercent,
  FaKey,
  FaUniversity,
  FaFlag,
  FaCalendar,
  FaChartLine
} from 'react-icons/fa'
import { rentVsBuyConfig } from '@/lib/calculators/configs/rentVsBuy.config'
import dynamic from 'next/dynamic'
const ExportPDFButton = dynamic(() => import('@/components/ExportPDFButton'), { ssr: false })
import { useCalculatorExport } from '@/hooks/useCalculatorExport'
import styles from './rent-vs-buy.module.css'

type LoanType = 'conventional' | 'fha' | 'va' | 'usda' | 'jumbo'
type ToggleMode = 'dollar' | 'percent'

export default function RentVsBuyCalculator() {
  const { chartRef, getExportData } = useCalculatorExport('Rent vs Buy')

  const [activeLoanType, setActiveLoanType] = useState<LoanType>('conventional')
  const [downPaymentMode, setDownPaymentMode] = useState<ToggleMode>('dollar')

  const [values, setValues] = useState({
    homePrice: '300000',
    downPaymentDollar: '60000',
    downPaymentPercent: '20',
    interestRate: '7',
    loanTerm: '30',
    propertyTaxRate: '1.2',
    insurance: '1200',
    maintenance: '250',
    hoaDues: '0',
    monthlyRent: '2000',
    rentIncrease: '3',
    yearsToStay: '7',
    appreciationRate: '3',
    closingCostsBuy: '10000',
    closingCostsSell: '6'
  })

  const [results, setResults] = useState({
    totalRentCost: 0,
    totalBuyCost: 0,
    netDifference: 0,
    recommendation: 'buy',
    buyMonthlyPayment: 0,
    buyPrincipalInterest: 0,
    buyPropertyTax: 0,
    buyInsurance: 0,
    buyMaintenance: 0,
    buyHOA: 0,
    homeValueAfter: 0,
    equityBuilt: 0
  })

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Auto-calculate down payment sync
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

  // Auto-calculate results
  useEffect(() => {
    calculateResults()
  }, [values, activeLoanType, downPaymentMode])

  const calculateResults = () => {
    const homePrice = parseFloat(values.homePrice) || 0
    const downPayment = downPaymentMode === 'dollar'
      ? parseFloat(values.downPaymentDollar) || 0
      : (homePrice * (parseFloat(values.downPaymentPercent) || 0)) / 100

    const loanAmount = homePrice - downPayment
    const rate = (parseFloat(values.interestRate) || 0) / 100 / 12
    const term = (parseFloat(values.loanTerm) || 30) * 12
    const years = parseFloat(values.yearsToStay) || 7

    // Calculate monthly P&I
    const monthlyPI = rate === 0
      ? loanAmount / term
      : loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

    // Calculate other monthly costs
    const monthlyTax = (homePrice * (parseFloat(values.propertyTaxRate) || 0) / 100) / 12
    const monthlyInsurance = (parseFloat(values.insurance) || 0) / 12
    const monthlyMaintenance = parseFloat(values.maintenance) || 0
    const monthlyHOA = parseFloat(values.hoaDues) || 0

    // PMI if needed
    const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0
    let monthlyPMI = 0
    if (activeLoanType === 'conventional' && downPaymentPercent < 20) {
      monthlyPMI = (loanAmount * 0.005) / 12
    } else if (activeLoanType === 'fha') {
      monthlyPMI = (loanAmount * 0.0085) / 12
    } else if (activeLoanType === 'usda') {
      monthlyPMI = (loanAmount * 0.0035) / 12
    }

    const totalMonthlyBuy = monthlyPI + monthlyTax + monthlyInsurance + monthlyMaintenance + monthlyPMI + monthlyHOA

    // Rent calculations
    const monthlyRent = parseFloat(values.monthlyRent) || 0
    const rentIncrease = (parseFloat(values.rentIncrease) || 0) / 100

    let totalRent = 0
    for (let year = 0; year < years; year++) {
      const yearRent = monthlyRent * Math.pow(1 + rentIncrease, year) * 12
      totalRent += yearRent
    }

    // Buy calculations
    const closingCostsBuy = parseFloat(values.closingCostsBuy) || 0
    const totalBuyPayments = totalMonthlyBuy * 12 * years
    const appreciationRate = (parseFloat(values.appreciationRate) || 0) / 100
    const homeValueAfter = homePrice * Math.pow(1 + appreciationRate, years)

    // Calculate equity built (home appreciation + principal paid down)
    const totalInterestPaid = (monthlyPI * 12 * years) - (loanAmount * (1 - Math.pow(1 + rate, -12 * years)))
    const principalPaid = (monthlyPI * 12 * years) - totalInterestPaid
    const equityBuilt = (homeValueAfter - homePrice) + principalPaid

    const closingCostsSell = homeValueAfter * ((parseFloat(values.closingCostsSell) || 0) / 100)
    const netBuyCost = downPayment + closingCostsBuy + totalBuyPayments - equityBuilt + closingCostsSell

    const netDifference = totalRent - netBuyCost
    const recommendation = netDifference > 0 ? 'buy' : 'rent'

    setResults({
      totalRentCost: totalRent,
      totalBuyCost: netBuyCost,
      netDifference: Math.abs(netDifference),
      recommendation,
      buyMonthlyPayment: totalMonthlyBuy,
      buyPrincipalInterest: monthlyPI,
      buyPropertyTax: monthlyTax,
      buyInsurance: monthlyInsurance,
      buyMaintenance: monthlyMaintenance,
      buyHOA: monthlyHOA,
      homeValueAfter,
      equityBuilt
    })
  }

  const loanTypes = [
    { id: 'conventional' as LoanType, label: 'Conventional', icon: FaUniversity },
    { id: 'fha' as LoanType, label: 'FHA', icon: FaHome },
    { id: 'va' as LoanType, label: 'VA', icon: FaFlag },
    { id: 'usda' as LoanType, label: 'USDA', icon: FaHome },
    { id: 'jumbo' as LoanType, label: 'Jumbo', icon: FaDollarSign }
  ]

  return (
    <CalculatorLayout config={rentVsBuyConfig}>
      <div className={styles.calculatorWrapper}>
        {/* Left Panel - Inputs */}
        <div className={styles.inputPanel}>
          <Card variant="elevated" padding="lg" className={styles.inputCard}>
            <h1 className={styles.cardTitle}>Rent vs Buy Calculator</h1>

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
                    placeholder="60000"
                    fullWidth
                  />
                ) : (
                  <Input
                    label=""
                    type="number"
                    value={values.downPaymentPercent}
                    onChange={(value) => handleChange('downPaymentPercent', value)}
                    placeholder="20"
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

              <Input
                label="Loan Term (Years)"
                type="number"
                value={values.loanTerm}
                onChange={(value) => handleChange('loanTerm', value)}
                placeholder="30"
                fullWidth
              />

              <Input
                label="Monthly Rent"
                type="number"
                value={values.monthlyRent}
                onChange={(value) => handleChange('monthlyRent', value)}
                icon={<Icon icon={FaKey} size="sm" />}
                fullWidth
              />

              <Input
                label="Rent Increase (Yearly %)"
                type="number"
                value={values.rentIncrease}
                onChange={(value) => handleChange('rentIncrease', value)}
                icon={<Icon icon={FaPercent} size="sm" />}
                fullWidth
              />

              <Input
                label="Years to Stay"
                type="number"
                value={values.yearsToStay}
                onChange={(value) => handleChange('yearsToStay', value)}
                icon={<Icon icon={FaCalendar} size="sm" />}
                fullWidth
              />

              <Input
                label="Home Appreciation Rate (%)"
                type="number"
                value={values.appreciationRate}
                onChange={(value) => handleChange('appreciationRate', value)}
                icon={<Icon icon={FaChartLine} size="sm" />}
                fullWidth
              />

              <Input
                label="Property Tax Rate (%)"
                type="number"
                value={values.propertyTaxRate}
                onChange={(value) => handleChange('propertyTaxRate', value)}
                placeholder="1.2"
                fullWidth
              />

              <Input
                label="Insurance (Yearly)"
                type="number"
                value={values.insurance}
                onChange={(value) => handleChange('insurance', value)}
                placeholder="1200"
                fullWidth
              />

              <Input
                label="Maintenance (Monthly)"
                type="number"
                value={values.maintenance}
                onChange={(value) => handleChange('maintenance', value)}
                placeholder="250"
                fullWidth
              />
            </div>
          </Card>
        </div>

        {/* Center Panel - Comparison */}
        <div className={styles.centerPanel}>
          <Card variant="elevated" padding="lg" className={styles.breakdownCard}>
            <h3 className={styles.cardTitle}>Cost Comparison</h3>

            <div className={styles.comparisonChart}>
              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonLabel}>Rent</div>
                <div className={`${styles.comparisonAmount} ${results.recommendation === 'rent' ? styles.winner : styles.loser}`}>
                  ${results.totalRentCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className={styles.comparisonVs}>vs</div>

              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonLabel}>Buy</div>
                <div className={`${styles.comparisonAmount} ${results.recommendation === 'buy' ? styles.winner : styles.loser}`}>
                  ${results.totalBuyCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className={styles.breakdownLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#E97451' }}></span>
                <span className={styles.legendLabel}>Principal & Interest</span>
                <span className={styles.legendValue}>${results.buyPrincipalInterest.toFixed(2)}/mo</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#51C2E9' }}></span>
                <span className={styles.legendLabel}>Property Tax</span>
                <span className={styles.legendValue}>${results.buyPropertyTax.toFixed(2)}/mo</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#E94D8A' }}></span>
                <span className={styles.legendLabel}>Insurance</span>
                <span className={styles.legendValue}>${results.buyInsurance.toFixed(2)}/mo</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#51E9B4' }}></span>
                <span className={styles.legendLabel}>Maintenance</span>
                <span className={styles.legendValue}>${results.buyMaintenance.toFixed(2)}/mo</span>
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
            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Total Rent Cost</div>
              <div className={styles.resultValue}>${results.totalRentCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Total Buy Cost</div>
              <div className={styles.resultValue}>${results.totalBuyCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Net Difference</div>
              <div className={styles.resultValue}>${results.netDifference.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.resultCard}>
              <div className={styles.resultLabel}>Recommendation</div>
              <div className={styles.resultValue}>{results.recommendation === 'buy' ? 'Buy' : 'Rent'}</div>
            </Card>
          </div>

          <Card variant="elevated" padding="md" className={styles.sliderCard}>
            <div className={styles.sliderLabel}>
              <span>Years to Stay</span>
              <span className={styles.sliderValue}>{values.yearsToStay} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={values.yearsToStay}
              onChange={(e) => handleChange('yearsToStay', e.target.value)}
              className={styles.slider}
            />
          </Card>

          <Card variant="elevated" padding="md" className={styles.sliderCard}>
            <div className={styles.sliderLabel}>
              <span>Home Appreciation Rate</span>
              <span className={styles.sliderValue}>{values.appreciationRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={values.appreciationRate}
              onChange={(e) => handleChange('appreciationRate', e.target.value)}
              className={styles.slider}
            />
          </Card>

          <Card variant="elevated" padding="md" className={styles.summaryCard}>
            <div className={styles.summaryTitle}>Summary:</div>
            <p className={styles.summaryText}>
              Over <strong>{values.yearsToStay} years</strong>, {results.recommendation === 'buy' ? 'buying' : 'renting'} is
              more cost-effective by <strong>${results.netDifference.toLocaleString()}</strong>.
              {results.recommendation === 'buy' && (
                <> Your home would be worth <strong>${results.homeValueAfter.toLocaleString()}</strong> with
                  <strong> ${results.equityBuilt.toLocaleString()}</strong> in equity built.</>
              )}
            </p>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  )
}
