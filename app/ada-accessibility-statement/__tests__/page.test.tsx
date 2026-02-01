import { render, screen } from '@testing-library/react'
import AdaAccessibilityStatementPage from '../page'
import { adaAccessibilityContent } from '@/lib/content/adaAccessibility'

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

describe('AdaAccessibilityStatementPage', () => {
  it('renders the page title and subtitle', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText(adaAccessibilityContent.hero.title)).toBeInTheDocument()
    expect(screen.getByText(adaAccessibilityContent.hero.subtitle)).toBeInTheDocument()
  })

  it('uses the ContentPage component', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByTestId('content-page')).toBeInTheDocument()
  })

  it('displays the last updated date', () => {
    render(<AdaAccessibilityStatementPage />)
    
    const formattedDate = new Date(adaAccessibilityContent.lastUpdated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument()
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<AdaAccessibilityStatementPage />)
    
    adaAccessibilityContent.sections.forEach(section => {
      expect(screen.getByText(section.heading)).toBeInTheDocument()
    })
  })

  it('renders section content paragraphs', () => {
    render(<AdaAccessibilityStatementPage />)
    
    // Check first section's first paragraph
    const firstSection = adaAccessibilityContent.sections[0]
    expect(screen.getByText(firstSection.content[0])).toBeInTheDocument()
  })

  it('renders subsections when present', () => {
    render(<AdaAccessibilityStatementPage />)
    
    // Find sections with subsections
    const sectionsWithSubsections = adaAccessibilityContent.sections.filter(
      section => section.subsections && section.subsections.length > 0
    )
    
    sectionsWithSubsections.forEach(section => {
      section.subsections?.forEach(subsection => {
        expect(screen.getByText(subsection.heading)).toBeInTheDocument()
      })
    })
  })

  it('renders the "Our Commitment" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Our Commitment')).toBeInTheDocument()
    expect(screen.getByText(/Model Mortgage is committed to ensuring digital accessibility/)).toBeInTheDocument()
  })

  it('renders the "Conformance Status" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Conformance Status')).toBeInTheDocument()
    expect(screen.getByText(/WCAG 2.1 Level AA/)).toBeInTheDocument()
  })

  it('renders the "Accessibility Features" section with subsections', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Accessibility Features')).toBeInTheDocument()
    expect(screen.getByText('Keyboard Navigation')).toBeInTheDocument()
    expect(screen.getByText('Screen Reader Compatibility')).toBeInTheDocument()
    expect(screen.getByText('Visual Design')).toBeInTheDocument()
    expect(screen.getByText('Content Structure')).toBeInTheDocument()
  })

  it('renders the "Feedback and Contact Information" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Feedback and Contact Information')).toBeInTheDocument()
    expect(screen.getByText(/info@modelmortgage.com/)).toBeInTheDocument()
    // Phone number appears multiple times, so use getAllByText
    const phoneNumbers = screen.getAllByText(/\(832\) 727-4128/)
    expect(phoneNumbers.length).toBeGreaterThan(0)
  })

  it('renders the contact notice at the bottom', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText(/We are committed to accessibility/)).toBeInTheDocument()
  })

  it('includes a contact link in the contact notice', () => {
    render(<AdaAccessibilityStatementPage />)
    
    const contactLink = screen.getByRole('link', { name: /please contact us/i })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('renders the "Known Limitations" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Known Limitations')).toBeInTheDocument()
    expect(screen.getByText('Third-Party Content')).toBeInTheDocument()
    expect(screen.getByText('Legacy Content')).toBeInTheDocument()
  })

  it('renders the "Ongoing Efforts" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Ongoing Efforts')).toBeInTheDocument()
    expect(screen.getByText('Regular Testing')).toBeInTheDocument()
    expect(screen.getByText('Training and Awareness')).toBeInTheDocument()
    expect(screen.getByText('Continuous Improvement')).toBeInTheDocument()
  })

  it('renders the "Alternative Access" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Alternative Access')).toBeInTheDocument()
    expect(screen.getByText(/Phone consultation with our mortgage specialists/)).toBeInTheDocument()
  })

  it('renders the "Legal Information" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Legal Information')).toBeInTheDocument()
    expect(screen.getByText(/Americans with Disabilities Act \(ADA\)/)).toBeInTheDocument()
  })

  it('renders the "Technical Specifications" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument()
    expect(screen.getByText(/HTML5/)).toBeInTheDocument()
    expect(screen.getByText(/CSS3/)).toBeInTheDocument()
    expect(screen.getByText(/WAI-ARIA/)).toBeInTheDocument()
  })

  it('renders the "Assessment and Testing" section', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Assessment and Testing')).toBeInTheDocument()
    expect(screen.getByText('Testing Methods')).toBeInTheDocument()
  })

  it('renders all subsection content', () => {
    render(<AdaAccessibilityStatementPage />)
    
    // Check that subsection content is rendered
    const accessibilityFeaturesSection = adaAccessibilityContent.sections.find(
      section => section.heading === 'Accessibility Features'
    )
    
    const keyboardNavSubsection = accessibilityFeaturesSection?.subsections?.find(
      sub => sub.heading === 'Keyboard Navigation'
    )
    
    if (keyboardNavSubsection) {
      expect(screen.getByText(keyboardNavSubsection.content[0])).toBeInTheDocument()
    }
  })

  it('uses semantic HTML sections', () => {
    const { container } = render(<AdaAccessibilityStatementPage />)
    
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBe(adaAccessibilityContent.sections.length)
  })

  it('has proper heading hierarchy', () => {
    const { container } = render(<AdaAccessibilityStatementPage />)
    
    // Check for h2 elements (section headings)
    const h2Elements = container.querySelectorAll('h2')
    expect(h2Elements.length).toBe(adaAccessibilityContent.sections.length)
    
    // Check for h3 elements (subsection headings)
    const totalSubsections = adaAccessibilityContent.sections.reduce(
      (count, section) => count + (section.subsections?.length || 0),
      0
    )
    const h3Elements = container.querySelectorAll('h3')
    expect(h3Elements.length).toBe(totalSubsections)
  })

  it('renders multiple paragraphs in sections with multiple content items', () => {
    render(<AdaAccessibilityStatementPage />)
    
    // Find a section with multiple content paragraphs
    const commitmentSection = adaAccessibilityContent.sections.find(
      section => section.heading === 'Our Commitment'
    )
    
    if (commitmentSection && commitmentSection.content.length > 1) {
      commitmentSection.content.forEach(paragraph => {
        expect(screen.getByText(paragraph)).toBeInTheDocument()
      })
    }
  })

  it('includes information about WCAG 2.1 AA compliance', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText(/WCAG 2.1 Level AA/)).toBeInTheDocument()
  })

  it('includes information about assistive technologies', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Assistive Technologies')).toBeInTheDocument()
    expect(screen.getByText(/JAWS, NVDA, VoiceOver/)).toBeInTheDocument()
  })

  it('includes response time information', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText('Response Time')).toBeInTheDocument()
    expect(screen.getByText(/2 business days/)).toBeInTheDocument()
  })

  it('includes information about color contrast requirements', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText(/4.5:1 for normal text, 3:1 for large text/)).toBeInTheDocument()
  })

  it('includes information about touch target sizing', () => {
    render(<AdaAccessibilityStatementPage />)
    
    expect(screen.getByText(/minimum 44x44 pixels/)).toBeInTheDocument()
  })
})
