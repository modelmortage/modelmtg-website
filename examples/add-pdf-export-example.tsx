/**
 * Example: Adding PDF Export to a Calculator
 * 
 * This example shows how to integrate PDF export functionality
 * into any calculator page.
 */

'use client'

import { useState, useEffect } from 'react'
import ExportPDFButton from '@/components/ExportPDFButton'
import { useCalculatorExport } from '@/hooks/useCalculatorExport'

export default function ExampleCalculator() {
  // 1. Initialize the export hook with your calculator name
  const { chartRef, getExportData } = useCalculatorExport('Purchase Calculator')
  
  // 2. Your calculator state
  const [values, setValues] = useState({
    homePrice: '300000',
    downPayment: '60000',
    interestRate: '6.5',
    loanTerm: '30'
  })

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    loanAmount: 0
  })

  // 3. Your calculation logic
  useEffect(() => {
    const homePrice = parseFloat(values.homePrice) || 0
    const downPayment = parseFloat(values.downPayment) || 0
    const rate = (parseFloat(values.interestRate) || 0) / 100 / 12
    const term = (parseFloat(values.loanTerm) || 30) * 12
    
    const loanAmount = homePrice - downPayment
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    const totalPayment = monthlyPayment * term
    const totalInterest = totalPayment - loanAmount

    setResults({
      monthlyPayment,
      totalInterest,
      totalPayment,
      loanAmount
    })
  }, [values])

  return (
    <div className="calculator-container">
      {/* 4. Add the export button where you want it */}
      <div className="header">
        <h1>Purchase Calculator</h1>
        <ExportPDFButton 
          getCalculatorData={() => getExportData(values, results)}
        />
      </div>

      {/* Your input fields */}
      <div className="inputs">
        <input
          type="number"
          value={values.homePrice}
          onChange={(e) => setValues(prev => ({ ...prev, homePrice: e.target.value }))}
          placeholder="Home Price"
        />
        {/* ... more inputs */}
      </div>

      {/* 5. Wrap your chart/visualization with chartRef */}
      <div ref={chartRef} className="chart-container">
        {/* Your chart component goes here */}
        <div className="donut-chart">
          <div className="center">
            <span>${results.monthlyPayment.toFixed(2)}</span>
            <span>per month</span>
          </div>
        </div>
      </div>

      {/* Your results display */}
      <div className="results">
        <div>Loan Amount: ${results.loanAmount.toFixed(2)}</div>
        <div>Monthly Payment: ${results.monthlyPayment.toFixed(2)}</div>
        <div>Total Interest: ${results.totalInterest.toFixed(2)}</div>
        <div>Total Payment: ${results.totalPayment.toFixed(2)}</div>
      </div>
    </div>
  )
}

/**
 * Key Points:
 * 
 * 1. The hook provides:
 *    - chartRef: Attach to the element you want captured in PDF
 *    - getExportData: Function to prepare data for export
 * 
 * 2. Pass your calculator's values and results to getExportData()
 * 
 * 3. The PDF will include:
 *    - Company logo (from /public/model-mortage-logo.png)
 *    - Calculator name
 *    - Generation date
 *    - Chart visualization (if chartRef is attached)
 *    - All results formatted nicely
 * 
 * 4. The PDF is automatically:
 *    - Uploaded to Supabase Storage
 *    - Metadata saved to database
 *    - Downloaded to user's computer
 */
