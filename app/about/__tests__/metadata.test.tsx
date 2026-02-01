import { metadata } from '../page'
import { aboutUsContent } from '@/lib/content/aboutUs'

describe('About Page Metadata', () => {
  it('has the correct title', () => {
    expect(metadata.title).toBe(aboutUsContent.metadata.title)
  })

  it('has the correct description', () => {
    expect(metadata.description).toBe(aboutUsContent.metadata.description)
  })

  it('has keywords', () => {
    expect(metadata.keywords).toBe(aboutUsContent.metadata.keywords.join(', '))
  })

  it('has Open Graph metadata', () => {
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBe(aboutUsContent.metadata.title)
    expect(metadata.openGraph?.description).toBe(aboutUsContent.metadata.description)
    expect(metadata.openGraph?.type).toBe('website')
  })

  it('has canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe(aboutUsContent.metadata.canonical)
  })

  it('description is within 160 characters', () => {
    const description = metadata.description as string
    expect(description.length).toBeLessThanOrEqual(160)
  })

  it('title is descriptive and includes key terms', () => {
    const title = metadata.title as string
    expect(title).toContain('About')
    expect(title).toContain('Model Mortgage')
  })
})
