import { render, screen } from '@testing-library/react'
import PrivacyPolicyPage from '../page'
import { privacyPolicyContent } from '@/lib/content/privacyPolicy'

// Mock the ContentPage component
jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ 
    title, 
    subtitle, 
    children 
  }: { 
    title: string
    subtitle: string
    children: React.ReactNode 
  }) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    )
  }
})

describe('PrivacyPolicyPage', () => {
  it('renders the page title and subtitle', () => {
    render(<PrivacyPolicyPage />)
    
    expect(screen.getByText(privacyPolicyContent.hero.title)).toBeInTheDocument()
    expect(screen.getByText(privacyPolicyContent.hero.subtitle)).toBeInTheDocument()
  })

  it('displays the last updated date', () => {
    render(<PrivacyPolicyPage />)
    
    expect(screen.getByText(/Last Updated:/i)).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<PrivacyPolicyPage />)
    
    privacyPolicyContent.sections.forEach(section => {
      expect(screen.getByText(section.heading)).toBeInTheDocument()
    })
  })

  it('renders section content paragraphs', () => {
    render(<PrivacyPolicyPage />)
    
    // Check that the introduction section content is rendered
    const introSection = privacyPolicyContent.sections[0]
    introSection.content.forEach(paragraph => {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    })
  })

  it('renders subsections when present', () => {
    render(<PrivacyPolicyPage />)
    
    // Find a section with subsections (e.g., "Information We Collect")
    const sectionWithSubsections = privacyPolicyContent.sections.find(
      section => section.subsections && section.subsections.length > 0
    )
    
    if (sectionWithSubsections?.subsections) {
      sectionWithSubsections.subsections.forEach(subsection => {
        expect(screen.getByText(subsection.heading)).toBeInTheDocument()
      })
    }
  })

  it('renders the contact notice at the bottom', () => {
    render(<PrivacyPolicyPage />)
    
    expect(screen.getByText(/If you have any questions about this Privacy Policy/i)).toBeInTheDocument()
  })

  it('includes a contact link', () => {
    render(<PrivacyPolicyPage />)
    
    const contactLink = screen.getByRole('link', { name: /contact us/i })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('renders all required privacy policy sections', () => {
    render(<PrivacyPolicyPage />)
    
    // Check for key privacy policy sections
    const requiredSections = [
      'Introduction',
      'Information We Collect',
      'Use of Your Information',
      'Disclosure of Your Information',
      'Security of Your Information',
      'Contact Us'
    ]
    
    requiredSections.forEach(sectionTitle => {
      expect(screen.getByText(sectionTitle)).toBeInTheDocument()
    })
  })

  it('includes GLBA compliance section', () => {
    render(<PrivacyPolicyPage />)
    
    const glbaElements = screen.getAllByText(/Gramm-Leach-Bliley Act/i)
    expect(glbaElements.length).toBeGreaterThan(0)
  })

  it('includes California privacy rights section', () => {
    render(<PrivacyPolicyPage />)
    
    expect(screen.getByText(/California Privacy Rights/i)).toBeInTheDocument()
  })

  it('includes policy for children section', () => {
    render(<PrivacyPolicyPage />)
    
    expect(screen.getByText(/Policy for Children/i)).toBeInTheDocument()
  })
})
