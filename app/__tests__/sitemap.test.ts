import sitemap from '../sitemap'
import { blogPosts } from '@/lib/content/blogPosts'
import { loanOptions } from '@/lib/content/loanOptions'

describe('Sitemap Generation', () => {
  let sitemapEntries: ReturnType<typeof sitemap>

  beforeAll(() => {
    sitemapEntries = sitemap()
  })

  describe('Static Pages', () => {
    const staticPages = [
      '/',
      '/about',
      '/meet-our-team',
      '/schedule-a-call',
      '/reviews',
      '/privacy-policy',
      '/ada-accessibility-statement',
      '/contact',
      '/pre-qualify',
    ]

    staticPages.forEach((page) => {
      it(`should include ${page}`, () => {
        const baseUrl = 'https://modelmtg.com'
        const expectedUrl = page === '/' ? baseUrl : `${baseUrl}${page}`
        const entry = sitemapEntries.find((e) => e.url === expectedUrl)
        expect(entry).toBeDefined()
        expect(entry?.url).toBe(expectedUrl)
      })
    })
  })

  describe('Calculator Pages', () => {
    const calculatorPages = [
      '/calculator',
      '/calculator/affordability',
      '/calculator/purchase',
      '/calculator/refinance',
      '/calculator/rent-vs-buy',
      '/calculator/va-purchase',
      '/calculator/va-refinance',
      '/calculator/dscr',
    ]

    calculatorPages.forEach((page) => {
      it(`should include ${page}`, () => {
        const expectedUrl = `https://modelmtg.com${page}`
        const entry = sitemapEntries.find((e) => e.url === expectedUrl)
        expect(entry).toBeDefined()
        expect(entry?.url).toBe(expectedUrl)
      })
    })

    it('should have high priority for calculator pages', () => {
      const calculatorEntries = sitemapEntries.filter((e) =>
        e.url.includes('/calculator')
      )
      calculatorEntries.forEach((entry) => {
        expect(entry.priority).toBeGreaterThanOrEqual(0.8)
      })
    })
  })

  describe('Team Member Pages', () => {
    const teamPages = ['/matthew-bramow', '/rolston-nicholls']

    teamPages.forEach((page) => {
      it(`should include ${page}`, () => {
        const expectedUrl = `https://modelmtg.com${page}`
        const entry = sitemapEntries.find((e) => e.url === expectedUrl)
        expect(entry).toBeDefined()
        expect(entry?.url).toBe(expectedUrl)
      })
    })
  })

  describe('Blog Pages', () => {
    it('should include blog listing page', () => {
      const entry = sitemapEntries.find((e) => e.url === 'https://modelmtg.com/blog')
      expect(entry).toBeDefined()
      expect(entry?.changeFrequency).toBe('weekly')
    })

    it('should include learning center page', () => {
      const entry = sitemapEntries.find(
        (e) => e.url === 'https://modelmtg.com/learning-center'
      )
      expect(entry).toBeDefined()
      expect(entry?.changeFrequency).toBe('weekly')
    })

    it('should include all blog post pages', () => {
      blogPosts.forEach((post) => {
        const expectedUrl = `https://modelmtg.com/blog/${post.slug}`
        const entry = sitemapEntries.find((e) => e.url === expectedUrl)
        expect(entry).toBeDefined()
        expect(entry?.url).toBe(expectedUrl)
      })
    })

    it('should use blog post publish dates as lastModified', () => {
      blogPosts.forEach((post) => {
        const expectedUrl = `https://modelmtg.com/blog/${post.slug}`
        const entry = sitemapEntries.find((e) => e.url === expectedUrl)
        expect(entry).toBeDefined()
        if (entry) {
          const entryDate = new Date(entry.lastModified).toISOString().split('T')[0]
          expect(entryDate).toBe(post.publishDate)
        }
      })
    })
  })

  describe('Loan Options Pages', () => {
    it('should include loan options hub page', () => {
      const entry = sitemapEntries.find(
        (e) => e.url === 'https://modelmtg.com/loan-options'
      )
      expect(entry).toBeDefined()
      expect(entry?.priority).toBe(0.9)
    })

    it('should include all loan option pages', () => {
      loanOptions.forEach((option) => {
        const expectedUrl = `https://modelmtg.com/loan-options/${option.slug}`
        const entry = sitemapEntries.find((e) => e.url === expectedUrl)
        expect(entry).toBeDefined()
        expect(entry?.url).toBe(expectedUrl)
      })
    })

    it('should have appropriate priority for loan option pages', () => {
      const loanOptionEntries = sitemapEntries.filter(
        (e) => e.url.includes('/loan-options/') && !e.url.endsWith('/loan-options')
      )
      loanOptionEntries.forEach((entry) => {
        expect(entry.priority).toBe(0.8)
      })
    })
  })

  describe('Sitemap Structure', () => {
    it('should have valid URLs for all entries', () => {
      sitemapEntries.forEach((entry) => {
        expect(entry.url).toMatch(/^https:\/\/modelmtg\.com/)
        expect(() => new URL(entry.url)).not.toThrow()
      })
    })

    it('should have lastModified dates for all entries', () => {
      sitemapEntries.forEach((entry) => {
        expect(entry.lastModified).toBeDefined()
        expect(entry.lastModified).toBeInstanceOf(Date)
      })
    })

    it('should have valid changeFrequency values', () => {
      const validFrequencies = [
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
      ]
      sitemapEntries.forEach((entry) => {
        if (entry.changeFrequency) {
          expect(validFrequencies).toContain(entry.changeFrequency)
        }
      })
    })

    it('should have priority values between 0 and 1', () => {
      sitemapEntries.forEach((entry) => {
        if (entry.priority !== undefined) {
          expect(entry.priority).toBeGreaterThanOrEqual(0)
          expect(entry.priority).toBeLessThanOrEqual(1)
        }
      })
    })

    it('should include all public pages (minimum count check)', () => {
      // Static pages: 9
      // Calculator pages: 8
      // Team pages: 2
      // Blog listing pages: 2
      // Blog posts: 10
      // Loan options hub: 1
      // Loan option pages: 11
      // Total minimum: 43
      expect(sitemapEntries.length).toBeGreaterThanOrEqual(43)
    })
  })

  describe('SEO Best Practices', () => {
    it('should prioritize homepage highest', () => {
      const homepage = sitemapEntries.find((e) => e.url === 'https://modelmtg.com')
      expect(homepage?.priority).toBe(1.0)
    })

    it('should prioritize conversion pages highly', () => {
      const conversionPages = [
        'https://modelmtg.com/schedule-a-call',
        'https://modelmtg.com/pre-qualify',
        'https://modelmtg.com/calculator',
      ]
      conversionPages.forEach((url) => {
        const entry = sitemapEntries.find((e) => e.url === url)
        expect(entry?.priority).toBeGreaterThanOrEqual(0.9)
      })
    })

    it('should prioritize legal pages lowest', () => {
      const legalPages = [
        'https://modelmtg.com/privacy-policy',
        'https://modelmtg.com/ada-accessibility-statement',
      ]
      legalPages.forEach((url) => {
        const entry = sitemapEntries.find((e) => e.url === url)
        expect(entry?.priority).toBeLessThanOrEqual(0.3)
      })
    })

    it('should update blog pages more frequently than static pages', () => {
      const blogEntry = sitemapEntries.find((e) => e.url === 'https://modelmtg.com/blog')
      const aboutEntry = sitemapEntries.find((e) => e.url === 'https://modelmtg.com/about')
      
      const frequencyOrder = ['yearly', 'monthly', 'weekly', 'daily', 'hourly', 'always']
      const blogFreqIndex = frequencyOrder.indexOf(blogEntry?.changeFrequency || '')
      const aboutFreqIndex = frequencyOrder.indexOf(aboutEntry?.changeFrequency || '')
      
      expect(blogFreqIndex).toBeGreaterThan(aboutFreqIndex)
    })
  })

  describe('Content Completeness', () => {
    it('should include exactly the number of blog posts in content', () => {
      const blogPostEntries = sitemapEntries.filter(
        (e) => e.url.includes('/blog/') && !e.url.endsWith('/blog')
      )
      expect(blogPostEntries.length).toBe(blogPosts.length)
    })

    it('should include exactly the number of loan options in content', () => {
      const loanOptionEntries = sitemapEntries.filter(
        (e) => e.url.includes('/loan-options/') && !e.url.endsWith('/loan-options')
      )
      expect(loanOptionEntries.length).toBe(loanOptions.length)
    })
  })
})
