/**
 * Property-based tests for static generation configuration
 * **Validates: Requirements 9.3**
 * 
 * Feature: website-structure-migration
 * Property: Static Generation Configuration
 * 
 * This test verifies that:
 * - Content pages use static generation with proper metadata
 * - Blog listing page has ISR configured with appropriate revalidation
 * - Dynamic routes have generateStaticParams for pre-rendering
 * - Calculator pages use client-side rendering (not static)
 */

import { describe, it, expect } from '@jest/globals'
import fc from 'fast-check'

describe('Property-Based Tests: Static Generation Configuration', () => {
  describe('Property: All content pages must have static metadata', () => {
    it('should have metadata export for any content page', async () => {
      const contentPages = [
        'about',
        'reviews',
        'learning-center',
        'privacy-policy',
        'ada-accessibility-statement',
        'meet-our-team',
        'schedule-a-call',
        'matthew-bramow',
        'rolston-nicholls',
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...contentPages),
          async (pageName) => {
            const pageModule = await import(`../${pageName}/page`)
            
            // Every content page must have metadata for static generation
            expect(pageModule).toHaveProperty('metadata')
            expect(pageModule.metadata).toBeTruthy()
            expect(typeof pageModule.metadata).toBe('object')
            
            // Metadata must include title and description for SEO
            expect(pageModule.metadata).toHaveProperty('title')
            expect(pageModule.metadata).toHaveProperty('description')
            expect(typeof pageModule.metadata.title).toBe('string')
            expect(typeof pageModule.metadata.description).toBe('string')
            expect(pageModule.metadata.title.length).toBeGreaterThan(0)
            expect(pageModule.metadata.description.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: contentPages.length }
      )
    })
  })

  describe('Property: Dynamic routes must have generateStaticParams', () => {
    it('should have generateStaticParams for any dynamic route', async () => {
      const dynamicRoutes = [
        { path: 'blog/[slug]', paramKey: 'slug' },
        { path: 'loan-options/[slug]', paramKey: 'slug' },
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...dynamicRoutes),
          async (route) => {
            const routeModule = await import(`../${route.path}/page`)
            
            // Every dynamic route must have generateStaticParams
            expect(routeModule).toHaveProperty('generateStaticParams')
            expect(typeof routeModule.generateStaticParams).toBe('function')
            
            // generateStaticParams must return an array of params
            const params = await routeModule.generateStaticParams()
            expect(Array.isArray(params)).toBe(true)
            expect(params.length).toBeGreaterThan(0)
            
            // Each param must have the correct key
            params.forEach((param: any) => {
              expect(param).toHaveProperty(route.paramKey)
              expect(typeof param[route.paramKey]).toBe('string')
              expect(param[route.paramKey].length).toBeGreaterThan(0)
            })
          }
        ),
        { numRuns: dynamicRoutes.length }
      )
    })
  })

  describe('Property: ISR revalidation must be within acceptable range', () => {
    it('should have revalidation time between 1 hour and 7 days for ISR pages', async () => {
      const isrPages = [
        { path: 'blog', minRevalidate: 3600, maxRevalidate: 604800 }, // 1 hour to 7 days
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...isrPages),
          async (page) => {
            const pageModule = await import(`../${page.path}/page`)
            
            // ISR pages must have revalidate export
            expect(pageModule).toHaveProperty('revalidate')
            expect(typeof pageModule.revalidate).toBe('number')
            
            // Revalidation time must be within acceptable range
            expect(pageModule.revalidate).toBeGreaterThanOrEqual(page.minRevalidate)
            expect(pageModule.revalidate).toBeLessThanOrEqual(page.maxRevalidate)
            
            // Revalidation time must be positive
            expect(pageModule.revalidate).toBeGreaterThan(0)
          }
        ),
        { numRuns: isrPages.length }
      )
    })
  })

  describe('Property: Calculator pages must not have static metadata', () => {
    it('should not have metadata export for any calculator page', async () => {
      const calculatorPages = [
        'calculator/affordability',
        'calculator/purchase',
        'calculator/refinance',
        'calculator/rent-vs-buy',
        'calculator/va-purchase',
        'calculator/va-refinance',
        'calculator/dscr',
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...calculatorPages),
          async (pageName) => {
            const pageModule = await import(`../${pageName}/page`)
            
            // Calculator pages should not have metadata (they're client components)
            expect(pageModule).not.toHaveProperty('metadata')
            
            // Calculator pages should not have generateStaticParams
            expect(pageModule).not.toHaveProperty('generateStaticParams')
            
            // Calculator pages should not have revalidate
            expect(pageModule).not.toHaveProperty('revalidate')
          }
        ),
        { numRuns: calculatorPages.length }
      )
    })
  })

  describe('Property: Static params must generate unique slugs', () => {
    it('should generate unique slugs for any dynamic route', async () => {
      const dynamicRoutes = [
        'blog/[slug]',
        'loan-options/[slug]',
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...dynamicRoutes),
          async (routePath) => {
            const routeModule = await import(`../${routePath}/page`)
            const params = await routeModule.generateStaticParams()
            
            // Extract all slugs
            const slugs = params.map((p: any) => p.slug)
            
            // All slugs must be unique
            const uniqueSlugs = new Set(slugs)
            expect(uniqueSlugs.size).toBe(slugs.length)
            
            // All slugs must be non-empty strings
            slugs.forEach((slug: string) => {
              expect(typeof slug).toBe('string')
              expect(slug.length).toBeGreaterThan(0)
              expect(slug.trim()).toBe(slug) // No leading/trailing whitespace
            })
          }
        ),
        { numRuns: dynamicRoutes.length }
      )
    })
  })

  describe('Property: Metadata must be complete for SEO', () => {
    it('should have complete metadata for any static page', async () => {
      const staticPages = [
        'about',
        'reviews',
        'learning-center',
        'privacy-policy',
        'ada-accessibility-statement',
        'meet-our-team',
        'schedule-a-call',
        'matthew-bramow',
        'rolston-nicholls',
        'blog',
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...staticPages),
          async (pageName) => {
            const pageModule = await import(`../${pageName}/page`)
            const metadata = pageModule.metadata
            
            // Title must be present and non-empty
            expect(metadata.title).toBeTruthy()
            expect(typeof metadata.title).toBe('string')
            expect(metadata.title.length).toBeGreaterThan(0)
            // Google displays 50-60 characters on desktop, up to 70-75 on mobile
            // We allow up to 75 characters as acceptable
            expect(metadata.title.length).toBeLessThanOrEqual(75)
            
            // Description must be present and non-empty
            expect(metadata.description).toBeTruthy()
            expect(typeof metadata.description).toBe('string')
            expect(metadata.description.length).toBeGreaterThan(0)
            expect(metadata.description.length).toBeLessThanOrEqual(160) // SEO best practice
            
            // OpenGraph should be present for social sharing
            if (metadata.openGraph) {
              expect(metadata.openGraph).toHaveProperty('title')
              expect(metadata.openGraph).toHaveProperty('description')
            }
            
            // Canonical URL should be present
            if (metadata.alternates) {
              expect(metadata.alternates).toHaveProperty('canonical')
            }
          }
        ),
        { numRuns: staticPages.length }
      )
    })
  })

  describe('Property: ISR configuration must be consistent', () => {
    it('should have consistent ISR configuration across all ISR pages', async () => {
      // Currently only blog listing uses ISR
      const isrPages = ['blog']

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...isrPages),
          async (pageName) => {
            const pageModule = await import(`../${pageName}/page`)
            
            // Must have both metadata and revalidate
            expect(pageModule).toHaveProperty('metadata')
            expect(pageModule).toHaveProperty('revalidate')
            
            // Revalidate must be a positive number
            expect(typeof pageModule.revalidate).toBe('number')
            expect(pageModule.revalidate).toBeGreaterThan(0)
            expect(Number.isFinite(pageModule.revalidate)).toBe(true)
            expect(Number.isInteger(pageModule.revalidate)).toBe(true)
          }
        ),
        { numRuns: isrPages.length }
      )
    })
  })

  describe('Property: generateStaticParams must return valid data structure', () => {
    it('should return array of objects with correct shape for any dynamic route', async () => {
      const dynamicRoutes = [
        { path: 'blog/[slug]', expectedKeys: ['slug'] },
        { path: 'loan-options/[slug]', expectedKeys: ['slug'] },
      ]

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...dynamicRoutes),
          async (route) => {
            const routeModule = await import(`../${route.path}/page`)
            const params = await routeModule.generateStaticParams()
            
            // Must return an array
            expect(Array.isArray(params)).toBe(true)
            
            // Array must not be empty
            expect(params.length).toBeGreaterThan(0)
            
            // Each item must be an object with expected keys
            params.forEach((param: any) => {
              expect(typeof param).toBe('object')
              expect(param).not.toBeNull()
              
              route.expectedKeys.forEach(key => {
                expect(param).toHaveProperty(key)
                expect(typeof param[key]).toBe('string')
              })
            })
          }
        ),
        { numRuns: dynamicRoutes.length }
      )
    })
  })
})
