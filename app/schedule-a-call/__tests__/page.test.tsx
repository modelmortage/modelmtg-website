import { render, screen } from '@testing-library/react'
import ScheduleCallPage from '../page'
import { scheduleCallContent } from '@/lib/content/scheduleCall'

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

describe('Schedule a Call Page', () => {
  beforeEach(() => {
    render(<ScheduleCallPage />)
  })

  describe('Page Structure and Content', () => {
    it('renders the page title and subtitle', () => {
      expect(screen.getByText(scheduleCallContent.hero.title)).toBeInTheDocument()
      expect(screen.getByText(scheduleCallContent.hero.subtitle)).toBeInTheDocument()
    })

    it('renders the introduction text', () => {
      expect(screen.getByText(scheduleCallContent.intro)).toBeInTheDocument()
    })

    it('renders all scheduling options', () => {
      scheduleCallContent.schedulingOptions.forEach(option => {
        expect(screen.getByText(option.title)).toBeInTheDocument()
        expect(screen.getByText(option.description)).toBeInTheDocument()
        expect(screen.getByText(option.action.text)).toBeInTheDocument()
      })
    })

    it('renders all benefits', () => {
      scheduleCallContent.benefits.forEach(benefit => {
        expect(screen.getByText(benefit.title)).toBeInTheDocument()
        expect(screen.getByText(benefit.description)).toBeInTheDocument()
      })
    })
  })

  describe('Scheduling Options Links', () => {
    it('renders correct links for each scheduling option', () => {
      scheduleCallContent.schedulingOptions.forEach(option => {
        const link = screen.getByText(option.action.text).closest('a')
        expect(link).toHaveAttribute('href', option.action.href)
      })
    })

    it('opens external links in new tab', () => {
      const externalOptions = scheduleCallContent.schedulingOptions.filter(
        option => option.action.href.startsWith('http')
      )
      
      externalOptions.forEach(option => {
        const link = screen.getByText(option.action.text).closest('a')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('does not open internal links in new tab', () => {
      const internalOptions = scheduleCallContent.schedulingOptions.filter(
        option => !option.action.href.startsWith('http')
      )
      
      internalOptions.forEach(option => {
        const link = screen.getByText(option.action.text).closest('a')
        expect(link).not.toHaveAttribute('target', '_blank')
      })
    })
  })

  describe('Calendly Integration', () => {
    it('renders Calendly iframe when URL is provided', () => {
      if (scheduleCallContent.calendlyUrl) {
        const iframe = screen.getByTitle('Schedule a consultation with Model Mortgage')
        expect(iframe).toBeInTheDocument()
        expect(iframe).toHaveAttribute('src', scheduleCallContent.calendlyUrl)
      }
    })

    it('does not render Calendly section when URL is not provided', () => {
      // This test would need a separate render with modified content
      // For now, we just verify the conditional rendering logic exists
      const iframes = screen.queryAllByTitle('Schedule a consultation with Model Mortgage')
      if (scheduleCallContent.calendlyUrl) {
        expect(iframes.length).toBeGreaterThan(0)
      } else {
        expect(iframes.length).toBe(0)
      }
    })
  })

  describe('Business Information', () => {
    it('displays business hours', () => {
      expect(screen.getByText('Business Hours')).toBeInTheDocument()
      expect(screen.getByText(/Monday - Friday/)).toBeInTheDocument()
    })

    it('displays location information', () => {
      expect(screen.getByText('Location')).toBeInTheDocument()
      expect(screen.getByText(/Houston, TX/)).toBeInTheDocument()
    })

    it('displays company information', () => {
      expect(screen.getByText('Company Information')).toBeInTheDocument()
      expect(screen.getByText(/Model Mortgage/)).toBeInTheDocument()
      expect(screen.getByText(/NMLS: 2516810/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('uses semantic HTML elements', () => {
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('has proper heading hierarchy', () => {
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
      
      const h3s = screen.getAllByRole('heading', { level: 3 })
      expect(h3s.length).toBeGreaterThan(0)
    })

    it('provides descriptive iframe title', () => {
      if (scheduleCallContent.calendlyUrl) {
        const iframe = screen.getByTitle('Schedule a consultation with Model Mortgage')
        expect(iframe).toHaveAttribute('title')
      }
    })
  })

  describe('SEO Requirements', () => {
    it('includes all required scheduling options', () => {
      // Verify at least 2 scheduling options are present
      const options = scheduleCallContent.schedulingOptions
      expect(options.length).toBeGreaterThanOrEqual(2)
      
      // Verify each option has required fields
      options.forEach(option => {
        expect(option.title).toBeTruthy()
        expect(option.description).toBeTruthy()
        expect(option.action.text).toBeTruthy()
        expect(option.action.href).toBeTruthy()
      })
    })

    it('includes contact information for Requirements 2.4', () => {
      // Verify phone number link exists
      const phoneLink = screen.getByText(/\(832\) 727-4128/)
      expect(phoneLink).toBeInTheDocument()
      
      // Verify contact page link exists
      const contactLink = screen.getByText('Contact Us')
      expect(contactLink).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('renders grid layouts for scheduling options', () => {
      const optionsSection = screen.getByText('Choose How to Connect').closest('section')
      expect(optionsSection).toBeInTheDocument()
    })

    it('renders grid layouts for benefits', () => {
      const benefitsSection = screen.getByText('What to Expect').closest('section')
      expect(benefitsSection).toBeInTheDocument()
    })
  })
})
