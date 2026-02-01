/**
 * Property-Based Tests for Navigation Consistency
 * Feature: website-structure-migration
 * 
 * Property 7: Navigation Consistency
 * For any page in the system, both the header and footer components should be 
 * present and contain the same navigation structure and links.
 * 
 * Validates: Requirements 2.3, 8.1, 8.2
 */

import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ContentPage } from '@/components/shared'

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/')
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

describe('Property 7: Navigation Consistency', () => {
  /**
   * **Validates: Requirements 2.3, 8.1, 8.2**
   * 
   * This property test verifies that Header and Footer components are present
   * and contain consistent navigation structure across different page configurations.
   */
  it('should have Header and Footer present on any ContentPage configuration', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary page titles
        fc.string({ minLength: 1, maxLength: 100 }),
        // Generate arbitrary subtitles (optional)
        fc.option(fc.string({ minLength: 1, maxLength: 200 })),
        // Generate arbitrary showCTA boolean
        fc.boolean(),
        (title, subtitle, showCTA) => {
          const { unmount } = render(
            <ContentPage
              title={title}
              subtitle={subtitle || undefined}
              showCTA={showCTA}
            >
              <div>Test Content</div>
            </ContentPage>
          )

          // Property: Header must be present (using banner role)
          const header = screen.getByRole('banner')
          expect(header).toBeInTheDocument()

          // Property: Footer must be present (using contentinfo role)
          const footer = screen.getByRole('contentinfo')
          expect(footer).toBeInTheDocument()

          // Property: Main content area must exist
          const main = screen.getByRole('main')
          expect(main).toBeInTheDocument()

          // Clean up after each iteration
          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should have consistent navigation links in Header across different paths', () => {
    const expectedHeaderLinks = [
      { name: /^learn$/i, href: '/learn' },
      { name: /pre-qualify/i, href: '/pre-qualify' },
      { name: /^calculator$/i, href: '/calculator' },
      { name: /loan options/i, href: '/loan-options' },
      { name: /about us/i, href: '/about' },
      { name: /^blog$/i, href: '/blog' },
      { name: /^contact$/i, href: '/contact' },
      { name: /apply online/i, href: '/apply' }
    ]

    fc.assert(
      fc.property(
        // Generate arbitrary paths
        fc.constantFrom(
          '/',
          '/calculator',
          '/calculator/affordability',
          '/blog',
          '/blog/article',
          '/loan-options',
          '/loan-options/fha',
          '/about',
          '/contact'
        ),
        (path) => {
          const { usePathname } = require('next/navigation')
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          // Property: All expected navigation links must be present
          expectedHeaderLinks.forEach(({ name, href }) => {
            const links = screen.getAllByRole('link', { name })
            expect(links.length).toBeGreaterThanOrEqual(1)
            const link = links[0]
            expect(link).toHaveAttribute('href', href)
          })

          // Clean up after each iteration
          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should have consistent navigation structure in Footer', () => {
    // Property: Footer should always contain the same link categories
    const expectedFooterCategories = [
      'About Us',
      'Loan Options',
      'Resources',
      'Connect With Us'
    ]

    render(<Footer />)

    // Property: All expected categories must be present
    expectedFooterCategories.forEach(category => {
      expect(screen.getByRole('heading', { name: category })).toBeInTheDocument()
    })

    // Property: Footer must contain legal links
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ada accessibility/i })).toBeInTheDocument()

    // Property: Footer must contain contact information
    expect(screen.getByRole('link', { name: /\(832\) 727-4128/i })).toBeInTheDocument()
  })

  it('should maintain Header and Footer structure regardless of content complexity', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary number of content sections
        fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
        // Generate arbitrary breadcrumb depth
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }),
            href: fc.webPath()
          }),
          { minLength: 0, maxLength: 5 }
        ),
        (contentSections, breadcrumbs) => {
          const { unmount } = render(
            <ContentPage
              title="Test Page"
              breadcrumbs={breadcrumbs.length > 0 ? breadcrumbs : undefined}
            >
              {contentSections.map((content, index) => (
                <section key={index}>
                  <p>{content}</p>
                </section>
              ))}
            </ContentPage>
          )

          // Property: Header must always be present regardless of content (using banner role)
          expect(screen.getByRole('banner')).toBeInTheDocument()

          // Property: Footer must always be present regardless of content (using contentinfo role)
          expect(screen.getByRole('contentinfo')).toBeInTheDocument()

          // Property: Navigation must be accessible
          const navigations = screen.getAllByRole('navigation')
          expect(navigations.length).toBeGreaterThanOrEqual(1)

          // Clean up after each iteration
          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should have accessible navigation elements in both Header and Footer', () => {
    render(
      <>
        <Header />
        <Footer />
      </>
    )

    // Property: Header must have navigation role
    const navigations = screen.getAllByRole('navigation')
    expect(navigations.length).toBeGreaterThanOrEqual(1)

    // Property: All navigation links must be keyboard accessible
    const allLinks = screen.getAllByRole('link')
    expect(allLinks.length).toBeGreaterThan(0)

    // Property: Each link must have an href attribute
    allLinks.forEach(link => {
      expect(link).toHaveAttribute('href')
      const href = link.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).not.toBe('')
    })
  })
})
