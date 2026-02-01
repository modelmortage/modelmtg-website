/**
 * Property-Based Tests for Heading Hierarchy
 * Feature: website-structure-migration
 * 
 * Property 15: Heading Hierarchy
 * For any page, there should be exactly one H1 element, and all heading elements 
 * should follow proper nesting order (H1 → H2 → H3, no skipping levels).
 * 
 * **Validates: Requirements 6.3**
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import { JSDOM } from 'jsdom'
import { blogPosts } from '@/lib/content/blogPosts'
import { loanOptions } from '@/lib/content/loanOptions'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Helper function to analyze heading hierarchy
interface HeadingAnalysis {
  h1Count: number
  hasSkippedLevels: boolean
  skippedLevels: string[]
  headingSequence: string[]
  isValid: boolean
}

function analyzeHeadingHierarchy(html: string): HeadingAnalysis {
  const dom = new JSDOM(html)
  const document = dom.window.document

  // Count H1 elements
  const h1Elements = document.querySelectorAll('h1')
  const h1Count = h1Elements.length

  // Get all heading elements in order
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const headingSequence = headings.map(h => h.tagName.toLowerCase())

  // Check for skipped levels
  const skippedLevels: string[] = []
  let hasSkippedLevels = false

  for (let i = 1; i < headingSequence.length; i++) {
    const currentLevel = parseInt(headingSequence[i].substring(1))
    const previousLevel = parseInt(headingSequence[i - 1].substring(1))
    
    // If current level is more than 1 greater than previous, we skipped a level
    if (currentLevel > previousLevel + 1) {
      hasSkippedLevels = true
      skippedLevels.push(
        `Skipped from ${headingSequence[i - 1]} to ${headingSequence[i]} at position ${i}`
      )
    }
  }

  const isValid = h1Count === 1 && !hasSkippedLevels

  return {
    h1Count,
    hasSkippedLevels,
    skippedLevels,
    headingSequence,
    isValid,
  }
}

// Define all page types to test
interface PageDefinition {
  name: string
  importPath: string
  params?: Record<string, string>
}

const staticPages: PageDefinition[] = [
  { name: 'About', importPath: '@/app/about/page' },
  { name: 'Meet Our Team', importPath: '@/app/meet-our-team/page' },
  { name: 'Schedule a Call', importPath: '@/app/schedule-a-call/page' },
  { name: 'Reviews', importPath: '@/app/reviews/page' },
  { name: 'Privacy Policy', importPath: '@/app/privacy-policy/page' },
  { name: 'ADA Accessibility Statement', importPath: '@/app/ada-accessibility-statement/page' },
  { name: 'Blog Listing', importPath: '@/app/blog/page' },
  { name: 'Learning Center', importPath: '@/app/learning-center/page' },
  { name: 'Loan Options Hub', importPath: '@/app/loan-options/page' },
  { name: 'Affordability Calculator', importPath: '@/app/calculator/affordability/page' },
  { name: 'Purchase Calculator', importPath: '@/app/calculator/purchase/page' },
  { name: 'Refinance Calculator', importPath: '@/app/calculator/refinance/page' },
  { name: 'Rent vs Buy Calculator', importPath: '@/app/calculator/rent-vs-buy/page' },
  { name: 'VA Purchase Calculator', importPath: '@/app/calculator/va-purchase/page' },
  { name: 'VA Refinance Calculator', importPath: '@/app/calculator/va-refinance/page' },
  { name: 'DSCR Calculator', importPath: '@/app/calculator/dscr/page' },
  { name: 'Matthew Bramow Profile', importPath: '@/app/matthew-bramow/page' },
  { name: 'Rolston Nicholls Profile', importPath: '@/app/rolston-nicholls/page' },
]

describe('Property 15: Heading Hierarchy', () => {
  /**
   * **Validates: Requirements 6.3**
   * 
   * This property test verifies that all pages maintain proper heading hierarchy:
   * - Exactly one H1 element per page
   * - No skipped heading levels (e.g., H1 → H3 without H2)
   */

  describe('Static Pages - Single H1 Property', () => {
    it('should have exactly one H1 element for any static page', async () => {
      // Property: Every static page must have exactly one H1 element
      for (const page of staticPages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBe(1)
        
        if (analysis.h1Count !== 1) {
          console.error(`${page.name}: Expected 1 H1, found ${analysis.h1Count}`)
          console.error(`Heading sequence:`, analysis.headingSequence)
        }

        unmount()
      }
    })
  })

  describe('Static Pages - No Skipped Levels Property', () => {
    it('should not skip heading levels for any static page', async () => {
      // Property: Heading levels must not be skipped (e.g., H1 → H2 → H3, not H1 → H3)
      for (const page of staticPages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.hasSkippedLevels).toBe(false)
        
        if (analysis.hasSkippedLevels) {
          console.error(`${page.name}: Skipped levels detected`)
          console.error(`Skipped levels:`, analysis.skippedLevels)
          console.error(`Heading sequence:`, analysis.headingSequence)
        }

        unmount()
      }
    })
  })

  describe('Dynamic Blog Posts - Heading Hierarchy Property', () => {
    it('should have exactly one H1 and proper nesting for any blog post', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          async (postIndex) => {
            const post = blogPosts[postIndex]
            const BlogPostPage = (await import('@/app/blog/[slug]/page')).default
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            const html = container.innerHTML

            const analysis = analyzeHeadingHierarchy(html)

            // Property: Exactly one H1
            expect(analysis.h1Count).toBe(1)
            
            // Property: No skipped levels
            expect(analysis.hasSkippedLevels).toBe(false)
            
            if (!analysis.isValid) {
              console.error(`Blog post "${post.title}":`)
              console.error(`  H1 count: ${analysis.h1Count}`)
              console.error(`  Skipped levels:`, analysis.skippedLevels)
              console.error(`  Heading sequence:`, analysis.headingSequence)
            }

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have valid heading hierarchy for all blog posts', async () => {
      // Property: Every blog post should have valid heading hierarchy
      const BlogPostPage = (await import('@/app/blog/[slug]/page')).default
      
      for (const post of blogPosts) {
        const { container, unmount } = render(
          <BlogPostPage params={{ slug: post.slug }} />
        )
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        
        if (!analysis.isValid) {
          console.error(`Blog post "${post.title}" has invalid heading hierarchy`)
          console.error(`  H1 count: ${analysis.h1Count}`)
          console.error(`  Skipped levels:`, analysis.skippedLevels)
        }

        unmount()
      }
    })
  })

  describe('Dynamic Loan Options - Heading Hierarchy Property', () => {
    it('should have exactly one H1 and proper nesting for any loan option page', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: loanOptions.length - 1 }),
          async (optionIndex) => {
            const option = loanOptions[optionIndex]
            const LoanOptionPage = (await import('@/app/loan-options/[slug]/page')).default
            
            const { container, unmount } = render(
              <LoanOptionPage params={{ slug: option.slug }} />
            )
            const html = container.innerHTML

            const analysis = analyzeHeadingHierarchy(html)

            // Property: Exactly one H1
            expect(analysis.h1Count).toBe(1)
            
            // Property: No skipped levels
            expect(analysis.hasSkippedLevels).toBe(false)
            
            if (!analysis.isValid) {
              console.error(`Loan option "${option.title}":`)
              console.error(`  H1 count: ${analysis.h1Count}`)
              console.error(`  Skipped levels:`, analysis.skippedLevels)
              console.error(`  Heading sequence:`, analysis.headingSequence)
            }

            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have valid heading hierarchy for all loan option pages', async () => {
      // Property: Every loan option page should have valid heading hierarchy
      const LoanOptionPage = (await import('@/app/loan-options/[slug]/page')).default
      
      for (const option of loanOptions) {
        const { container, unmount } = render(
          <LoanOptionPage params={{ slug: option.slug }} />
        )
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        
        if (!analysis.isValid) {
          console.error(`Loan option "${option.title}" has invalid heading hierarchy`)
          console.error(`  H1 count: ${analysis.h1Count}`)
          console.error(`  Skipped levels:`, analysis.skippedLevels)
        }

        unmount()
      }
    })
  })

  describe('Heading Hierarchy Invariants', () => {
    it('should never have zero H1 elements on any page', async () => {
      // Property: All pages must have at least one H1 (and exactly one)
      const allPages = [...staticPages]
      
      for (const page of allPages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBeGreaterThan(0)
        
        unmount()
      }
    })

    it('should never have multiple H1 elements on any page', async () => {
      // Property: All pages must have at most one H1
      const allPages = [...staticPages]
      
      for (const page of allPages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBeLessThanOrEqual(1)
        
        unmount()
      }
    })

    it('should have headings in sequential order without gaps', async () => {
      // Property: Heading levels should increment by at most 1
      const allPages = [...staticPages]
      
      for (const page of allPages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        // Check that no heading level jumps by more than 1
        for (let i = 1; i < analysis.headingSequence.length; i++) {
          const currentLevel = parseInt(analysis.headingSequence[i].substring(1))
          const previousLevel = parseInt(analysis.headingSequence[i - 1].substring(1))
          const levelDifference = currentLevel - previousLevel

          expect(levelDifference).toBeLessThanOrEqual(1)
        }
        
        unmount()
      }
    })

    it('should start with H1 as the first heading on any page', async () => {
      // Property: The first heading element should always be H1
      const allPages = [...staticPages]
      
      for (const page of allPages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        if (analysis.headingSequence.length > 0) {
          expect(analysis.headingSequence[0]).toBe('h1')
        }
        
        unmount()
      }
    })
  })

  describe('Requirements Validation', () => {
    it('should meet Requirement 6.3: Proper heading hierarchy for search engines', async () => {
      // Requirement 6.3: When a page is crawled by search engines, 
      // the system shall provide proper heading hierarchy (H1, H2, H3)
      
      // Test a sample of different page types
      const samplePages = [
        { name: 'Content Page', importPath: '@/app/about/page' },
        { name: 'Calculator Page', importPath: '@/app/calculator/affordability/page' },
        { name: 'Blog Listing', importPath: '@/app/blog/page' },
        { name: 'Loan Options Hub', importPath: '@/app/loan-options/page' },
      ]

      for (const page of samplePages) {
        const PageComponent = (await import(page.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        // Verify proper heading hierarchy as per Requirement 6.3
        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        expect(analysis.isValid).toBe(true)
        
        unmount()
      }
    })

    it('should have exactly one H1 on dynamic pages as per Requirement 6.3', async () => {
      // Test dynamic pages (blog posts and loan options)
      const BlogPostPage = (await import('@/app/blog/[slug]/page')).default
      const LoanOptionPage = (await import('@/app/loan-options/[slug]/page')).default
      
      // Test first blog post
      const firstPost = blogPosts[0]
      const { container: blogContainer, unmount: unmountBlog } = render(
        <BlogPostPage params={{ slug: firstPost.slug }} />
      )
      const blogAnalysis = analyzeHeadingHierarchy(blogContainer.innerHTML)
      expect(blogAnalysis.h1Count).toBe(1)
      expect(blogAnalysis.hasSkippedLevels).toBe(false)
      unmountBlog()
      
      // Test first loan option
      const firstOption = loanOptions[0]
      const { container: loanContainer, unmount: unmountLoan } = render(
        <LoanOptionPage params={{ slug: firstOption.slug }} />
      )
      const loanAnalysis = analyzeHeadingHierarchy(loanContainer.innerHTML)
      expect(loanAnalysis.h1Count).toBe(1)
      expect(loanAnalysis.hasSkippedLevels).toBe(false)
      unmountLoan()
    })

    it('should maintain heading hierarchy across all page types', async () => {
      // Property: All page types (static, blog, loan options, calculators, profiles)
      // should maintain proper heading hierarchy
      
      const pageTypeTests = [
        { type: 'Content', importPath: '@/app/about/page' },
        { type: 'Calculator', importPath: '@/app/calculator/purchase/page' },
        { type: 'Blog', importPath: '@/app/blog/page' },
        { type: 'Loan Options', importPath: '@/app/loan-options/page' },
        { type: 'Team Profile', importPath: '@/app/matthew-bramow/page' },
      ]

      for (const pageTest of pageTypeTests) {
        const PageComponent = (await import(pageTest.importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.isValid).toBe(true)
        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        
        if (!analysis.isValid) {
          console.error(`${pageTest.type} page has invalid heading hierarchy`)
        }
        
        unmount()
      }
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle pages with minimal headings (only H1)', async () => {
      // Property: Pages with only an H1 should still be valid
      // This tests the boundary condition of minimal heading structure
      
      // Most pages will have more than just H1, but the property should hold
      // that a page with only H1 is valid (no skipped levels possible)
      const ScheduleCallPage = (await import('@/app/schedule-a-call/page')).default
      const { container, unmount } = render(<ScheduleCallPage />)
      const html = container.innerHTML

      const analysis = analyzeHeadingHierarchy(html)

      expect(analysis.h1Count).toBe(1)
      expect(analysis.hasSkippedLevels).toBe(false)
      
      unmount()
    })

    it('should handle pages with deep heading nesting (H1 → H2 → H3 → H4)', async () => {
      // Property: Pages with deep but proper nesting should be valid
      // Blog posts often have deeper heading structures
      
      const BlogPostPage = (await import('@/app/blog/[slug]/page')).default
      const post = blogPosts[0]
      
      const { container, unmount } = render(
        <BlogPostPage params={{ slug: post.slug }} />
      )
      const html = container.innerHTML

      const analysis = analyzeHeadingHierarchy(html)

      expect(analysis.h1Count).toBe(1)
      expect(analysis.hasSkippedLevels).toBe(false)
      
      // Verify that if there are H3s, there are also H2s
      const hasH3 = analysis.headingSequence.includes('h3')
      const hasH2 = analysis.headingSequence.includes('h2')
      
      if (hasH3) {
        expect(hasH2).toBe(true)
      }
      
      unmount()
    })

    it('should validate heading hierarchy regardless of heading content', async () => {
      // Property: Heading hierarchy validity is independent of heading text content
      // This tests that the structure is what matters, not the content
      
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          async (postIndex) => {
            const post = blogPosts[postIndex]
            const BlogPostPage = (await import('@/app/blog/[slug]/page')).default
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            const html = container.innerHTML

            const analysis = analyzeHeadingHierarchy(html)

            // Property: Valid hierarchy regardless of what text is in the headings
            expect(analysis.isValid).toBe(true)
            
            unmount()
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('Comprehensive Page Coverage', () => {
    it('should validate heading hierarchy for all calculator pages', async () => {
      // Property: All calculator pages should have valid heading hierarchy
      const calculatorPages = [
        '@/app/calculator/affordability/page',
        '@/app/calculator/purchase/page',
        '@/app/calculator/refinance/page',
        '@/app/calculator/rent-vs-buy/page',
        '@/app/calculator/va-purchase/page',
        '@/app/calculator/va-refinance/page',
        '@/app/calculator/dscr/page',
      ]

      for (const importPath of calculatorPages) {
        const PageComponent = (await import(importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        expect(analysis.isValid).toBe(true)
        
        unmount()
      }
    })

    it('should validate heading hierarchy for all content pages', async () => {
      // Property: All content pages should have valid heading hierarchy
      const contentPages = [
        '@/app/about/page',
        '@/app/meet-our-team/page',
        '@/app/schedule-a-call/page',
        '@/app/reviews/page',
        '@/app/privacy-policy/page',
        '@/app/ada-accessibility-statement/page',
      ]

      for (const importPath of contentPages) {
        const PageComponent = (await import(importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        expect(analysis.isValid).toBe(true)
        
        unmount()
      }
    })

    it('should validate heading hierarchy for all team member pages', async () => {
      // Property: All team member profile pages should have valid heading hierarchy
      const teamPages = [
        '@/app/matthew-bramow/page',
        '@/app/rolston-nicholls/page',
      ]

      for (const importPath of teamPages) {
        const PageComponent = (await import(importPath)).default
        const { container, unmount } = render(<PageComponent />)
        const html = container.innerHTML

        const analysis = analyzeHeadingHierarchy(html)

        expect(analysis.h1Count).toBe(1)
        expect(analysis.hasSkippedLevels).toBe(false)
        expect(analysis.isValid).toBe(true)
        
        unmount()
      }
    })
  })
})
