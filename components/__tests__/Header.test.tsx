import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../Header'

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

const { usePathname } = require('next/navigation')

describe('Header', () => {
  beforeEach(() => {
    // Reset mock before each test
    usePathname.mockReturnValue('/')
  })

  it('should render logo and company name', () => {
    render(<Header />)
    
    expect(screen.getByAltText(/model mortgage/i)).toBeInTheDocument()
    expect(screen.getByText(/model mortgage/i)).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /^learn$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pre-qualify/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^calculator$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /loan options/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about us/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^blog$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^contact$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /apply online/i })).toBeInTheDocument()
  })

  it('should highlight active navigation item on home page', () => {
    usePathname.mockReturnValue('/')
    render(<Header />)
    
    // Home page - no nav items should be active
    const learnLink = screen.getByRole('link', { name: /^learn$/i })
    expect(learnLink).not.toHaveClass('active')
  })

  it('should highlight active navigation item on calculator page', () => {
    usePathname.mockReturnValue('/calculator')
    render(<Header />)
    
    const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
    expect(calculatorLink).toHaveClass('active')
    expect(calculatorLink).toHaveAttribute('aria-current', 'page')
  })

  it('should highlight active navigation item on nested calculator page', () => {
    usePathname.mockReturnValue('/calculator/affordability')
    render(<Header />)
    
    const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
    expect(calculatorLink).toHaveClass('active')
    expect(calculatorLink).toHaveAttribute('aria-current', 'page')
  })

  it('should highlight active navigation item on blog page', () => {
    usePathname.mockReturnValue('/blog')
    render(<Header />)
    
    const blogLink = screen.getByRole('link', { name: /^blog$/i })
    expect(blogLink).toHaveClass('active')
  })

  it('should highlight active navigation item on blog post page', () => {
    usePathname.mockReturnValue('/blog/my-article')
    render(<Header />)
    
    const blogLink = screen.getByRole('link', { name: /^blog$/i })
    expect(blogLink).toHaveClass('active')
  })

  it('should highlight active navigation item on loan options page', () => {
    usePathname.mockReturnValue('/loan-options/fha')
    render(<Header />)
    
    const loanOptionsLink = screen.getByRole('link', { name: /loan options/i })
    expect(loanOptionsLink).toHaveClass('active')
  })

  it('should only highlight one navigation item at a time', () => {
    usePathname.mockReturnValue('/calculator')
    render(<Header />)
    
    const activeLinks = screen.getAllByRole('link').filter(link => 
      link.classList.contains('active')
    )
    
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0]).toHaveTextContent(/calculator/i)
  })

  it('should render mobile menu toggle button', () => {
    render(<Header />)
    
    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('should toggle mobile menu when button is clicked', () => {
    const { container } = render(<Header />)
    
    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    const nav = container.querySelector('nav')
    
    // Initially closed
    expect(nav).not.toHaveClass('navOpen')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton).toHaveAttribute('aria-label', 'Open menu')
    
    // Click to open
    fireEvent.click(toggleButton)
    expect(nav).toHaveClass('navOpen')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(toggleButton).toHaveAttribute('aria-label', 'Close menu')
    
    // Click to close
    fireEvent.click(toggleButton)
    expect(nav).not.toHaveClass('navOpen')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(toggleButton).toHaveAttribute('aria-label', 'Open menu')
  })

  it('should close mobile menu when a navigation link is clicked', () => {
    const { container } = render(<Header />)
    
    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    const nav = container.querySelector('nav')
    
    // Open menu
    fireEvent.click(toggleButton)
    expect(nav).toHaveClass('navOpen')
    
    // Click a navigation link
    const learnLink = screen.getByRole('link', { name: /^learn$/i })
    fireEvent.click(learnLink)
    
    // Menu should close
    expect(nav).not.toHaveClass('navOpen')
  })

  it('should prevent body scroll when mobile menu is open', () => {
    render(<Header />)
    
    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    
    // Initially, body should be scrollable
    expect(document.body.style.overflow).toBe('')
    
    // Open menu
    fireEvent.click(toggleButton)
    expect(document.body.style.overflow).toBe('hidden')
    
    // Close menu
    fireEvent.click(toggleButton)
    expect(document.body.style.overflow).toBe('')
  })

  it('should add hamburger animation class when menu is open', () => {
    render(<Header />)
    
    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    
    // Initially not animated
    expect(toggleButton).not.toHaveClass('mobileToggleOpen')
    
    // Open menu
    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveClass('mobileToggleOpen')
    
    // Close menu
    fireEvent.click(toggleButton)
    expect(toggleButton).not.toHaveClass('mobileToggleOpen')
  })

  it('should have proper accessibility attributes', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
    
    const toggleButton = screen.getByRole('button', { name: /open menu/i })
    expect(toggleButton).toHaveAttribute('aria-label')
    expect(toggleButton).toHaveAttribute('aria-expanded')
    expect(toggleButton).toHaveAttribute('aria-controls', 'main-navigation')
  })

  it('should have correct href attributes for all links', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /^learn$/i })).toHaveAttribute('href', '/learn')
    expect(screen.getByRole('link', { name: /pre-qualify/i })).toHaveAttribute('href', '/pre-qualify')
    expect(screen.getByRole('link', { name: /^calculator$/i })).toHaveAttribute('href', '/calculator')
    expect(screen.getByRole('link', { name: /loan options/i })).toHaveAttribute('href', '/loan-options')
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: /^blog$/i })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /apply online/i })).toHaveAttribute('href', '/apply')
  })

  it('should not mark CTA button as active', () => {
    usePathname.mockReturnValue('/apply')
    render(<Header />)
    
    const applyButton = screen.getByRole('link', { name: /apply online/i })
    expect(applyButton).not.toHaveClass('active')
    expect(applyButton).toHaveClass('ctaButton')
  })
})
