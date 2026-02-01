import { metadata } from '../page'
import { Metadata } from 'next'

describe('Learning Center Page Metadata', () => {
  it('has a unique title tag', () => {
    expect(metadata.title).toBeDefined()
    expect(metadata.title).toContain('Learning Center')
    expect(metadata.title).toContain('Model Mortgage')
  })

  it('has a meta description within 160 characters', () => {
    expect(metadata.description).toBeDefined()
    expect(metadata.description!.length).toBeLessThanOrEqual(160)
    expect(metadata.description).toContain('education')
  })

  it('has relevant keywords', () => {
    expect(metadata.keywords).toBeDefined()
    expect(metadata.keywords).toContain('mortgage education')
    expect(metadata.keywords).toContain('learning center')
  })

  it('has Open Graph tags', () => {
    const og = (metadata as Metadata).openGraph
    expect(og).toBeDefined()
    expect(og?.title).toContain('Learning Center')
    expect(og?.description).toBeDefined()
    expect(og?.type).toBe('website')
    expect(og?.images).toBeDefined()
  })

  it('has Twitter card tags', () => {
    const twitter = (metadata as Metadata).twitter
    expect(twitter).toBeDefined()
    expect(twitter?.card).toBe('summary_large_image')
    expect(twitter?.title).toContain('Learning Center')
    expect(twitter?.description).toBeDefined()
    expect(twitter?.images).toBeDefined()
  })

  it('has canonical URL', () => {
    const alternates = (metadata as Metadata).alternates
    expect(alternates).toBeDefined()
    expect(alternates?.canonical).toBe('/learning-center')
  })

  it('has SEO-friendly title structure', () => {
    const title = metadata.title as string
    expect(title).toMatch(/Learning Center.*Model Mortgage/)
  })

  it('description accurately summarizes page content', () => {
    const description = metadata.description as string
    expect(description).toContain('education')
    expect(description).toContain('home buyers')
  })
})
