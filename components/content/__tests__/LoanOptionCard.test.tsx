import { render, screen } from '@testing-library/react'
import LoanOptionCard from '../LoanOptionCard'
import { LoanOption } from '@/lib/types/content'

describe('LoanOptionCard', () => {
  const mockLoanOption: LoanOption = {
    id: 'test-loan',
    slug: 'test-loan',
    title: 'Test Loan Option',
    shortDescription: 'This is a test loan option description',
    fullDescription: 'Full description',
    benefits: ['Benefit 1', 'Benefit 2'],
    requirements: ['Requirement 1'],
    idealFor: ['Test users'],
    icon: 'home',
    relatedCalculators: ['purchase'],
    metadata: {
      title: 'Test Loan',
      description: 'Test description',
      keywords: ['test']
    }
  }

  it('renders loan option title', () => {
    render(<LoanOptionCard loanOption={mockLoanOption} />)
    expect(screen.getByText('Test Loan Option')).toBeInTheDocument()
  })

  it('renders loan option short description', () => {
    render(<LoanOptionCard loanOption={mockLoanOption} />)
    expect(screen.getByText('This is a test loan option description')).toBeInTheDocument()
  })

  it('renders correct icon for loan type', () => {
    render(<LoanOptionCard loanOption={mockLoanOption} />)
    expect(screen.getByText('🏠')).toBeInTheDocument()
  })

  it('renders as a link with correct href', () => {
    render(<LoanOptionCard loanOption={mockLoanOption} />)
    const link = screen.getByRole('link', { name: /learn more about test loan option/i })
    expect(link).toHaveAttribute('href', '/loan-options/test-loan')
  })

  it('renders arrow indicator', () => {
    render(<LoanOptionCard loanOption={mockLoanOption} />)
    expect(screen.getByText('→')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<LoanOptionCard loanOption={mockLoanOption} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'Learn more about Test Loan Option')
  })

  describe('icon mapping', () => {
    it('renders shield icon for FHA loans', () => {
      const fhaLoan = { ...mockLoanOption, icon: 'shield' }
      render(<LoanOptionCard loanOption={fhaLoan} />)
      expect(screen.getByText('🛡️')).toBeInTheDocument()
    })

    it('renders flag icon for VA loans', () => {
      const vaLoan = { ...mockLoanOption, icon: 'flag' }
      render(<LoanOptionCard loanOption={vaLoan} />)
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    })

    it('renders tree icon for USDA loans', () => {
      const usdaLoan = { ...mockLoanOption, icon: 'tree' }
      render(<LoanOptionCard loanOption={usdaLoan} />)
      expect(screen.getByText('🌳')).toBeInTheDocument()
    })

    it('renders building icon for jumbo loans', () => {
      const jumboLoan = { ...mockLoanOption, icon: 'building' }
      render(<LoanOptionCard loanOption={jumboLoan} />)
      expect(screen.getByText('🏢')).toBeInTheDocument()
    })

    it('renders key icon for first-time buyer programs', () => {
      const firstTimeLoan = { ...mockLoanOption, icon: 'key' }
      render(<LoanOptionCard loanOption={firstTimeLoan} />)
      expect(screen.getByText('🔑')).toBeInTheDocument()
    })

    it('renders percent icon for low down payment options', () => {
      const lowDownLoan = { ...mockLoanOption, icon: 'percent' }
      render(<LoanOptionCard loanOption={lowDownLoan} />)
      expect(screen.getByText('💰')).toBeInTheDocument()
    })

    it('renders chart icon for investment property loans', () => {
      const investmentLoan = { ...mockLoanOption, icon: 'chart' }
      render(<LoanOptionCard loanOption={investmentLoan} />)
      expect(screen.getByText('📊')).toBeInTheDocument()
    })

    it('renders refresh icon for refinance', () => {
      const refinanceLoan = { ...mockLoanOption, icon: 'refresh' }
      render(<LoanOptionCard loanOption={refinanceLoan} />)
      expect(screen.getByText('🔄')).toBeInTheDocument()
    })

    it('renders dollar icon for cash-out refinance', () => {
      const cashOutLoan = { ...mockLoanOption, icon: 'dollar' }
      render(<LoanOptionCard loanOption={cashOutLoan} />)
      expect(screen.getByText('💵')).toBeInTheDocument()
    })

    it('renders star icon for VA refinance options', () => {
      const vaRefinanceLoan = { ...mockLoanOption, icon: 'star' }
      render(<LoanOptionCard loanOption={vaRefinanceLoan} />)
      expect(screen.getByText('⭐')).toBeInTheDocument()
    })

    it('falls back to home icon for unknown icon types', () => {
      const unknownLoan = { ...mockLoanOption, icon: 'unknown' }
      render(<LoanOptionCard loanOption={unknownLoan} />)
      expect(screen.getByText('🏠')).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    it('applies correct CSS classes for responsive layout', () => {
      const { container } = render(<LoanOptionCard loanOption={mockLoanOption} />)
      const card = container.querySelector('a')
      expect(card).toHaveClass('card')
    })
  })

  describe('edge cases', () => {
    it('handles long titles gracefully', () => {
      const longTitleLoan = {
        ...mockLoanOption,
        title: 'This is a Very Long Loan Option Title That Should Still Display Properly'
      }
      render(<LoanOptionCard loanOption={longTitleLoan} />)
      expect(screen.getByText(/This is a Very Long Loan Option Title/)).toBeInTheDocument()
    })

    it('handles long descriptions gracefully', () => {
      const longDescLoan = {
        ...mockLoanOption,
        shortDescription: 'This is a very long description that goes on and on and should still be displayed properly within the card component without breaking the layout or causing any visual issues'
      }
      render(<LoanOptionCard loanOption={longDescLoan} />)
      expect(screen.getByText(/This is a very long description/)).toBeInTheDocument()
    })

    it('handles empty short description', () => {
      const emptyDescLoan = { ...mockLoanOption, shortDescription: '' }
      const { container } = render(<LoanOptionCard loanOption={emptyDescLoan} />)
      const description = container.querySelector('.description')
      expect(description).toBeInTheDocument()
      expect(description?.textContent).toBe('')
    })
  })
})
