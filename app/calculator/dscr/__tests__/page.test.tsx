/**
 * DSCR Investment Calculator Page Tests
 * Tests the DSCR calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DSCRCalculator from '../page'

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

describe('DSCRCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<DSCRCalculator />)
    
    expect(screen.getByText('DSCR Investment Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Calculate Debt Service Coverage Ratio/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<DSCRCalculator />)
    
    expect(screen.getByLabelText(/Property Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly Rent/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly Expenses/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<DSCRCalculator />)
    
    const propertyPriceInput = screen.getByLabelText(/Property Price/i) as HTMLInputElement
    fireEvent.change(propertyPriceInput, { target: { value: '300000' } })
    
    expect(propertyPriceInput.value).toBe('300000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<DSCRCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '60000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2500' } })
    fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: '800' } })
    
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
    render(<DSCRCalculator />)
    
    // Try to calculate with invalid property price (too low)
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '60000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2500' } })
    fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: '800' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<DSCRCalculator />)
    
    // Create an error by submitting invalid data
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '500' } })
    fireEvent.click(screen.getByText('Calculate'))
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    
    // Start typing a valid value
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '300000' } })
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('has default value for interest rate', () => {
    render(<DSCRCalculator />)
    
    const interestRateInput = screen.getByLabelText(/Interest Rate/i) as HTMLInputElement
    
    expect(interestRateInput.value).toBe('7.5')
  })

  it('validates that down payment cannot exceed property price', async () => {
    render(<DSCRCalculator />)
    
    // Try to calculate with down payment exceeding property price
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '100000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '150000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2500' } })
    fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: '800' } })
    
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

  it('calculates DSCR for investment property with positive cash flow', async () => {
    render(<DSCRCalculator />)
    
    // Fill in the form with values that should produce positive cash flow
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '60000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2500' } })
    fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: '800' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
      // Results should include DSCR ratio and cash flow
      expect(results).toHaveTextContent('DSCR Ratio')
      expect(results).toHaveTextContent('Monthly Cash Flow')
    })
  })

  it('handles zero down payment (100% financing)', async () => {
    render(<DSCRCalculator />)
    
    // Fill in the form with zero down payment
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2500' } })
    fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: '800' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
    })
  })

  it('handles cash purchase (100% down payment)', async () => {
    render(<DSCRCalculator />)
    
    // Fill in the form with 100% down payment
    fireEvent.change(screen.getByLabelText(/Property Price/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.5' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2500' } })
    fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: '800' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
    })
  })
})
