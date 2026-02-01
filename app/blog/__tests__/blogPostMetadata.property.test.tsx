/**
 * Property-Based Tests for Blog Post Metadata Completeness
 * Feature: website-structure-migration
 * 
 * Property 11: Blog Post Metadata Completeness
 * For any blog post (in listing or individual page), the rendered output should include 
 * title, excerpt, author, publication date, category, and featured image.
 * 
 * **Validates: Requirements 4.3, 4.6**
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import { blogPosts } from '@/lib/content/blogPosts'
import BlogCard from '@/components/content/BlogCard'
import BlogPostPage from '@/app/blog/[slug]/page'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  usePathname: jest.fn(() => '/blog/test-post'),
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

describe('Property 11: Blog Post Metadata Completeness', () => {
  /**
   * **Validates: Requirements 4.3, 4.6**
   * 
   * This property test verifies that blog posts display all required metadata
   * fields in both listing (BlogCard) and individual page views.
   */

  describe('BlogCard Component (Blog Listing)', () => {
    it('should display all required metadata fields for any blog post in listing', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(<BlogCard blogPost={post} />)
            
            // Property: Title must be present
            const titleElement = screen.getByText(post.title)
            expect(titleElement).toBeInTheDocument()
            
            // Property: Excerpt must be present
            const excerptElement = screen.getByText(post.excerpt)
            expect(excerptElement).toBeInTheDocument()
            
            // Property: Publication date must be present
            const dateElement = container.querySelector(`time[datetime="${post.publishDate}"]`)
            expect(dateElement).toBeInTheDocument()
            expect(dateElement?.textContent).toBeTruthy()
            
            // Property: Category must be present
            const categoryElement = screen.getByText(post.category)
            expect(categoryElement).toBeInTheDocument()
            
            // Property: Featured image must be present with correct src
            const imageElement = container.querySelector(`img[src="${post.featuredImage}"]`)
            expect(imageElement).toBeInTheDocument()
            expect(imageElement).toHaveAttribute('alt', post.title)
            
            // Property: Read time must be present
            const readTimeText = `${post.readTime} min read`
            const readTimeElement = screen.getByText(readTimeText)
            expect(readTimeElement).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render title as a heading element for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(<BlogCard blogPost={post} />)
            
            // Property: Title should be in an h2 element (BlogCard uses h2)
            const h2Element = container.querySelector('h2')
            expect(h2Element).toBeInTheDocument()
            expect(h2Element?.textContent).toBe(post.title)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should format publication date correctly for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(<BlogCard blogPost={post} />)
            
            // Property: Date should be in a time element with datetime attribute
            const timeElement = container.querySelector('time')
            expect(timeElement).toBeInTheDocument()
            expect(timeElement).toHaveAttribute('datetime', post.publishDate)
            
            // Property: Date should be formatted as readable text (not just ISO format)
            const dateText = timeElement?.textContent || ''
            expect(dateText).not.toBe(post.publishDate) // Should be formatted, not raw ISO
            expect(dateText.length).toBeGreaterThan(0)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display featured image with proper accessibility attributes for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(<BlogCard blogPost={post} />)
            
            // Property: Image must have alt text
            const imageElement = container.querySelector('img')
            expect(imageElement).toBeInTheDocument()
            expect(imageElement).toHaveAttribute('alt')
            expect(imageElement?.getAttribute('alt')).toBe(post.title)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render all blog posts with complete metadata', () => {
      // Property: Every blog post should render with all required metadata
      blogPosts.forEach((post) => {
        const { container, unmount } = render(<BlogCard blogPost={post} />)
        
        // Verify all required fields are present
        expect(screen.getByText(post.title)).toBeInTheDocument()
        expect(screen.getByText(post.excerpt)).toBeInTheDocument()
        // Use getAllByText for category since multiple posts may have the same category
        const categoryElements = screen.getAllByText(post.category)
        expect(categoryElements.length).toBeGreaterThan(0)
        expect(container.querySelector(`time[datetime="${post.publishDate}"]`)).toBeInTheDocument()
        expect(container.querySelector(`img[src="${post.featuredImage}"]`)).toBeInTheDocument()
        expect(screen.getByText(`${post.readTime} min read`)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should have clickable link to blog post for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(<BlogCard blogPost={post} />)
            
            // Property: Card should be wrapped in a link to the blog post
            const linkElement = container.querySelector(`a[href="/blog/${post.slug}"]`)
            expect(linkElement).toBeInTheDocument()
            
            // Property: Link should have accessible label
            expect(linkElement).toHaveAttribute('aria-label')
            const ariaLabel = linkElement?.getAttribute('aria-label')
            expect(ariaLabel).toContain(post.title)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Blog Post Page (Individual Post)', () => {
    it('should display all required metadata fields for any blog post page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Title must be present (appears multiple times - in hero and breadcrumb)
            const titleElements = screen.getAllByText(post.title)
            expect(titleElements.length).toBeGreaterThan(0)
            
            // Property: Author must be present
            const authorText = `By ${post.author}`
            const authorElement = screen.getByText(authorText)
            expect(authorElement).toBeInTheDocument()
            
            // Property: Publication date must be present
            const timeElements = container.querySelectorAll('time')
            expect(timeElements.length).toBeGreaterThan(0)
            const hasCorrectDate = Array.from(timeElements).some(
              el => el.getAttribute('datetime') === post.publishDate
            )
            expect(hasCorrectDate).toBe(true)
            
            // Property: Category must be present
            const categoryElements = screen.getAllByText(post.category)
            expect(categoryElements.length).toBeGreaterThan(0)
            
            // Property: Featured image must be present
            const images = container.querySelectorAll('img')
            const hasFeaturedImage = Array.from(images).some(
              img => img.getAttribute('src') === post.featuredImage
            )
            expect(hasFeaturedImage).toBe(true)
            
            // Property: Read time must be present
            const readTimeText = `${post.readTime} min read`
            const readTimeElement = screen.getByText(readTimeText)
            expect(readTimeElement).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display tags for any blog post page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: All tags should be displayed
            post.tags.forEach(tag => {
              const tagElement = screen.getByText(tag)
              expect(tagElement).toBeInTheDocument()
            })
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render author information for any blog post page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Author name should be present with "By" prefix
            const authorText = `By ${post.author}`
            expect(screen.getByText(authorText)).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should include structured data with all metadata for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Structured data script should exist
            const scripts = container.querySelectorAll('script[type="application/ld+json"]')
            expect(scripts.length).toBeGreaterThan(0)
            
            // Property: Should have BlogPosting structured data
            const articleScript = Array.from(scripts).find(script => {
              const content = script.textContent || ''
              return content.includes('"@type":"BlogPosting"')
            })
            expect(articleScript).toBeDefined()
            
            if (articleScript) {
              const structuredData = JSON.parse(articleScript.textContent || '{}')
              
              // Property: Structured data should include all required metadata
              expect(structuredData['@type']).toBe('BlogPosting')
              expect(structuredData.headline).toBe(post.title)
              expect(structuredData.author.name).toBe(post.author)
              expect(structuredData.datePublished).toBe(post.publishDate)
              expect(structuredData.image).toBe(post.featuredImage)
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render featured image with proper alt text for any blog post page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Featured image should have alt text matching the title
            const images = container.querySelectorAll('img')
            const featuredImage = Array.from(images).find(
              img => img.getAttribute('src') === post.featuredImage
            )
            
            expect(featuredImage).toBeDefined()
            expect(featuredImage).toHaveAttribute('alt', post.title)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should format date with proper datetime attribute for any blog post page', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Time elements should have datetime attribute
            const timeElements = container.querySelectorAll('time[datetime]')
            expect(timeElements.length).toBeGreaterThan(0)
            
            // Property: At least one time element should have the correct date
            const hasCorrectDate = Array.from(timeElements).some(
              el => el.getAttribute('datetime') === post.publishDate
            )
            expect(hasCorrectDate).toBe(true)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Metadata Consistency', () => {
    it('should have consistent metadata structure across all blog posts', () => {
      // Property: All blog posts should have the same metadata fields defined
      blogPosts.forEach(post => {
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('excerpt')
        expect(post).toHaveProperty('author')
        expect(post).toHaveProperty('publishDate')
        expect(post).toHaveProperty('category')
        expect(post).toHaveProperty('tags')
        expect(post).toHaveProperty('featuredImage')
        expect(post).toHaveProperty('readTime')
        expect(post).toHaveProperty('content')
        expect(post).toHaveProperty('metadata')
        
        // Verify metadata types
        expect(typeof post.slug).toBe('string')
        expect(typeof post.title).toBe('string')
        expect(typeof post.excerpt).toBe('string')
        expect(typeof post.author).toBe('string')
        expect(typeof post.publishDate).toBe('string')
        expect(typeof post.category).toBe('string')
        expect(Array.isArray(post.tags)).toBe(true)
        expect(typeof post.featuredImage).toBe('string')
        expect(typeof post.readTime).toBe('number')
        expect(typeof post.content).toBe('string')
        expect(typeof post.metadata).toBe('object')
      })
    })

    it('should have non-empty required metadata fields for all blog posts', () => {
      // Property: Required metadata fields should not be empty
      blogPosts.forEach(post => {
        expect(post.slug.length).toBeGreaterThan(0)
        expect(post.title.length).toBeGreaterThan(0)
        expect(post.excerpt.length).toBeGreaterThan(0)
        expect(post.author.length).toBeGreaterThan(0)
        expect(post.publishDate.length).toBeGreaterThan(0)
        expect(post.category.length).toBeGreaterThan(0)
        expect(post.tags.length).toBeGreaterThan(0)
        expect(post.featuredImage.length).toBeGreaterThan(0)
        expect(post.readTime).toBeGreaterThan(0)
        expect(post.content.length).toBeGreaterThan(0)
      })
    })

    it('should have valid date format for all blog posts', () => {
      // Property: Publication dates should be in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      
      blogPosts.forEach(post => {
        expect(post.publishDate).toMatch(dateRegex)
        
        // Property: Date should be parseable
        const date = new Date(post.publishDate)
        expect(date.toString()).not.toBe('Invalid Date')
      })
    })

    it('should have reasonable read time values for all blog posts', () => {
      // Property: Read time should be a positive integer
      blogPosts.forEach(post => {
        expect(post.readTime).toBeGreaterThan(0)
        expect(Number.isInteger(post.readTime)).toBe(true)
        
        // Property: Read time should be reasonable (1-60 minutes)
        expect(post.readTime).toBeGreaterThanOrEqual(1)
        expect(post.readTime).toBeLessThanOrEqual(60)
      })
    })

    it('should have valid image paths for all blog posts', () => {
      // Property: Featured images should have valid paths
      blogPosts.forEach(post => {
        expect(post.featuredImage).toMatch(/^\/images\/blog\//)
        expect(post.featuredImage).toMatch(/\.(jpg|jpeg|png|webp)$/)
      })
    })

    it('should have at least one tag for all blog posts', () => {
      // Property: All blog posts should have at least one tag
      blogPosts.forEach(post => {
        expect(post.tags.length).toBeGreaterThanOrEqual(1)
        
        // Property: All tags should be non-empty strings
        post.tags.forEach(tag => {
          expect(typeof tag).toBe('string')
          expect(tag.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have SEO metadata for all blog posts', () => {
      // Property: All blog posts should have complete SEO metadata
      blogPosts.forEach(post => {
        expect(post.metadata).toBeDefined()
        expect(post.metadata.title).toBeTruthy()
        expect(post.metadata.description).toBeTruthy()
        expect(post.metadata.keywords).toBeDefined()
        expect(Array.isArray(post.metadata.keywords)).toBe(true)
        expect(post.metadata.keywords.length).toBeGreaterThan(0)
        expect(post.metadata.canonical).toBeTruthy()
        expect(post.metadata.canonical).toBe(`/blog/${post.slug}`)
      })
    })

    it('should have reasonable excerpt length for all blog posts', () => {
      // Property: Excerpts should be between 50 and 300 characters
      blogPosts.forEach(post => {
        expect(post.excerpt.length).toBeGreaterThanOrEqual(50)
        expect(post.excerpt.length).toBeLessThanOrEqual(300)
      })
    })

    it('should have unique slugs for all blog posts', () => {
      // Property: All blog post slugs should be unique
      const slugs = blogPosts.map(post => post.slug)
      const uniqueSlugs = new Set(slugs)
      
      expect(uniqueSlugs.size).toBe(slugs.length)
    })
  })

  describe('Requirements Validation', () => {
    it('should meet Requirement 4.3: Display article metadata in listing', () => {
      // Requirement 4.3: Blog listing should display article titles, excerpts, 
      // publication dates, and featured images
      
      const post = blogPosts[0]
      const { container } = render(<BlogCard blogPost={post} />)
      
      // Verify all required fields from Requirement 4.3
      expect(screen.getByText(post.title)).toBeInTheDocument()
      expect(screen.getByText(post.excerpt)).toBeInTheDocument()
      expect(container.querySelector(`time[datetime="${post.publishDate}"]`)).toBeInTheDocument()
      expect(container.querySelector(`img[src="${post.featuredImage}"]`)).toBeInTheDocument()
    })

    it('should meet Requirement 4.6: Organize blog posts with complete metadata', () => {
      // Requirement 4.6: Blog posts should be organized with metadata including 
      // title, author, date, and category
      
      const post = blogPosts[0]
      const { container } = render(<BlogPostPage params={{ slug: post.slug }} />)
      
      // Verify all required metadata fields from Requirement 4.6
      expect(screen.getAllByText(post.title).length).toBeGreaterThan(0)
      expect(screen.getByText(`By ${post.author}`)).toBeInTheDocument()
      
      const timeElements = container.querySelectorAll('time')
      const hasDate = Array.from(timeElements).some(
        el => el.getAttribute('datetime') === post.publishDate
      )
      expect(hasDate).toBe(true)
      
      expect(screen.getAllByText(post.category).length).toBeGreaterThan(0)
    })

    it('should have at least 10 blog posts as per Requirement 4.4', () => {
      // Requirement 4.4: System should implement at least ten individual blog post pages
      expect(blogPosts.length).toBeGreaterThanOrEqual(10)
    })
  })
})
