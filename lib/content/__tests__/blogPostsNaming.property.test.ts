/**
 * Property-Based Test for File Naming Consistency
 * Feature: website-structure-migration
 * Task: 14.10 Write property test for file naming consistency
 * 
 * Property 29: File Naming Consistency
 * For any blog post file, the filename should follow the kebab-case naming 
 * convention and match the post slug.
 * 
 * **Validates: Requirements 10.4**
 */

import fc from 'fast-check'
import { blogPosts } from '@/lib/content/blogPosts'

describe('Property 29: File Naming Consistency', () => {
  /**
   * **Validates: Requirements 10.4**
   * 
   * This property test verifies that all blog post slugs follow the kebab-case
   * naming convention (lowercase letters, numbers, and hyphens only).
   */
  test('all blog post slugs follow kebab-case naming convention', () => {
    // Kebab-case pattern: lowercase letters, numbers, and hyphens
    // Must start with a letter or number, cannot have consecutive hyphens
    const kebabCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

    fc.assert(
      fc.property(
        fc.constantFrom(...blogPosts),
        (blogPost) => {
          // Verify the slug follows kebab-case convention
          expect(blogPost.slug).toMatch(kebabCasePattern)
          
          // Verify no uppercase letters
          expect(blogPost.slug).toBe(blogPost.slug.toLowerCase())
          
          // Verify no spaces
          expect(blogPost.slug).not.toContain(' ')
          
          // Verify no underscores (should use hyphens instead)
          expect(blogPost.slug).not.toContain('_')
          
          // Verify no consecutive hyphens
          expect(blogPost.slug).not.toMatch(/--/)
          
          // Verify doesn't start or end with hyphen
          expect(blogPost.slug).not.toMatch(/^-/)
          expect(blogPost.slug).not.toMatch(/-$/)
        }
      ),
      { numRuns: blogPosts.length }
    )
  })

  /**
   * **Validates: Requirements 10.4**
   * 
   * This test verifies that blog post slugs are unique to prevent
   * routing conflicts.
   */
  test('all blog post slugs are unique', () => {
    const slugs = blogPosts.map(post => post.slug)
    const uniqueSlugs = new Set(slugs)
    
    expect(uniqueSlugs.size).toBe(slugs.length)
  })

  /**
   * **Validates: Requirements 10.4**
   * 
   * This test verifies that blog post slugs match their canonical URLs,
   * ensuring consistency between the slug and the expected URL path.
   */
  test('blog post slugs match their canonical URLs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogPosts),
        (blogPost) => {
          if (blogPost.metadata.canonical) {
            // Canonical URL should end with the slug
            expect(blogPost.metadata.canonical).toBe(`/blog/${blogPost.slug}`)
          }
        }
      ),
      { numRuns: blogPosts.length }
    )
  })

  /**
   * **Validates: Requirements 10.4**
   * 
   * This test verifies that slugs are reasonable in length for URLs
   * (not too short to be meaningless, not too long to be unwieldy).
   */
  test('blog post slugs have reasonable length', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...blogPosts),
        (blogPost) => {
          // Slug should be at least 3 characters (e.g., "fha")
          expect(blogPost.slug.length).toBeGreaterThanOrEqual(3)
          
          // Slug should be at most 100 characters for practical URL length
          expect(blogPost.slug.length).toBeLessThanOrEqual(100)
        }
      ),
      { numRuns: blogPosts.length }
    )
  })
})
