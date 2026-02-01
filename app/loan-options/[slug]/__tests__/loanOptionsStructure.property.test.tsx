/**
 * Property-Based Tests for Loan Options Structure
 * Feature: website-structure-migration
 * 
 * Property 10: Loan Options Structure
 * For any loan options page, the content should include all required sections:
 * overview, benefits list, requirements list, and call-to-action.
 * 
 * **Validates: Requirements 3.2, 3.3**
 */

import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import LoanOptionPage from '../page'
import { loanOptions } from '@/lib/content/loanOptions'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  usePathname: jest.fn(() => '/loan-options/test')
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
        <header role="banner">
          <nav role="navigation">Header Nav</nav>
        </header>
        <main role="main">
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
            <section data-testid="cta-section">
              <h2>{cta.title}</h2>
              <p>{cta.description}</p>
              <a href={cta.buttonHref}>{cta.buttonText}</a>
            </section>
          )}
        </main>
        <footer role="contentinfo">Footer</footer>
      </div>
    )
  }
})

describe('Property 10: Loan Options Structure', () => {
  /**
   * **Validates: Requirements 3.2, 3.3**
   * 
   * This property test verifies that loan options pages have consistent structure
   * with all required sections: overview, benefits, requirements, and call-to-action.
   */
  
  it('should render any loan option page with all required sections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          // Render the loan option page
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Page should render without errors
          expect(container).toBeInTheDocument()
          
          // Property: Overview section must exist
          const overviewHeading = screen.getByText('Overview')
          expect(overviewHeading).toBeInTheDocument()
          
          // Property: Benefits section must exist
          const benefitsHeading = screen.getByText('Key Benefits')
          expect(benefitsHeading).toBeInTheDocument()
          
          // Property: Requirements section must exist
          const requirementsHeading = screen.getByText('Requirements')
          expect(requirementsHeading).toBeInTheDocument()
          
          // Property: Call-to-action section must exist
          const ctaSection = container.querySelector('[data-testid="cta-section"]')
          expect(ctaSection).toBeInTheDocument()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display overview content for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Overview section should contain the full description
          const overviewHeading = screen.getByText('Overview')
          const overviewSection = overviewHeading.closest('section')
          expect(overviewSection).toBeInTheDocument()
          
          // Property: Full description paragraphs should be present
          const paragraphs = loanOption.fullDescription.split('\n\n')
          paragraphs.forEach(paragraph => {
            expect(screen.getByText(paragraph)).toBeInTheDocument()
          })
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display all benefits as a list for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Benefits section should exist
          const benefitsHeading = screen.getByText('Key Benefits')
          const benefitsSection = benefitsHeading.closest('section')
          expect(benefitsSection).toBeInTheDocument()
          
          // Property: Benefits should be displayed as a list
          const benefitsList = benefitsSection?.querySelector('ul')
          expect(benefitsList).toBeInTheDocument()
          
          // Property: All benefits should be present
          loanOption.benefits.forEach(benefit => {
            expect(screen.getByText(benefit)).toBeInTheDocument()
          })
          
          // Property: Number of benefit items should match data
          const benefitItems = benefitsSection?.querySelectorAll('li')
          expect(benefitItems?.length).toBe(loanOption.benefits.length)
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display all requirements as a list for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Requirements section should exist
          const requirementsHeading = screen.getByText('Requirements')
          const requirementsSection = requirementsHeading.closest('section')
          expect(requirementsSection).toBeInTheDocument()
          
          // Property: Requirements should be displayed as a list
          const requirementsList = requirementsSection?.querySelector('ul')
          expect(requirementsList).toBeInTheDocument()
          
          // Property: All requirements should be present
          loanOption.requirements.forEach(requirement => {
            expect(screen.getByText(requirement)).toBeInTheDocument()
          })
          
          // Property: Number of requirement items should match data
          const requirementItems = requirementsSection?.querySelectorAll('li')
          expect(requirementItems?.length).toBe(loanOption.requirements.length)
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display call-to-action section for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: CTA section should exist
          const ctaSection = container.querySelector('[data-testid="cta-section"]')
          expect(ctaSection).toBeInTheDocument()
          
          // Property: CTA should have a title
          const ctaTitles = screen.getAllByText('Ready to Explore This Loan Option?')
          expect(ctaTitles.length).toBeGreaterThan(0)
          
          // Property: CTA should have a description mentioning the loan type
          const ctaDescription = screen.getByText(
            new RegExp(`Contact us today to learn more about ${loanOption.title}`)
          )
          expect(ctaDescription).toBeInTheDocument()
          
          // Property: CTA should have an action button
          const ctaButtons = screen.getAllByText('Schedule a Call')
          expect(ctaButtons.length).toBeGreaterThan(0)
          // Check that at least one is a link to schedule-a-call
          const scheduleLinks = ctaButtons.filter(btn => 
            btn.closest('a')?.getAttribute('href') === '/schedule-a-call'
          )
          expect(scheduleLinks.length).toBeGreaterThan(0)
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should have consistent section structure across all loan options', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: All required sections should be present in order
          const main = container.querySelector('main')
          const sections = main?.querySelectorAll('section')
          
          expect(sections).toBeTruthy()
          expect(sections!.length).toBeGreaterThanOrEqual(4) // At least 4 sections
          
          // Property: Section headings should follow proper hierarchy
          const h2Headings = main?.querySelectorAll('h2')
          expect(h2Headings).toBeTruthy()
          expect(h2Headings!.length).toBeGreaterThanOrEqual(4)
          
          // Property: Required section headings should be present
          const headingTexts = Array.from(h2Headings!).map(h => h.textContent)
          expect(headingTexts).toContain('Overview')
          expect(headingTexts).toContain('Key Benefits')
          expect(headingTexts).toContain('Requirements')
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display ideal for section for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Ideal For section should exist
          const idealForHeading = screen.getByText('Ideal For')
          expect(idealForHeading).toBeInTheDocument()
          
          // Property: All ideal for items should be present
          loanOption.idealFor.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument()
          })
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display related calculators when available', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: If loan has related calculators, section should exist
          if (loanOption.relatedCalculators.length > 0) {
            const calculatorsHeading = screen.getByText('Related Calculators')
            expect(calculatorsHeading).toBeInTheDocument()
          }
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display next steps section for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Next Steps section should exist
          const nextStepsHeading = screen.getByText('Next Steps')
          expect(nextStepsHeading).toBeInTheDocument()
          
          // Property: Next steps should have an ordered list
          const nextStepsSection = nextStepsHeading.closest('section')
          const orderedList = nextStepsSection?.querySelector('ol')
          expect(orderedList).toBeInTheDocument()
          
          // Property: Should have at least 4 steps
          const listItems = orderedList?.querySelectorAll('li')
          expect(listItems?.length).toBeGreaterThanOrEqual(4)
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should have proper heading hierarchy for any loan option page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Should have exactly one h1
          const main = container.querySelector('main')
          const h1Elements = main?.querySelectorAll('h1')
          expect(h1Elements?.length).toBe(1)
          
          // Property: h1 should contain the loan option title
          expect(h1Elements?.[0].textContent).toBe(loanOption.title)
          
          // Property: All section headings should be h2
          const overviewHeading = screen.getByText('Overview')
          expect(overviewHeading.tagName).toBe('H2')
          
          const benefitsHeading = screen.getByText('Key Benefits')
          expect(benefitsHeading.tagName).toBe('H2')
          
          const requirementsHeading = screen.getByText('Requirements')
          expect(requirementsHeading.tagName).toBe('H2')
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display breadcrumb navigation for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Breadcrumb navigation should exist
          const breadcrumb = screen.getByLabelText('Breadcrumb')
          expect(breadcrumb).toBeInTheDocument()
          
          // Property: Breadcrumb should contain "Loan Options"
          expect(screen.getByText('Loan Options')).toBeInTheDocument()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should render all 11 loan option pages with complete structure', () => {
    // Property: All loan options should render successfully
    loanOptions.forEach(loanOption => {
      const { container, unmount } = render(
        <LoanOptionPage params={{ slug: loanOption.slug }} />
      )
      
      // Verify all required sections exist
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Key Benefits')).toBeInTheDocument()
      expect(screen.getByText('Requirements')).toBeInTheDocument()
      expect(screen.getByText('Ideal For')).toBeInTheDocument()
      expect(screen.getByText('Next Steps')).toBeInTheDocument()
      
      // Verify CTA exists
      const ctaSection = container.querySelector('[data-testid="cta-section"]')
      expect(ctaSection).toBeInTheDocument()
      
      unmount()
    })
  })
  
  it('should have semantic HTML structure for any loan option page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { container, unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Should use semantic HTML elements
          const main = container.querySelector('main')
          const header = container.querySelector('header')
          const footer = container.querySelector('footer')
          const sections = container.querySelectorAll('section')
          
          expect(main).toBeInTheDocument()
          expect(header).toBeInTheDocument()
          expect(footer).toBeInTheDocument()
          expect(sections.length).toBeGreaterThan(0)
          
          // Property: Lists should use proper list elements
          const lists = main?.querySelectorAll('ul, ol')
          expect(lists).toBeTruthy()
          expect(lists!.length).toBeGreaterThanOrEqual(3) // Benefits, Requirements, Ideal For
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should render without console errors for any loan option', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: No console errors should be logged during render
          expect(consoleSpy).not.toHaveBeenCalled()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
    
    consoleSpy.mockRestore()
  })
  
  it('should have consistent content structure across all loan options', () => {
    // Property: All loan options should have the same section structure
    const sectionStructures = loanOptions.map(loanOption => {
      const { container, unmount } = render(
        <LoanOptionPage params={{ slug: loanOption.slug }} />
      )
      
      const main = container.querySelector('main')
      const h2Headings = Array.from(main?.querySelectorAll('h2') || [])
        .map(h => h.textContent)
      
      unmount()
      
      return h2Headings
    })
    
    // Property: All pages should have the same core sections
    const coreSection = ['Overview', 'Key Benefits', 'Requirements', 'Ideal For']
    sectionStructures.forEach(structure => {
      coreSection.forEach(section => {
        expect(structure).toContain(section)
      })
    })
  })
  
  it('should display title and subtitle for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Title should be displayed
          const titleElements = screen.getAllByText(loanOption.title)
          expect(titleElements.length).toBeGreaterThan(0)
          
          // Property: Short description should be displayed
          expect(screen.getByText(loanOption.shortDescription)).toBeInTheDocument()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should have action buttons in next steps for any loan option', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: loanOptions.length - 1 }),
        (loanIndex) => {
          const loanOption = loanOptions[loanIndex]
          
          const { unmount } = render(
            <LoanOptionPage params={{ slug: loanOption.slug }} />
          )
          
          // Property: Should have "Schedule a Call" button
          const scheduleButtons = screen.getAllByText('Schedule a Call')
          expect(scheduleButtons.length).toBeGreaterThan(0)
          
          // Property: Should have "View All Loan Options" button
          const viewAllButton = screen.getByText('View All Loan Options')
          expect(viewAllButton).toBeInTheDocument()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})
