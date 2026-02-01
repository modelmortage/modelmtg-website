/**
 * Property-based tests for ARIA labels
 * Feature: website-structure-migration, Property 21: ARIA Labels
 * Validates Requirements 7.5
 */

import { render } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs, { BreadcrumbItem } from '@/components/shared/Breadcrumbs'
import BlogCard from '@/components/content/BlogCard'
import LoanOptionCard from '@/components/content/LoanOptionCard'
import TeamMemberCard from '@/components/content/TeamMemberCard'
import { BlogPost, LoanOption, TeamMember } from '@/lib/types/content'

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

describe('Property 21: ARIA Labels - Requirements 7.5', () => {
  /**
   * Property: For any interactive element without visible text (icons, image buttons),
   * appropriate ARIA labels or aria-label attributes should be present
   */
  
  describe('Icon buttons should have aria-label', () => {
    it('should have aria-label on mobile menu toggle button', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const { container } = render(<Header />)
          
          // Find all buttons
          const buttons = container.querySelectorAll('button')
          
          // Each button should have either visible text or aria-label
          buttons.forEach(button => {
            const hasVisibleText = button.textContent && button.textContent.trim().length > 0
            const hasAriaLabel = button.hasAttribute('aria-label')
            
            // Icon buttons (no visible text) must have aria-label
            if (!hasVisibleText) {
              expect(hasAriaLabel).toBe(true)
              expect(button.getAttribute('aria-label')).toBeTruthy()
            }
          })
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Image buttons should have alt text or aria-label', () => {
    it('should have alt text on logo image used as link', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const { container } = render(<Header />)
          
          // Find all images within links
          const links = container.querySelectorAll('a')
          
          links.forEach(link => {
            const images = link.querySelectorAll('img')
            
            images.forEach(img => {
              const hasAltText = img.hasAttribute('alt') && img.getAttribute('alt')!.length > 0
              const linkHasAriaLabel = link.hasAttribute('aria-label')
              
              // Image within link must have alt text or link must have aria-label
              expect(hasAltText || linkHasAriaLabel).toBe(true)
            })
          })
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Social icon links should have aria-label', () => {
    it('should have aria-label on all social icon links', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const { container } = render(<Footer />)
          
          // Find social icon links (they have minimal text content)
          const allLinks = container.querySelectorAll('a')
          
          allLinks.forEach(link => {
            const textContent = link.textContent?.trim() || ''
            const hasAriaLabel = link.hasAttribute('aria-label')
            
            // Links with very short text (1-2 chars) are likely icons and should have aria-label
            if (textContent.length <= 2) {
              expect(hasAriaLabel).toBe(true)
              const ariaLabel = link.getAttribute('aria-label')
              expect(ariaLabel).toBeTruthy()
              expect(ariaLabel!.length).toBeGreaterThan(2)
            }
          })
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Card links should have descriptive aria-label', () => {
    const blogPostArbitrary = fc.record({
      slug: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      title: fc.string({ minLength: 10, maxLength: 100 }),
      excerpt: fc.string({ minLength: 20, maxLength: 200 }),
      content: fc.string({ minLength: 50, maxLength: 500 }),
      author: fc.string({ minLength: 5, maxLength: 50 }),
      publishDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
        .map(d => d.toISOString().split('T')[0]),
      category: fc.constantFrom('Home Buying', 'Refinancing', 'Investment'),
      tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
      featuredImage: fc.constant('/test-image.jpg'),
      readTime: fc.integer({ min: 1, max: 20 }),
      metadata: fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        description: fc.string({ minLength: 20, maxLength: 160 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 })
      })
    })

    it('should have aria-label on blog card links', () => {
      fc.assert(
        fc.property(blogPostArbitrary, (blogPost) => {
          const { container } = render(<BlogCard blogPost={blogPost as BlogPost} />)
          
          const link = container.querySelector('a')
          expect(link).toBeTruthy()
          
          if (link) {
            expect(link.hasAttribute('aria-label')).toBe(true)
            const ariaLabel = link.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
            expect(ariaLabel!.length).toBeGreaterThan(0)
          }
        }),
        { numRuns: 20 }
      )
    })

    const loanOptionArbitrary = fc.record({
      id: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      slug: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      title: fc.string({ minLength: 10, maxLength: 100 }),
      shortDescription: fc.string({ minLength: 20, maxLength: 200 }),
      fullDescription: fc.string({ minLength: 50, maxLength: 500 }),
      benefits: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      requirements: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      idealFor: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      icon: fc.constantFrom('home', 'shield', 'flag', 'tree', 'building'),
      relatedCalculators: fc.array(fc.string({ minLength: 5, maxLength: 20 }), { maxLength: 3 }),
      metadata: fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        description: fc.string({ minLength: 20, maxLength: 160 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 })
      })
    })

    it('should have aria-label on loan option card links', () => {
      fc.assert(
        fc.property(loanOptionArbitrary, (loanOption) => {
          const { container } = render(<LoanOptionCard loanOption={loanOption as LoanOption} />)
          
          const link = container.querySelector('a')
          expect(link).toBeTruthy()
          
          if (link) {
            expect(link.hasAttribute('aria-label')).toBe(true)
            const ariaLabel = link.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
            expect(ariaLabel!.length).toBeGreaterThan(0)
          }
        }),
        { numRuns: 20 }
      )
    })

    const teamMemberArbitrary = fc.record({
      slug: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      title: fc.string({ minLength: 10, maxLength: 100 }),
      bio: fc.string({ minLength: 50, maxLength: 500 }),
      photo: fc.constant('/test-photo.jpg'),
      credentials: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
      specialties: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
      contact: fc.record({
        email: fc.option(fc.emailAddress(), { nil: undefined }),
        phone: fc.option(fc.constant('555-1234'), { nil: undefined }),
        calendly: fc.option(fc.constant('https://calendly.com/test'), { nil: undefined })
      }),
      metadata: fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        description: fc.string({ minLength: 20, maxLength: 160 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 })
      })
    })

    it('should have aria-label on team member card links', () => {
      fc.assert(
        fc.property(teamMemberArbitrary, (teamMember) => {
          const { container } = render(<TeamMemberCard teamMember={teamMember as TeamMember} />)
          
          const link = container.querySelector('a')
          expect(link).toBeTruthy()
          
          if (link) {
            expect(link.hasAttribute('aria-label')).toBe(true)
            const ariaLabel = link.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
            expect(ariaLabel!.length).toBeGreaterThan(0)
          }
        }),
        { numRuns: 20 }
      )
    })
  })

  describe('Decorative elements should have aria-hidden', () => {
    it('should have aria-hidden on decorative arrows in cards', () => {
      const blogPost: BlogPost = {
        slug: 'test',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        author: 'Test Author',
        publishDate: '2024-01-15',
        category: 'Test',
        tags: ['test'],
        featuredImage: '/test.jpg',
        readTime: 5,
        metadata: { title: 'Test', description: 'Test', keywords: ['test'] }
      }

      fc.assert(
        fc.property(fc.constant(blogPost), (post) => {
          const { container } = render(<BlogCard blogPost={post} />)
          
          // Find decorative elements (arrows)
          const decorativeElements = container.querySelectorAll('[aria-hidden="true"]')
          
          // Should have at least one decorative element
          expect(decorativeElements.length).toBeGreaterThan(0)
          
          // Decorative elements should not be focusable
          decorativeElements.forEach(element => {
            expect(element.hasAttribute('tabindex')).toBe(false)
          })
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Breadcrumb navigation should have proper ARIA attributes', () => {
    const breadcrumbItemsArbitrary = fc.array(
      fc.record({
        label: fc.string({ minLength: 3, maxLength: 30 }),
        href: fc.array(fc.constantFrom('/', 'a', 'b', 'c', '-'), { minLength: 5, maxLength: 30 }).map(arr => arr.join(''))
      }),
      { minLength: 1, maxLength: 5 }
    )

    it('should have aria-label on breadcrumb navigation', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const { container } = render(<Breadcrumbs items={items as BreadcrumbItem[]} />)
          
          const nav = container.querySelector('nav')
          expect(nav).toBeTruthy()
          expect(nav?.hasAttribute('aria-label')).toBe(true)
        }),
        { numRuns: 20 }
      )
    })

    it('should have aria-current on last breadcrumb item', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          if (items.length === 0) return true // Skip empty arrays
          
          const { container } = render(<Breadcrumbs items={items as BreadcrumbItem[]} />)
          
          // Find the current page indicator
          const currentElements = container.querySelectorAll('[aria-current="page"]')
          
          // Should have exactly one current page indicator
          expect(currentElements.length).toBe(1)
        }),
        { numRuns: 20 }
      )
    })

    it('should have aria-hidden on breadcrumb separators', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          if (items.length === 0) return true // Skip empty arrays
          
          const { container } = render(<Breadcrumbs items={items as BreadcrumbItem[]} />)
          
          // Find separators
          const separators = container.querySelectorAll('[aria-hidden="true"]')
          
          // Should have separators (one for each item plus home)
          expect(separators.length).toBeGreaterThan(0)
        }),
        { numRuns: 20 }
      )
    })
  })

  describe('All interactive elements should be accessible', () => {
    it('should have either visible text or aria-label on all links', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const { container } = render(<Footer />)
          
          const allLinks = container.querySelectorAll('a')
          
          allLinks.forEach(link => {
            const hasVisibleText = link.textContent && link.textContent.trim().length > 0
            const hasAriaLabel = link.hasAttribute('aria-label')
            const hasAriaLabelledBy = link.hasAttribute('aria-labelledby')
            
            // Every link must have some form of accessible name
            expect(hasVisibleText || hasAriaLabel || hasAriaLabelledBy).toBe(true)
          })
        }),
        { numRuns: 10 }
      )
    })

    it('should have either visible text or aria-label on all buttons', () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          const { container } = render(<Header />)
          
          const allButtons = container.querySelectorAll('button')
          
          allButtons.forEach(button => {
            const hasVisibleText = button.textContent && button.textContent.trim().length > 0
            const hasAriaLabel = button.hasAttribute('aria-label')
            const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
            
            // Every button must have some form of accessible name
            expect(hasVisibleText || hasAriaLabel || hasAriaLabelledBy).toBe(true)
          })
        }),
        { numRuns: 10 }
      )
    })
  })
})
