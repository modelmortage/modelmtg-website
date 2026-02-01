/**
 * Property-Based Tests for Navigation Flows
 * Feature: website-structure-migration
 * Task: 14.1 Test navigation flows
 * 
 * Property 23: Active Navigation State
 * For any page, the navigation item corresponding to the current page should 
 * have an active state indicator (class or style).
 * Validates: Requirements 8.3
 * 
 * Property 24: Breadcrumb Navigation
 * For any nested page (loan options, blog posts, team profiles), breadcrumb 
 * navigation should be present showing the hierarchical path.
 * Validates: Requirements 8.4
 * 
 * Property 25: Navigation Link Functionality
 * For any navigation link, clicking it should navigate to the correct URL 
 * without errors or broken links.
 * Validates: Requirements 8.5
 */

import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ContentPage from '@/components/shared/ContentPage'

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
  /**
   * **Validates: Requirements 8.3**
   * 
   * This property test verifies that for any page path, the corresponding
   * navigation item is marked as active with proper class and aria-current attribute.
   */
  it('should mark the correct navigation item as active for any valid path', () => {
    // Define navigation sections and their paths
    const navigationSections = [
      { section: 'learn', paths: ['/learn', '/learn/article'] },
      { section: 'pre-qualify', paths: ['/pre-qualify'] },
      { section: 'calculator', paths: ['/calculator', '/calculator/affordability', '/calculator/purchase', '/calculator/refinance'] },
      { section: 'loan-options', paths: ['/loan-options', '/loan-options/fha', '/loan-options/va', '/loan-options/conventional'] },
      { section: 'about', paths: ['/about', '/about-us'] },
      { section: 'blog', paths: ['/blog', '/blog/article-1', '/blog/article-2'] },
      { section: 'contact', paths: ['/contact'] }
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...navigationSections),
        fc.integer({ min: 0, max: 10 }),
        (navSection, pathIndex) => {
          const path = navSection.paths[pathIndex % navSection.paths.length]
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Exactly one navigation item should be active (or none for home)
          const activeLinks = container.querySelectorAll('.active')
          
          if (path === '/') {
            expect(activeLinks.length).toBe(0)
          } else {
            expect(activeLinks.length).toBe(1)
            
            // Property: Active link should have aria-current="page"
            const activeLink = activeLinks[0]
            expect(activeLink).toHaveAttribute('aria-current', 'page')
            
            // Property: Active link should correspond to the current section
            const linkText = activeLink.textContent?.toLowerCase() || ''
            const sectionName = navSection.section.toLowerCase()
            
            // Handle special cases
            if (sectionName === 'loan-options') {
              expect(linkText).toContain('loan')
            } else if (sectionName === 'pre-qualify') {
              expect(linkText).toContain('qualify')
            } else if (sectionName === 'about') {
              expect(linkText).toContain('about')
            } else {
              expect(linkText).toContain(sectionName)
            }
          }

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should maintain active state consistency across different nested depths', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('calculator', 'blog', 'loan-options'),
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 3 }),
        (baseSection, pathSegments) => {
          // Build a nested path
          const path = `/${baseSection}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Active state should be determined by the base section, not depth
          const activeLinks = container.querySelectorAll('.active')
          expect(activeLinks.length).toBe(1)

          const activeLink = activeLinks[0]
          expect(activeLink).toHaveAttribute('aria-current', 'page')

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should not mark CTA button as active regardless of path', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/apply',
          '/calculator',
          '/blog',
          '/loan-options',
          '/contact',
          '/about'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          const applyButton = screen.getByRole('link', { name: /apply online/i })
          
          // Property: CTA button should never have active class
          expect(applyButton).not.toHaveClass('active')
          
          // Property: CTA button should always have ctaButton class
          expect(applyButton).toHaveClass('ctaButton')

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })
})

describe('Property 24: Breadcrumb Navigation', () => {
  /**
   * **Validates: Requirements 8.4**
   * 
   * This property test verifies that breadcrumb navigation is present and
   * correctly structured for any nested page configuration.
   */
  it('should always include home link as first breadcrumb item', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }),
            href: fc.webPath()
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (breadcrumbItems) => {
          const { unmount } = render(<Breadcrumbs items={breadcrumbItems} />)

          // Property: Home link must always be present
          const homeLink = screen.getByRole('link', { name: /^home$/i })
          expect(homeLink).toBeInTheDocument()
          expect(homeLink).toHaveAttribute('href', '/')

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should mark the last breadcrumb item as current page for any breadcrumb depth', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 50 }).filter(s => {
              const trimmed = s.trim()
              return trimmed.length >= 3 && /^[a-zA-Z0-9\s-]+$/.test(trimmed)
            }),
            href: fc.constantFrom('/loan-options', '/blog', '/calculator', '/about', '/contact')
          }),
          { minLength: 1, maxLength: 5 }
        ).filter(items => {
          // Ensure all labels and hrefs are unique
          const labels = items.map(item => item.label.trim())
          const hrefs = items.map(item => item.href)
          return new Set(labels).size === labels.length && new Set(hrefs).size === hrefs.length
        }),
        (breadcrumbItems) => {
          const { unmount } = render(<Breadcrumbs items={breadcrumbItems} />)

          // Property: Last item should have aria-current="page"
          const lastItem = breadcrumbItems[breadcrumbItems.length - 1]
          const currentPageElement = screen.getByText(new RegExp(lastItem.label.trim(), 'i'))
          expect(currentPageElement).toHaveAttribute('aria-current', 'page')

          // Property: Last item should not be a link
          expect(currentPageElement.tagName).not.toBe('A')

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should render all intermediate breadcrumb items as links', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 50 }).filter(s => {
              const trimmed = s.trim()
              return trimmed.length >= 3 && /^[a-zA-Z0-9\s-]+$/.test(trimmed)
            }),
            href: fc.constantFrom('/loan-options', '/blog', '/calculator', '/about', '/contact')
          }),
          { minLength: 2, maxLength: 3 }
        ).filter(items => {
          // Ensure all labels and hrefs are unique
          const labels = items.map(item => item.label.trim())
          const hrefs = items.map(item => item.href)
          return new Set(labels).size === labels.length && new Set(hrefs).size === hrefs.length
        }),
        (breadcrumbItems) => {
          const { unmount } = render(<Breadcrumbs items={breadcrumbItems} />)

          // Property: All items except the last should be links
          for (let i = 0; i < breadcrumbItems.length - 1; i++) {
            const item = breadcrumbItems[i]
            const links = screen.getAllByRole('link', { name: new RegExp(item.label.trim(), 'i') })
            // Should find at least one link with this label
            expect(links.length).toBeGreaterThanOrEqual(1)
          }

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should have proper ARIA navigation role for any breadcrumb configuration', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }),
            href: fc.webPath()
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (breadcrumbItems) => {
          const { unmount } = render(<Breadcrumbs items={breadcrumbItems} />)

          // Property: Breadcrumb navigation must have proper ARIA label
          const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i })
          expect(breadcrumbNav).toBeInTheDocument()

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should render breadcrumbs in ContentPage for any nested page configuration', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }),
            href: fc.webPath()
          }),
          { minLength: 1, maxLength: 4 }
        ),
        (pageTitle, breadcrumbItems) => {
          const { unmount } = render(
            <ContentPage
              title={pageTitle}
              breadcrumbs={breadcrumbItems}
            >
              <p>Content</p>
            </ContentPage>
          )

          // Property: Breadcrumb navigation must be present
          const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i })
          expect(breadcrumbNav).toBeInTheDocument()

          // Property: Home link must be present
          const homeLink = screen.getByRole('link', { name: /^home$/i })
          expect(homeLink).toBeInTheDocument()

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  it('should maintain breadcrumb structure regardless of label length', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 100 }).filter(s => {
              const trimmed = s.trim()
              return trimmed.length >= 3 && /^[a-zA-Z0-9\s-]+$/.test(trimmed)
            }),
            href: fc.constantFrom('/loan-options', '/blog', '/calculator', '/about', '/contact', '/team')
          }),
          { minLength: 1, maxLength: 3 }
        ).filter(items => {
          // Ensure all labels and hrefs are unique
          const labels = items.map(item => item.label.trim())
          const hrefs = items.map(item => item.href)
          return new Set(labels).size === labels.length && new Set(hrefs).size === hrefs.length
        }),
        (breadcrumbItems) => {
          const { unmount } = render(<Breadcrumbs items={breadcrumbItems} />)

          // Property: All breadcrumb items should be rendered
          breadcrumbItems.forEach((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            const trimmedLabel = item.label.trim()
            if (isLast) {
              const currentPage = screen.getByText(new RegExp(trimmedLabel, 'i'))
              expect(currentPage).toBeInTheDocument()
            } else {
              const links = screen.getAllByRole('link', { name: new RegExp(trimmedLabel, 'i') })
              expect(links.length).toBeGreaterThanOrEqual(1)
            }
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })
})

describe('Property 25: Navigation Link Functionality', () => {
  /**
   * **Validates: Requirements 8.5**
   * 
   * This property test verifies that all navigation links have valid href
   * attributes and are properly structured for navigation.
   */
  it('should have valid href attributes for all header navigation links', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/calculator',
          '/blog',
          '/loan-options',
          '/about',
          '/contact'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All links must have valid href attributes
          const allLinks = container.querySelectorAll('a[href]')
          expect(allLinks.length).toBeGreaterThan(0)

          allLinks.forEach(link => {
            const href = link.getAttribute('href')
            
            // Property: href must not be empty or just '#'
            expect(href).toBeTruthy()
            expect(href).not.toBe('')
            expect(href).not.toBe('#')
            
            // Property: href must be a valid path or protocol
            expect(
              href?.startsWith('/') || 
              href?.startsWith('mailto:') || 
              href?.startsWith('tel:') || 
              href?.startsWith('http')
            ).toBe(true)
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should have valid href attributes for all footer navigation links', () => {
    const { container } = render(<Footer />)

    // Property: All footer links must have valid href attributes
    const allLinks = container.querySelectorAll('a[href]')
    expect(allLinks.length).toBeGreaterThan(0)

    allLinks.forEach(link => {
      const href = link.getAttribute('href')
      
      // Property: href must not be empty
      expect(href).toBeTruthy()
      expect(href).not.toBe('')
      
      // Property: href must be a valid path or protocol (or # for placeholder social links)
      expect(
        href?.startsWith('/') || 
        href?.startsWith('mailto:') || 
        href?.startsWith('tel:') || 
        href?.startsWith('http') ||
        href === '#'
      ).toBe(true)
    })
  })

  it('should have accessible navigation links for any page state', () => {
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
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

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

          // Property: Both header and footer must have navigation links
          const allLinks = container.querySelectorAll('a[href]')
          expect(allLinks.length).toBeGreaterThan(0)

          // Property: All links must have valid hrefs
          allLinks.forEach(link => {
            const href = link.getAttribute('href')
            expect(href).toBeTruthy()
            expect(href).not.toBe('')
          })

          // Property: Navigation elements must be present
          const navigations = container.querySelectorAll('nav')
          expect(navigations.length).toBeGreaterThanOrEqual(1)

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  it('should have proper link text for accessibility', () => {
    const { container } = render(
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
      
      // Property: Link must have either text content or aria-label
      expect(hasTextContent || hasAriaLabel).toBe(true)
    })
  })

  it('should not have duplicate navigation links with different hrefs', () => {
    const { container } = render(<Header />)

    // Property: Links with same text should have same href
    const linkMap = new Map<string, string>()
    const allLinks = container.querySelectorAll('nav a[href]')

    allLinks.forEach(link => {
      const text = link.textContent?.trim().toLowerCase()
      const href = link.getAttribute('href')

      if (text && href) {
        if (linkMap.has(text)) {
          // If we've seen this text before, href should match
          expect(linkMap.get(text)).toBe(href)
        } else {
          linkMap.set(text, href)
        }
      }
    })
  })
})

describe('Integration: Complete Navigation Flow Properties', () => {
  it('should maintain navigation consistency across any page configuration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/calculator/affordability',
          '/blog/article',
          '/loan-options/fha'
        ),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.option(
          fc.array(
            fc.record({
              label: fc.string({ minLength: 1, maxLength: 50 }),
              href: fc.webPath()
            }),
            { minLength: 1, maxLength: 3 }
          )
        ),
        (path, pageTitle, breadcrumbs) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(
            <ContentPage
              title={pageTitle}
              breadcrumbs={breadcrumbs || undefined}
            >
              <p>Content</p>
            </ContentPage>
          )

          // Property: Header must be present
          const header = screen.getByRole('banner')
          expect(header).toBeInTheDocument()

          // Property: Footer must be present
          const footer = screen.getByRole('contentinfo')
          expect(footer).toBeInTheDocument()

          // Property: If breadcrumbs provided, they must be rendered
          if (breadcrumbs && breadcrumbs.length > 0) {
            const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i })
            expect(breadcrumbNav).toBeInTheDocument()
          }

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })
})
