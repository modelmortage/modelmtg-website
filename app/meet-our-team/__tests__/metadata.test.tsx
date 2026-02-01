import { meetOurTeamContent } from '@/lib/content/teamMembers'

describe('Meet Our Team Page Metadata', () => {
  const metadata = meetOurTeamContent.metadata

  it('has a descriptive title with key terms', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.title.toLowerCase()).toContain('team')
    expect(metadata.title.toLowerCase()).toContain('model mortgage')
  })

  it('has a meta description within 160 characters', () => {
    expect(metadata.description).toBeTruthy()
    expect(metadata.description.length).toBeLessThanOrEqual(160)
  })

  it('has relevant keywords', () => {
    expect(metadata.keywords).toBeTruthy()
    expect(metadata.keywords.length).toBeGreaterThan(0)
    expect(metadata.keywords.some(k => k.toLowerCase().includes('team'))).toBe(true)
  })

  it('has a canonical URL', () => {
    expect(metadata.canonical).toBeTruthy()
    expect(metadata.canonical).toBe('/meet-our-team')
  })

  it('has an Open Graph image', () => {
    expect(metadata.ogImage).toBeTruthy()
  })

  it('description accurately summarizes the page content', () => {
    expect(metadata.description.toLowerCase()).toContain('team')
    expect(metadata.description.toLowerCase()).toContain('mortgage')
  })
})
