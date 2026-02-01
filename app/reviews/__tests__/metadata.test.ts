import { reviewsContent } from '@/lib/content/reviews'

describe('Reviews Page Metadata', () => {
  describe('SEO Requirements (6.1, 6.2, 6.4)', () => {
    it('has a unique title tag', () => {
      expect(reviewsContent.metadata.title).toBeDefined()
      expect(reviewsContent.metadata.title.length).toBeGreaterThan(0)
    })

    it('title contains key terms', () => {
      const title = reviewsContent.metadata.title.toLowerCase()
      expect(title).toMatch(/review|client|testimonial/)
      expect(title).toContain('model mortgage')
    })

    it('has a meta description', () => {
      expect(reviewsContent.metadata.description).toBeDefined()
      expect(reviewsContent.metadata.description.length).toBeGreaterThan(0)
    })

    it('meta description is within 160 characters', () => {
      expect(reviewsContent.metadata.description.length).toBeLessThanOrEqual(160)
    })

    it('meta description accurately summarizes the page content', () => {
      const description = reviewsContent.metadata.description.toLowerCase()
      expect(description).toMatch(/review|testimonial|client/)
      expect(description).toContain('model mortgage')
    })

    it('has keywords defined', () => {
      expect(reviewsContent.metadata.keywords).toBeDefined()
      expect(Array.isArray(reviewsContent.metadata.keywords)).toBe(true)
      expect(reviewsContent.metadata.keywords.length).toBeGreaterThan(0)
    })

    it('keywords are relevant to reviews and testimonials', () => {
      const keywords = reviewsContent.metadata.keywords.join(' ').toLowerCase()
      expect(keywords).toMatch(/review|testimonial|client/)
      expect(keywords).toContain('model mortgage')
    })

    it('has a canonical URL', () => {
      expect(reviewsContent.metadata.canonical).toBeDefined()
      expect(reviewsContent.metadata.canonical).toBe('/reviews')
    })

    it('has an Open Graph image', () => {
      expect(reviewsContent.metadata.ogImage).toBeDefined()
      expect(reviewsContent.metadata.ogImage).toContain('/images/')
    })
  })

  describe('Content Structure', () => {
    it('has hero section with title and subtitle', () => {
      expect(reviewsContent.hero.title).toBeDefined()
      expect(reviewsContent.hero.subtitle).toBeDefined()
      expect(reviewsContent.hero.title.length).toBeGreaterThan(0)
      expect(reviewsContent.hero.subtitle.length).toBeGreaterThan(0)
    })

    it('has an introduction text', () => {
      expect(reviewsContent.introduction).toBeDefined()
      expect(reviewsContent.introduction.length).toBeGreaterThan(0)
    })

    it('has overall rating information', () => {
      expect(reviewsContent.overallRating).toBeDefined()
      expect(reviewsContent.overallRating.value).toBeDefined()
      expect(reviewsContent.overallRating.count).toBeDefined()
      expect(reviewsContent.overallRating.value).toBeGreaterThan(0)
      expect(reviewsContent.overallRating.count).toBeGreaterThan(0)
    })

    it('has a reviews array', () => {
      expect(reviewsContent.reviews).toBeDefined()
      expect(Array.isArray(reviewsContent.reviews)).toBe(true)
      expect(reviewsContent.reviews.length).toBeGreaterThan(0)
    })

    it('has trust badges array', () => {
      expect(reviewsContent.trustBadges).toBeDefined()
      expect(Array.isArray(reviewsContent.trustBadges)).toBe(true)
      expect(reviewsContent.trustBadges.length).toBeGreaterThan(0)
    })
  })

  describe('Review Data Validation', () => {
    it('all reviews have required fields', () => {
      reviewsContent.reviews.forEach(review => {
        expect(review.id).toBeDefined()
        expect(review.name).toBeDefined()
        expect(review.location).toBeDefined()
        expect(review.text).toBeDefined()
        expect(review.rating).toBeDefined()
        expect(review.date).toBeDefined()
      })
    })

    it('all reviews have valid ratings (1-5)', () => {
      reviewsContent.reviews.forEach(review => {
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
      })
    })

    it('all reviews have valid date format (YYYY-MM-DD)', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      reviewsContent.reviews.forEach(review => {
        expect(review.date).toMatch(dateRegex)
        // Verify it's a valid date
        const date = new Date(review.date)
        expect(date.toString()).not.toBe('Invalid Date')
      })
    })

    it('all reviews have non-empty text', () => {
      reviewsContent.reviews.forEach(review => {
        expect(review.text.length).toBeGreaterThan(0)
        expect(review.text.length).toBeGreaterThan(20) // Meaningful review
      })
    })

    it('all reviews have unique IDs', () => {
      const ids = reviewsContent.reviews.map(review => review.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('Trust Badges Validation', () => {
    it('all trust badges have required fields', () => {
      reviewsContent.trustBadges.forEach(badge => {
        expect(badge.icon).toBeDefined()
        expect(badge.name).toBeDefined()
        expect(badge.description).toBeDefined()
      })
    })

    it('includes NMLS certification badge', () => {
      const nmlsBadge = reviewsContent.trustBadges.find(
        badge => badge.name.toLowerCase().includes('nmls')
      )
      expect(nmlsBadge).toBeDefined()
    })
  })

  describe('Structured Data Requirements (6.6)', () => {
    it('overall rating is suitable for structured data', () => {
      expect(reviewsContent.overallRating.value).toBeGreaterThanOrEqual(1)
      expect(reviewsContent.overallRating.value).toBeLessThanOrEqual(5)
      expect(Number.isFinite(reviewsContent.overallRating.value)).toBe(true)
    })

    it('review count is suitable for structured data', () => {
      expect(reviewsContent.overallRating.count).toBeGreaterThan(0)
      expect(Number.isInteger(reviewsContent.overallRating.count)).toBe(true)
    })

    it('reviews have all fields needed for Review schema', () => {
      reviewsContent.reviews.forEach(review => {
        // Required for schema.org Review
        expect(review.name).toBeDefined() // author
        expect(review.date).toBeDefined() // datePublished
        expect(review.text).toBeDefined() // reviewBody
        expect(review.rating).toBeDefined() // reviewRating
      })
    })
  })

  describe('Content Quality', () => {
    it('has at least 10 reviews for credibility', () => {
      expect(reviewsContent.reviews.length).toBeGreaterThanOrEqual(10)
    })

    it('reviews mention different loan types', () => {
      const loanTypes = reviewsContent.reviews
        .filter(review => review.loanType)
        .map(review => review.loanType)
      
      const uniqueLoanTypes = new Set(loanTypes)
      expect(uniqueLoanTypes.size).toBeGreaterThan(3) // At least 4 different loan types
    })

    it('reviews are from different locations', () => {
      const locations = reviewsContent.reviews.map(review => review.location)
      const uniqueLocations = new Set(locations)
      expect(uniqueLocations.size).toBeGreaterThan(5) // At least 6 different locations
    })

    it('reviews are recent (within last 2 years)', () => {
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      
      reviewsContent.reviews.forEach(review => {
        const reviewDate = new Date(review.date)
        expect(reviewDate.getTime()).toBeGreaterThan(twoYearsAgo.getTime())
      })
    })
  })
})
