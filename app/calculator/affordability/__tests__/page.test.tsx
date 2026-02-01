/**
 * Affordability Calculator Page Tests
 * Tests the affordability calculator page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AffordabilityCalculator from '../page'

// Mock the CalculatorLayout component
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
    const calculateButton = screen.getByText('Calculate Affordability')
    fireEvent.click(calculateButton)
    
    // Wait for results to appear - check for "Your Results" heading
    await waitFor(() => {
      const resultsHeading = screen.getAllByText('Your Results')
      expect(resultsHeading.length).toBeGreaterThan(0)
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
    const calculateButton = screen.getByText('Calculate Affordability')
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
    fireEvent.click(screen.getByText('Calculate Affordability'))
    
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
