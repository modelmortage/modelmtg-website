import { render, screen } from '@testing-library/react'
import ContentPage from '../ContentPage'
import { BreadcrumbItem } from '../Breadcrumbs'

// Mock the Header and Footer components
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>
  }
})

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

describe('ContentPage', () => {
  it('should render header and footer', () => {
    render(
      <ContentPage title="Test Page">
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should render page title', () => {
    render(
      <ContentPage title="About Us">
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByRole('heading', { name: /about us/i, level: 1 })).toBeInTheDocument()
  })

  it('should render subtitle when provided', () => {
    render(
      <ContentPage 
        title="Test Page" 
        subtitle="This is a test subtitle"
      >
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByText(/this is a test subtitle/i)).toBeInTheDocument()
  })

  it('should render breadcrumbs when provided', () => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/about/team' }
    ]
    
    render(
      <ContentPage title="Team" breadcrumbs={breadcrumbs}>
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
  })

  it('should not render breadcrumbs when not provided', () => {
    render(
      <ContentPage title="Test Page">
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.queryByRole('navigation', { name: /breadcrumb/i })).not.toBeInTheDocument()
  })

  it('should render children content', () => {
    render(
      <ContentPage title="Test Page">
        <div data-testid="custom-content">Custom Content</div>
      </ContentPage>
    )
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText(/custom content/i)).toBeInTheDocument()
  })

  it('should render default CTA section', () => {
    render(
      <ContentPage title="Test Page">
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByRole('heading', { name: /ready to get started/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /schedule a call/i })).toBeInTheDocument()
  })

  it('should render custom CTA when provided', () => {
    const customCTA = {
      title: 'Custom CTA Title',
      description: 'Custom CTA Description',
      buttonText: 'Custom Button',
      buttonHref: '/custom-link'
    }
    
    render(
      <ContentPage title="Test Page" cta={customCTA}>
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByRole('heading', { name: /custom cta title/i })).toBeInTheDocument()
    expect(screen.getByText(/custom cta description/i)).toBeInTheDocument()
    
    const button = screen.getByRole('link', { name: /custom button/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/custom-link')
  })

  it('should not render CTA when showCTA is false', () => {
    render(
      <ContentPage title="Test Page" showCTA={false}>
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.queryByRole('heading', { name: /ready to get started/i })).not.toBeInTheDocument()
  })

  it('should apply hero background color when provided', () => {
    const { container } = render(
      <ContentPage title="Test Page" heroBackground="rgb(255, 0, 0)">
        <div>Content</div>
      </ContentPage>
    )
    
    const heroSection = container.querySelector('section')
    expect(heroSection).toHaveStyle({ background: 'rgb(255, 0, 0)' })
  })

  it('should apply hero background image when provided', () => {
    const { container } = render(
      <ContentPage title="Test Page" heroImage="/test-image.jpg">
        <div>Content</div>
      </ContentPage>
    )
    
    const heroSection = container.querySelector('section')
    expect(heroSection).toHaveStyle({
      backgroundImage: expect.stringContaining('/test-image.jpg')
    })
  })

  it('should have proper semantic structure', () => {
    render(
      <ContentPage title="Test Page">
        <div>Content</div>
      </ContentPage>
    )
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render multiple content sections', () => {
    render(
      <ContentPage title="Test Page">
        <section data-testid="section-1">Section 1</section>
        <section data-testid="section-2">Section 2</section>
        <section data-testid="section-3">Section 3</section>
      </ContentPage>
    )
    
    expect(screen.getByTestId('section-1')).toBeInTheDocument()
    expect(screen.getByTestId('section-2')).toBeInTheDocument()
    expect(screen.getByTestId('section-3')).toBeInTheDocument()
  })
})
