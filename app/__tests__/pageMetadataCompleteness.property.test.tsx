/**
 * Property-Based Tests for Page Metadata Completeness
 * Feature: website-structure-migration
 * 
 * Property 14: Page Metadata Completeness
 * For any page, the HTML head should contain a unique title tag, 
 * meta description (≤160 characters), and Open Graph tags (og:title, og:description).
 * 
 * **Validates: Requirements 6.1, 6.2, 6.4**
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import { Metadata } from 'next'

// Import all static page metadata
import { metadata as rootMetadata } from '../layout'
import { metadata as aboutMetadata } from '../about/page'
import { metadata as blogMetadata } from '../blog/page'
import { metadata as calculatorHubMetadata } from '../calculator/page'
import { metadata as contactMetadata } from '../contact/page'
import { metadata as loanOptionsMetadata } from '../loan-options/page'
import { metadata as meetOurTeamMetadata } from '../meet-our-team/page'
import { metadata as privacyPolicyMetadata } from '../privacy-policy/page'
import { metadata as adaAccessibilityMetadata } from '../ada-accessibility-statement/page'
import { metadata as reviewsMetadata } from '../reviews/page'
import { metadata as scheduleCallMetadata } from '../schedule-a-call/page'
import { metadata as learningCenterMetadata } from '../learning-center/page'

// Import calculator metadata from layouts
import { metadata as affordabilityMetadata } from '../calculator/affordability/layout'
import { metadata as purchaseMetadata } from '../calculator/purchase/layout'
import { metadata as refinanceMetadata } from '../calculator/refinance/layout'
import { metadata as rentVsBuyMetadata } from '../calculator/rent-vs-buy/layout'
import { metadata as vaPurchaseMetadata } from '../calculator/va-purchase/layout'
import { metadata as vaRefinanceMetadata } from '../calculator/va-refinance/layout'
import { metadata as dscrMetadata } from '../calculator/dscr/layout'
import { metadata as preQualifyMetadata } from '../pre-qualify/layout'

// Import team member metadata
import { metadata as matthewBramowMetadata } from '../matthew-bramow/page'
import { metadata as rolstonNichollsMetadata } from '../rolston-nicholls/page'

// Import dynamic content
import { blogPosts } from '@/lib/content/blogPosts'
import { loanOptions } from '@/lib/content/loanOptions'

interface PageMetadataEntry {
  name: string
  path: string
  metadata: Metadata
}

// Collect all static page metadata
const staticPages: PageMetadataEntry[] = [
  { name: 'Home', path: '/', metadata: rootMetadata },
  { name: 'About', path: '/about', metadata: aboutMetadata },
  { name: 'Blog', path: '/blog', metadata: blogMetadata },
  { name: 'Calculator Hub', path: '/calculator', metadata: calculatorHubMetadata },
  { name: 'Contact', path: '/contact', metadata: contactMetadata },
  { name: 'Loan Options Hub', path: '/loan-options', metadata: loanOptionsMetadata },
  { name: 'Meet Our Team', path: '/meet-our-team', metadata: meetOurTeamMetadata },
  { name: 'Privacy Policy', path: '/privacy-policy', metadata: privacyPolicyMetadata },
  { name: 'ADA Accessibility', path: '/ada-accessibility-statement', metadata: adaAccessibilityMetadata },
  { name: 'Reviews', path: '/reviews', metadata: reviewsMetadata },
  { name: 'Schedule a Call', path: '/schedule-a-call', metadata: scheduleCallMetadata },
  { name: 'Learning Center', path: '/learning-center', metadata: learningCenterMetadata },
  { name: 'Affordability Calculator', path: '/calculator/affordability', metadata: affordabilityMetadata },
  { name: 'Purchase Calculator', path: '/calculator/purchase', metadata: purchaseMetadata },
  { name: 'Refinance Calculator', path: '/calculator/refinance', metadata: refinanceMetadata },
  { name: 'Rent vs Buy Calculator', path: '/calculator/rent-vs-buy', metadata: rentVsBuyMetadata },
  { name: 'VA Purchase Calculator', path: '/calculator/va-purchase', metadata: vaPurchaseMetadata },
  { name: 'VA Refinance Calculator', path: '/calculator/va-refinance', metadata: vaRefinanceMetadata },
  { name: 'DSCR Calculator', path: '/calculator/dscr', metadata: dscrMetadata },
  { name: 'Pre-Qualify', path: '/pre-qualify', metadata: preQualifyMetadata },
  { name: 'Matthew Bramow Profile', path: '/matthew-bramow', metadata: matthewBramowMetadata },
  { name: 'Rolston Nicholls Profile', path: '/rolston-nicholls', metadata: rolstonNichollsMetadata },
]

// Collect dynamic page metadata
const dynamicPages: PageMetadataEntry[] = [
  ...blogPosts.map(post => ({
    name: `Blog Post: ${post.title}`,
    path: `/blog/${post.slug}`,
    metadata: {
      title: post.metadata.title,
      description: post.metadata.description,
      keywords: post.metadata.keywords?.join(', '),
      openGraph: {
        title: post.metadata.title,
        description: post.metadata.description,
        type: 'article' as const,
        images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: post.metadata.title,
        description: post.metadata.description,
        images: post.featuredImage ? [post.featuredImage] : undefined,
      },
      alternates: {
        canonical: post.metadata.canonical,
      },
    } as Metadata,
  })),
  ...loanOptions.map(option => ({
    name: `Loan Option: ${option.title}`,
    path: `/loan-options/${option.slug}`,
    metadata: {
      title: option.metadata.title,
      description: option.metadata.description,
      keywords: option.metadata.keywords?.join(', '),
      openGraph: {
        title: option.metadata.title,
        description: option.metadata.description,
        type: 'website' as const,
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: option.metadata.title,
        description: option.metadata.description,
      },
      alternates: {
        canonical: option.metadata.canonical,
      },
    } as Metadata,
  })),
]

const allPages = [...staticPages, ...dynamicPages]

describe('Property 14: Page Metadata Completeness', () => {
  /**
   * **Validates: Requirements 6.1, 6.2, 6.4**
   * 
   * This property test verifies that all pages have complete metadata:
   * - Unique title tags
   * - Meta descriptions ≤160 characters
   * - Open Graph tags (og:title, og:description)
   */

  describe('Requirement 6.1: Unique Title Tags', () => {
    it('should have a title tag for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: Title must be defined
            expect(page.metadata.title).toBeDefined()
            
            // Property: Title must be a non-empty string
            expect(typeof page.metadata.title).toBe('string')
            expect((page.metadata.title as string).length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have descriptive title (at least 20 characters) for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const title = page.metadata.title as string
            
            // Property: Title should be descriptive (at least 20 characters)
            expect(title.length).toBeGreaterThanOrEqual(20)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have unique titles across all pages', () => {
      // Property: All page titles should be unique
      const titles = allPages.map(page => page.metadata.title as string)
      const uniqueTitles = new Set(titles)
      
      expect(uniqueTitles.size).toBe(titles.length)
    })

    it('should have title that accurately describes the page for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const title = page.metadata.title as string
            
            // Property: Title should not be generic
            const genericTitles = ['Page', 'Untitled', 'New Page', 'Home Page']
            const isGeneric = genericTitles.some(generic => 
              title.toLowerCase() === generic.toLowerCase()
            )
            expect(isGeneric).toBe(false)
            
            // Property: Title should contain meaningful content
            expect(title.trim()).toBe(title) // No leading/trailing whitespace
            expect(title).not.toMatch(/^\s*$/) // Not just whitespace
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Requirement 6.2: Meta Descriptions ≤160 Characters', () => {
    it('should have a meta description for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: Description must be defined
            expect(page.metadata.description).toBeDefined()
            
            // Property: Description must be a non-empty string
            expect(typeof page.metadata.description).toBe('string')
            expect((page.metadata.description as string).length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have meta description ≤160 characters for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const description = page.metadata.description as string
            
            // Property: Description must be ≤160 characters (SEO best practice)
            expect(description.length).toBeLessThanOrEqual(160)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have meaningful description (at least 50 characters) for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const description = page.metadata.description as string
            
            // Property: Description should be substantial (at least 50 characters)
            expect(description.length).toBeGreaterThanOrEqual(50)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have description that summarizes page content for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const description = page.metadata.description as string
            
            // Property: Description should not be generic
            const genericDescriptions = ['Description', 'Page description', 'Content']
            const isGeneric = genericDescriptions.some(generic => 
              description.toLowerCase() === generic.toLowerCase()
            )
            expect(isGeneric).toBe(false)
            
            // Property: Description should be properly formatted
            expect(description.trim()).toBe(description) // No leading/trailing whitespace
            expect(description).not.toMatch(/^\s*$/) // Not just whitespace
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Requirement 6.4: Open Graph Tags', () => {
    it('should have Open Graph title for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: Open Graph metadata must be defined
            expect(page.metadata.openGraph).toBeDefined()
            
            // Property: og:title must be defined
            expect(page.metadata.openGraph?.title).toBeDefined()
            expect(typeof page.metadata.openGraph?.title).toBe('string')
            
            // Property: og:title should be non-empty
            const ogTitle = page.metadata.openGraph?.title as string
            expect(ogTitle.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have Open Graph description for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: og:description must be defined
            expect(page.metadata.openGraph?.description).toBeDefined()
            expect(typeof page.metadata.openGraph?.description).toBe('string')
            
            // Property: og:description should be non-empty
            const ogDescription = page.metadata.openGraph?.description as string
            expect(ogDescription.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have Open Graph type for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: og:type must be defined
            expect(page.metadata.openGraph?.type).toBeDefined()
            
            // Property: og:type should be a valid Open Graph type
            const validTypes = ['website', 'article', 'profile', 'book', 'video.movie', 'music.song']
            expect(validTypes).toContain(page.metadata.openGraph?.type)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have consistent Open Graph title with page title for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const title = page.metadata.title as string
            const ogTitle = page.metadata.openGraph?.title as string
            
            // Property: og:title should match or be derived from page title
            // They should be the same or og:title should be a substring of title
            const titlesMatch = title === ogTitle || 
                               title.includes(ogTitle) || 
                               ogTitle.includes(title.split('|')[0].trim())
            
            expect(titlesMatch).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have Open Graph description that is meaningful for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const ogDescription = page.metadata.openGraph?.description as string
            
            // Property: og:description should be meaningful and substantial
            expect(ogDescription.length).toBeGreaterThan(30)
            expect(ogDescription.length).toBeLessThanOrEqual(200) // OG descriptions can be longer than meta
            
            // Property: Should not be generic
            const genericDescriptions = ['Description', 'Page description', 'Content']
            const isGeneric = genericDescriptions.some(generic => 
              ogDescription.toLowerCase() === generic.toLowerCase()
            )
            expect(isGeneric).toBe(false)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have appropriate Open Graph type based on page content for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const ogType = page.metadata.openGraph?.type
            
            // Property: Blog posts should have 'article' type
            if (page.path.startsWith('/blog/') && page.path !== '/blog') {
              expect(ogType).toBe('article')
            }
            
            // Property: Team member profiles should have 'profile' type
            if (page.path.includes('matthew-bramow') || page.path.includes('rolston-nicholls')) {
              expect(ogType).toBe('profile')
            }
            
            // Property: Other pages should typically be 'website' type
            if (!page.path.startsWith('/blog/') && 
                !page.path.includes('matthew-bramow') && 
                !page.path.includes('rolston-nicholls')) {
              expect(['website', 'article']).toContain(ogType)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Canonical URLs', () => {
    it('should have canonical URL for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: Canonical URL should be defined for SEO
            expect(page.metadata.alternates?.canonical).toBeDefined()
            
            // Property: Canonical URL should match the page path
            const canonical = page.metadata.alternates?.canonical as string
            expect(canonical).toContain(page.path)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have properly formatted canonical URL for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const canonical = page.metadata.alternates?.canonical as string
            
            // Property: Canonical URL should be absolute or relative path
            expect(canonical).toBeTruthy()
            expect(canonical.length).toBeGreaterThan(0)
            
            // Property: Canonical should not have trailing slash (except root)
            if (canonical !== '/' && !canonical.startsWith('http')) {
              expect(canonical).not.toMatch(/\/$/)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Metadata Consistency Across All Pages', () => {
    it('should have all required metadata fields for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            
            // Property: All pages must have complete metadata structure
            expect(page.metadata).toBeDefined()
            expect(page.metadata.title).toBeDefined()
            expect(page.metadata.description).toBeDefined()
            expect(page.metadata.openGraph).toBeDefined()
            expect(page.metadata.openGraph?.title).toBeDefined()
            expect(page.metadata.openGraph?.description).toBeDefined()
            expect(page.metadata.openGraph?.type).toBeDefined()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have metadata that meets all requirements simultaneously for any page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allPages.length - 1 }),
          (pageIndex) => {
            const page = allPages[pageIndex]
            const title = page.metadata.title as string
            const description = page.metadata.description as string
            const ogTitle = page.metadata.openGraph?.title as string
            const ogDescription = page.metadata.openGraph?.description as string
            
            // Property: Combined requirements check
            // Requirement 6.1: Unique, descriptive title
            expect(title.length).toBeGreaterThanOrEqual(20)
            
            // Requirement 6.2: Description ≤160 characters and meaningful
            expect(description.length).toBeGreaterThanOrEqual(50)
            expect(description.length).toBeLessThanOrEqual(160)
            
            // Requirement 6.4: Open Graph tags present
            expect(ogTitle.length).toBeGreaterThan(0)
            expect(ogDescription.length).toBeGreaterThan(0)
            expect(page.metadata.openGraph?.type).toBeDefined()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have no duplicate metadata across different pages', () => {
      // Property: Each page should have unique metadata
      const titles = allPages.map(p => p.metadata.title)
      const descriptions = allPages.map(p => p.metadata.description)
      
      // All titles should be unique
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(titles.length)
      
      // All descriptions should be unique (or at least mostly unique)
      const uniqueDescriptions = new Set(descriptions)
      // Allow some description reuse but expect high uniqueness
      expect(uniqueDescriptions.size).toBeGreaterThan(allPages.length * 0.9)
    })
  })

  describe('Static Pages Metadata', () => {
    it('should have complete metadata for all static pages', () => {
      // Property: Every static page should have complete metadata
      staticPages.forEach((page) => {
        expect(page.metadata.title).toBeDefined()
        expect(page.metadata.description).toBeDefined()
        expect(page.metadata.openGraph?.title).toBeDefined()
        expect(page.metadata.openGraph?.description).toBeDefined()
        
        const title = page.metadata.title as string
        const description = page.metadata.description as string
        
        expect(title.length).toBeGreaterThanOrEqual(20)
        expect(description.length).toBeGreaterThanOrEqual(50)
        expect(description.length).toBeLessThanOrEqual(160)
      })
    })
  })

  describe('Dynamic Pages Metadata', () => {
    it('should have complete metadata for all blog posts', () => {
      // Property: Every blog post should have complete metadata
      const blogPostPages = allPages.filter(p => p.path.startsWith('/blog/') && p.path !== '/blog')
      
      expect(blogPostPages.length).toBe(blogPosts.length)
      
      blogPostPages.forEach((page) => {
        expect(page.metadata.title).toBeDefined()
        expect(page.metadata.description).toBeDefined()
        expect(page.metadata.openGraph?.title).toBeDefined()
        expect(page.metadata.openGraph?.description).toBeDefined()
        expect(page.metadata.openGraph?.type).toBe('article')
        
        const description = page.metadata.description as string
        expect(description.length).toBeLessThanOrEqual(160)
      })
    })

    it('should have complete metadata for all loan option pages', () => {
      // Property: Every loan option should have complete metadata
      const loanOptionPages = allPages.filter(p => 
        p.path.startsWith('/loan-options/') && p.path !== '/loan-options'
      )
      
      expect(loanOptionPages.length).toBe(loanOptions.length)
      
      loanOptionPages.forEach((page) => {
        expect(page.metadata.title).toBeDefined()
        expect(page.metadata.description).toBeDefined()
        expect(page.metadata.openGraph?.title).toBeDefined()
        expect(page.metadata.openGraph?.description).toBeDefined()
        
        const description = page.metadata.description as string
        expect(description.length).toBeLessThanOrEqual(160)
      })
    })
  })

  describe('Requirements Validation', () => {
    it('should meet Requirement 6.1: Unique title tags for every page', () => {
      // Requirement 6.1: The system shall include unique title tags for every page 
      // that accurately describe the page content
      
      const titles = allPages.map(p => p.metadata.title as string)
      const uniqueTitles = new Set(titles)
      
      // All titles should be unique
      expect(uniqueTitles.size).toBe(titles.length)
      
      // All titles should be descriptive
      titles.forEach(title => {
        expect(title.length).toBeGreaterThanOrEqual(20)
      })
    })

    it('should meet Requirement 6.2: Meta descriptions ≤160 characters for every page', () => {
      // Requirement 6.2: The system shall include meta descriptions for every page 
      // that summarize the page content within 160 characters
      
      allPages.forEach((page) => {
        const description = page.metadata.description as string
        
        expect(description).toBeDefined()
        expect(description.length).toBeGreaterThan(0)
        expect(description.length).toBeLessThanOrEqual(160)
        expect(description.length).toBeGreaterThanOrEqual(50) // Meaningful content
      })
    })

    it('should meet Requirement 6.4: Open Graph tags for all pages', () => {
      // Requirement 6.4: The system shall implement Open Graph tags for 
      // social media sharing on all pages
      
      allPages.forEach((page) => {
        expect(page.metadata.openGraph).toBeDefined()
        expect(page.metadata.openGraph?.title).toBeDefined()
        expect(page.metadata.openGraph?.description).toBeDefined()
        expect(page.metadata.openGraph?.type).toBeDefined()
        
        const ogTitle = page.metadata.openGraph?.title as string
        const ogDescription = page.metadata.openGraph?.description as string
        
        expect(ogTitle.length).toBeGreaterThan(0)
        expect(ogDescription.length).toBeGreaterThan(0)
      })
    })

    it('should have metadata for minimum required pages', () => {
      // Property: Should have metadata for all required page types
      // Static pages: 22
      // Blog posts: at least 10
      // Loan options: 11
      // Total minimum: 43
      
      expect(allPages.length).toBeGreaterThanOrEqual(43)
    })
  })
})
