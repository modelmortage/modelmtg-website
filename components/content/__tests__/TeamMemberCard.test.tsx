import { render, screen } from '@testing-library/react'
import TeamMemberCard from '../TeamMemberCard'
import { TeamMember } from '@/lib/types/content'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('TeamMemberCard', () => {
  const mockTeamMember: TeamMember = {
    slug: 'john-doe',
    name: 'John Doe',
    title: 'Senior Mortgage Broker',
    bio: 'John is an experienced mortgage broker with over 15 years in the industry. He specializes in helping first-time homebuyers navigate the complex world of mortgages.',
    photo: '/images/team/john-doe.jpg',
    credentials: [
      'NMLS #123456',
      '15+ years of experience',
      'Top-rated broker'
    ],
    specialties: [
      'First-time homebuyers',
      'VA loans',
      'FHA loans',
      'Refinancing'
    ],
    contact: {
      email: 'john@example.com',
      phone: '(555) 123-4567',
      calendly: 'https://calendly.com/john-doe'
    },
    metadata: {
      title: 'John Doe | Senior Mortgage Broker',
      description: 'Meet John Doe, experienced mortgage broker',
      keywords: ['John Doe', 'mortgage broker']
    }
  }

  it('renders team member name', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders team member title', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    expect(screen.getByText('Senior Mortgage Broker')).toBeInTheDocument()
  })

  it('renders bio excerpt', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    const bioText = screen.getByText(/John is an experienced mortgage broker/)
    expect(bioText).toBeInTheDocument()
  })

  it('truncates long bio to 150 characters', () => {
    const longBio = 'A'.repeat(200)
    const teamMemberWithLongBio = {
      ...mockTeamMember,
      bio: longBio
    }
    render(<TeamMemberCard teamMember={teamMemberWithLongBio} />)
    const bioElement = screen.getByText(/A+\.\.\./)
    expect(bioElement.textContent?.length).toBeLessThanOrEqual(154) // 150 + '...'
  })

  it('renders team member photo with correct alt text', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    const image = screen.getByAltText('John Doe')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/team/john-doe.jpg')
  })

  it('renders specialties section', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    expect(screen.getByText('Specialties:')).toBeInTheDocument()
  })

  it('renders first 3 specialties', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    expect(screen.getByText('First-time homebuyers')).toBeInTheDocument()
    expect(screen.getByText('VA loans')).toBeInTheDocument()
    expect(screen.getByText('FHA loans')).toBeInTheDocument()
  })

  it('does not render more than 3 specialties', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    expect(screen.queryByText('Refinancing')).not.toBeInTheDocument()
  })

  it('renders as a link to team member profile', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    const link = screen.getByRole('link', { name: /Learn more about John Doe/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/john-doe')
  })

  it('renders arrow indicator', () => {
    const { container } = render(<TeamMemberCard teamMember={mockTeamMember} />)
    // Arrow is now an SVG icon (FaArrowRight) instead of text
    const arrow = container.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

  it('handles team member with no specialties', () => {
    const teamMemberNoSpecialties = {
      ...mockTeamMember,
      specialties: []
    }
    render(<TeamMemberCard teamMember={teamMemberNoSpecialties} />)
    expect(screen.queryByText('Specialties:')).not.toBeInTheDocument()
  })

  it('handles team member with fewer than 3 specialties', () => {
    const teamMemberFewSpecialties = {
      ...mockTeamMember,
      specialties: ['First-time homebuyers', 'VA loans']
    }
    render(<TeamMemberCard teamMember={teamMemberFewSpecialties} />)
    expect(screen.getByText('First-time homebuyers')).toBeInTheDocument()
    expect(screen.getByText('VA loans')).toBeInTheDocument()
    expect(screen.queryByText('FHA loans')).not.toBeInTheDocument()
  })

  it('handles short bio without truncation', () => {
    const shortBio = 'Short bio text.'
    const teamMemberShortBio = {
      ...mockTeamMember,
      bio: shortBio
    }
    render(<TeamMemberCard teamMember={teamMemberShortBio} />)
    const bioText = screen.getByText('Short bio text.')
    expect(bioText.textContent).toBe('Short bio text.')
    expect(bioText.textContent).not.toContain('...')
  })

  it('has proper accessibility attributes', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'Learn more about John Doe')
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<TeamMemberCard teamMember={mockTeamMember} />)
    const card = container.querySelector('a')
    expect(card).toHaveClass('card')
  })
})
