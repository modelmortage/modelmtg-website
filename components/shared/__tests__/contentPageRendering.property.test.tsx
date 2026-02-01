/**
 * Property-Based Tests for Content Page Rendering
 * Feature: website-structure-migration
 * 
 * Property 6: Content Page Rendering
 * For any content page (About Us, Meet Our Team, Schedule a Call, Reviews, 
 * Privacy Policy, ADA Statement), the page should render without errors and 
 * display the expected content sections.
 * 
 * **Validates: Requirements 2.2**
 */

import { render, screen } from '@testing-library/react'
import fc from 'fast-check'

// Import content pages
import MeetOurTeamPage from '@/app/meet-our-team/page'
import ScheduleCallPage from '@/app/schedule-a-call/page'
import ReviewsPage from '@/app/reviews/page'
import PrivacyPolicyPage from '@/app/privacy-policy/page'
import AdaAccessibilityStatementPage from '@/app/ada-accessibility-statement/page'

// Import content data
import { meetOurTeamContent } from '@/lib/content/teamMembers'
import { scheduleCallContent } from '@/lib/content/scheduleCall'
import { reviewsContent } from '@/lib/content/reviews'
import { privacyPolicyContent } from '@/lib/content/privacyPolicy'
import { adaAccessibilityContent } from '@/lib/content/adaAccessibility'

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/')
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

// Define content page configurations
const contentPages = [
  {
    name: 'Meet Our Team',
    component: MeetOurTeamPage,
    content: meetOurTeamContent,
    expectedSections: ['team members', 'specialties', 'contact'],
    hasHero: true,
    hasTitle: true
  },
  {
    name: 'Schedule a Call',
    component: ScheduleCallPage,
    content: scheduleCallContent,
    expectedSections: ['scheduling options', 'benefits', 'business hours'],
    hasHero: true,
    hasTitle: true
  },
  {
    name: 'Reviews',
    component: ReviewsPage,
    content: reviewsContent,
    expectedSections: ['reviews', 'rating', 'trust badges'],
    hasHero: true,
    hasTitle: true
  },
  {
    name: 'Privacy Policy',
    component: PrivacyPolicyPage,
    content: privacyPolicyContent,
    expectedSections: ['policy content', 'last updated'],
    hasHero: true,
    hasTitle: true
  },
  {
    name: 'ADA Accessibility Statement',
    component: AdaAccessibilityStatementPage,
    content: adaAccessibilityContent,
    expectedSections: ['statement content', 'last updated'],
    hasHero: true,
    hasTitle: true
  }
]

describe('Property 6: Content Page Rendering', () => {
  /**
   * **Validates: Requirements 2.2**
   * 
   * This property test verifies that content pages render without errors
   * and display the expected content sections with proper formatting and styling.
   */
  
  it('should render any content page without errors', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          // Render the page component
          const { container, unmount } = render(<Component />)
          
          // Property: Page should render without throwing errors
          expect(container).toBeInTheDocument()
          
          // Property: Main content area should exist
          const main = screen.getByRole('main')
          expect(main).toBeInTheDocument()
          
          // Clean up
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should display page title for any content page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { container, unmount } = render(<Component />)
          
          // Property: Page should have a title (h1 in main content)
          if (page.hasTitle && page.content.hero) {
            const main = container.querySelector('main')
            const h1InMain = main?.querySelector('h1')
            expect(h1InMain).toBeInTheDocument()
            expect(h1InMain?.textContent).toBe(page.content.hero.title)
          }
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should have proper heading hierarchy for any content page', () => {
    contentPages.forEach((page) => {
      const Component = page.component
      const { container } = render(<Component />)
      
      // Property: Main content should have exactly one h1
      const main = container.querySelector('main')
      const h1InMain = main?.querySelectorAll('h1')
      expect(h1InMain?.length).toBe(1)
      
      // Property: Headings in main should follow proper nesting order
      const allHeadings = main?.querySelectorAll('h1, h2, h3, h4, h5, h6')
      if (allHeadings) {
        const headingLevels = Array.from(allHeadings).map(h => 
          parseInt(h.tagName.substring(1))
        )
        
        // First heading should be h1
        expect(headingLevels[0]).toBe(1)
        
        // No heading should skip more than one level
        for (let i = 1; i < headingLevels.length; i++) {
          const diff = headingLevels[i] - headingLevels[i - 1]
          expect(diff).toBeLessThanOrEqual(1)
        }
      }
    })
  })
  
  it('should render content sections for any content page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { container, unmount } = render(<Component />)
          
          // Property: Page should have section elements
          const sections = container.querySelectorAll('section')
          expect(sections.length).toBeGreaterThan(0)
          
          // Property: Sections should contain content
          sections.forEach(section => {
            expect(section.textContent).toBeTruthy()
            expect(section.textContent!.length).toBeGreaterThan(0)
          })
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should have header and footer on any content page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { unmount } = render(<Component />)
          
          // Property: Header must be present (using banner role)
          const header = screen.getByRole('banner')
          expect(header).toBeInTheDocument()
          
          // Property: Footer must be present (using contentinfo role)
          const footer = screen.getByRole('contentinfo')
          expect(footer).toBeInTheDocument()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should render Meet Our Team page with team member information', () => {
    const { container } = render(<MeetOurTeamPage />)
    
    // Property: Should display team member names
    meetOurTeamContent.teamMembers.forEach(member => {
      const nameElement = screen.getByText(member.name)
      expect(nameElement).toBeInTheDocument()
    })
    
    // Property: Should display team member titles
    meetOurTeamContent.teamMembers.forEach(member => {
      const titleElement = screen.getByText(member.title)
      expect(titleElement).toBeInTheDocument()
    })
    
    // Property: Should have contact information
    const contactLinks = container.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]')
    expect(contactLinks.length).toBeGreaterThan(0)
  })
  
  it('should render Schedule a Call page with scheduling options', () => {
    const { container } = render(<ScheduleCallPage />)
    
    // Property: Should display scheduling options
    scheduleCallContent.schedulingOptions.forEach(option => {
      const optionTitle = screen.getByText(option.title)
      expect(optionTitle).toBeInTheDocument()
    })
    
    // Property: Should have action buttons/links
    const actionLinks = container.querySelectorAll('a[href]')
    expect(actionLinks.length).toBeGreaterThan(0)
    
    // Property: Should display benefits
    scheduleCallContent.benefits.forEach(benefit => {
      const benefitTitle = screen.getByText(benefit.title)
      expect(benefitTitle).toBeInTheDocument()
    })
  })
  
  it('should render Reviews page with review content', () => {
    const { container } = render(<ReviewsPage />)
    
    // Property: Should display overall rating
    const ratingValue = screen.getByText(reviewsContent.overallRating.value.toFixed(1))
    expect(ratingValue).toBeInTheDocument()
    
    // Property: Should display individual reviews
    const reviewCards = container.querySelectorAll('article')
    expect(reviewCards.length).toBeGreaterThanOrEqual(reviewsContent.reviews.length)
    
    // Property: Should have structured data script
    const structuredDataScript = container.querySelector('script[type="application/ld+json"]')
    expect(structuredDataScript).toBeInTheDocument()
    
    // Property: Structured data should be valid JSON
    if (structuredDataScript) {
      const jsonContent = structuredDataScript.textContent
      expect(() => JSON.parse(jsonContent!)).not.toThrow()
    }
  })
  
  it('should render Privacy Policy page with policy sections', () => {
    const { container } = render(<PrivacyPolicyPage />)
    
    // Property: Should display last updated date (look for the strong element)
    const lastUpdatedStrong = screen.getByText('Last Updated:')
    expect(lastUpdatedStrong).toBeInTheDocument()
    
    // Property: Should display all policy sections (check in main content area)
    const main = container.querySelector('main')
    privacyPolicyContent.sections.forEach(section => {
      const headings = main?.querySelectorAll('h2')
      const headingExists = headings && Array.from(headings).some(h => h.textContent === section.heading)
      expect(headingExists).toBe(true)
    })
    
    // Property: Should have contact link
    const contactLink = container.querySelector('a[href="/contact"]')
    expect(contactLink).toBeInTheDocument()
  })
  
  it('should render ADA Accessibility Statement page with statement sections', () => {
    const { container } = render(<AdaAccessibilityStatementPage />)
    
    // Property: Should display last updated date (look for the strong element)
    const lastUpdatedStrong = screen.getByText('Last Updated:')
    expect(lastUpdatedStrong).toBeInTheDocument()
    
    // Property: Should display all statement sections (check in main content area)
    const main = container.querySelector('main')
    adaAccessibilityContent.sections.forEach(section => {
      const headings = main?.querySelectorAll('h2')
      const headingExists = headings && Array.from(headings).some(h => h.textContent === section.heading)
      expect(headingExists).toBe(true)
    })
    
    // Property: Should have contact link
    const contactLink = container.querySelector('a[href="/contact"]')
    expect(contactLink).toBeInTheDocument()
  })
  
  it('should render content with proper formatting for any content page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { container, unmount } = render(<Component />)
          
          // Property: Text content should be readable (not empty)
          const paragraphs = container.querySelectorAll('p')
          paragraphs.forEach(p => {
            if (p.textContent) {
              expect(p.textContent.trim().length).toBeGreaterThan(0)
            }
          })
          
          // Property: Links should have href attributes
          const links = container.querySelectorAll('a')
          links.forEach(link => {
            expect(link).toHaveAttribute('href')
            const href = link.getAttribute('href')
            expect(href).toBeTruthy()
          })
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should have accessible navigation for any content page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { unmount } = render(<Component />)
          
          // Property: Page should have navigation elements
          const navigations = screen.getAllByRole('navigation')
          expect(navigations.length).toBeGreaterThanOrEqual(1)
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should render images with alt text for any content page with images', () => {
    const { container } = render(<MeetOurTeamPage />)
    
    // Property: All images should have alt attributes
    const images = container.querySelectorAll('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      const alt = img.getAttribute('alt')
      // Alt can be empty for decorative images, but attribute must exist
      expect(alt).not.toBeNull()
    })
  })
  
  it('should maintain consistent styling across all content pages', () => {
    contentPages.forEach(page => {
      const Component = page.component
      const { container } = render(<Component />)
      
      // Property: Main content should have CSS classes applied
      const main = container.querySelector('main')
      expect(main?.className).toBeTruthy()
      
      // Property: Sections should have CSS classes
      const sections = container.querySelectorAll('section')
      sections.forEach(section => {
        // At least some sections should have classes for styling
        const hasClass = section.className && section.className.length > 0
        // We expect at least one section to have styling
        if (sections.length > 0) {
          expect(hasClass || section.getAttribute('style')).toBeTruthy()
        }
      })
    })
  })
  
  it('should render content pages without console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { unmount } = render(<Component />)
          
          // Property: No console errors should be logged during render
          expect(consoleSpy).not.toHaveBeenCalled()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
    
    consoleSpy.mockRestore()
  })
  
  it('should have proper semantic HTML structure for any content page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: contentPages.length - 1 }),
        (pageIndex) => {
          const page = contentPages[pageIndex]
          const Component = page.component
          
          const { container, unmount } = render(<Component />)
          
          // Property: Should use semantic HTML elements
          const main = container.querySelector('main')
          const header = container.querySelector('header')
          const footer = container.querySelector('footer')
          
          expect(main).toBeInTheDocument()
          expect(header).toBeInTheDocument()
          expect(footer).toBeInTheDocument()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should render all content pages successfully in sequence', () => {
    // Property: All content pages should render without errors
    contentPages.forEach(page => {
      const Component = page.component
      const { container, unmount } = render(<Component />)
      
      expect(container).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      
      unmount()
    })
  })
})
