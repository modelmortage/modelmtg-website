import { render, screen } from '@testing-library/react'
import MatthewBramowPage from '../page'
import { teamMembers } from '@/lib/content/teamMembers'

const member = teamMembers.find(m => m.slug === 'matthew-bramow')!

// Mock the ContentPage component
jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ title, subtitle, children, breadcrumbs }: any) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {breadcrumbs && (
          <nav data-testid="breadcrumbs">
            {breadcrumbs.map((crumb: any, i: number) => (
              <span key={i}>{crumb.label}</span>
            ))}
          </nav>
        )}
        {children}
      </div>
    )
  }
})

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>
  }
})

describe('MatthewBramowPage', () => {
  it('renders the member name and title', () => {
    render(<MatthewBramowPage />)
    
    const names = screen.getAllByText(member.name)
    expect(names.length).toBeGreaterThan(0)
    expect(screen.getByText(member.title)).toBeInTheDocument()
  })

  it('renders breadcrumb navigation', () => {
    render(<MatthewBramowPage />)
    
    const breadcrumbs = screen.getByTestId('breadcrumbs')
    expect(breadcrumbs).toBeInTheDocument()
    expect(screen.getByText('Meet Our Team')).toBeInTheDocument()
    const names = screen.getAllByText(member.name)
    expect(names.length).toBeGreaterThan(0)
  })

  it('renders the member photo with correct alt text', () => {
    render(<MatthewBramowPage />)
    
    const img = screen.getByAltText(`${member.name} - ${member.title}`)
    expect(img).toBeInTheDocument()
    // Next.js Image optimizes URLs, so check that src contains the expected path
    expect(img.getAttribute('src')).toContain(member.photo.replace('/images/', ''))
  })

  it('renders the complete bio', () => {
    render(<MatthewBramowPage />)
    
    const bioParagraphs = member.bio.split('\n\n')
    bioParagraphs.forEach(paragraph => {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    })
  })

  it('renders contact information', () => {
    render(<MatthewBramowPage />)
    
    if (member.contact.email) {
      const emailLink = screen.getByText(member.contact.email)
      expect(emailLink).toBeInTheDocument()
      expect(emailLink.closest('a')).toHaveAttribute('href', `mailto:${member.contact.email}`)
    }
    
    if (member.contact.phone) {
      const phoneLink = screen.getByText(member.contact.phone)
      expect(phoneLink).toBeInTheDocument()
      expect(phoneLink.closest('a')).toHaveAttribute('href', `tel:${member.contact.phone}`)
    }
  })

  it('renders all credentials', () => {
    render(<MatthewBramowPage />)
    
    member.credentials.forEach(credential => {
      expect(screen.getByText(credential)).toBeInTheDocument()
    })
  })

  it('renders all specialties', () => {
    render(<MatthewBramowPage />)
    
    member.specialties.forEach(specialty => {
      expect(screen.getByText(specialty)).toBeInTheDocument()
    })
  })

  it('renders back to team link', () => {
    render(<MatthewBramowPage />)
    
    const backLink = screen.getByText('Back to Meet Our Team')
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/meet-our-team')
  })

  it('uses ContentPage component', () => {
    render(<MatthewBramowPage />)
    
    expect(screen.getByTestId('content-page')).toBeInTheDocument()
  })
})
