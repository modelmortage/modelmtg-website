/**
 * Property-Based Tests for Structured Data Validity
 * Feature: website-structure-migration
 * Property 16: Structured Data Validity
 * Validates: Requirements 6.6
 * 
 * For any page with structured data, the JSON-LD script should be present,
 * valid JSON, and conform to schema.org specifications.
 */

import { render } from '@testing-library/react'
import fc from 'fast-check'

// Import pages that have structured data
import HomePage from '@/app/page'
import BlogPage from '@/app/blog/page'
import LearningCenterPage from '@/app/learning-center/page'
import ReviewsPage from '@/app/reviews/page'
import MatthewBramowPage from '@/app/matthew-bramow/page'
import RolstonNichollsPage from '@/app/rolston-nicholls/page'
import { blogPosts } from '@/lib/content/blogPosts'
import { loanOptions } from '@/lib/content/loanOptions'

// Mock all components to avoid rendering issues
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>
  }
})

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

jest.mock('@/components/shared/Breadcrumbs', () => {
  return function MockBreadcrumbs() {
    return <nav data-testid="breadcrumbs">Breadcrumbs</nav>
  }
})

jest.mock('@/components/home/HeroSection', () => {
  return function MockHeroSection() {
    return <div data-testid="hero">Hero</div>
  }
})

jest.mock('@/components/home/TrustBar', () => {
  return function MockTrustBar() {
    return <div data-testid="trust-bar">Trust Bar</div>
  }
})

jest.mock('@/components/home/LoanProgramsGrid', () => {
  return function MockLoanProgramsGrid() {
    return <div data-testid="loan-programs">Loan Programs</div>
  }
})

jest.mock('@/components/home/MarketPowerSection', () => {
  return function MockMarketPowerSection() {
    return <div data-testid="market-power">Market Power</div>
  }
})

jest.mock('@/components/home/AuthorityTimeline', () => {
  return function MockAuthorityTimeline() {
    return <div data-testid="authority-timeline">Authority Timeline</div>
  }
})

jest.mock('@/components/home/TrustStackWall', () => {
  return function MockTrustStackWall() {
    return <div data-testid="trust-stack">Trust Stack</div>
  }
})

jest.mock('@/components/home/PersonalBrandSection', () => {
  return function MockPersonalBrandSection() {
    return <div data-testid="personal-brand">Personal Brand</div>
  }
})

jest.mock('@/components/content/BlogCard', () => {
  return function MockBlogCard() {
    return <div data-testid="blog-card">Blog Card</div>
  }
})

jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ children, title }: any) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        {children}
      </div>
    )
  }
})

// Helper function to extract and validate structured data from a rendered component
function extractStructuredData(container: HTMLElement): any[] {
  const scripts = container.querySelectorAll('script[type="application/ld+json"]')
  const structuredDataArray: any[] = []

  scripts.forEach((script) => {
    const content = script.textContent || '{}'
    try {
      const data = JSON.parse(content)
      structuredDataArray.push(data)
    } catch (e) {
      // If JSON parsing fails, the test will catch it
      structuredDataArray.push({ error: 'Invalid JSON' })
    }
  })

  return structuredDataArray
}

// Helper function to validate schema.org context
function hasValidSchemaContext(data: any): boolean {
  return data['@context'] === 'https://schema.org'
}

// Helper function to validate required schema.org properties
function hasRequiredSchemaProperties(data: any): boolean {
  // Must have @context and @type
  if (!data['@context'] || !data['@type']) {
    return false
  }

  // Validate based on type
  const type = data['@type']

  switch (type) {
    case 'Organization':
      return !!(data.name)
    
    case 'RealEstateAgent':
      return !!(data.name && data.address)
    
    case 'Article':
      return !!(data.headline && data.author && data.datePublished)
    
    case 'BlogPosting':
      return !!(data.headline && data.author && data.datePublished)
    
    case 'Blog':
      return !!(data.name && data.url)
    
    case 'BreadcrumbList':
      return !!(data.itemListElement && Array.isArray(data.itemListElement))
    
    case 'WebSite':
      return !!(data.name && data.url)
    
    case 'LocalBusiness':
      return !!(data.name && data.address)
    
    case 'ItemList':
      return !!(data.itemListElement && Array.isArray(data.itemListElement))
    
    default:
      // For unknown types, just check that @context and @type exist
      return true
  }
}

// Helper function to validate BreadcrumbList structure
function isValidBreadcrumbList(data: any): boolean {
  if (data['@type'] !== 'BreadcrumbList') {
    return true // Not a breadcrumb, skip validation
  }

  if (!Array.isArray(data.itemListElement)) {
    return false
  }

  // Each item should have @type, position, name, and item
  return data.itemListElement.every((item: any, index: number) => {
    return (
      item['@type'] === 'ListItem' &&
      item.position === index + 1 &&
      typeof item.name === 'string' &&
      typeof item.item === 'string'
    )
  })
}

describe('Property 16: Structured Data Validity (Requirement 6.6)', () => {
  /**
   * **Validates: Requirements 6.6**
   * 
   * Property: For any page with structured data, the JSON-LD script should be:
   * 1. Present in the rendered HTML
   * 2. Valid JSON (parseable)
   * 3. Conform to schema.org specifications (@context, @type, required properties)
   */

  describe('Home Page Structured Data', () => {
    it('should have valid JSON-LD structured data', () => {
      const { container } = render(<HomePage />)
      const structuredData = extractStructuredData(container)

      // Property: Should have at least one structured data script
      expect(structuredData.length).toBeGreaterThan(0)

      // Property: All structured data should be valid JSON (no errors)
      structuredData.forEach((data) => {
        expect(data.error).toBeUndefined()
      })

      // Property: All structured data should have valid schema.org context
      structuredData.forEach((data) => {
        expect(hasValidSchemaContext(data)).toBe(true)
      })

      // Property: All structured data should have required properties
      structuredData.forEach((data) => {
        expect(hasRequiredSchemaProperties(data)).toBe(true)
      })
    })
  })

  describe('Blog Post Pages Structured Data', () => {
    it('should have valid Article structured data for all blog posts', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...blogPosts.map(post => post.slug)),
          (slug) => {
            // Dynamically import and render the blog post page
            const BlogPostPage = require('@/app/blog/[slug]/page').default
            const { container } = render(<BlogPostPage params={{ slug }} />)
            
            const structuredData = extractStructuredData(container)

            // Property: Should have at least one structured data script
            expect(structuredData.length).toBeGreaterThan(0)

            // Property: All structured data should be valid JSON
            structuredData.forEach((data) => {
              expect(data.error).toBeUndefined()
            })

            // Property: All structured data should have valid schema.org context
            structuredData.forEach((data) => {
              expect(hasValidSchemaContext(data)).toBe(true)
            })

            // Property: All structured data should have required properties
            structuredData.forEach((data) => {
              expect(hasRequiredSchemaProperties(data)).toBe(true)
            })

            // Property: Should have BlogPosting schema (not Article)
            const hasBlogPostingSchema = structuredData.some(data => data['@type'] === 'BlogPosting')
            expect(hasBlogPostingSchema).toBe(true)

            // Property: Should have BreadcrumbList schema
            const hasBreadcrumbSchema = structuredData.some(data => data['@type'] === 'BreadcrumbList')
            expect(hasBreadcrumbSchema).toBe(true)

            // Property: BreadcrumbList should be valid
            const breadcrumbData = structuredData.find(data => data['@type'] === 'BreadcrumbList')
            if (breadcrumbData) {
              expect(isValidBreadcrumbList(breadcrumbData)).toBe(true)
            }
          }
        ),
        { numRuns: Math.min(10, blogPosts.length) } // Test up to 10 blog posts
      )
    })
  })

  describe('Loan Options Pages Structured Data', () => {
    it('should have valid BreadcrumbList structured data for all loan option pages', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...loanOptions.map(option => option.slug)),
          (slug) => {
            // Dynamically import and render the loan option page
            const LoanOptionPage = require('@/app/loan-options/[slug]/page').default
            const { container } = render(<LoanOptionPage params={{ slug }} />)
            
            const structuredData = extractStructuredData(container)

            // Property: Should have at least one structured data script
            expect(structuredData.length).toBeGreaterThan(0)

            // Property: All structured data should be valid JSON
            structuredData.forEach((data) => {
              expect(data.error).toBeUndefined()
            })

            // Property: All structured data should have valid schema.org context
            structuredData.forEach((data) => {
              expect(hasValidSchemaContext(data)).toBe(true)
            })

            // Property: All structured data should have required properties
            structuredData.forEach((data) => {
              expect(hasRequiredSchemaProperties(data)).toBe(true)
            })

            // Property: Should have BreadcrumbList schema
            const hasBreadcrumbSchema = structuredData.some(data => data['@type'] === 'BreadcrumbList')
            expect(hasBreadcrumbSchema).toBe(true)

            // Property: BreadcrumbList should be valid
            const breadcrumbData = structuredData.find(data => data['@type'] === 'BreadcrumbList')
            if (breadcrumbData) {
              expect(isValidBreadcrumbList(breadcrumbData)).toBe(true)
            }
          }
        ),
        { numRuns: Math.min(10, loanOptions.length) } // Test up to 10 loan options
      )
    })
  })

  describe('Team Member Pages Structured Data', () => {
    it('should have valid BreadcrumbList structured data for Matthew Bramow page', () => {
      const { container } = render(<MatthewBramowPage />)
      const structuredData = extractStructuredData(container)

      // Property: Should have at least one structured data script
      expect(structuredData.length).toBeGreaterThan(0)

      // Property: All structured data should be valid JSON
      structuredData.forEach((data) => {
        expect(data.error).toBeUndefined()
      })

      // Property: All structured data should have valid schema.org context
      structuredData.forEach((data) => {
        expect(hasValidSchemaContext(data)).toBe(true)
      })

      // Property: All structured data should have required properties
      structuredData.forEach((data) => {
        expect(hasRequiredSchemaProperties(data)).toBe(true)
      })

      // Property: Should have BreadcrumbList schema
      const hasBreadcrumbSchema = structuredData.some(data => data['@type'] === 'BreadcrumbList')
      expect(hasBreadcrumbSchema).toBe(true)

      // Property: BreadcrumbList should be valid
      const breadcrumbData = structuredData.find(data => data['@type'] === 'BreadcrumbList')
      if (breadcrumbData) {
        expect(isValidBreadcrumbList(breadcrumbData)).toBe(true)
      }
    })

    it('should have valid BreadcrumbList structured data for Rolston Nicholls page', () => {
      const { container } = render(<RolstonNichollsPage />)
      const structuredData = extractStructuredData(container)

      // Property: Should have at least one structured data script
      expect(structuredData.length).toBeGreaterThan(0)

      // Property: All structured data should be valid JSON
      structuredData.forEach((data) => {
        expect(data.error).toBeUndefined()
      })

      // Property: All structured data should have valid schema.org context
      structuredData.forEach((data) => {
        expect(hasValidSchemaContext(data)).toBe(true)
      })

      // Property: All structured data should have required properties
      structuredData.forEach((data) => {
        expect(hasRequiredSchemaProperties(data)).toBe(true)
      })

      // Property: Should have BreadcrumbList schema
      const hasBreadcrumbSchema = structuredData.some(data => data['@type'] === 'BreadcrumbList')
      expect(hasBreadcrumbSchema).toBe(true)

      // Property: BreadcrumbList should be valid
      const breadcrumbData = structuredData.find(data => data['@type'] === 'BreadcrumbList')
      if (breadcrumbData) {
        expect(isValidBreadcrumbList(breadcrumbData)).toBe(true)
      }
    })
  })

  describe('Other Pages with Structured Data', () => {
    it('should have valid structured data for Blog listing page', () => {
      const { container } = render(<BlogPage />)
      const structuredData = extractStructuredData(container)

      // Property: Should have at least one structured data script
      expect(structuredData.length).toBeGreaterThan(0)

      // Property: All structured data should be valid JSON
      structuredData.forEach((data) => {
        expect(data.error).toBeUndefined()
      })

      // Property: All structured data should have valid schema.org context
      structuredData.forEach((data) => {
        expect(hasValidSchemaContext(data)).toBe(true)
      })

      // Property: All structured data should have required properties
      structuredData.forEach((data) => {
        expect(hasRequiredSchemaProperties(data)).toBe(true)
      })
    })

    it('should have valid structured data for Learning Center page', () => {
      const { container } = render(<LearningCenterPage />)
      const structuredData = extractStructuredData(container)

      // Property: Should have at least one structured data script
      expect(structuredData.length).toBeGreaterThan(0)

      // Property: All structured data should be valid JSON
      structuredData.forEach((data) => {
        expect(data.error).toBeUndefined()
      })

      // Property: All structured data should have valid schema.org context
      structuredData.forEach((data) => {
        expect(hasValidSchemaContext(data)).toBe(true)
      })

      // Property: All structured data should have required properties
      structuredData.forEach((data) => {
        expect(hasRequiredSchemaProperties(data)).toBe(true)
      })
    })

    it('should have valid structured data for Reviews page', () => {
      const { container } = render(<ReviewsPage />)
      const structuredData = extractStructuredData(container)

      // Property: Should have at least one structured data script
      expect(structuredData.length).toBeGreaterThan(0)

      // Property: All structured data should be valid JSON
      structuredData.forEach((data) => {
        expect(data.error).toBeUndefined()
      })

      // Property: All structured data should have valid schema.org context
      structuredData.forEach((data) => {
        expect(hasValidSchemaContext(data)).toBe(true)
      })

      // Property: All structured data should have required properties
      structuredData.forEach((data) => {
        expect(hasRequiredSchemaProperties(data)).toBe(true)
      })
    })
  })

  describe('Structured Data Schema Validation', () => {
    /**
     * Property: All structured data across all pages should conform to schema.org
     * specifications with proper @context and @type fields
     */
    it('should validate that all structured data has @context and @type', () => {
      const pages = [
        { name: 'Home', component: HomePage },
        { name: 'Blog', component: BlogPage },
        { name: 'Learning Center', component: LearningCenterPage },
        { name: 'Reviews', component: ReviewsPage },
        { name: 'Matthew Bramow', component: MatthewBramowPage },
        { name: 'Rolston Nicholls', component: RolstonNichollsPage },
      ]

      pages.forEach(({ name, component: Component }) => {
        const { container } = render(<Component />)
        const structuredData = extractStructuredData(container)

        structuredData.forEach((data, index) => {
          // Property: Must have @context
          expect(data['@context']).toBeDefined()
          expect(data['@context']).toBe('https://schema.org')

          // Property: Must have @type
          expect(data['@type']).toBeDefined()
          expect(typeof data['@type']).toBe('string')

          // Property: @type should be a valid schema.org type
          const validTypes = [
            'Organization',
            'RealEstateAgent',
            'Article',
            'BlogPosting',
            'Blog',
            'BreadcrumbList',
            'WebSite',
            'LocalBusiness',
            'ItemList',
            'AggregateRating',
            'Review',
            'Rating',
            'Person',
            'ImageObject',
            'WebPage',
            'PostalAddress',
            'ContactPoint',
            'GeoCoordinates',
            'CollectionPage'
          ]
          expect(validTypes).toContain(data['@type'])
        })
      })
    })
  })
})
