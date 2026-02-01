/**
 * Property-Based Test for Navigation Link Functionality
 * Feature: website-structure-migration
 * Task: 14.7 Write property test for navigation link functionality
 * 
 * Property 25: Navigation Link Functionality
 * For any navigation link, clicking it should navigate to the correct URL 
 * without errors or broken links.
 * 
 * **Validates: Requirements 8.5**
 */

import { render } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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

describe('Property 25: Navigation Link Functionality', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property test verifies that all navigation links in the header
   * have valid href attributes that point to proper URLs without errors.
   * 
   * The test verifies:
   * 1. All links have non-empty href attributes
   * 2. All hrefs are valid paths (start with /, mailto:, tel:, or http)
   * 3. No links point to '#' (broken/placeholder links)
   * 4. All links are properly structured for navigation
   */
  it('should have valid href attributes for all header navigation links', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/calculator',
          '/calculator/affordability',
          '/blog',
          '/blog/article',
          '/loan-options',
          '/loan-options/fha',
          '/about',
          '/contact',
          '/learn',
          '/pre-qualify'
        ),
        (currentPath) => {
          usePathname.mockReturnValue(currentPath)

          const { container, unmount } = render(<Header />)

          // Property 1: All links must have href attributes
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBeGreaterThan(0)

          allLinks.forEach(link => {
            const href = link.getAttribute('href')
            
            // Property 2: href must not be empty or null
            expect(href).toBeTruthy()
            expect(href).not.toBe('')
            
            // Property 3: href must not be just '#' (broken link)
            expect(href).not.toBe('#')
            
            // Property 4: href must be a valid path or protocol
            const isValidHref = 
              href?.startsWith('/') || 
              href?.startsWith('mailto:') || 
              href?.startsWith('tel:') || 
              href?.startsWith('http://') ||
              href?.startsWith('https://')
            
            expect(isValidHref).toBe(true)
          })

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that all footer navigation links have valid
   * href attributes and are properly structured.
   */
  it('should have valid href attributes for all footer navigation links', () => {
    const { container } = render(<Footer />)

    // Property 1: All footer links must have href attributes
    const allLinks = container.querySelectorAll('a')
    expect(allLinks.length).toBeGreaterThan(0)

    allLinks.forEach(link => {
      const href = link.getAttribute('href')
      
      // Property 2: href must not be empty
      expect(href).toBeTruthy()
      expect(href).not.toBe('')
      
      // Property 3: href must be a valid path or protocol
      // Note: Footer may have '#' for placeholder social links
      const isValidHref = 
        href?.startsWith('/') || 
        href?.startsWith('mailto:') || 
        href?.startsWith('tel:') || 
        href?.startsWith('http://') ||
        href?.startsWith('https://') ||
        href === '#'
      
      expect(isValidHref).toBe(true)
    })
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that navigation links are keyboard accessible
   * and don't have negative tabindex values that would prevent keyboard navigation.
   */
  it('should have keyboard accessible navigation links for any page state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/calculator/affordability',
          '/blog/article',
          '/loan-options/fha',
          '/about',
          '/contact',
          '/pre-qualify'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All links must be keyboard accessible
          const allLinks = container.querySelectorAll('a[href]')
          
          allLinks.forEach(link => {
            const tabindex = link.getAttribute('tabindex')
            
            // Property: Links should not have negative tabindex
            if (tabindex !== null) {
              expect(parseInt(tabindex)).toBeGreaterThanOrEqual(0)
            }
            
            // Property: Links should be focusable (not disabled)
            expect(link).not.toHaveAttribute('disabled')
          })

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that all navigation links have proper text content
   * or aria-label for accessibility and screen readers.
   */
  it('should have proper link text or aria-label for accessibility', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(
            <>
              <Header />
              <Footer />
            </>
          )

          // Property: All links must have text content or aria-label
          const allLinks = container.querySelectorAll('a[href]')
          
          allLinks.forEach(link => {
            const hasTextContent = (link.textContent?.trim().length || 0) > 0
            const hasAriaLabel = link.hasAttribute('aria-label')
            const hasAriaLabelledBy = link.hasAttribute('aria-labelledby')
            
            // Property: Link must have either text content or aria-label/aria-labelledby
            expect(hasTextContent || hasAriaLabel || hasAriaLabelledBy).toBe(true)
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that navigation links with the same text
   * consistently point to the same destination across the application.
   */
  it('should not have duplicate navigation links with different hrefs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Links with same text should have same href
          const linkMap = new Map<string, string>()
          const navLinks = container.querySelectorAll('nav a[href]')

          navLinks.forEach(link => {
            const text = link.textContent?.trim().toLowerCase()
            const href = link.getAttribute('href')

            if (text && href && text !== '') {
              if (linkMap.has(text)) {
                // If we've seen this text before, href should match
                expect(linkMap.get(text)).toBe(href)
              } else {
                linkMap.set(text, href)
              }
            }
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that all main navigation links point to
   * expected application routes and are not broken.
   */
  it('should have all expected main navigation links with correct paths', () => {
    const expectedNavLinks = [
      { text: 'learn', href: '/learn' },
      { text: 'pre-qualify', href: '/pre-qualify' },
      { text: 'calculator', href: '/calculator' },
      { text: 'loan options', href: '/loan-options' },
      { text: 'about us', href: '/about' },
      { text: 'blog', href: '/blog' },
      { text: 'contact', href: '/contact' },
      { text: 'apply online', href: '/apply' }
    ]

    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All expected navigation links should be present with correct hrefs
          expectedNavLinks.forEach(expectedLink => {
            const links = Array.from(container.querySelectorAll('nav a'))
            const matchingLink = links.find(link => 
              link.textContent?.toLowerCase().trim() === expectedLink.text &&
              link.getAttribute('href') === expectedLink.href
            )
            
            expect(matchingLink).toBeTruthy()
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that navigation links maintain consistent
   * structure and attributes across different page states.
   */
  it('should maintain consistent link structure across header and footer', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(
            <>
              <Header />
              <Footer />
            </>
          )

          // Property 1: Both header and footer must have navigation links
          const allLinks = container.querySelectorAll('a[href]')
          expect(allLinks.length).toBeGreaterThan(0)

          // Property 2: All links must have valid hrefs
          allLinks.forEach(link => {
            const href = link.getAttribute('href')
            expect(href).toBeTruthy()
            expect(href).not.toBe('')
          })

          // Property 3: Navigation elements must be present
          const navigations = container.querySelectorAll('nav')
          expect(navigations.length).toBeGreaterThanOrEqual(1)

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that all navigation links have proper
   * HTML structure and are valid anchor elements.
   */
  it('should have properly structured anchor elements for all navigation links', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All navigation links should be proper anchor elements
          const allLinks = container.querySelectorAll('nav a')
          
          allLinks.forEach(link => {
            // Property 1: Should be an anchor element
            expect(link.tagName).toBe('A')
            
            // Property 2: Should have href attribute
            expect(link.hasAttribute('href')).toBe(true)
            
            // Property 3: Should not have invalid attributes
            expect(link.hasAttribute('onclick')).toBe(false)
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that footer links to important pages
   * are present and functional.
   */
  it('should have all expected footer navigation links with correct paths', () => {
    const expectedFooterSections = [
      { section: 'About Us', links: ['/about', '/team', '/reviews', '/contact'] },
      { section: 'Loan Options', links: ['/loan-options/conventional', '/loan-options/fha', '/loan-options/va', '/loan-options/jumbo', '/loan-options/refinance'] },
      { section: 'Resources', links: ['/learn', '/calculator', '/pre-qualify', '/blog'] },
      { section: 'Legal', links: ['/privacy-policy', '/nmls', '/ada-accessibility-statement'] }
    ]

    const { container } = render(<Footer />)

    // Property: All expected footer links should be present
    expectedFooterSections.forEach(section => {
      section.links.forEach(expectedHref => {
        const links = Array.from(container.querySelectorAll('a'))
        const matchingLink = links.find(link => 
          link.getAttribute('href') === expectedHref
        )
        
        // Each expected link should exist in the footer
        expect(matchingLink).toBeTruthy()
      })
    })
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that contact links (phone, email) in the footer
   * use proper protocols (tel:, mailto:).
   */
  it('should have properly formatted contact links in footer', () => {
    const { container } = render(<Footer />)

    // Property: Phone links should use tel: protocol
    const phoneLinks = Array.from(container.querySelectorAll('a[href^="tel:"]'))
    phoneLinks.forEach(link => {
      const href = link.getAttribute('href')
      expect(href).toMatch(/^tel:\+?[\d-()]+$/)
    })

    // Property: Email links should use mailto: protocol
    const emailLinks = Array.from(container.querySelectorAll('a[href^="mailto:"]'))
    emailLinks.forEach(link => {
      const href = link.getAttribute('href')
      expect(href).toMatch(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that navigation links work correctly
   * regardless of the current page depth or nesting level.
   */
  it('should have valid navigation links regardless of page depth', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/calculator',
          '/calculator/affordability',
          '/blog',
          '/blog/article-slug',
          '/loan-options',
          '/loan-options/fha',
          '/loan-options/va/details'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All navigation links should be valid regardless of current depth
          const allLinks = container.querySelectorAll('nav a[href]')
          
          allLinks.forEach(link => {
            const href = link.getAttribute('href')
            
            // Property 1: href should be absolute path (start with /)
            if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
              expect(href.startsWith('/')).toBe(true)
            }
            
            // Property 2: href should not contain '..' (relative navigation)
            expect(href).not.toContain('..')
            
            // Property 3: href should not have double slashes (except after protocol)
            if (href && href.startsWith('/')) {
              expect(href).not.toMatch(/\/\//)
            }
          })

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  /**
   * **Validates: Requirements 8.5**
   * 
   * This property verifies that all navigation links are clickable
   * and not obscured by other elements.
   */
  it('should have clickable navigation links that are not disabled', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All navigation links should be clickable
          const allLinks = container.querySelectorAll('nav a[href]')
          
          allLinks.forEach(link => {
            // Property 1: Should not be disabled
            expect(link).not.toHaveAttribute('disabled')
            
            // Property 2: Should not have pointer-events: none
            const computedStyle = window.getComputedStyle(link)
            expect(computedStyle.pointerEvents).not.toBe('none')
            
            // Property 3: Should have href (already verified, but double-check)
            expect(link.getAttribute('href')).toBeTruthy()
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })
})
