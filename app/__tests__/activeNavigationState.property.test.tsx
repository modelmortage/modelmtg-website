/**
 * Property-Based Test for Active Navigation State
 * Feature: website-structure-migration
 * Task: 14.5 Write property test for active navigation state
 * 
 * Property 23: Active Navigation State
 * For any page, the navigation item corresponding to the current page should 
 * have an active state indicator (class or style).
 * 
 * **Validates: Requirements 8.3**
 */

import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import '@testing-library/jest-dom'

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

const { usePathname } = require('next/navigation')

describe('Property 23: Active Navigation State', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property test verifies that for any page path, the corresponding
   * navigation item is marked as active with proper class and aria-current attribute.
   * 
   * The test generates various page paths and verifies:
   * 1. Exactly one navigation item is active (or none for home page)
   * 2. Active item has the 'active' CSS class
   * 3. Active item has aria-current="page" attribute
   * 4. Active state corresponds to the correct navigation section
   */
  it('should mark exactly one navigation item as active for any valid page path', () => {
    // Define all navigation sections with their base paths and example nested paths
    const navigationSections = [
      { 
        section: 'learn', 
        basePath: '/learn',
        nestedPaths: ['/learn', '/learn/article', '/learn/guide/mortgages']
      },
      { 
        section: 'pre-qualify', 
        basePath: '/pre-qualify',
        nestedPaths: ['/pre-qualify', '/pre-qualify/step-1']
      },
      { 
        section: 'calculator', 
        basePath: '/calculator',
        nestedPaths: [
          '/calculator',
          '/calculator/affordability',
          '/calculator/purchase',
          '/calculator/refinance',
          '/calculator/rent-vs-buy',
          '/calculator/va-purchase',
          '/calculator/va-refinance',
          '/calculator/dscr'
        ]
      },
      { 
        section: 'loan-options', 
        basePath: '/loan-options',
        nestedPaths: [
          '/loan-options',
          '/loan-options/fha-home-loan',
          '/loan-options/va',
          '/loan-options/conventional',
          '/loan-options/jumbo',
          '/loan-options/usda'
        ]
      },
      { 
        section: 'about', 
        basePath: '/about',
        nestedPaths: ['/about', '/about-us', '/about/team']
      },
      { 
        section: 'blog', 
        basePath: '/blog',
        nestedPaths: [
          '/blog',
          '/blog/article-1',
          '/blog/article-2',
          '/blog/category/mortgages'
        ]
      },
      { 
        section: 'contact', 
        basePath: '/contact',
        nestedPaths: ['/contact', '/contact/schedule']
      }
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...navigationSections),
        fc.integer({ min: 0, max: 100 }),
        (navSection, pathIndex) => {
          // Select a path from the nested paths array
          const path = navSection.nestedPaths[pathIndex % navSection.nestedPaths.length]
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property 1: Exactly one navigation item should be active
          const activeLinks = container.querySelectorAll('.active')
          expect(activeLinks.length).toBe(1)
          
          // Property 2: Active link should have the 'active' CSS class
          const activeLink = activeLinks[0]
          expect(activeLink).toHaveClass('active')
          
          // Property 3: Active link should have aria-current="page"
          expect(activeLink).toHaveAttribute('aria-current', 'page')
          
          // Property 4: Active link should correspond to the current section
          const linkText = activeLink.textContent?.toLowerCase() || ''
          const sectionName = navSection.section.toLowerCase()
          
          // Verify the correct section is marked as active
          if (sectionName === 'loan-options') {
            expect(linkText).toContain('loan')
          } else if (sectionName === 'pre-qualify') {
            expect(linkText).toContain('qualify')
          } else if (sectionName === 'about') {
            expect(linkText).toContain('about')
          } else {
            expect(linkText).toContain(sectionName)
          }

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that the home page (/) has no active navigation items,
   * as it doesn't correspond to any specific navigation section.
   */
  it('should not mark any navigation item as active on the home page', () => {
    fc.assert(
      fc.property(
        fc.constant('/'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Home page should have zero active navigation items
          const activeLinks = container.querySelectorAll('.active')
          expect(activeLinks.length).toBe(0)

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that active state is determined by the base path segment,
   * not by the depth of nesting. For example, /calculator/affordability and
   * /calculator/affordability/advanced should both mark the calculator nav item as active.
   */
  it('should maintain active state consistency across different nested depths', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('calculator', 'blog', 'loan-options', 'learn', 'about'),
        fc.array(
          fc.string({ minLength: 3, maxLength: 15 }).filter(s => /^[a-z0-9-]+$/.test(s)),
          { minLength: 0, maxLength: 4 }
        ),
        (baseSection, pathSegments) => {
          // Build a nested path with arbitrary depth
          const path = `/${baseSection}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Active state should be determined by base section, not depth
          const activeLinks = container.querySelectorAll('.active')
          expect(activeLinks.length).toBe(1)

          const activeLink = activeLinks[0]
          expect(activeLink).toHaveAttribute('aria-current', 'page')
          
          // Verify the base section is marked as active
          const linkText = activeLink.textContent?.toLowerCase() || ''
          if (baseSection === 'loan-options') {
            expect(linkText).toContain('loan')
          } else {
            expect(linkText).toContain(baseSection)
          }

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that the CTA button (Apply Online) is never marked
   * as active, even when on the /apply page. CTA buttons should maintain their
   * distinct styling and not participate in active state indication.
   */
  it('should never mark CTA button as active regardless of current path', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/apply',
          '/calculator',
          '/blog',
          '/loan-options',
          '/contact',
          '/about',
          '/learn',
          '/pre-qualify'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          const applyButton = screen.getByRole('link', { name: /apply online/i })
          
          // Property 1: CTA button should never have active class
          expect(applyButton).not.toHaveClass('active')
          
          // Property 2: CTA button should always have ctaButton class
          expect(applyButton).toHaveClass('ctaButton')
          
          // Property 3: CTA button should not have aria-current attribute
          expect(applyButton).not.toHaveAttribute('aria-current')

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that when the pathname changes, the active state
   * updates accordingly. This ensures the navigation responds to route changes.
   */
  it('should update active state when pathname changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { from: '/blog', to: '/calculator' },
          { from: '/calculator', to: '/loan-options' },
          { from: '/loan-options', to: '/about' },
          { from: '/about', to: '/blog' },
          { from: '/learn', to: '/contact' },
          { from: '/contact', to: '/pre-qualify' }
        ),
        (pathChange) => {
          // Start with the first path
          usePathname.mockReturnValue(pathChange.from)
          const { container, rerender, unmount } = render(<Header />)

          // Verify initial active state
          let activeLinks = container.querySelectorAll('.active')
          expect(activeLinks.length).toBe(1)
          const initialActiveText = activeLinks[0].textContent?.toLowerCase() || ''

          // Change to the second path
          usePathname.mockReturnValue(pathChange.to)
          rerender(<Header />)

          // Verify updated active state
          activeLinks = container.querySelectorAll('.active')
          expect(activeLinks.length).toBe(1)
          const updatedActiveText = activeLinks[0].textContent?.toLowerCase() || ''

          // Property: Active text should have changed
          expect(updatedActiveText).not.toBe(initialActiveText)

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that all active navigation items have both
   * the CSS class and the ARIA attribute for proper styling and accessibility.
   */
  it('should have both CSS class and ARIA attribute on all active navigation items', () => {
    const testPaths = [
      '/learn',
      '/pre-qualify',
      '/calculator',
      '/calculator/affordability',
      '/loan-options',
      '/loan-options/fha-home-loan',
      '/about',
      '/blog',
      '/blog/article',
      '/contact'
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...testPaths),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          const activeLinks = container.querySelectorAll('.active')
          
          // Property: Each active link must have both class and aria-current
          activeLinks.forEach(activeLink => {
            expect(activeLink).toHaveClass('active')
            expect(activeLink).toHaveAttribute('aria-current', 'page')
          })

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that non-active navigation items do not have
   * the active class or aria-current attribute.
   */
  it('should not mark non-active navigation items with active indicators', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/calculator',
          '/blog',
          '/loan-options',
          '/about',
          '/learn',
          '/contact',
          '/pre-qualify'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Get all navigation links
          const allNavLinks = container.querySelectorAll('nav a')
          const activeLinks = container.querySelectorAll('.active')
          
          // Property: Non-active links should not have active class or aria-current
          allNavLinks.forEach(link => {
            const isActive = Array.from(activeLinks).includes(link)
            
            if (!isActive) {
              expect(link).not.toHaveClass('active')
              expect(link).not.toHaveAttribute('aria-current', 'page')
            }
          })

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that the active state works correctly for
   * all calculator sub-pages, ensuring consistent behavior across
   * the entire calculator section.
   */
  it('should mark calculator as active for all calculator sub-pages', () => {
    const calculatorPaths = [
      '/calculator',
      '/calculator/affordability',
      '/calculator/purchase',
      '/calculator/refinance',
      '/calculator/rent-vs-buy',
      '/calculator/va-purchase',
      '/calculator/va-refinance',
      '/calculator/dscr'
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...calculatorPaths),
        (path) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
          
          // Property: Calculator link should be active for all calculator paths
          expect(calculatorLink).toHaveClass('active')
          expect(calculatorLink).toHaveAttribute('aria-current', 'page')

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that the active state works correctly for
   * all loan options sub-pages, ensuring consistent behavior across
   * the entire loan options section.
   */
  it('should mark loan options as active for all loan options sub-pages', () => {
    const loanOptionPaths = [
      '/loan-options',
      '/loan-options/fha-home-loan',
      '/loan-options/va',
      '/loan-options/conventional',
      '/loan-options/jumbo',
      '/loan-options/usda',
      '/loan-options/first-time-home-buyer',
      '/loan-options/refinance'
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...loanOptionPaths),
        (path) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          const loanOptionsLink = screen.getByRole('link', { name: /loan options/i })
          
          // Property: Loan Options link should be active for all loan option paths
          expect(loanOptionsLink).toHaveClass('active')
          expect(loanOptionsLink).toHaveAttribute('aria-current', 'page')

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  /**
   * **Validates: Requirements 8.3**
   * 
   * This property verifies that the active state works correctly for
   * all blog sub-pages, ensuring consistent behavior across the blog section.
   */
  it('should mark blog as active for all blog sub-pages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/blog'),
        fc.array(
          fc.string({ minLength: 5, maxLength: 30 }).filter(s => /^[a-z0-9-]+$/.test(s)),
          { minLength: 0, maxLength: 2 }
        ),
        (basePath, slugSegments) => {
          const path = slugSegments.length > 0 
            ? `${basePath}/${slugSegments.join('/')}`
            : basePath
          
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          const blogLink = screen.getByRole('link', { name: /^blog$/i })
          
          // Property: Blog link should be active for all blog paths
          expect(blogLink).toHaveClass('active')
          expect(blogLink).toHaveAttribute('aria-current', 'page')

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })
})
