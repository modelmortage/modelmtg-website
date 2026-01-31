/**
 * Refinance Calculator Page Tests
 * Tests the refinance calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RefinanceCalculator from '../page'

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

describe('RefinanceCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<RefinanceCalculator />)
    
    expect(screen.getByText('Refinance Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Calculate your potential savings from refinancing/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<RefinanceCalculator />)
    
    expect(screen.getByLabelText(/Current Loan Balance/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Current Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/New Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Remaining Term/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/New Loan Term/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Closing Costs/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<RefinanceCalculator />)
    
    const currentBalanceInput = screen.getByLabelText(/Current Loan Balance/i) as HTMLInputElement
    fireEvent.change(currentBalanceInput, { target: { value: '250000' } })
    
    expect(currentBalanceInput.value).toBe('250000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<RefinanceCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '250000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/Remaining Term/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Closing Costs/i), { target: { value: '5000' } })
    
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
    render(<RefinanceCalculator />)
    
    // Try to calculate with invalid current balance (too low)
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/Remaining Term/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Closing Costs/i), { target: { value: '5000' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<RefinanceCalculator />)
    
    // Create an error by submitting invalid data
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/Remaining Term/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Closing Costs/i), { target: { value: '5000' } })
    fireEvent.click(screen.getByText('Calculate'))
    
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
    
    // Start typing a valid value
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '250000' } })
    
    // Error for current balance should be cleared (but other errors may still exist)
    await waitFor(() => {
      const alerts = screen.queryAllByRole('alert')
      const currentBalanceError = alerts.find(alert => 
        alert.textContent?.includes('Current balance')
      )
      expect(currentBalanceError).toBeUndefined()
    })
  })

  it('has default values for new loan term and closing costs', () => {
    render(<RefinanceCalculator />)
    
    const newTermInput = screen.getByLabelText(/New Loan Term/i) as HTMLInputElement
    const closingCostsInput = screen.getByLabelText(/Closing Costs/i) as HTMLInputElement
    
    expect(newTermInput.value).toBe('30')
    expect(closingCostsInput.value).toBe('5000')
  })

  it('validates interest rate ranges', async () => {
    render(<RefinanceCalculator />)
    
    // Try to calculate with invalid interest rate (too high)
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '250000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/Remaining Term/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Closing Costs/i), { target: { value: '5000' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calculates break-even point and savings correctly', async () => {
    render(<RefinanceCalculator />)
    
    // Fill in the form with values that should show savings
    fireEvent.change(screen.getByLabelText(/Current Loan Balance/i), { target: { value: '250000' } })
    fireEvent.change(screen.getByLabelText(/Current Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/New Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/Remaining Term/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/New Loan Term/i), { target: { value: '30' } })
    fireEvent.change(screen.getByLabelText(/Closing Costs/i), { target: { value: '5000' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).toHaveTextContent('New Monthly Payment')
      expect(results).toHaveTextContent('Monthly Savings')
      expect(results).toHaveTextContent('Break-Even Point')
    })
  })
})
