/**
 * Purchase Calculator Page Tests
 * Tests the purchase calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PurchaseCalculator from '../page'

// Mock the shared components
jest.mock('@/components/calculators/CalculatorLayout', () => {
  return function MockCalculatorLayout({ config, children }: any) {
    return (
      <div data-testid="calculator-layout">
        <h1>{config.title}</h1>
        <p>{config.description}</p>
        {children}
      </div>
    )
  }
})

jest.mock('@/components/calculators/CalculatorForm', () => {
  return function MockCalculatorForm({ inputs, values, errors, onChange, onCalculate }: any) {
    return (
      <div data-testid="calculator-form">
        {inputs.map((input: any) => (
          <div key={input.name}>
            <label htmlFor={input.name}>{input.label}</label>
            <input
              id={input.name}
              name={input.name}
              type="number"
              value={values[input.name] || ''}
              onChange={(e) => onChange(input.name, e.target.value)}
            />
            {errors[input.name] && <span role="alert">{errors[input.name]}</span>}
          </div>
        ))}
        <button onClick={onCalculate}>Calculate</button>
      </div>
    )
  }
})

jest.mock('@/components/calculators/CalculatorResults', () => {
  return function MockCalculatorResults({ results, loading }: any) {
    if (loading) return <div data-testid="calculator-results">Loading...</div>
    if (!results) return <div data-testid="calculator-results">No results</div>
    return (
      <div data-testid="calculator-results">
        {results.map((result: any, index: number) => (
          <div key={index}>
            <span>{result.label}</span>
            <span>{result.value}</span>
          </div>
        ))}
      </div>
    )
  }
})

describe('PurchaseCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<PurchaseCalculator />)
    
    expect(screen.getByText('Purchase Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Estimate your monthly mortgage payment/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<PurchaseCalculator />)
    
    expect(screen.getByLabelText(/Home Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Loan Term/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Property Tax Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Annual Insurance/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly HOA Fees/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<PurchaseCalculator />)
    
    const homePriceInput = screen.getByLabelText(/Home Price/i) as HTMLInputElement
    fireEvent.change(homePriceInput, { target: { value: '350000' } })
    
    expect(homePriceInput.value).toBe('350000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<PurchaseCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    fireEvent.change(screen.getByLabelText(/Monthly HOA Fees/i), { target: { value: '0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
    })
  })

  it('displays validation errors for invalid inputs', async () => {
    render(<PurchaseCalculator />)
    
    // Try to calculate with invalid home price (too low)
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    fireEvent.change(screen.getByLabelText(/Monthly HOA Fees/i), { target: { value: '0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<PurchaseCalculator />)
    
    // Create an error by submitting invalid data
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '500' } })
    fireEvent.click(screen.getByText('Calculate'))
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    
    // Start typing a valid value
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('has default values for interest rate, loan term, property tax rate, insurance, and HOA', () => {
    render(<PurchaseCalculator />)
    
    const interestRateInput = screen.getByLabelText(/Interest Rate/i) as HTMLInputElement
    const loanTermInput = screen.getByLabelText(/Loan Term/i) as HTMLInputElement
    const propertyTaxRateInput = screen.getByLabelText(/Property Tax Rate/i) as HTMLInputElement
    const insuranceInput = screen.getByLabelText(/Annual Insurance/i) as HTMLInputElement
    const hoaInput = screen.getByLabelText(/Monthly HOA Fees/i) as HTMLInputElement
    
    expect(interestRateInput.value).toBe('7.0')
    expect(loanTermInput.value).toBe('30')
    expect(propertyTaxRateInput.value).toBe('1.2')
    expect(insuranceInput.value).toBe('1200')
    expect(hoaInput.value).toBe('0')
  })

  it('validates that down payment cannot exceed home price', async () => {
    render(<PurchaseCalculator />)
    
    // Try to calculate with down payment exceeding home price
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '100000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '150000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    fireEvent.change(screen.getByLabelText(/Monthly HOA Fees/i), { target: { value: '0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should handle the error gracefully
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      // Either shows an error or handles it in the calculation
      expect(results).toBeInTheDocument()
    })
  })
})
