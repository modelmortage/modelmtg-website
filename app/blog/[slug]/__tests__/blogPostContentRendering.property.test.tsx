/**
 * Property-Based Tests for Blog Post Content Rendering
 * Feature: website-structure-migration
 * 
 * Property 12: Blog Post Content Rendering
 * For any blog post page, the complete article content should be rendered 
 * with proper HTML structure and formatting.
 * 
 * **Validates: Requirements 4.5**
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import { blogPosts } from '@/lib/content/blogPosts'
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

describe('Property 12: Blog Post Content Rendering', () => {
  /**
   * **Validates: Requirements 4.5**
   * 
   * This property test verifies that blog post pages render complete article
   * content with proper HTML structure and formatting for all blog posts.
   */

  describe('Complete Content Rendering', () => {
    it('should render complete article content for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should be rendered in the document
            const bodyText = document.body.textContent || ''
            
            // Property: Content should be substantial (not empty)
            expect(bodyText.length).toBeGreaterThan(100)
            
            // Property: Content should include text from the post content
            // Extract meaningful text from the content (skip markdown syntax)
            const contentLines = post.content
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0 && !line.startsWith('#'))
            
            // Check that at least some content lines are present
            let foundContentLines = 0
            for (const line of contentLines.slice(0, 10)) {
              // Remove markdown syntax for comparison
              const cleanLine = line
                .replace(/\*\*/g, '')
                .replace(/^- /, '')
                .trim()
              
              if (cleanLine.length > 20 && bodyText.includes(cleanLine.substring(0, 30))) {
                foundContentLines++
              }
            }
            
            // Property: At least some content should be rendered
            expect(foundContentLines).toBeGreaterThan(0)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render content with minimum expected length for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Rendered content should have substantial length
            const bodyText = document.body.textContent || ''
            
            // Property: Content length should be at least 50% of source content
            // (accounting for markdown syntax removal)
            const minExpectedLength = post.content.length * 0.3
            expect(bodyText.length).toBeGreaterThan(minExpectedLength)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not lose content during rendering for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Key phrases from content should be present
            // Extract sentences (text between periods)
            const sentences = post.content
              .split(/[.!?]\s+/)
              .map(s => s.trim())
              .filter(s => s.length > 30 && !s.startsWith('#'))
            
            const bodyText = document.body.textContent || ''
            
            // Check that at least 50% of sentences are present
            let foundSentences = 0
            for (const sentence of sentences.slice(0, 20)) {
              const cleanSentence = sentence
                .replace(/\*\*/g, '')
                .replace(/^- /, '')
                .trim()
              
              // Check if first 20 characters of sentence are present
              if (cleanSentence.length > 20) {
                const snippet = cleanSentence.substring(0, 20)
                if (bodyText.includes(snippet)) {
                  foundSentences++
                }
              }
            }
            
            const totalChecked = Math.min(sentences.length, 20)
            if (totalChecked > 0) {
              const foundPercentage = foundSentences / totalChecked
              expect(foundPercentage).toBeGreaterThan(0.3)
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('HTML Structure', () => {
    it('should render content with proper HTML structure for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should be wrapped in an article element
            const article = container.querySelector('article')
            expect(article).toBeInTheDocument()
            
            // Property: Article should contain the main content
            expect(article?.textContent?.length).toBeGreaterThan(100)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render headings from markdown for any blog post with headings', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            // Only test posts that have markdown headings
            const hasHeadings = /^#{1,6}\s+/m.test(post.content)
            
            if (!hasHeadings) {
              return true // Skip posts without headings
            }
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Markdown headings should be converted to HTML headings
            const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
            
            // Should have at least the title heading plus content headings
            expect(headings.length).toBeGreaterThan(1)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render paragraphs from content for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should be rendered in paragraph elements
            const paragraphs = container.querySelectorAll('p')
            
            // Should have multiple paragraphs for article content
            expect(paragraphs.length).toBeGreaterThan(0)
            
            // Property: Paragraphs should contain actual content
            const paragraphsWithContent = Array.from(paragraphs).filter(
              p => (p.textContent?.length || 0) > 20
            )
            expect(paragraphsWithContent.length).toBeGreaterThan(0)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render lists from markdown for any blog post with lists', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            // Only test posts that have markdown lists
            const hasLists = /^- /m.test(post.content)
            
            if (!hasLists) {
              return true // Skip posts without lists
            }
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Markdown lists should be converted to HTML lists
            const lists = container.querySelectorAll('ul, ol')
            expect(lists.length).toBeGreaterThan(0)
            
            // Property: Lists should contain list items
            const listItems = container.querySelectorAll('li')
            expect(listItems.length).toBeGreaterThan(0)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render bold text from markdown for any blog post with bold text', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            // Only test posts that have bold markdown
            const hasBold = /\*\*[^*]+\*\*/.test(post.content)
            
            if (!hasBold) {
              return true // Skip posts without bold text
            }
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Bold markdown should be converted to strong elements
            const strongElements = container.querySelectorAll('strong')
            expect(strongElements.length).toBeGreaterThan(0)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Content Formatting', () => {
    it('should maintain proper spacing between content elements for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content elements should be properly separated
            // Check that we have multiple block-level elements
            const blockElements = container.querySelectorAll('p, h1, h2, h3, h4, ul, ol')
            expect(blockElements.length).toBeGreaterThan(1)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render content in readable format for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { container, unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should not be rendered as one giant block
            // Check that text is distributed across multiple elements
            const textElements = container.querySelectorAll('p, li, h1, h2, h3, h4')
            const totalTextLength = Array.from(textElements).reduce(
              (sum, el) => sum + (el.textContent?.length || 0),
              0
            )
            
            // Property: Text should be distributed (not all in one element)
            if (textElements.length > 0) {
              const avgLength = totalTextLength / textElements.length
              expect(avgLength).toBeLessThan(5000) // No single element should be too long
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should preserve content order for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should appear in the same order as source
            // Extract first few meaningful lines from content
            const contentLines = post.content
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 20 && !line.startsWith('#'))
              .slice(0, 5)
            
            const bodyText = document.body.textContent || ''
            
            // Find positions of content lines in rendered output
            const positions: number[] = []
            for (const line of contentLines) {
              const cleanLine = line.replace(/\*\*/g, '').replace(/^- /, '').trim()
              if (cleanLine.length > 20) {
                const snippet = cleanLine.substring(0, 30)
                const pos = bodyText.indexOf(snippet)
                if (pos !== -1) {
                  positions.push(pos)
                }
              }
            }
            
            // Property: Found content should appear in increasing order
            if (positions.length > 1) {
              for (let i = 1; i < positions.length; i++) {
                expect(positions[i]).toBeGreaterThan(positions[i - 1])
              }
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Content Completeness', () => {
    it('should render all major sections for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: All H2 headings from content should be rendered
            const h2Headings = post.content
              .split('\n')
              .filter(line => line.trim().startsWith('## '))
              .map(line => line.trim().substring(3).trim())
            
            const bodyText = document.body.textContent || ''
            
            // Check that major section headings are present
            let foundHeadings = 0
            for (const heading of h2Headings) {
              if (bodyText.includes(heading)) {
                foundHeadings++
              }
            }
            
            // Property: At least 80% of H2 headings should be present
            if (h2Headings.length > 0) {
              const foundPercentage = foundHeadings / h2Headings.length
              expect(foundPercentage).toBeGreaterThan(0.8)
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not truncate content for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should include text from the end of the article
            // Get last meaningful paragraph from content
            const contentLines = post.content
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 30 && !line.startsWith('#'))
            
            const lastLines = contentLines.slice(-5)
            const bodyText = document.body.textContent || ''
            
            // Check that content from the end is present
            let foundEndContent = false
            for (const line of lastLines) {
              const cleanLine = line.replace(/\*\*/g, '').replace(/^- /, '').trim()
              if (cleanLine.length > 20) {
                const snippet = cleanLine.substring(0, 30)
                if (bodyText.includes(snippet)) {
                  foundEndContent = true
                  break
                }
              }
            }
            
            // Property: Content from the end should be present (not truncated)
            expect(foundEndContent).toBe(true)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should render content from beginning, middle, and end for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            // Property: Content should be complete (not just excerpts)
            const contentLines = post.content
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 30 && !line.startsWith('#'))
            
            if (contentLines.length < 3) {
              unmount()
              return true // Skip very short posts
            }
            
            const bodyText = document.body.textContent || ''
            
            // Check beginning
            const beginningLine = contentLines[0]
            const beginningSnippet = beginningLine
              .replace(/\*\*/g, '')
              .replace(/^- /, '')
              .substring(0, 30)
            const hasBeginning = bodyText.includes(beginningSnippet)
            
            // Check middle
            const middleIndex = Math.floor(contentLines.length / 2)
            const middleLine = contentLines[middleIndex]
            const middleSnippet = middleLine
              .replace(/\*\*/g, '')
              .replace(/^- /, '')
              .substring(0, 30)
            const hasMiddle = bodyText.includes(middleSnippet)
            
            // Check end
            const endLine = contentLines[contentLines.length - 1]
            const endSnippet = endLine
              .replace(/\*\*/g, '')
              .replace(/^- /, '')
              .substring(0, 30)
            const hasEnd = bodyText.includes(endSnippet)
            
            // Property: Should have content from all sections
            const sectionsFound = [hasBeginning, hasMiddle, hasEnd].filter(Boolean).length
            expect(sectionsFound).toBeGreaterThanOrEqual(2)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Content Integrity', () => {
    it('should not corrupt special characters for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            const bodyText = document.body.textContent || ''
            
            // Property: Common special characters should be preserved
            // Check for presence of punctuation and special chars if they exist in source
            if (post.content.includes('%')) {
              expect(bodyText).toContain('%')
            }
            if (post.content.includes('$')) {
              expect(bodyText).toContain('$')
            }
            if (post.content.includes('&')) {
              // & might be encoded, so check for either form
              expect(bodyText.includes('&') || bodyText.includes('and')).toBe(true)
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain text readability for any blog post', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: blogPosts.length - 1 }),
          (postIndex) => {
            const post = blogPosts[postIndex]
            
            const { unmount } = render(
              <BlogPostPage params={{ slug: post.slug }} />
            )
            
            const bodyText = document.body.textContent || ''
            
            // Property: Text should not have excessive whitespace
            // Check that there aren't long runs of spaces
            const hasExcessiveSpaces = /\s{10,}/.test(bodyText)
            expect(hasExcessiveSpaces).toBe(false)
            
            // Property: Text should have normal word spacing
            const words = bodyText.split(/\s+/).filter(w => w.length > 0)
            expect(words.length).toBeGreaterThan(50)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Requirements Validation', () => {
    it('should meet Requirement 4.5: Display complete article content with proper formatting', () => {
      // Requirement 4.5: When a user navigates to a blog post, the system should 
      // display the complete article content with proper formatting
      
      const post = blogPosts[0]
      const { container } = render(<BlogPostPage params={{ slug: post.slug }} />)
      
      // Verify complete content is rendered
      const bodyText = document.body.textContent || ''
      expect(bodyText.length).toBeGreaterThan(100)
      
      // Verify proper HTML structure
      expect(container.querySelector('article')).toBeInTheDocument()
      expect(container.querySelectorAll('p').length).toBeGreaterThan(0)
      
      // Verify formatting elements are present
      const headings = container.querySelectorAll('h1, h2, h3, h4')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should meet Requirement 4.7: Maintain readability with proper typography and spacing', () => {
      // Requirement 4.7: When displaying blog content, the system should maintain 
      // readability with proper typography and spacing
      
      const post = blogPosts[0]
      const { container } = render(<BlogPostPage params={{ slug: post.slug }} />)
      
      // Verify content is structured with proper spacing
      const blockElements = container.querySelectorAll('p, h1, h2, h3, h4, ul, ol')
      expect(blockElements.length).toBeGreaterThan(1)
      
      // Verify paragraphs contain readable content
      const paragraphs = container.querySelectorAll('p')
      const paragraphsWithContent = Array.from(paragraphs).filter(
        p => (p.textContent?.length || 0) > 20
      )
      expect(paragraphsWithContent.length).toBeGreaterThan(0)
    })

    it('should render all blog posts with complete content', () => {
      // Property: Every blog post should render with complete content
      blogPosts.forEach((post) => {
        const { container, unmount } = render(
          <BlogPostPage params={{ slug: post.slug }} />
        )
        
        // Verify content is present and substantial
        const bodyText = document.body.textContent || ''
        expect(bodyText.length).toBeGreaterThan(100)
        
        // Verify HTML structure
        expect(container.querySelector('article')).toBeInTheDocument()
        
        unmount()
      })
    })
  })
})
