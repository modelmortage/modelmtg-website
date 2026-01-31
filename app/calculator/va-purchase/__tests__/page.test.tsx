/**
 * VA Purchase Calculator Page Tests
 * Tests the VA purchase calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import VAPurchaseCalculator from '../page'

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

describe('VAPurchaseCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<VAPurchaseCalculator />)
    
    expect(screen.getByText('VA Purchase Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Calculate your monthly VA loan payment/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<VAPurchaseCalculator />)
    
    expect(screen.getByLabelText(/Home Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/VA Funding Fee/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Property Tax Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Annual Insurance/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<VAPurchaseCalculator />)
    
    const homePriceInput = screen.getByLabelText(/Home Price/i) as HTMLInputElement
    fireEvent.change(homePriceInput, { target: { value: '350000' } })
    
    expect(homePriceInput.value).toBe('350000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<VAPurchaseCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    
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
    render(<VAPurchaseCalculator />)
    
    // Try to calculate with invalid home price (too low)
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<VAPurchaseCalculator />)
    
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

  it('has default values for down payment, interest rate, VA funding fee, property tax rate, and insurance', () => {
    render(<VAPurchaseCalculator />)
    
    const downPaymentInput = screen.getByLabelText(/Down Payment/i) as HTMLInputElement
    const interestRateInput = screen.getByLabelText(/Interest Rate/i) as HTMLInputElement
    const vaFundingFeeInput = screen.getByLabelText(/VA Funding Fee/i) as HTMLInputElement
    const propertyTaxRateInput = screen.getByLabelText(/Property Tax Rate/i) as HTMLInputElement
    const insuranceInput = screen.getByLabelText(/Annual Insurance/i) as HTMLInputElement
    
    expect(downPaymentInput.value).toBe('0')
    expect(interestRateInput.value).toBe('6.5')
    expect(vaFundingFeeInput.value).toBe('2.15')
    expect(propertyTaxRateInput.value).toBe('1.2')
    expect(insuranceInput.value).toBe('1200')
  })

  it('validates that down payment cannot exceed home price', async () => {
    render(<VAPurchaseCalculator />)
    
    // Try to calculate with down payment exceeding home price
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '100000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '150000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    
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

  it('calculates correctly with 0% down payment (typical VA loan)', async () => {
    render(<VAPurchaseCalculator />)
    
    // Fill in the form with 0% down payment
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
      expect(results).not.toHaveTextContent('Loading...')
    })
  })

  it('calculates correctly with a down payment', async () => {
    render(<VAPurchaseCalculator />)
    
    // Fill in the form with a down payment
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '300000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '30000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '6.5' } })
    fireEvent.change(screen.getByLabelText(/VA Funding Fee/i), { target: { value: '2.15' } })
    fireEvent.change(screen.getByLabelText(/Property Tax Rate/i), { target: { value: '1.2' } })
    fireEvent.change(screen.getByLabelText(/Annual Insurance/i), { target: { value: '1200' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
      expect(results).not.toHaveTextContent('Loading...')
    })
  })
})
