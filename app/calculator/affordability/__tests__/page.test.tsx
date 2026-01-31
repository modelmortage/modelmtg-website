/**
 * Affordability Calculator Page Tests
 * Tests the affordability calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AffordabilityCalculator from '../page'

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

describe('AffordabilityCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<AffordabilityCalculator />)
    
    expect(screen.getByText('How Much Can I Afford?')).toBeInTheDocument()
    expect(screen.getByText(/Calculate your maximum home purchase price/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<AffordabilityCalculator />)
    
    expect(screen.getByLabelText(/Annual Gross Income/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly Debts/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<AffordabilityCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Gross Income/i) as HTMLInputElement
    fireEvent.change(incomeInput, { target: { value: '80000' } })
    
    expect(incomeInput.value).toBe('80000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<AffordabilityCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Annual Gross Income/i), { target: { value: '80000' } })
    fireEvent.change(screen.getByLabelText(/Monthly Debts/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '20000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    
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
    render(<AffordabilityCalculator />)
    
    // Try to calculate with negative income
    fireEvent.change(screen.getByLabelText(/Annual Gross Income/i), { target: { value: '-1000' } })
    fireEvent.change(screen.getByLabelText(/Monthly Debts/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '20000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<AffordabilityCalculator />)
    
    // Create an error by submitting invalid data
    fireEvent.change(screen.getByLabelText(/Annual Gross Income/i), { target: { value: '-1000' } })
    fireEvent.click(screen.getByText('Calculate'))
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    
    // Start typing a valid value
    fireEvent.change(screen.getByLabelText(/Annual Gross Income/i), { target: { value: '80000' } })
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  it('has default value for interest rate', () => {
    render(<AffordabilityCalculator />)
    
    const interestRateInput = screen.getByLabelText(/Interest Rate/i) as HTMLInputElement
    expect(interestRateInput.value).toBe('7.0')
  })
})
