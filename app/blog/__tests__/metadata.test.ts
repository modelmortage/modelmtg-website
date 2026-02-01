import { metadata } from '../page'

describe('Blog Page Metadata', () => {
  it('has a unique and descriptive title', () => {
    expect(metadata.title).toBeDefined()
    expect(metadata.title).toContain('Blog')
    expect(metadata.title).toContain('Model Mortgage')
  })

  it('has a meta description within 160 characters', () => {
    expect(metadata.description).toBeDefined()
    expect(metadata.description!.length).toBeLessThanOrEqual(160)
    expect(metadata.description!.length).toBeGreaterThan(50)
  })

  it('includes relevant keywords', () => {
    expect(metadata.keywords).toBeDefined()
    expect(typeof metadata.keywords).toBe('string')
    expect(metadata.keywords).toContain('mortgage')
    expect(metadata.keywords).toContain('blog')
  })

  it('has Open Graph metadata', () => {
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBeDefined()
    expect(metadata.openGraph?.description).toBeDefined()
    expect(metadata.openGraph?.type).toBe('website')
    expect(metadata.openGraph?.images).toBeDefined()
  })

  it('has Twitter Card metadata', () => {
    expect(metadata.twitter).toBeDefined()
    expect(metadata.twitter?.card).toBe('summary_large_image')
    expect(metadata.twitter?.title).toBeDefined()
    expect(metadata.twitter?.description).toBeDefined()
    expect(metadata.twitter?.images).toBeDefined()
  })

  it('has canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe('/blog')
  })

  it('Open Graph and Twitter metadata match main metadata', () => {
    // Ensure consistency across metadata fields
    expect(metadata.openGraph?.title).toContain('Blog')
    expect(metadata.twitter?.title).toContain('Blog')
  })
})
