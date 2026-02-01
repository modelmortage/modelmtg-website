import { render, screen } from '@testing-library/react'
import LoanOptionPage, { generateMetadata, generateStaticParams } from '../page'
import { loanOptions } from '@/lib/content/loanOptions'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

// Mock the ContentPage component to avoid Header/Footer rendering issues
jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ 
    title, 
    subtitle, 
    breadcrumbs,
    children,
    cta
  }: { 
    title: string
    subtitle: string
    breadcrumbs?: Array<{ label: string; href: string }>
    children: React.ReactNode
    cta?: { title: string; description: string; buttonText: string; buttonHref: string }
  }) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {breadcrumbs && (
          <nav aria-label="Breadcrumb">
            <span>Home</span>
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>{crumb.label}</span>
            ))}
          </nav>
        )}
        {children}
        {cta && (
          <div>
            <h2>{cta.title}</h2>
            <p>{cta.description}</p>
          </div>
        )}
      </div>
    )
  }
})

describe('LoanOptionPage', () => {
  describe('generateStaticParams', () => {
    it('should generate params for all loan options', async () => {
      const params = await generateStaticParams()
      
      expect(params).toHaveLength(loanOptions.length)
      expect(params).toEqual(
        loanOptions.map((option) => ({ slug: option.slug }))
      )
    })

    it('should include all 11 loan option slugs', async () => {
      const params = await generateStaticParams()
      const slugs = params.map(p => p.slug)
      
      expect(slugs).toContain('fixed-rate-mortgage')
      expect(slugs).toContain('fha-home-loan')
      expect(slugs).toContain('va-home-loan')
      expect(slugs).toContain('usda-loan')
      expect(slugs).toContain('jumbo-home-loan')
      expect(slugs).toContain('first-time-home-buyer')
      expect(slugs).toContain('low-down-payment-purchase-options')
      expect(slugs).toContain('investment-property-loans')
      expect(slugs).toContain('refinance')
      expect(slugs).toContain('cash-out-refinance')
      expect(slugs).toContain('va-loan-refinance-options')
    })
  })

  describe('generateMetadata', () => {
    it('should generate correct metadata for a valid loan option', async () => {
      const metadata = await generateMetadata({
        params: { slug: 'fixed-rate-mortgage' },
      })

      expect(metadata.title).toBe('Fixed Rate Mortgage | Stable Home Loans - Model Mortgage')
      expect(metadata.description).toContain('fixed-rate mortgages')
      expect(metadata.keywords).toContain('fixed rate mortgage')
    })

    it('should generate metadata for all loan options', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })

        expect(metadata.title).toBe(option.metadata.title)
        expect(metadata.description).toBe(option.metadata.description)
        expect(metadata.keywords).toBe(option.metadata.keywords.join(', '))
      }
    })

    it('should include Open Graph metadata', async () => {
      const metadata = await generateMetadata({
        params: { slug: 'va-home-loan' },
      })

      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBeTruthy()
      expect(metadata.openGraph?.description).toBeTruthy()
      expect(metadata.openGraph?.type).toBe('website')
    })

    it('should include Twitter metadata', async () => {
      const metadata = await generateMetadata({
        params: { slug: 'fha-home-loan' },
      })

      expect(metadata.twitter).toBeDefined()
      expect(metadata.twitter?.card).toBe('summary_large_image')
      expect(metadata.twitter?.title).toBeTruthy()
      expect(metadata.twitter?.description).toBeTruthy()
    })

    it('should include canonical URL', async () => {
      const metadata = await generateMetadata({
        params: { slug: 'jumbo-home-loan' },
      })

      expect(metadata.alternates?.canonical).toBe('/loan-options/jumbo-home-loan')
    })

    it('should return not found metadata for invalid slug', async () => {
      const metadata = await generateMetadata({
        params: { slug: 'invalid-loan-option' },
      })

      expect(metadata.title).toBe('Loan Option Not Found')
      expect(metadata.description).toBe('The requested loan option could not be found.')
    })
  })

  describe('LoanOptionPage Component', () => {
    it('should render loan option page with all required sections', () => {
      render(<LoanOptionPage params={{ slug: 'fixed-rate-mortgage' }} />)

      // Check for main sections
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Key Benefits')).toBeInTheDocument()
      expect(screen.getByText('Requirements')).toBeInTheDocument()
      expect(screen.getByText('Ideal For')).toBeInTheDocument()
      expect(screen.getByText('Next Steps')).toBeInTheDocument()
    })

    it('should display loan option title and description', () => {
      render(<LoanOptionPage params={{ slug: 'fha-home-loan' }} />)

      // Use getAllByText since title appears in multiple places
      const titleElements = screen.getAllByText('FHA Home Loan')
      expect(titleElements.length).toBeGreaterThan(0)
      expect(screen.getByText(/Government-backed loans with low down payments/)).toBeInTheDocument()
    })

    it('should render all benefits', () => {
      render(<LoanOptionPage params={{ slug: 'va-home-loan' }} />)

      const vaLoan = loanOptions.find(o => o.slug === 'va-home-loan')!
      
      vaLoan.benefits.forEach(benefit => {
        expect(screen.getByText(benefit)).toBeInTheDocument()
      })
    })

    it('should render all requirements', () => {
      render(<LoanOptionPage params={{ slug: 'usda-loan' }} />)

      const usdaLoan = loanOptions.find(o => o.slug === 'usda-loan')!
      
      usdaLoan.requirements.forEach(requirement => {
        expect(screen.getByText(requirement)).toBeInTheDocument()
      })
    })

    it('should render all ideal for items', () => {
      render(<LoanOptionPage params={{ slug: 'jumbo-home-loan' }} />)

      const jumboLoan = loanOptions.find(o => o.slug === 'jumbo-home-loan')!
      
      jumboLoan.idealFor.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('should display related calculators section when calculators exist', () => {
      render(<LoanOptionPage params={{ slug: 'fixed-rate-mortgage' }} />)

      expect(screen.getByText('Related Calculators')).toBeInTheDocument()
      expect(screen.getByText('Purchase Calculator')).toBeInTheDocument()
      expect(screen.getByText('Affordability Calculator')).toBeInTheDocument()
    })

    it('should render breadcrumb navigation', () => {
      render(<LoanOptionPage params={{ slug: 'cash-out-refinance' }} />)

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Loan Options')).toBeInTheDocument()
      // Use getAllByText since the title appears in multiple places (h1, breadcrumb, CTA)
      const titleElements = screen.getAllByText('Cash Out Refinance')
      expect(titleElements.length).toBeGreaterThan(0)
    })

    it('should display CTA section', () => {
      render(<LoanOptionPage params={{ slug: 'first-time-home-buyer' }} />)

      expect(screen.getByText('Ready to Explore This Loan Option?')).toBeInTheDocument()
      expect(screen.getByText(/Contact us today to learn more/)).toBeInTheDocument()
    })

    it('should render next steps with ordered list', () => {
      render(<LoanOptionPage params={{ slug: 'investment-property-loans' }} />)

      expect(screen.getByText(/Schedule a consultation/)).toBeInTheDocument()
      expect(screen.getByText(/Get pre-approved/)).toBeInTheDocument()
      expect(screen.getByText(/Find your home/)).toBeInTheDocument()
      expect(screen.getByText(/Close on your loan/)).toBeInTheDocument()
    })

    it('should render all 11 loan option pages without errors', () => {
      loanOptions.forEach(option => {
        const { container } = render(<LoanOptionPage params={{ slug: option.slug }} />)
        expect(container).toBeInTheDocument()
        // Use getAllByText since title appears in multiple places
        const titleElements = screen.getAllByText(option.title)
        expect(titleElements.length).toBeGreaterThan(0)
      })
    })

    it('should call notFound for invalid slug', () => {
      const { notFound } = require('next/navigation')
      
      // Clear previous calls
      notFound.mockClear()
      // Make notFound throw an error to simulate Next.js behavior
      notFound.mockImplementation(() => {
        throw new Error('NEXT_NOT_FOUND')
      })
      
      // Suppress console errors for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      // Expect the component to throw when notFound is called
      expect(() => {
        render(<LoanOptionPage params={{ slug: 'invalid-slug' }} />)
      }).toThrow()
      
      expect(notFound).toHaveBeenCalled()
      
      // Restore console.error
      consoleSpy.mockRestore()
    })
  })

  describe('Content Structure', () => {
    it('should display full description with proper paragraphs', () => {
      render(<LoanOptionPage params={{ slug: 'va-home-loan' }} />)

      const vaLoan = loanOptions.find(o => o.slug === 'va-home-loan')!
      const paragraphs = vaLoan.fullDescription.split('\n\n')
      
      paragraphs.forEach(paragraph => {
        expect(screen.getByText(paragraph)).toBeInTheDocument()
      })
    })

    it('should have proper heading hierarchy', () => {
      const { container } = render(<LoanOptionPage params={{ slug: 'refinance' }} />)

      const h1Elements = container.querySelectorAll('h1')
      const h2Elements = container.querySelectorAll('h2')
      
      expect(h1Elements.length).toBe(1) // Only one H1
      expect(h2Elements.length).toBeGreaterThan(0) // Multiple H2s for sections
    })
  })

  describe('Links and Navigation', () => {
    it('should have links to related calculators', () => {
      render(<LoanOptionPage params={{ slug: 'va-home-loan' }} />)

      const vaLoan = loanOptions.find(o => o.slug === 'va-home-loan')!
      
      // Check that calculator links are present
      if (vaLoan.relatedCalculators.includes('va-purchase')) {
        expect(screen.getByText('VA Purchase Calculator')).toBeInTheDocument()
      }
      if (vaLoan.relatedCalculators.includes('va-refinance')) {
        expect(screen.getByText('VA Refinance Calculator')).toBeInTheDocument()
      }
    })

    it('should have CTA buttons', () => {
      render(<LoanOptionPage params={{ slug: 'low-down-payment-purchase-options' }} />)

      const scheduleButtons = screen.getAllByText('Schedule a Call')
      const viewAllButton = screen.getByText('View All Loan Options')
      
      expect(scheduleButtons.length).toBeGreaterThan(0)
      expect(viewAllButton).toBeInTheDocument()
    })
  })
})
