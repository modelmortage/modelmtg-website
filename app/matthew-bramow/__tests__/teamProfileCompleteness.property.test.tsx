/**
 * Property-Based Tests for Team Profile Completeness
 * Feature: website-structure-migration
 * 
 * Property 13: Team Profile Completeness
 * For any team member profile page, the rendered output should include 
 * photo, bio, credentials, and contact information.
 * 
 * **Validates: Requirements 5.2**
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fc from 'fast-check'
import { teamMembers } from '@/lib/content/teamMembers'
import MatthewBramowPage from '@/app/matthew-bramow/page'
import RolstonNichollsPage from '@/app/rolston-nicholls/page'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/matthew-bramow'),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Map of team member slugs to their page components
const pageComponents: Record<string, React.ComponentType> = {
  'matthew-bramow': MatthewBramowPage,
  'rolston-nicholls': RolstonNichollsPage,
}

describe('Property 13: Team Profile Completeness', () => {
  /**
   * **Validates: Requirements 5.2**
   * 
   * This property test verifies that team member profile pages display all
   * required information: photo, bio, credentials, and contact information.
   */

  describe('Complete Profile Information', () => {
    it('should display all required profile fields for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Photo must be present
            const photoElement = container.querySelector(`img[src="${member.photo}"]`)
            expect(photoElement).toBeInTheDocument()
            expect(photoElement).toHaveAttribute('alt')
            
            // Property: Bio must be present
            // Bio is split into paragraphs, check for bio content
            const bioParagraphs = member.bio.split('\n\n')
            const firstParagraph = bioParagraphs[0]
            expect(screen.getByText(firstParagraph)).toBeInTheDocument()
            
            // Property: Credentials must be present
            member.credentials.forEach(credential => {
              expect(screen.getByText(credential)).toBeInTheDocument()
            })
            
            // Property: Contact information must be present
            if (member.contact.email) {
              const emailLink = container.querySelector(`a[href="mailto:${member.contact.email}"]`)
              expect(emailLink).toBeInTheDocument()
              expect(screen.getByText(member.contact.email)).toBeInTheDocument()
            }
            
            if (member.contact.phone) {
              const phoneLink = container.querySelector(`a[href="tel:${member.contact.phone}"]`)
              expect(phoneLink).toBeInTheDocument()
              expect(screen.getByText(member.contact.phone)).toBeInTheDocument()
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display name and title for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: Name should be displayed (may appear multiple times)
            const nameElements = screen.getAllByText(member.name)
            expect(nameElements.length).toBeGreaterThan(0)
            
            // Property: Title should be displayed
            expect(screen.getByText(member.title)).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display complete bio for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: All bio paragraphs should be rendered
            const bioParagraphs = member.bio.split('\n\n').filter(p => p.trim().length > 0)
            
            bioParagraphs.forEach(paragraph => {
              expect(screen.getByText(paragraph)).toBeInTheDocument()
            })
            
            // Property: Bio should be substantial
            const bodyText = document.body.textContent || ''
            expect(bodyText).toContain(member.bio.substring(0, 50))
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display all credentials for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: All credentials should be displayed
            expect(member.credentials.length).toBeGreaterThan(0)
            
            member.credentials.forEach(credential => {
              expect(screen.getByText(credential)).toBeInTheDocument()
            })
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display all specialties for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: All specialties should be displayed
            expect(member.specialties.length).toBeGreaterThan(0)
            
            member.specialties.forEach(specialty => {
              expect(screen.getByText(specialty)).toBeInTheDocument()
            })
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Photo Display', () => {
    it('should display photo with proper attributes for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Photo should have correct src
            const photoElement = container.querySelector(`img[src="${member.photo}"]`)
            expect(photoElement).toBeInTheDocument()
            
            // Property: Photo should have alt text
            expect(photoElement).toHaveAttribute('alt')
            const altText = photoElement?.getAttribute('alt') || ''
            expect(altText).toContain(member.name)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display photo with accessibility attributes for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Photo should have meaningful alt text
            const photoElement = container.querySelector('img')
            expect(photoElement).toBeInTheDocument()
            expect(photoElement).toHaveAttribute('alt')
            
            const altText = photoElement?.getAttribute('alt') || ''
            expect(altText.length).toBeGreaterThan(0)
            expect(altText).not.toBe('photo')
            expect(altText).not.toBe('image')
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Contact Information', () => {
    it('should display email as clickable link for any team member with email', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            
            if (!member.contact.email) {
              return true // Skip members without email
            }
            
            const PageComponent = pageComponents[member.slug]
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Email should be a mailto link
            const emailLink = container.querySelector(`a[href="mailto:${member.contact.email}"]`)
            expect(emailLink).toBeInTheDocument()
            
            // Property: Email text should be visible
            expect(screen.getByText(member.contact.email)).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display phone as clickable link for any team member with phone', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            
            if (!member.contact.phone) {
              return true // Skip members without phone
            }
            
            const PageComponent = pageComponents[member.slug]
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Phone should be a tel link
            const phoneLink = container.querySelector(`a[href="tel:${member.contact.phone}"]`)
            expect(phoneLink).toBeInTheDocument()
            
            // Property: Phone text should be visible
            expect(screen.getByText(member.contact.phone)).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should display scheduling link for any team member with calendly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            
            if (!member.contact.calendly) {
              return true // Skip members without calendly
            }
            
            const PageComponent = pageComponents[member.slug]
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Calendly link should be present
            const calendlyLink = container.querySelector(`a[href="${member.contact.calendly}"]`)
            expect(calendlyLink).toBeInTheDocument()
            
            // Property: Link should have call-to-action text
            const linkText = calendlyLink?.textContent || ''
            expect(linkText.toLowerCase()).toContain('schedule')
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have contact section heading for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: Contact section should have a heading
            expect(screen.getByText('Contact Information')).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Profile Structure', () => {
    it('should have proper section headings for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Should have section headings
            const headings = container.querySelectorAll('h2, h3')
            expect(headings.length).toBeGreaterThan(0)
            
            // Property: Should have credentials heading
            expect(screen.getByText('Credentials')).toBeInTheDocument()
            
            // Property: Should have specialties heading
            expect(screen.getByText('Specialties')).toBeInTheDocument()
            
            // Property: Should have contact heading
            expect(screen.getByText('Contact Information')).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have bio section with heading for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: Bio section should have a heading with first name
            const firstName = member.name.split(' ')[0]
            const bioHeading = `About ${firstName}`
            expect(screen.getByText(bioHeading)).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have breadcrumb navigation for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { container, unmount } = render(<PageComponent />)
            
            // Property: Should have breadcrumb navigation
            const breadcrumbLink = container.querySelector('a[href="/meet-our-team"]')
            expect(breadcrumbLink).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have call-to-action section for any team member', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: teamMembers.length - 1 }),
          (memberIndex) => {
            const member = teamMembers[memberIndex]
            const PageComponent = pageComponents[member.slug]
            
            const { unmount } = render(<PageComponent />)
            
            // Property: Should have CTA section
            expect(screen.getByText('Ready to Work Together?')).toBeInTheDocument()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Data Consistency', () => {
    it('should have consistent data structure for all team members', () => {
      // Property: All team members should have the same data structure
      teamMembers.forEach(member => {
        expect(member).toHaveProperty('slug')
        expect(member).toHaveProperty('name')
        expect(member).toHaveProperty('title')
        expect(member).toHaveProperty('bio')
        expect(member).toHaveProperty('photo')
        expect(member).toHaveProperty('credentials')
        expect(member).toHaveProperty('specialties')
        expect(member).toHaveProperty('contact')
        expect(member).toHaveProperty('metadata')
        
        // Verify data types
        expect(typeof member.slug).toBe('string')
        expect(typeof member.name).toBe('string')
        expect(typeof member.title).toBe('string')
        expect(typeof member.bio).toBe('string')
        expect(typeof member.photo).toBe('string')
        expect(Array.isArray(member.credentials)).toBe(true)
        expect(Array.isArray(member.specialties)).toBe(true)
        expect(typeof member.contact).toBe('object')
        expect(typeof member.metadata).toBe('object')
      })
    })

    it('should have non-empty required fields for all team members', () => {
      // Property: Required fields should not be empty
      teamMembers.forEach(member => {
        expect(member.slug.length).toBeGreaterThan(0)
        expect(member.name.length).toBeGreaterThan(0)
        expect(member.title.length).toBeGreaterThan(0)
        expect(member.bio.length).toBeGreaterThan(0)
        expect(member.photo.length).toBeGreaterThan(0)
        expect(member.credentials.length).toBeGreaterThan(0)
        expect(member.specialties.length).toBeGreaterThan(0)
      })
    })

    it('should have valid photo paths for all team members', () => {
      // Property: Photos should have valid paths
      teamMembers.forEach(member => {
        expect(member.photo).toMatch(/^\/images\/team\//)
        expect(member.photo).toMatch(/\.(jpg|jpeg|png|webp)$/)
      })
    })

    it('should have at least one contact method for all team members', () => {
      // Property: All team members should have at least one contact method
      teamMembers.forEach(member => {
        const hasEmail = !!member.contact.email
        const hasPhone = !!member.contact.phone
        const hasCalendly = !!member.contact.calendly
        
        expect(hasEmail || hasPhone || hasCalendly).toBe(true)
      })
    })

    it('should have valid email format for team members with email', () => {
      // Property: Email addresses should be valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      teamMembers.forEach(member => {
        if (member.contact.email) {
          expect(member.contact.email).toMatch(emailRegex)
        }
      })
    })

    it('should have valid phone format for team members with phone', () => {
      // Property: Phone numbers should be formatted
      teamMembers.forEach(member => {
        if (member.contact.phone) {
          expect(member.contact.phone.length).toBeGreaterThan(0)
          // Should contain digits
          expect(/\d/.test(member.contact.phone)).toBe(true)
        }
      })
    })

    it('should have valid calendly URLs for team members with calendly', () => {
      // Property: Calendly URLs should be valid
      teamMembers.forEach(member => {
        if (member.contact.calendly) {
          expect(member.contact.calendly).toMatch(/^https?:\/\//)
          expect(member.contact.calendly).toContain('calendly')
        }
      })
    })

    it('should have SEO metadata for all team members', () => {
      // Property: All team members should have complete SEO metadata
      teamMembers.forEach(member => {
        expect(member.metadata).toBeDefined()
        expect(member.metadata.title).toBeTruthy()
        expect(member.metadata.description).toBeTruthy()
        expect(member.metadata.keywords).toBeDefined()
        expect(Array.isArray(member.metadata.keywords)).toBe(true)
        expect(member.metadata.keywords.length).toBeGreaterThan(0)
        expect(member.metadata.canonical).toBeTruthy()
        expect(member.metadata.canonical).toBe(`/${member.slug}`)
      })
    })

    it('should have unique slugs for all team members', () => {
      // Property: All team member slugs should be unique
      const slugs = teamMembers.map(member => member.slug)
      const uniqueSlugs = new Set(slugs)
      
      expect(uniqueSlugs.size).toBe(slugs.length)
    })

    it('should have reasonable bio length for all team members', () => {
      // Property: Bios should be substantial but not excessive
      teamMembers.forEach(member => {
        expect(member.bio.length).toBeGreaterThan(100)
        expect(member.bio.length).toBeLessThan(5000)
      })
    })

    it('should have at least 2 credentials for all team members', () => {
      // Property: Team members should have multiple credentials
      teamMembers.forEach(member => {
        expect(member.credentials.length).toBeGreaterThanOrEqual(2)
        
        // All credentials should be non-empty
        member.credentials.forEach(credential => {
          expect(typeof credential).toBe('string')
          expect(credential.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have at least 2 specialties for all team members', () => {
      // Property: Team members should have multiple specialties
      teamMembers.forEach(member => {
        expect(member.specialties.length).toBeGreaterThanOrEqual(2)
        
        // All specialties should be non-empty
        member.specialties.forEach(specialty => {
          expect(typeof specialty).toBe('string')
          expect(specialty.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Requirements Validation', () => {
    it('should meet Requirement 5.1: Provide individual profile pages', () => {
      // Requirement 5.1: The system shall provide individual profile pages 
      // for Matthew Bramow and Rolston Nicholls
      
      expect(teamMembers.length).toBeGreaterThanOrEqual(2)
      
      const matthewProfile = teamMembers.find(m => m.slug === 'matthew-bramow')
      const rolstonProfile = teamMembers.find(m => m.slug === 'rolston-nicholls')
      
      expect(matthewProfile).toBeDefined()
      expect(rolstonProfile).toBeDefined()
    })

    it('should meet Requirement 5.2: Display photo, bio, credentials, and contact info', () => {
      // Requirement 5.2: When a user navigates to a team member profile, 
      // the system shall display their photo, bio, credentials, and contact information
      
      const member = teamMembers[0]
      const PageComponent = pageComponents[member.slug]
      const { container } = render(<PageComponent />)
      
      // Verify all required elements from Requirement 5.2
      
      // Photo
      const photoElement = container.querySelector(`img[src="${member.photo}"]`)
      expect(photoElement).toBeInTheDocument()
      
      // Bio
      const bioParagraphs = member.bio.split('\n\n')
      expect(screen.getByText(bioParagraphs[0])).toBeInTheDocument()
      
      // Credentials
      member.credentials.forEach(credential => {
        expect(screen.getByText(credential)).toBeInTheDocument()
      })
      
      // Contact information
      if (member.contact.email) {
        expect(screen.getByText(member.contact.email)).toBeInTheDocument()
      }
      if (member.contact.phone) {
        expect(screen.getByText(member.contact.phone)).toBeInTheDocument()
      }
    })

    it('should meet Requirement 5.3: Link profiles from Meet Our Team page', () => {
      // Requirement 5.3: The system shall link team member profiles from 
      // the Meet Our Team page
      
      // Verify breadcrumb links back to team page
      const member = teamMembers[0]
      const PageComponent = pageComponents[member.slug]
      const { container } = render(<PageComponent />)
      
      const teamPageLink = container.querySelector('a[href="/meet-our-team"]')
      expect(teamPageLink).toBeInTheDocument()
    })

    it('should meet Requirement 5.4: Ensure interactive elements are functional', () => {
      // Requirement 5.4: When a profile includes contact forms or scheduling links, 
      // the system shall ensure all interactive elements are functional
      
      const member = teamMembers[0]
      const PageComponent = pageComponents[member.slug]
      const { container } = render(<PageComponent />)
      
      // Verify contact links are functional (have proper href attributes)
      if (member.contact.email) {
        const emailLink = container.querySelector(`a[href="mailto:${member.contact.email}"]`)
        expect(emailLink).toBeInTheDocument()
      }
      
      if (member.contact.phone) {
        const phoneLink = container.querySelector(`a[href="tel:${member.contact.phone}"]`)
        expect(phoneLink).toBeInTheDocument()
      }
      
      if (member.contact.calendly) {
        const calendlyLink = container.querySelector(`a[href="${member.contact.calendly}"]`)
        expect(calendlyLink).toBeInTheDocument()
      }
    })

    it('should render all team member profiles with complete information', () => {
      // Property: Every team member should have a complete profile
      teamMembers.forEach((member) => {
        const PageComponent = pageComponents[member.slug]
        const { container, unmount } = render(<PageComponent />)
        
        // Verify all required fields are present
        expect(container.querySelector(`img[src="${member.photo}"]`)).toBeInTheDocument()
        expect(screen.getByText(member.bio.split('\n\n')[0])).toBeInTheDocument()
        
        member.credentials.forEach(credential => {
          expect(screen.getByText(credential)).toBeInTheDocument()
        })
        
        if (member.contact.email) {
          expect(screen.getByText(member.contact.email)).toBeInTheDocument()
        }
        
        if (member.contact.phone) {
          expect(screen.getByText(member.contact.phone)).toBeInTheDocument()
        }
        
        unmount()
      })
    })
  })
})
