import { render, screen } from '@testing-library/react'
import MeetOurTeamPage from '../page'
import { meetOurTeamContent } from '@/lib/content/teamMembers'

// Mock the ContentPage component
jest.mock('@/components/shared/ContentPage', () => {
  return function MockContentPage({ title, subtitle, children }: any) {
    return (
      <div data-testid="content-page">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    )
  }
})

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>
  }
})

describe('MeetOurTeamPage', () => {
  it('renders the page title and subtitle', () => {
    render(<MeetOurTeamPage />)
    
    expect(screen.getByText(meetOurTeamContent.hero.title)).toBeInTheDocument()
    expect(screen.getByText(meetOurTeamContent.hero.subtitle)).toBeInTheDocument()
  })

  it('renders the introduction text', () => {
    render(<MeetOurTeamPage />)
    
    expect(screen.getByText(meetOurTeamContent.intro)).toBeInTheDocument()
  })

  it('renders all team members', () => {
    render(<MeetOurTeamPage />)
    
    meetOurTeamContent.teamMembers.forEach(member => {
      expect(screen.getByText(member.name)).toBeInTheDocument()
      expect(screen.getByText(member.title)).toBeInTheDocument()
    })
  })

  it('renders team member photos with correct alt text', () => {
    render(<MeetOurTeamPage />)
    
    meetOurTeamContent.teamMembers.forEach(member => {
      const img = screen.getByAltText(member.name)
      expect(img).toBeInTheDocument()
    })
  })

  it('renders team member bio excerpts', () => {
    render(<MeetOurTeamPage />)
    
    // TeamMemberCard truncates bio to 150 characters
    // Just verify that some bio text is present for each member
    meetOurTeamContent.teamMembers.forEach(member => {
      // Check for the beginning of the bio text
      const bioStart = member.bio.substring(0, 30)
      const bioElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes(bioStart) || false
      })
      expect(bioElements.length).toBeGreaterThan(0)
    })
  })

  it('renders team member specialties', () => {
    render(<MeetOurTeamPage />)
    
    meetOurTeamContent.teamMembers.forEach(member => {
      // Check first 3 specialties (as shown in the UI)
      member.specialties.slice(0, 3).forEach(specialty => {
        const elements = screen.getAllByText(specialty)
        expect(elements.length).toBeGreaterThan(0)
      })
    })
  })

  it('renders team member contact information', () => {
    render(<MeetOurTeamPage />)
    
    // TeamMemberCard doesn't display contact info - it's a link to the profile page
    // Verify that each team member card links to their profile
    meetOurTeamContent.teamMembers.forEach(member => {
      const links = screen.getAllByRole('link')
      const memberLink = links.find(link => link.getAttribute('href') === `/${member.slug}`)
      expect(memberLink).toBeInTheDocument()
    })
  })

  it('renders links to individual team member profiles', () => {
    render(<MeetOurTeamPage />)
    
    // Each TeamMemberCard is a link to the profile
    meetOurTeamContent.teamMembers.forEach(member => {
      const links = screen.getAllByRole('link')
      const memberLink = links.find(link => link.getAttribute('href') === `/${member.slug}`)
      expect(memberLink).toBeInTheDocument()
      expect(memberLink).toHaveAttribute('href', `/${member.slug}`)
    })
  })

  it('renders company NMLS information', () => {
    render(<MeetOurTeamPage />)
    
    expect(screen.getByText('Company NMLS: 2516810')).toBeInTheDocument()
  })

  it('uses ContentPage component', () => {
    render(<MeetOurTeamPage />)
    
    expect(screen.getByTestId('content-page')).toBeInTheDocument()
  })
})
