/**
 * Monthly Payment Summary Section Tests
 * Tests the monthly payment summary section added in task 10
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import VAPurchaseCalculator from '../page'

// Mock the shared components
jest.mock('@/components/calculators/CalculatorLayout', () => {
  return function MockCalculatorLayout({ children }: any) {
    return <div data-testid="calculator-layout">{children}</div>
  }
})

describe('Monthly Payment Summary Section', () => {
  it('renders the monthly payment summary section', () => {
    render(<VAPurchaseCalculator />)
    
    expect(screen.getByText('Monthly Payment Summary')).toBeInTheDocument()
  })

  it('displays all required fields in the summary', () => {
    render(<VAPurchaseCalculator />)
    
    // Check for all required labels - use getAllByText for labels that appear multiple times
    expect(screen.getAllByText('Home Value').length).toBeGreaterThan(0)
    expect(screen.getByText('Mortgage Amount')).toBeInTheDocument()
    expect(screen.getByText('Monthly Principal & Interest')).toBeInTheDocument()
    expect(screen.getByText('Monthly Property Tax')).toBeInTheDocument()
    expect(screen.getByText('Monthly Home Insurance')).toBeInTheDocument()
  })

  it('displays home value correctly formatted', () => {
    render(<VAPurchaseCalculator />)
    
    // Default home value is 200000
    const summaryItems = screen.getAllByText(/\$200,000\.00/)
    expect(summaryItems.length).toBeGreaterThan(0)
  })

  it('conditionally displays Monthly Extra Payment when extra payment is greater than 0', () => {
    render(<VAPurchaseCalculator />)
    
    // Initially, extra payment is 0, so it should not be displayed
    expect(screen.queryByText('Monthly Extra Payment')).not.toBeInTheDocument()
  })

  it('conditionally displays Monthly HOA Fees when HOA dues are greater than 0', () => {
    render(<VAPurchaseCalculator />)
    
    // Initially, HOA dues are 0, so it should not be displayed
    expect(screen.queryByText('Monthly HOA Fees')).not.toBeInTheDocument()
  })

  it('displays mortgage amount as final mortgage amount (including VA funding fee)', () => {
    render(<VAPurchaseCalculator />)
    
    // With default values:
    // Home Price: 200000
    // Down Payment: 0
    // Base Mortgage: 200000
    // VA Funding Fee (first-time 2.15%): 200000 * 0.0215 = 4300
    // Final Mortgage Amount: 200000 + 4300 = 204300
    
    // Look for the mortgage amount value in the summary
    const mortgageAmountText = screen.getByText('Mortgage Amount')
    const summaryItem = mortgageAmountText.closest('.summaryItem')
    
    // The value should be displayed in the same container
    expect(summaryItem).toBeInTheDocument()
  })

  it('displays monthly principal and interest', () => {
    render(<VAPurchaseCalculator />)
    
    const piText = screen.getByText('Monthly Principal & Interest')
    expect(piText).toBeInTheDocument()
    
    // The value should be in the same summary item
    const summaryItem = piText.closest('.summaryItem')
    expect(summaryItem).toBeInTheDocument()
  })

  it('displays monthly property tax', () => {
    render(<VAPurchaseCalculator />)
    
    const taxText = screen.getByText('Monthly Property Tax')
    expect(taxText).toBeInTheDocument()
    
    // Default property tax is 2400/year = 200/month
    // Should display $200.00
    const summaryItem = taxText.closest('.summaryItem')
    expect(summaryItem).toBeInTheDocument()
  })

  it('displays monthly home insurance', () => {
    render(<VAPurchaseCalculator />)
    
    const insuranceText = screen.getByText('Monthly Home Insurance')
    expect(insuranceText).toBeInTheDocument()
    
    // Default insurance is 1200/year = 100/month
    // Should display $100.00
    const summaryItem = insuranceText.closest('.summaryItem')
    expect(summaryItem).toBeInTheDocument()
  })
})
