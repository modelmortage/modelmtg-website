import { generateMetadata } from '../page'
import { loanOptions } from '@/lib/content/loanOptions'

describe('Loan Option Pages - SEO Metadata', () => {
  describe('Title Tags', () => {
    it('should have unique title for each loan option', async () => {
      const titles = new Set<string>()

      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.title).toBeTruthy()
        expect(titles.has(metadata.title as string)).toBe(false)
        titles.add(metadata.title as string)
      }

      expect(titles.size).toBe(loanOptions.length)
    })

    it('should include brand name in all titles', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.title).toContain('Model Mortgage')
      }
    })
  })

  describe('Meta Descriptions', () => {
    it('should have description for each loan option', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.description).toBeTruthy()
        expect(typeof metadata.description).toBe('string')
      }
    })

    it('should have descriptions within 160 characters', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.description!.length).toBeLessThanOrEqual(160)
      }
    })

    it('should have unique descriptions', async () => {
      const descriptions = new Set<string>()

      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(descriptions.has(metadata.description as string)).toBe(false)
        descriptions.add(metadata.description as string)
      }

      expect(descriptions.size).toBe(loanOptions.length)
    })
  })

  describe('Keywords', () => {
    it('should have keywords for each loan option', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.keywords).toBeTruthy()
        expect(typeof metadata.keywords).toBe('string')
      }
    })

    it('should have multiple keywords per page', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        const keywordArray = (metadata.keywords as string).split(', ')
        expect(keywordArray.length).toBeGreaterThanOrEqual(3)
      }
    })
  })

  describe('Open Graph Tags', () => {
    it('should have Open Graph title for all pages', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.openGraph?.title).toBeTruthy()
      }
    })

    it('should have Open Graph description for all pages', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.openGraph?.description).toBeTruthy()
      }
    })

    it('should have Open Graph type set to website', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.openGraph?.type).toBe('website')
      }
    })

    it('should include OG image when available', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        if (option.metadata.ogImage) {
          expect(metadata.openGraph?.images).toBeDefined()
          expect(metadata.openGraph?.images).toHaveLength(1)
        }
      }
    })
  })

  describe('Twitter Card Tags', () => {
    it('should have Twitter card type for all pages', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.twitter?.card).toBe('summary_large_image')
      }
    })

    it('should have Twitter title for all pages', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.twitter?.title).toBeTruthy()
      }
    })

    it('should have Twitter description for all pages', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.twitter?.description).toBeTruthy()
      }
    })
  })

  describe('Canonical URLs', () => {
    it('should have canonical URL for each page', async () => {
      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        expect(metadata.alternates?.canonical).toBeTruthy()
        expect(metadata.alternates?.canonical).toBe(`/loan-options/${option.slug}`)
      }
    })

    it('should have unique canonical URLs', async () => {
      const canonicals = new Set<string>()

      for (const option of loanOptions) {
        const metadata = await generateMetadata({
          params: { slug: option.slug },
        })
        
        const canonical = metadata.alternates?.canonical as string
        expect(canonicals.has(canonical)).toBe(false)
        canonicals.add(canonical)
      }

      expect(canonicals.size).toBe(loanOptions.length)
    })
  })

  describe('All 11 Loan Options Coverage', () => {
    const expectedSlugs = [
      'fixed-rate-mortgage',
      'fha-home-loan',
      'va-home-loan',
      'usda-loan',
      'jumbo-home-loan',
      'first-time-home-buyer',
      'low-down-payment-purchase-options',
      'investment-property-loans',
      'refinance',
      'cash-out-refinance',
      'va-loan-refinance-options',
    ]

    it('should have metadata for all 11 loan options', () => {
      expect(loanOptions.length).toBe(11)
      
      const actualSlugs = loanOptions.map(o => o.slug)
      expectedSlugs.forEach(slug => {
        expect(actualSlugs).toContain(slug)
      })
    })

    it('should generate valid metadata for all 11 loan options', async () => {
      for (const slug of expectedSlugs) {
        const metadata = await generateMetadata({ params: { slug } })
        
        expect(metadata.title).toBeTruthy()
        expect(metadata.description).toBeTruthy()
        expect(metadata.keywords).toBeTruthy()
        expect(metadata.openGraph).toBeDefined()
        expect(metadata.twitter).toBeDefined()
        expect(metadata.alternates?.canonical).toBe(`/loan-options/${slug}`)
      }
    })
  })
})
