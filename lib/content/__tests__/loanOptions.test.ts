import { loanOptions, loanOptionsHubContent } from '../loanOptions'

describe('Loan Options Content Structure', () => {
  describe('loanOptions array', () => {
    it('should contain exactly 11 loan options', () => {
      expect(loanOptions).toHaveLength(11)
    })

    it('should include all required loan types', () => {
      const expectedTypes = [
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
        'va-loan-refinance-options'
      ]

      const actualIds = loanOptions.map(option => option.id)
      expect(actualIds).toEqual(expectedTypes)
    })

    it('should have all required fields for each loan option', () => {
      loanOptions.forEach(option => {
        expect(option).toHaveProperty('id')
        expect(option).toHaveProperty('slug')
        expect(option).toHaveProperty('title')
        expect(option).toHaveProperty('shortDescription')
        expect(option).toHaveProperty('fullDescription')
        expect(option).toHaveProperty('benefits')
        expect(option).toHaveProperty('requirements')
        expect(option).toHaveProperty('idealFor')
        expect(option).toHaveProperty('icon')
        expect(option).toHaveProperty('relatedCalculators')
        expect(option).toHaveProperty('metadata')
      })
    })

    it('should have non-empty arrays for benefits, requirements, and idealFor', () => {
      loanOptions.forEach(option => {
        expect(option.benefits.length).toBeGreaterThan(0)
        expect(option.requirements.length).toBeGreaterThan(0)
        expect(option.idealFor.length).toBeGreaterThan(0)
      })
    })

    it('should have valid metadata for each loan option', () => {
      loanOptions.forEach(option => {
        expect(option.metadata.title).toBeTruthy()
        expect(option.metadata.description).toBeTruthy()
        expect(option.metadata.description.length).toBeLessThanOrEqual(160)
        expect(option.metadata.keywords.length).toBeGreaterThan(0)
        expect(option.metadata.canonical).toBeTruthy()
      })
    })

    it('should have matching id and slug for each loan option', () => {
      loanOptions.forEach(option => {
        expect(option.id).toBe(option.slug)
      })
    })

    it('should have at least one related calculator for each loan option', () => {
      loanOptions.forEach(option => {
        expect(option.relatedCalculators.length).toBeGreaterThan(0)
      })
    })
  })

  describe('loanOptionsHubContent', () => {
    it('should have all required fields', () => {
      expect(loanOptionsHubContent).toHaveProperty('metadata')
      expect(loanOptionsHubContent).toHaveProperty('hero')
      expect(loanOptionsHubContent).toHaveProperty('intro')
      expect(loanOptionsHubContent).toHaveProperty('loanOptions')
    })

    it('should have valid metadata', () => {
      expect(loanOptionsHubContent.metadata.title).toBeTruthy()
      expect(loanOptionsHubContent.metadata.description).toBeTruthy()
      expect(loanOptionsHubContent.metadata.description.length).toBeLessThanOrEqual(160)
      expect(loanOptionsHubContent.metadata.keywords.length).toBeGreaterThan(0)
    })

    it('should reference the same loanOptions array', () => {
      expect(loanOptionsHubContent.loanOptions).toBe(loanOptions)
    })
  })
})
