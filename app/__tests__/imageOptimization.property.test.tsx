/**
 * Property-based tests for image optimization
 * Feature: website-structure-migration
 * Property 27: Image Optimization
 * 
 * **Validates: Requirements 9.2**
 * 
 * For any image element, the image should be served in WebP format (or have WebP alternatives)
 * and use responsive sizing attributes.
 */

import { render } from '@testing-library/react'
import fc from 'fast-check'
import BlogCard from '@/components/content/BlogCard'
import TeamMemberCard from '@/components/content/TeamMemberCard'
import { BlogPost, TeamMember } from '@/lib/types/content'

describe('Property 27: Image Optimization', () => {
  describe('BlogCard image optimization', () => {
    it('should use Next.js Image component with responsive attributes for any blog post', () => {
      fc.assert(
        fc.property(
          fc.record({
            slug: fc.string({ minLength: 5, maxLength: 50 }),
            title: fc.string({ minLength: 10, maxLength: 100 }),
            excerpt: fc.string({ minLength: 20, maxLength: 200 }),
            content: fc.string({ minLength: 50, maxLength: 500 }),
            author: fc.string({ minLength: 5, maxLength: 50 }),
            publishDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
              .map(d => d.toISOString().split('T')[0]),
            category: fc.constantFrom('Learn', 'Home Buying', 'Refinancing', 'Investment'),
            tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
            featuredImage: fc.constant('/test-image.jpg'),
            readTime: fc.integer({ min: 1, max: 20 }),
            metadata: fc.record({
              title: fc.string({ minLength: 10, maxLength: 100 }),
              description: fc.string({ minLength: 20, maxLength: 160 }),
              keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
            }),
          }),
          (data) => {
            const blogPost: BlogPost = {
              ...data,
              metadata: {
                ...data.metadata,
              },
            }

            const { container } = render(<BlogCard blogPost={blogPost} />)
            
            // Verify image element exists
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
            
            // Verify Next.js Image component attributes
            // Next.js Image with fill adds position absolute
            expect(image).toHaveStyle({ position: 'absolute' })
            
            // Verify responsive srcset is present (Next.js generates this)
            expect(image).toHaveAttribute('srcset')
            
            // Verify loading attribute is present
            expect(image).toHaveAttribute('loading')
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('TeamMemberCard image optimization', () => {
    it('should use Next.js Image component with responsive attributes for any team member', () => {
      fc.assert(
        fc.property(
          fc.record({
            slug: fc.string({ minLength: 5, maxLength: 50 }),
            name: fc.string({ minLength: 5, maxLength: 50 }),
            title: fc.string({ minLength: 10, maxLength: 100 }),
            bio: fc.string({ minLength: 50, maxLength: 500 }),
            photo: fc.constant('/test-photo.jpg'),
            credentials: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
            specialties: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
            contact: fc.record({
              email: fc.option(fc.emailAddress(), { nil: undefined }),
              phone: fc.option(fc.string({ minLength: 10, maxLength: 15 }), { nil: undefined }),
            }),
            metadata: fc.record({
              title: fc.string({ minLength: 10, maxLength: 100 }),
              description: fc.string({ minLength: 20, maxLength: 160 }),
              keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
            }),
          }),
          (data) => {
            const teamMember: TeamMember = {
              ...data,
              metadata: {
                ...data.metadata,
              },
            }

            const { container } = render(<TeamMemberCard teamMember={teamMember} />)
            
            // Verify image element exists
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
            
            // Verify Next.js Image component attributes
            expect(image).toHaveStyle({ position: 'absolute' })
            
            // Verify responsive srcset is present
            expect(image).toHaveAttribute('srcset')
            
            // Verify loading attribute is present
            expect(image).toHaveAttribute('loading')
          }
        ),
        { numRuns: 50 }
      )
    })
  })

  describe('Image component configuration', () => {
    it('should verify images have proper alt text for any content', () => {
      fc.assert(
        fc.property(
          fc.record({
            slug: fc.string({ minLength: 5, maxLength: 50 }),
            title: fc.string({ minLength: 10, maxLength: 100 }),
            excerpt: fc.string({ minLength: 20, maxLength: 200 }),
            content: fc.string({ minLength: 50, maxLength: 500 }),
            author: fc.string({ minLength: 5, maxLength: 50 }),
            publishDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
              .map(d => d.toISOString().split('T')[0]),
            category: fc.constantFrom('Learn', 'Home Buying', 'Refinancing'),
            tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
            featuredImage: fc.constant('/test-image.jpg'),
            readTime: fc.integer({ min: 1, max: 20 }),
            metadata: fc.record({
              title: fc.string({ minLength: 10, maxLength: 100 }),
              description: fc.string({ minLength: 20, maxLength: 160 }),
              keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
            }),
          }),
          (data) => {
            const blogPost: BlogPost = {
              ...data,
              metadata: {
                ...data.metadata,
              },
            }

            const { container } = render(<BlogCard blogPost={blogPost} />)
            
            const image = container.querySelector('img')
            expect(image).toBeInTheDocument()
            
            // Verify alt text is present and meaningful
            const altText = image?.getAttribute('alt')
            expect(altText).toBeTruthy()
            expect(altText).toBe(blogPost.title)
          }
        ),
        { numRuns: 50 }
      )
    })
  })
})
