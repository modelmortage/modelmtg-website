import { teamMembers, meetOurTeamContent } from '../teamMembers'
import { TeamMember } from '@/lib/types/content'

describe('Team Members Content Structure', () => {
  describe('teamMembers array', () => {
    it('should contain exactly 2 team members', () => {
      expect(teamMembers).toHaveLength(2)
    })

    it('should include Matthew Bramow profile', () => {
      const matthew = teamMembers.find(member => member.slug === 'matthew-bramow')
      expect(matthew).toBeDefined()
      expect(matthew?.name).toBe('Matthew Bramow')
    })

    it('should include Rolston Nicholls profile', () => {
      const rolston = teamMembers.find(member => member.slug === 'rolston-nicholls')
      expect(rolston).toBeDefined()
      expect(rolston?.name).toBe('Rolston Nicholls')
    })
  })

  describe('TeamMember structure validation', () => {
    it.each(teamMembers)('$name should have all required fields', (member: TeamMember) => {
      // Required string fields
      expect(member.slug).toBeTruthy()
      expect(typeof member.slug).toBe('string')
      
      expect(member.name).toBeTruthy()
      expect(typeof member.name).toBe('string')
      
      expect(member.title).toBeTruthy()
      expect(typeof member.title).toBe('string')
      
      expect(member.bio).toBeTruthy()
      expect(typeof member.bio).toBe('string')
      
      expect(member.photo).toBeTruthy()
      expect(typeof member.photo).toBe('string')
      
      // Required array fields
      expect(Array.isArray(member.credentials)).toBe(true)
      expect(member.credentials.length).toBeGreaterThan(0)
      
      expect(Array.isArray(member.specialties)).toBe(true)
      expect(member.specialties.length).toBeGreaterThan(0)
      
      // Required contact object
      expect(member.contact).toBeDefined()
      expect(typeof member.contact).toBe('object')
      
      // Required metadata object
      expect(member.metadata).toBeDefined()
      expect(typeof member.metadata).toBe('object')
    })

    it.each(teamMembers)('$name should have valid contact information', (member: TeamMember) => {
      const { contact } = member
      
      // At least one contact method should be provided
      const hasContactMethod = contact.email || contact.phone || contact.calendly
      expect(hasContactMethod).toBeTruthy()
      
      // If email is provided, it should be a string
      if (contact.email) {
        expect(typeof contact.email).toBe('string')
        expect(contact.email).toContain('@')
      }
      
      // If phone is provided, it should be a string
      if (contact.phone) {
        expect(typeof contact.phone).toBe('string')
      }
      
      // If calendly is provided, it should be a valid URL
      if (contact.calendly) {
        expect(typeof contact.calendly).toBe('string')
        expect(contact.calendly).toMatch(/^https?:\/\//)
      }
    })

    it.each(teamMembers)('$name should have valid metadata', (member: TeamMember) => {
      const { metadata } = member
      
      expect(metadata.title).toBeTruthy()
      expect(typeof metadata.title).toBe('string')
      
      expect(metadata.description).toBeTruthy()
      expect(typeof metadata.description).toBe('string')
      expect(metadata.description.length).toBeLessThanOrEqual(160)
      
      expect(Array.isArray(metadata.keywords)).toBe(true)
      expect(metadata.keywords.length).toBeGreaterThan(0)
      
      if (metadata.ogImage) {
        expect(typeof metadata.ogImage).toBe('string')
      }
      
      if (metadata.canonical) {
        expect(typeof metadata.canonical).toBe('string')
        expect(metadata.canonical).toMatch(/^\//)
      }
    })
  })

  describe('Matthew Bramow profile', () => {
    const matthew = teamMembers.find(member => member.slug === 'matthew-bramow')!

    it('should have correct basic information', () => {
      expect(matthew.name).toBe('Matthew Bramow')
      expect(matthew.title).toBe('Owner & Senior Mortgage Broker')
      expect(matthew.slug).toBe('matthew-bramow')
    })

    it('should have a comprehensive bio', () => {
      expect(matthew.bio.length).toBeGreaterThan(100)
      expect(matthew.bio).toContain('mortgage broker')
    })

    it('should have credentials', () => {
      expect(matthew.credentials.length).toBeGreaterThan(0)
      expect(matthew.credentials.some(cred => cred.includes('NMLS'))).toBe(true)
    })

    it('should have specialties', () => {
      expect(matthew.specialties.length).toBeGreaterThan(0)
    })

    it('should have contact information', () => {
      expect(matthew.contact.email).toBeTruthy()
      expect(matthew.contact.phone).toBeTruthy()
      expect(matthew.contact.calendly).toBeTruthy()
    })

    it('should have photo path', () => {
      expect(matthew.photo).toMatch(/^\/images\//)
    })
  })

  describe('Rolston Nicholls profile', () => {
    const rolston = teamMembers.find(member => member.slug === 'rolston-nicholls')!

    it('should have correct basic information', () => {
      expect(rolston.name).toBe('Rolston Nicholls')
      expect(rolston.title).toBe('Mortgage Broker')
      expect(rolston.slug).toBe('rolston-nicholls')
    })

    it('should have a comprehensive bio', () => {
      expect(rolston.bio.length).toBeGreaterThan(100)
      expect(rolston.bio).toContain('mortgage broker')
    })

    it('should have credentials', () => {
      expect(rolston.credentials.length).toBeGreaterThan(0)
      expect(rolston.credentials.some(cred => cred.includes('NMLS'))).toBe(true)
    })

    it('should have specialties', () => {
      expect(rolston.specialties.length).toBeGreaterThan(0)
    })

    it('should have contact information', () => {
      expect(rolston.contact.email).toBeTruthy()
      expect(rolston.contact.phone).toBeTruthy()
      expect(rolston.contact.calendly).toBeTruthy()
    })

    it('should have photo path', () => {
      expect(rolston.photo).toMatch(/^\/images\//)
    })
  })

  describe('meetOurTeamContent', () => {
    it('should have valid metadata', () => {
      expect(meetOurTeamContent.metadata).toBeDefined()
      expect(meetOurTeamContent.metadata.title).toBeTruthy()
      expect(meetOurTeamContent.metadata.description).toBeTruthy()
      expect(meetOurTeamContent.metadata.description.length).toBeLessThanOrEqual(160)
    })

    it('should have hero section', () => {
      expect(meetOurTeamContent.hero).toBeDefined()
      expect(meetOurTeamContent.hero.title).toBeTruthy()
      expect(meetOurTeamContent.hero.subtitle).toBeTruthy()
    })

    it('should have intro text', () => {
      expect(meetOurTeamContent.intro).toBeTruthy()
      expect(typeof meetOurTeamContent.intro).toBe('string')
    })

    it('should reference the teamMembers array', () => {
      expect(meetOurTeamContent.teamMembers).toBe(teamMembers)
    })
  })
})
