/**
 * Unit tests for static generation configuration
 * Validates: Requirements 9.3
 */

import { describe, it, expect } from '@jest/globals'

describe('Static Generation Configuration', () => {
  describe('Blog Listing Page ISR', () => {
    it('should have ISR revalidation configured for blog listing page', async () => {
      // Import the blog page module to check its exports
      const blogPageModule = await import('../blog/page')
      
      // Verify that revalidate is exported and set to 24 hours (86400 seconds)
      expect(blogPageModule).toHaveProperty('revalidate')
      expect(blogPageModule.revalidate).toBe(86400)
    })
  })

  describe('Dynamic Routes Static Params', () => {
    it('should have generateStaticParams for blog post pages', async () => {
      const blogPostModule = await import('../blog/[slug]/page')
      
      expect(blogPostModule).toHaveProperty('generateStaticParams')
      expect(typeof blogPostModule.generateStaticParams).toBe('function')
      
      // Verify it returns an array of params
      const params = await blogPostModule.generateStaticParams()
      expect(Array.isArray(params)).toBe(true)
      expect(params.length).toBeGreaterThan(0)
      expect(params[0]).toHaveProperty('slug')
    })

    it('should have generateStaticParams for loan options pages', async () => {
      const loanOptionsModule = await import('../loan-options/[slug]/page')
      
      expect(loanOptionsModule).toHaveProperty('generateStaticParams')
      expect(typeof loanOptionsModule.generateStaticParams).toBe('function')
      
      // Verify it returns an array of params
      const params = await loanOptionsModule.generateStaticParams()
      expect(Array.isArray(params)).toBe(true)
      expect(params.length).toBeGreaterThan(0)
      expect(params[0]).toHaveProperty('slug')
    })
  })

  describe('Content Pages Static Generation', () => {
    it('should export metadata for about page', async () => {
      const aboutModule = await import('../about/page')
      
      expect(aboutModule).toHaveProperty('metadata')
      expect(aboutModule.metadata).toHaveProperty('title')
      expect(aboutModule.metadata).toHaveProperty('description')
    })

    it('should export metadata for reviews page', async () => {
      const reviewsModule = await import('../reviews/page')
      
      expect(reviewsModule).toHaveProperty('metadata')
      expect(reviewsModule.metadata).toHaveProperty('title')
      expect(reviewsModule.metadata).toHaveProperty('description')
    })

    it('should export metadata for learning center page', async () => {
      const learningCenterModule = await import('../learning-center/page')
      
      expect(learningCenterModule).toHaveProperty('metadata')
      expect(learningCenterModule.metadata).toHaveProperty('title')
      expect(learningCenterModule.metadata).toHaveProperty('description')
    })

    it('should export metadata for privacy policy page', async () => {
      const privacyModule = await import('../privacy-policy/page')
      
      expect(privacyModule).toHaveProperty('metadata')
      expect(privacyModule.metadata).toHaveProperty('title')
      expect(privacyModule.metadata).toHaveProperty('description')
    })

    it('should export metadata for ADA accessibility statement page', async () => {
      const adaModule = await import('../ada-accessibility-statement/page')
      
      expect(adaModule).toHaveProperty('metadata')
      expect(adaModule.metadata).toHaveProperty('title')
      expect(adaModule.metadata).toHaveProperty('description')
    })

    it('should export metadata for team member pages', async () => {
      const matthewModule = await import('../matthew-bramow/page')
      const rolstonModule = await import('../rolston-nicholls/page')
      
      expect(matthewModule).toHaveProperty('metadata')
      expect(matthewModule.metadata).toHaveProperty('title')
      
      expect(rolstonModule).toHaveProperty('metadata')
      expect(rolstonModule.metadata).toHaveProperty('title')
    })
  })

  describe('Calculator Pages Client-Side Rendering', () => {
    it('should not have static metadata export for calculator pages', async () => {
      // Calculator pages use 'use client' directive and don't export metadata
      // They should be client-side rendered, not statically generated
      
      // We can verify this by checking that the module doesn't export metadata
      // Note: This test verifies the absence of static generation for calculators
      const affordabilityModule = await import('../calculator/affordability/page')
      
      // Calculator pages should not have metadata export (they're client components)
      expect(affordabilityModule).not.toHaveProperty('metadata')
    })
  })

  describe('ISR Configuration Values', () => {
    it('should use appropriate revalidation time for blog listing', async () => {
      const blogPageModule = await import('../blog/page')
      
      // 86400 seconds = 24 hours
      // This is appropriate for blog content that doesn't change frequently
      expect(blogPageModule.revalidate).toBe(86400)
      expect(blogPageModule.revalidate).toBeGreaterThan(0)
      expect(blogPageModule.revalidate).toBeLessThanOrEqual(86400)
    })
  })

  describe('Static Generation Best Practices', () => {
    it('should have all required static pages with metadata', async () => {
      const staticPages = [
        '../about/page',
        '../reviews/page',
        '../learning-center/page',
        '../privacy-policy/page',
        '../ada-accessibility-statement/page',
        '../meet-our-team/page',
        '../schedule-a-call/page',
        '../matthew-bramow/page',
        '../rolston-nicholls/page',
      ]

      for (const pagePath of staticPages) {
        const pageModule = await import(pagePath)
        expect(pageModule).toHaveProperty('metadata')
        expect(pageModule.metadata).toHaveProperty('title')
        expect(pageModule.metadata).toHaveProperty('description')
      }
    })

    it('should have generateStaticParams for all dynamic routes', async () => {
      const dynamicRoutes = [
        '../blog/[slug]/page',
        '../loan-options/[slug]/page',
      ]

      for (const routePath of dynamicRoutes) {
        const routeModule = await import(routePath)
        expect(routeModule).toHaveProperty('generateStaticParams')
        expect(typeof routeModule.generateStaticParams).toBe('function')
        
        const params = await routeModule.generateStaticParams()
        expect(Array.isArray(params)).toBe(true)
        expect(params.length).toBeGreaterThan(0)
      }
    })
  })
})
