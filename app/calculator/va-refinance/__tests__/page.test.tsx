/**
 * VA Refinance Calculator Page Tests
 * Tests the VA refinance calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import VARefinanceCalculator from '../page'

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

describe('VARefinanceCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<VARefinanceCalculator />)
    
    expect(screen.getByText('VA Refinance Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Calculate your VA refinance savings/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<VARefinanceCalculator />)
    
    expect(screen.getByLabelText(/Current Loan Balance/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Current Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/New Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Cash Out Amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/VA Funding Fee/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<VARefinanceCalculator />)
    
    const currentBalanceInput = screen.getByLabelText(/Current Loan Balance/i) as HTMLInputElement
    fireEvent.change(currentBalanceInput, { target: { value: '300000' } })
    
    expect(currentBalanceInput.value).toBe('300000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<VARefinanceCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      // Results should be displayed
      // Check for Refinance Analysis heading
      const headings = screen.getAllByText(/Refinance Analysis/i)
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  it('displays validation errors for invalid inputs', async () => {
    render(<VARefinanceCalculator />)
    
    // Try to calculate with invalid current balance (too low)
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<VARefinanceCalculator />)
    
    // Create an error by submitting invalid data
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '500' } })
    fireEvent.click(screen.getByText('Calculate VA Refinance'))
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    
    // Start typing a valid value
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('has default values for cash out amount and VA funding fee', () => {
    render(<VARefinanceCalculator />)
    
    const cashOutAmountInput = screen.getByLabelText(/Cash Out Amount/i) as HTMLInputElement
    const vaFundingFeeInput = screen.getByLabelText(/VA Funding Fee/i) as HTMLInputElement
    
    expect(cashOutAmountInput.value).toBe('0')
    expect(vaFundingFeeInput.value).toBe('2.15')
  })

  it('calculates correctly with no cash out (IRRRL)', async () => {
    render(<VARefinanceCalculator />)
    
    // Fill in the form with no cash out
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      // Results should be displayed
      // Check for Refinance Analysis heading
      const headings = screen.getAllByText(/Refinance Analysis/i)
      expect(headings.length).toBeGreaterThan(0)
      expect(results).not.toHaveTextContent('Loading...')
    })
  })

  it('calculates correctly with cash out', async () => {
    render(<VARefinanceCalculator />)
    
    // Fill in the form with cash out
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '50000' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.3' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      // Results should be displayed
      // Check for Refinance Analysis heading
      const headings = screen.getAllByText(/Refinance Analysis/i)
      expect(headings.length).toBeGreaterThan(0)
      expect(results).not.toHaveTextContent('Loading...')
    })
  })

  it('validates that interest rates are within valid range', async () => {
    render(<VARefinanceCalculator />)
    
    // Try to calculate with invalid interest rate (too high)
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('handles rate increase scenario (new rate higher than current)', async () => {
    render(<VARefinanceCalculator />)
    
    // Fill in the form with rate increase
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '5.0' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '50000' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.3' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear (should still calculate, just show negative savings)
    await waitFor(() => {
      // Results should be displayed
      // Check for Refinance Analysis heading
      const headings = screen.getAllByText(/Refinance Analysis/i)
      expect(headings.length).toBeGreaterThan(0)
      expect(results).not.toHaveTextContent('Loading...')
    })
  })

  it('validates that cash out amount is not negative', async () => {
    render(<VARefinanceCalculator />)
    
    // Try to calculate with negative cash out
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.0' } })
    fireEvent.change(screen.getByLabelText(/Cash Out Amount/i), { target: { value: '-10000' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate VA Refinance')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})



