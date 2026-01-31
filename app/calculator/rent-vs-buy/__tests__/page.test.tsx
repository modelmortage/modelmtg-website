/**
 * Rent vs Buy Calculator Page Tests
 * Tests the rent vs buy calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RentVsBuyCalculator from '../page'

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

describe('RentVsBuyCalculator Page', () => {
  it('renders the calculator page with title and description', () => {
    render(<RentVsBuyCalculator />)
    
    expect(screen.getByText('Rent vs Buy Calculator')).toBeInTheDocument()
    expect(screen.getByText(/Compare the total costs of renting versus buying/i)).toBeInTheDocument()
  })

  it('renders all required input fields', () => {
    render(<RentVsBuyCalculator />)
    
    expect(screen.getByLabelText(/Home Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Monthly Rent/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Years to Stay/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Home Appreciation Rate/i)).toBeInTheDocument()
  })

  it('updates input values when user types', () => {
    render(<RentVsBuyCalculator />)
    
    const homePriceInput = screen.getByLabelText(/Home Price/i) as HTMLInputElement
    fireEvent.change(homePriceInput, { target: { value: '350000' } })
    
    expect(homePriceInput.value).toBe('350000')
  })

  it('calculates and displays results when Calculate button is clicked', async () => {
    render(<RentVsBuyCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    
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
    render(<RentVsBuyCalculator />)
    
    // Try to calculate with invalid home price (too low)
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('clears errors when user starts typing in a field with errors', async () => {
    render(<RentVsBuyCalculator />)
    
    // Create an error by submitting invalid data
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '500' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    fireEvent.click(screen.getByText('Calculate'))
    
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
    
    // Start typing a valid value
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    
    // Error for home price should be cleared (but other errors may still exist)
    await waitFor(() => {
      const alerts = screen.queryAllByRole('alert')
      const homePriceError = alerts.find(alert => 
        alert.textContent?.includes('Home price')
      )
      expect(homePriceError).toBeUndefined()
    })
  })

  it('has default values for interest rate, years to stay, and appreciation rate', () => {
    render(<RentVsBuyCalculator />)
    
    const interestRateInput = screen.getByLabelText(/Interest Rate/i) as HTMLInputElement
    const yearsToStayInput = screen.getByLabelText(/Years to Stay/i) as HTMLInputElement
    const appreciationRateInput = screen.getByLabelText(/Home Appreciation Rate/i) as HTMLInputElement
    
    expect(interestRateInput.value).toBe('7.0')
    expect(yearsToStayInput.value).toBe('7')
    expect(appreciationRateInput.value).toBe('3.0')
  })

  it('validates interest rate ranges', async () => {
    render(<RentVsBuyCalculator />)
    
    // Try to calculate with invalid interest rate (too high)
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calculates comparison results correctly', async () => {
    render(<RentVsBuyCalculator />)
    
    // Fill in the form with realistic values
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).toHaveTextContent('Total Cost of Buying')
      expect(results).toHaveTextContent('Total Cost of Renting')
      expect(results).toHaveTextContent('Net Difference')
      expect(results).toHaveTextContent('Recommendation')
    })
  })

  it('displays equity and appreciation information', async () => {
    render(<RentVsBuyCalculator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).toHaveTextContent('Equity Built')
      expect(results).toHaveTextContent('Home Value After Period')
      expect(results).toHaveTextContent('Total Appreciation')
    })
  })

  it('validates years to stay range', async () => {
    render(<RentVsBuyCalculator />)
    
    // Try to calculate with invalid years to stay (0)
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '3.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('handles negative appreciation rates', async () => {
    render(<RentVsBuyCalculator />)
    
    // Fill in the form with negative appreciation rate
    fireEvent.change(screen.getByLabelText(/Home Price/i), { target: { value: '350000' } })
    fireEvent.change(screen.getByLabelText(/Down Payment/i), { target: { value: '70000' } })
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), { target: { value: '7.0' } })
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), { target: { value: '2000' } })
    fireEvent.change(screen.getByLabelText(/Years to Stay/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Home Appreciation Rate/i), { target: { value: '-2.0' } })
    
    // Click calculate
    const calculateButton = screen.getByText('Calculate')
    fireEvent.click(calculateButton)
    
    // Should calculate successfully (negative appreciation is valid)
    await waitFor(() => {
      const results = screen.getByTestId('calculator-results')
      expect(results).not.toHaveTextContent('No results')
    })
  })
})
