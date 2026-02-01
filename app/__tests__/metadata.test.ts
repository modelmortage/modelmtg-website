/**
 * Metadata Verification Tests
 * 
 * This test suite verifies that all pages have proper metadata:
 * - Unique title tags
 * - Meta descriptions ≤160 characters
 * - Open Graph tags
 * 
 * Validates Requirements 6.1, 6.2, 6.4
 */

import { describe, it, expect } from '@jest/globals'

// Import all metadata from pages
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

// Import blog and loan options metadata (these are dynamic, so we'll test the generators)
import { blogPosts } from '@/lib/content/blogPosts'
import { loanOptions } from '@/lib/content/loanOptions'

describe('Page Metadata Verification', () => {
  const allMetadata = [
    { name: 'Home', metadata: rootMetadata },
    { name: 'About', metadata: aboutMetadata },
    { name: 'Blog', metadata: blogMetadata },
    { name: 'Calculator Hub', metadata: calculatorHubMetadata },
    { name: 'Contact', metadata: contactMetadata },
    { name: 'Loan Options Hub', metadata: loanOptionsMetadata },
    { name: 'Meet Our Team', metadata: meetOurTeamMetadata },
    { name: 'Privacy Policy', metadata: privacyPolicyMetadata },
    { name: 'ADA Accessibility', metadata: adaAccessibilityMetadata },
    { name: 'Reviews', metadata: reviewsMetadata },
    { name: 'Schedule a Call', metadata: scheduleCallMetadata },
    { name: 'Affordability Calculator', metadata: affordabilityMetadata },
    { name: 'Purchase Calculator', metadata: purchaseMetadata },
    { name: 'Refinance Calculator', metadata: refinanceMetadata },
    { name: 'Rent vs Buy Calculator', metadata: rentVsBuyMetadata },
    { name: 'VA Purchase Calculator', metadata: vaPurchaseMetadata },
    { name: 'VA Refinance Calculator', metadata: vaRefinanceMetadata },
    { name: 'DSCR Calculator', metadata: dscrMetadata },
    { name: 'Pre-Qualify', metadata: preQualifyMetadata },
    { name: 'Matthew Bramow Profile', metadata: matthewBramowMetadata },
    { name: 'Rolston Nicholls Profile', metadata: rolstonNichollsMetadata },
  ]

  describe('Requirement 6.1: Unique Title Tags', () => {
    it('should have a title tag for every page', () => {
      allMetadata.forEach(({ name, metadata }) => {
        expect(metadata.title).toBeDefined()
        expect(typeof metadata.title).toBe('string')
        expect((metadata.title as string).length).toBeGreaterThan(0)
      })
    })

    it('should have unique title tags for all pages', () => {
      const titles = allMetadata.map(({ metadata }) => metadata.title as string)
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(titles.length)
    })

    it('should have descriptive titles (at least 20 characters)', () => {
      allMetadata.forEach(({ name, metadata }) => {
        const title = metadata.title as string
        expect(title.length).toBeGreaterThanOrEqual(20)
      })
    })
  })

  describe('Requirement 6.2: Meta Descriptions ≤160 Characters', () => {
    it('should have a meta description for every page', () => {
      allMetadata.forEach(({ name, metadata }) => {
        expect(metadata.description).toBeDefined()
        expect(typeof metadata.description).toBe('string')
        expect((metadata.description as string).length).toBeGreaterThan(0)
      })
    })

    it('should have meta descriptions ≤160 characters', () => {
      allMetadata.forEach(({ name, metadata }) => {
        const description = metadata.description as string
        expect(description.length).toBeLessThanOrEqual(160)
      })
    })

    it('should have meaningful descriptions (at least 50 characters)', () => {
      allMetadata.forEach(({ name, metadata }) => {
        const description = metadata.description as string
        expect(description.length).toBeGreaterThanOrEqual(50)
      })
    })
  })

  describe('Requirement 6.4: Open Graph Tags', () => {
    it('should have Open Graph title for every page', () => {
      allMetadata.forEach(({ name, metadata }) => {
        expect(metadata.openGraph).toBeDefined()
        expect(metadata.openGraph?.title).toBeDefined()
        expect(typeof metadata.openGraph?.title).toBe('string')
      })
    })

    it('should have Open Graph description for every page', () => {
      allMetadata.forEach(({ name, metadata }) => {
        expect(metadata.openGraph?.description).toBeDefined()
        expect(typeof metadata.openGraph?.description).toBe('string')
      })
    })

    it('should have Open Graph type for every page', () => {
      allMetadata.forEach(({ name, metadata }) => {
        expect(metadata.openGraph?.type).toBeDefined()
        expect(['website', 'article', 'profile']).toContain(metadata.openGraph?.type)
      })
    })
  })

  describe('Dynamic Pages: Blog Posts', () => {
    it('should have metadata for all blog posts', () => {
      blogPosts.forEach((post) => {
        expect(post.metadata).toBeDefined()
        expect(post.metadata.title).toBeDefined()
        expect(post.metadata.description).toBeDefined()
        expect(post.metadata.keywords).toBeDefined()
      })
    })

    it('should have blog post descriptions ≤160 characters', () => {
      blogPosts.forEach((post) => {
        expect(post.metadata.description.length).toBeLessThanOrEqual(160)
      })
    })

    it('should have unique titles for all blog posts', () => {
      const titles = blogPosts.map((post) => post.metadata.title)
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(titles.length)
    })
  })

  describe('Dynamic Pages: Loan Options', () => {
    it('should have metadata for all loan options', () => {
      loanOptions.forEach((option) => {
        expect(option.metadata).toBeDefined()
        expect(option.metadata.title).toBeDefined()
        expect(option.metadata.description).toBeDefined()
        expect(option.metadata.keywords).toBeDefined()
      })
    })

    it('should have loan option descriptions ≤160 characters', () => {
      loanOptions.forEach((option) => {
        expect(option.metadata.description.length).toBeLessThanOrEqual(160)
      })
    })

    it('should have unique titles for all loan options', () => {
      const titles = loanOptions.map((option) => option.metadata.title)
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(titles.length)
    })
  })

  describe('Twitter Card Tags', () => {
    it('should have Twitter card metadata for pages with social sharing', () => {
      // Check a sample of pages that should have Twitter cards
      const pagesWithTwitterCards = [
        blogMetadata,
        reviewsMetadata,
        privacyPolicyMetadata,
        adaAccessibilityMetadata,
      ]

      pagesWithTwitterCards.forEach((metadata) => {
        expect(metadata.twitter).toBeDefined()
        expect(metadata.twitter?.card).toBe('summary_large_image')
        expect(metadata.twitter?.title).toBeDefined()
        expect(metadata.twitter?.description).toBeDefined()
      })
    })
  })

  describe('Canonical URLs', () => {
    it('should have canonical URLs for key pages', () => {
      const pagesWithCanonicals = [
        { name: 'About', metadata: aboutMetadata, expected: '/about' },
        { name: 'Blog', metadata: blogMetadata, expected: '/blog' },
        { name: 'Reviews', metadata: reviewsMetadata, expected: '/reviews' },
        { name: 'Schedule a Call', metadata: scheduleCallMetadata, expected: '/schedule-a-call' },
      ]

      pagesWithCanonicals.forEach(({ name, metadata, expected }) => {
        expect(metadata.alternates?.canonical).toBeDefined()
        expect(metadata.alternates?.canonical).toContain(expected)
      })
    })
  })
})
