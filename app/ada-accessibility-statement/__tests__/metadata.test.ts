import { metadata } from '../page'
import { adaAccessibilityContent } from '@/lib/content/adaAccessibility'

describe('AdaAccessibilityStatementPage Metadata', () => {
  it('has a title', () => {
    expect(metadata.title).toBeDefined()
    expect(metadata.title).toBe(adaAccessibilityContent.metadata.title)
  })

  it('has a description', () => {
    expect(metadata.description).toBeDefined()
    expect(metadata.description).toBe(adaAccessibilityContent.metadata.description)
  })

  it('has a description under 160 characters', () => {
    expect(metadata.description).toBeDefined()
    if (metadata.description) {
      expect(metadata.description.length).toBeLessThanOrEqual(160)
    }
  })

  it('has keywords', () => {
    expect(metadata.keywords).toBeDefined()
    expect(metadata.keywords).toBe(adaAccessibilityContent.metadata.keywords.join(', '))
  })

  it('has Open Graph metadata', () => {
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBe(adaAccessibilityContent.metadata.title)
    expect(metadata.openGraph?.description).toBe(adaAccessibilityContent.metadata.description)
    expect(metadata.openGraph?.type).toBe('website')
  })

  it('has Twitter metadata', () => {
    expect(metadata.twitter).toBeDefined()
    expect(metadata.twitter?.card).toBe('summary_large_image')
    expect(metadata.twitter?.title).toBe(adaAccessibilityContent.metadata.title)
    expect(metadata.twitter?.description).toBe(adaAccessibilityContent.metadata.description)
  })

  it('has canonical URL', () => {
    expect(metadata.alternates?.canonical).toBeDefined()
    expect(metadata.alternates?.canonical).toBe(adaAccessibilityContent.metadata.canonical)
  })

  it('title includes "Model Mortgage"', () => {
    expect(metadata.title).toContain('Model Mortgage')
  })

  it('title includes "ADA" or "Accessibility"', () => {
    const title = metadata.title as string
    expect(title.toLowerCase()).toMatch(/ada|accessibility/)
  })

  it('description mentions accessibility or ADA', () => {
    const description = metadata.description as string
    expect(description.toLowerCase()).toMatch(/accessibility|ada/)
  })

  it('keywords include accessibility-related terms', () => {
    const keywords = metadata.keywords as string
    expect(keywords.toLowerCase()).toMatch(/accessibility|ada|wcag/)
  })
})
