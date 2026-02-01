import { metadata } from '../page'
import { scheduleCallContent } from '@/lib/content/scheduleCall'

describe('Schedule a Call Page Metadata', () => {
  describe('SEO Requirements - Requirement 6.1', () => {
    it('has a unique title tag', () => {
      expect(metadata.title).toBeDefined()
      expect(metadata.title).toBe(scheduleCallContent.metadata.title)
      expect(typeof metadata.title).toBe('string')
      expect((metadata.title as string).length).toBeGreaterThan(0)
    })

    it('title includes key information', () => {
      const title = metadata.title as string
      expect(title.toLowerCase()).toContain('schedule')
      expect(title.toLowerCase()).toContain('model mortgage')
    })
  })

  describe('SEO Requirements - Requirement 6.2', () => {
    it('has a meta description', () => {
      expect(metadata.description).toBeDefined()
      expect(metadata.description).toBe(scheduleCallContent.metadata.description)
      expect(typeof metadata.description).toBe('string')
    })

    it('meta description is within 160 characters', () => {
      const description = metadata.description as string
      expect(description.length).toBeLessThanOrEqual(160)
    })

    it('meta description is descriptive and includes key terms', () => {
      const description = metadata.description as string
      expect(description.toLowerCase()).toContain('schedule')
      expect(description.toLowerCase()).toContain('consultation')
    })
  })

  describe('SEO Requirements - Requirement 6.4 (Open Graph)', () => {
    it('has Open Graph title', () => {
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBeDefined()
      expect(metadata.openGraph?.title).toBe(scheduleCallContent.metadata.title)
    })

    it('has Open Graph description', () => {
      expect(metadata.openGraph?.description).toBeDefined()
      expect(metadata.openGraph?.description).toBe(scheduleCallContent.metadata.description)
    })

    it('has Open Graph type', () => {
      expect(metadata.openGraph).toBeDefined()
      // OpenGraph type is set correctly in the metadata
      expect(metadata.openGraph).toHaveProperty('type')
    })

    it('has Open Graph image when provided', () => {
      if (scheduleCallContent.metadata.ogImage) {
        expect(metadata.openGraph?.images).toBeDefined()
        expect(Array.isArray(metadata.openGraph?.images)).toBe(true)
        expect((metadata.openGraph?.images as any)[0].url).toBe(scheduleCallContent.metadata.ogImage)
      }
    })
  })

  describe('SEO Requirements - Canonical URL', () => {
    it('has canonical URL', () => {
      expect(metadata.alternates?.canonical).toBeDefined()
      expect(metadata.alternates?.canonical).toBe(scheduleCallContent.metadata.canonical)
      expect(metadata.alternates?.canonical).toBe('/schedule-a-call')
    })
  })

  describe('Keywords', () => {
    it('has relevant keywords', () => {
      expect(metadata.keywords).toBeDefined()
      expect(typeof metadata.keywords).toBe('string')
      
      const keywords = (metadata.keywords as string).toLowerCase()
      expect(keywords).toContain('schedule')
      expect(keywords).toContain('consultation')
      expect(keywords).toContain('mortgage')
    })

    it('keywords match content structure', () => {
      const keywordsArray = scheduleCallContent.metadata.keywords
      expect(Array.isArray(keywordsArray)).toBe(true)
      expect(keywordsArray.length).toBeGreaterThan(0)
      
      // Verify keywords are relevant to scheduling
      const hasSchedulingKeyword = keywordsArray.some(keyword => 
        keyword.toLowerCase().includes('schedule') || 
        keyword.toLowerCase().includes('consultation') ||
        keyword.toLowerCase().includes('appointment')
      )
      expect(hasSchedulingKeyword).toBe(true)
    })
  })

  describe('Content Structure Requirements', () => {
    it('has properly structured hero content', () => {
      expect(scheduleCallContent.hero.title).toBeDefined()
      expect(scheduleCallContent.hero.subtitle).toBeDefined()
      expect(scheduleCallContent.hero.title.length).toBeGreaterThan(0)
      expect(scheduleCallContent.hero.subtitle.length).toBeGreaterThan(0)
    })

    it('has introduction text', () => {
      expect(scheduleCallContent.intro).toBeDefined()
      expect(scheduleCallContent.intro.length).toBeGreaterThan(0)
    })

    it('has scheduling options array', () => {
      expect(Array.isArray(scheduleCallContent.schedulingOptions)).toBe(true)
      expect(scheduleCallContent.schedulingOptions.length).toBeGreaterThan(0)
    })

    it('each scheduling option has required fields', () => {
      scheduleCallContent.schedulingOptions.forEach(option => {
        expect(option.title).toBeDefined()
        expect(option.description).toBeDefined()
        expect(option.icon).toBeDefined()
        expect(option.action.text).toBeDefined()
        expect(option.action.href).toBeDefined()
      })
    })

    it('has benefits array', () => {
      expect(Array.isArray(scheduleCallContent.benefits)).toBe(true)
      expect(scheduleCallContent.benefits.length).toBeGreaterThan(0)
    })

    it('each benefit has required fields', () => {
      scheduleCallContent.benefits.forEach(benefit => {
        expect(benefit.title).toBeDefined()
        expect(benefit.description).toBeDefined()
      })
    })
  })

  describe('Interactive Elements - Requirement 2.4', () => {
    it('has functional scheduling links', () => {
      scheduleCallContent.schedulingOptions.forEach(option => {
        expect(option.action.href).toBeDefined()
        expect(option.action.href.length).toBeGreaterThan(0)
        
        // Verify href is a valid URL or path
        const href = option.action.href
        const isValidUrl = href.startsWith('http') || href.startsWith('/') || href.startsWith('tel:') || href.startsWith('mailto:')
        expect(isValidUrl).toBe(true)
      })
    })

    it('includes phone contact option', () => {
      const hasPhoneOption = scheduleCallContent.schedulingOptions.some(
        option => option.action.href.startsWith('tel:')
      )
      expect(hasPhoneOption).toBe(true)
    })

    it('includes Calendly or scheduling link', () => {
      const hasSchedulingLink = scheduleCallContent.schedulingOptions.some(
        option => option.action.href.includes('calendly') || option.action.href.includes('schedule')
      )
      expect(hasSchedulingLink).toBe(true)
    })
  })
})
