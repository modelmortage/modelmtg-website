/**
 * Property-Based Test for Breadcrumb Navigation
 * Feature: website-structure-migration
 * Task: 14.6 Write property test for breadcrumb navigation
 * 
 * Property 24: Breadcrumb Navigation
 * For any nested page (loan options, blog posts, team profiles), breadcrumb 
 * navigation should be present showing the hierarchical path.
 * 
 * **Validates: Requirements 8.4**
 */

import { render, screen } from '@testing-library/react'
import fc from 'fast-check'
import Breadcrumbs, { BreadcrumbItem } from '@/components/shared/Breadcrumbs'
import '@testing-library/jest-dom'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

describe('Property 24: Breadcrumb Navigation', () => {
  /**
   * **Validates: Requirements 8.4**
   * 
   * This property test verifies that breadcrumb navigation is present and
   * correctly structured for any nested page path. The test generates various
   * breadcrumb configurations and verifies:
   * 1. Home link is always present
   * 2. All breadcrumb items are rendered
   * 3. Intermediate items are links
   * 4. Last item is marked as current page (not a link)
   * 5. Proper accessibility attributes are present
   */
  it('should render breadcrumbs with home link and all items for any nested page', () => {
    // Generator for breadcrumb items
    const breadcrumbItemArb = fc.record({
      label: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length > 0),
      href: fc.string({ minLength: 1, maxLength: 50 }).map(s => `/${s.replace(/\s+/g, '-').toLowerCase()}`)
    })

    fc.assert(
      fc.property(
        fc.array(breadcrumbItemArb, { minLength: 1, maxLength: 5 }),
        (items) => {
          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Home link should always be present
          const homeLink = container.querySelector('a[href="/"]')
          expect(homeLink).toBeInTheDocument()
          expect(homeLink?.textContent).toMatch(/home/i)

          // Property 2: All breadcrumb items should be rendered
          items.forEach((item, index) => {
            const isLast = index === items.length - 1
            
            if (isLast) {
              // Last item should be text, not a link
              const currentItem = container.querySelector('[aria-current="page"]')
              expect(currentItem).toBeInTheDocument()
              expect(currentItem?.textContent).toBe(item.label)
              expect(currentItem?.tagName).toBe('SPAN')
            } else {
              // Intermediate items should be links
              const links = Array.from(container.querySelectorAll('a'))
              const matchingLink = links.find(link => link.textContent === item.label && link.getAttribute('href') === item.href)
              expect(matchingLink).toBeTruthy()
            }
          })

          // Property 3: Navigation should have proper accessibility attributes
          const nav = container.querySelector('nav[aria-label="Breadcrumb"]')
          expect(nav).toBeInTheDocument()

          // Property 4: Should have a list structure
          const list = container.querySelector('ol')
          expect(list).toBeInTheDocument()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs correctly show the hierarchical path
   * for loan options pages. All loan options pages should have:
   * Home > Loan Options > [Specific Loan Type]
   */
  it('should show correct hierarchical path for loan options pages', () => {
    const loanOptionSlugs = [
      'fixed-rate-mortgage',
      'fha-home-loan',
      'va-home-loan',
      'usda-loan',
      'jumbo-home-loan',
      'first-time-home-buyer',
      'low-down-payment-purchase-options',
      'investment-property-loans',
      'refinance',
      'cash-out-refinance',
      'va-loan-refinance-options'
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...loanOptionSlugs),
        fc.string({ minLength: 5, maxLength: 50 }).filter(s => {
          const trimmed = s.trim()
          return trimmed.length >= 5 && /[a-zA-Z0-9]/.test(trimmed)
        }),
        (slug, title) => {
          const items: BreadcrumbItem[] = [
            { label: 'Loan Options', href: '/loan-options' },
            { label: title, href: `/loan-options/${slug}` }
          ]

          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Should have exactly 3 levels (Home + 2 items)
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBe(2) // Home + Loan Options (last item is not a link)

          // Property 2: Home should be first
          expect(allLinks[0].textContent).toMatch(/home/i)
          expect(allLinks[0].getAttribute('href')).toBe('/')

          // Property 3: Loan Options should be second
          expect(allLinks[1].textContent).toBe('Loan Options')
          expect(allLinks[1].getAttribute('href')).toBe('/loan-options')

          // Property 4: Current page should be marked as current
          const currentPage = container.querySelector('[aria-current="page"]')
          expect(currentPage?.textContent).toBe(title)
          expect(currentPage?.tagName).toBe('SPAN')

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs correctly show the hierarchical path
   * for blog post pages. All blog posts should have:
   * Home > Blog > [Post Title]
   */
  it('should show correct hierarchical path for blog post pages', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => {
          const trimmed = s.trim()
          return trimmed.length >= 10 && /[a-zA-Z0-9]/.test(trimmed)
        }),
        fc.string({ minLength: 5, maxLength: 50 }).filter(s => /^[a-z0-9-]+$/.test(s)),
        (postTitle, slug) => {
          const items: BreadcrumbItem[] = [
            { label: 'Blog', href: '/blog' },
            { label: postTitle, href: `/blog/${slug}` }
          ]

          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Should have exactly 3 levels (Home + 2 items)
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBe(2) // Home + Blog (last item is not a link)

          // Property 2: Home should be first
          expect(allLinks[0].textContent).toMatch(/home/i)
          expect(allLinks[0].getAttribute('href')).toBe('/')

          // Property 3: Blog should be second
          expect(allLinks[1].textContent).toBe('Blog')
          expect(allLinks[1].getAttribute('href')).toBe('/blog')

          // Property 4: Current page (post title) should be marked as current
          const currentPage = container.querySelector('[aria-current="page"]')
          expect(currentPage?.textContent).toBe(postTitle)
          expect(currentPage?.tagName).toBe('SPAN')

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs correctly show the hierarchical path
   * for team member profile pages. All team profiles should have:
   * Home > Meet Our Team > [Team Member Name]
   */
  it('should show correct hierarchical path for team member profile pages', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 50 }).filter(s => {
          const trimmed = s.trim()
          return trimmed.length >= 5 && /[a-zA-Z]/.test(trimmed)
        }),
        fc.string({ minLength: 3, maxLength: 30 }).filter(s => /^[a-z-]+$/.test(s)),
        (memberName, slug) => {
          const items: BreadcrumbItem[] = [
            { label: 'Meet Our Team', href: '/meet-our-team' },
            { label: memberName, href: `/${slug}` }
          ]

          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Should have exactly 3 levels (Home + 2 items)
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBe(2) // Home + Meet Our Team (last item is not a link)

          // Property 2: Home should be first
          expect(allLinks[0].textContent).toMatch(/home/i)
          expect(allLinks[0].getAttribute('href')).toBe('/')

          // Property 3: Meet Our Team should be second
          expect(allLinks[1].textContent).toBe('Meet Our Team')
          expect(allLinks[1].getAttribute('href')).toBe('/meet-our-team')

          // Property 4: Current page (member name) should be marked as current
          const currentPage = container.querySelector('[aria-current="page"]')
          expect(currentPage?.textContent).toBe(memberName)
          expect(currentPage?.tagName).toBe('SPAN')

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that separators are correctly placed between
   * breadcrumb items for visual clarity and proper navigation structure.
   */
  it('should render separators between all breadcrumb items', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length > 0),
            href: fc.string({ minLength: 1, maxLength: 50 }).map(s => `/${s.replace(/\s+/g, '-')}`)
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items) => {
          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property: Should have exactly as many separators as items
          // (one separator before each item, including the first one after Home)
          const separators = container.querySelectorAll('[aria-hidden="true"]')
          expect(separators.length).toBe(items.length)

          // Property: All separators should be hidden from screen readers
          separators.forEach(separator => {
            expect(separator).toHaveAttribute('aria-hidden', 'true')
            expect(separator.textContent).toBe('/')
          })

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs work correctly with deep nesting,
   * supporting arbitrary levels of hierarchy.
   */
  it('should handle deep nesting with multiple levels of hierarchy', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length > 0),
            href: fc.string({ minLength: 1, maxLength: 30 }).map(s => `/${s.replace(/\s+/g, '-')}`)
          }),
          { minLength: 2, maxLength: 6 }
        ),
        (items) => {
          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: All intermediate items should be links
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBe(items.length) // Home + all items except last

          // Property 2: Only the last item should have aria-current
          const currentItem = container.querySelector('[aria-current="page"]')
          expect(currentItem?.textContent).toBe(items[items.length - 1].label)

          // Property 3: All non-last items should be clickable links
          for (let i = 0; i < items.length - 1; i++) {
            const links = Array.from(container.querySelectorAll('a'))
            const matchingLink = links.find(link => 
              link.textContent === items[i].label && 
              link.getAttribute('href') === items[i].href
            )
            expect(matchingLink).toBeTruthy()
          }

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs maintain proper accessibility
   * attributes for screen readers and assistive technologies.
   */
  it('should maintain proper accessibility attributes for all breadcrumb elements', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length > 0),
            href: fc.string({ minLength: 1, maxLength: 50 }).map(s => `/${s.replace(/\s+/g, '-')}`)
          }),
          { minLength: 1, maxLength: 4 }
        ),
        (items) => {
          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Navigation should have aria-label="Breadcrumb"
          const nav = container.querySelector('nav[aria-label="Breadcrumb"]')
          expect(nav).toBeInTheDocument()

          // Property 2: Should use semantic list structure
          const list = container.querySelector('ol')
          expect(list).toBeInTheDocument()

          // Property 3: Last item should have aria-current="page"
          const lastItem = container.querySelector('[aria-current="page"]')
          expect(lastItem?.textContent).toBe(items[items.length - 1].label)

          // Property 4: Separators should be hidden from screen readers
          const separators = container.querySelectorAll('[aria-hidden="true"]')
          expect(separators.length).toBe(items.length)
          separators.forEach(separator => {
            expect(separator).toHaveAttribute('aria-hidden', 'true')
          })

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs work correctly with single-level
   * nesting (e.g., just one item after Home).
   */
  it('should handle single-level nesting correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).map(s => `/${s.replace(/\s+/g, '-')}`),
        (label, href) => {
          const items: BreadcrumbItem[] = [{ label, href }]

          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Should have Home link
          const homeLink = container.querySelector('a[href="/"]')
          expect(homeLink).toBeInTheDocument()
          expect(homeLink?.textContent).toMatch(/home/i)

          // Property 2: Should have exactly one separator
          const separators = container.querySelectorAll('[aria-hidden="true"]')
          expect(separators.length).toBe(1)

          // Property 3: Current page should not be a link
          const currentPage = container.querySelector('[aria-current="page"]')
          expect(currentPage?.tagName).toBe('SPAN')
          expect(currentPage?.textContent).toBe(label)

          // Property 4: Should have exactly one link (Home)
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBe(1)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs correctly handle special characters
   * and various text formats in labels.
   */
  it('should correctly render breadcrumb labels with special characters', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 50 }).filter(s => {
              const trimmed = s.trim()
              // Exclude HTML-breaking chars and ensure meaningful content
              return trimmed.length >= 3 && !/[<>]/.test(trimmed) && /[a-zA-Z0-9]/.test(trimmed)
            }),
            href: fc.string({ minLength: 1, maxLength: 50 }).map(s => `/${s.replace(/\s+/g, '-')}`)
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (items) => {
          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property: All labels should be rendered exactly as provided
          items.forEach((item, index) => {
            const isLast = index === items.length - 1
            
            if (isLast) {
              const currentElement = container.querySelector('[aria-current="page"]')
              expect(currentElement?.textContent).toBe(item.label)
              expect(currentElement?.tagName).toBe('SPAN')
            } else {
              // For non-last items, find the link with matching text
              const links = Array.from(container.querySelectorAll('a'))
              const matchingLink = links.find(link => link.textContent === item.label)
              expect(matchingLink).toBeTruthy()
            }
          })

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs maintain consistent structure
   * regardless of the length of labels or hrefs.
   */
  it('should maintain consistent structure with varying label and href lengths', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 100 }).filter(s => {
              const trimmed = s.trim()
              return trimmed.length >= 3 && /[a-zA-Z0-9]/.test(trimmed)
            }),
            href: fc.string({ minLength: 1, maxLength: 200 }).map(s => `/${s.replace(/\s+/g, '-')}`)
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items) => {
          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: Should always have navigation with proper role
          const nav = container.querySelector('nav[aria-label="Breadcrumb"]')
          expect(nav).toBeInTheDocument()

          // Property 2: Should always have list structure
          const list = container.querySelector('ol')
          expect(list).toBeInTheDocument()

          // Property 3: Should have correct number of links (Home + all but last item)
          const allLinks = container.querySelectorAll('a')
          expect(allLinks.length).toBe(items.length)

          // Property 4: Should have correct number of separators
          const separators = container.querySelectorAll('[aria-hidden="true"]')
          expect(separators.length).toBe(items.length)

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.4**
   * 
   * This property verifies that breadcrumbs work correctly when items have
   * identical labels but different hrefs (e.g., multiple pages with same name
   * in different sections).
   */
  it('should handle items with identical labels but different hrefs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 20 }).filter(s => {
          const trimmed = s.trim()
          return trimmed.length >= 3 && /[a-zA-Z0-9]/.test(trimmed)
        }),
        fc.array(
          fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
          { minLength: 2, maxLength: 4 }
        ),
        (commonLabel, pathSegments) => {
          // Create items with same label but different hrefs
          const items: BreadcrumbItem[] = pathSegments.map((segment, index) => ({
            label: commonLabel,
            href: `/${pathSegments.slice(0, index + 1).join('/')}`
          }))

          const { container, unmount } = render(<Breadcrumbs items={items} />)

          // Property 1: All items should be rendered
          const allElements = Array.from(container.querySelectorAll('li'))
            .map(li => li.textContent)
            .filter(text => text?.includes(commonLabel))
          expect(allElements.length).toBeGreaterThanOrEqual(items.length)

          // Property 2: Last item should be marked as current
          const currentElement = container.querySelector('[aria-current="page"]')
          expect(currentElement?.textContent).toBe(commonLabel)

          // Property 3: All but last should be links
          const links = Array.from(container.querySelectorAll('a'))
            .filter(link => link.textContent === commonLabel)
          expect(links.length).toBe(items.length - 1)

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })
})
