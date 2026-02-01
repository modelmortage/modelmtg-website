import { metadata } from '../page'
import { teamMembers } from '@/lib/content/teamMembers'

const member = teamMembers.find(m => m.slug === 'rolston-nicholls')!

describe('RolstonNichollsPage Metadata', () => {
  it('has a unique title tag', () => {
    expect(metadata.title).toBe(member.metadata.title)
    expect(metadata.title).toContain('Rolston Nicholls')
    expect(metadata.title).toContain('Model Mortgage')
  })

  it('has a meta description within 160 characters', () => {
    expect(metadata.description).toBe(member.metadata.description)
    expect(metadata.description!.length).toBeLessThanOrEqual(160)
  })

  it('has keywords', () => {
    expect(metadata.keywords).toBe(member.metadata.keywords.join(', '))
    expect(metadata.keywords).toContain('Rolston Nicholls')
  })

  it('has Open Graph tags', () => {
    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBe(member.metadata.title)
    expect(metadata.openGraph?.description).toBe(member.metadata.description)
    expect(metadata.openGraph?.type).toBe('profile')
  })

  it('has Open Graph image if specified', () => {
    if (member.metadata.ogImage) {
      expect(metadata.openGraph?.images).toBeDefined()
      expect(metadata.openGraph?.images).toEqual([{ url: member.metadata.ogImage }])
    }
  })

  it('has canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe(member.metadata.canonical)
    expect(metadata.alternates?.canonical).toBe('/rolston-nicholls')
  })
})
