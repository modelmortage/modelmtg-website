import { metadata } from '../page'
import { privacyPolicyContent } from '@/lib/content/privacyPolicy'

describe('Privacy Policy Page Metadata', () => {
  it('has a unique title tag', () => {
    expect(metadata.title).toBe(privacyPolicyContent.metadata.title)
    expect(metadata.title).toContain('Privacy Policy')
    expect(metadata.title).toContain('Model Mortgage')
  })

  it('has a meta description within 160 characters', () => {
    expect(metadata.description).toBe(privacyPolicyContent.metadata.description)
    expect(metadata.description!.length).toBeLessThanOrEqual(160)
  })

  it('includes relevant keywords', () => {
    expect(metadata.keywords).toBe(privacyPolicyContent.metadata.keywords.join(', '))
    expect(metadata.keywords).toContain('privacy policy')
    expect(metadata.keywords).toContain('data protection')
  })

  it('has Open Graph tags', () => {
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBe(privacyPolicyContent.metadata.title)
    expect(metadata.openGraph?.description).toBe(privacyPolicyContent.metadata.description)
    expect(metadata.openGraph?.type).toBe('website')
  })

  it('has Twitter card tags', () => {
    expect(metadata.twitter).toBeDefined()
    expect(metadata.twitter?.card).toBe('summary_large_image')
    expect(metadata.twitter?.title).toBe(privacyPolicyContent.metadata.title)
    expect(metadata.twitter?.description).toBe(privacyPolicyContent.metadata.description)
  })

  it('has a canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe(privacyPolicyContent.metadata.canonical)
    expect(metadata.alternates?.canonical).toBe('/privacy-policy')
  })

  it('metadata matches content structure', () => {
    expect(metadata.title).toBe(privacyPolicyContent.metadata.title)
    expect(metadata.description).toBe(privacyPolicyContent.metadata.description)
    expect(metadata.keywords).toBe(privacyPolicyContent.metadata.keywords.join(', '))
  })
})
