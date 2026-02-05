/**
 * Unit tests for ARIA labels on interactive elements
 * Validates Requirements 7.5, 8.3
 */

import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import BlogCard from '@/components/content/BlogCard'
import LoanOptionCard from '@/components/content/LoanOptionCard'
import { BlogPost, LoanOption } from '@/lib/types/content'

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

describe('ARIA Labels - Requirements 7.5, 8.3', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  describe('Header Component', () => {
    it('should have aria-label on mobile menu toggle button', () => {
      render(<Header />)
      
      const toggleButton = screen.getByRole('button', { name: /open menu/i })
      expect(toggleButton).toHaveAttribute('aria-label')
      expect(toggleButton.getAttribute('aria-label')).toMatch(/open menu/i)
    })

    it('should have aria-expanded on mobile menu toggle button', () => {
      render(<Header />)
      
      const toggleButton = screen.getByRole('button', { name: /open menu/i })
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have aria-controls on mobile menu toggle button', () => {
      render(<Header />)
      
      const toggleButton = screen.getByRole('button', { name: /open menu/i })
      expect(toggleButton).toHaveAttribute('aria-controls', 'main-navigation')
    })

    it('should have aria-current="page" on active navigation items', () => {
      usePathname.mockReturnValue('/calculator')
      render(<Header />)
      
      const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
      expect(calculatorLink).toHaveAttribute('aria-current', 'page')
    })

    it('should not have aria-current on inactive navigation items', () => {
      usePathname.mockReturnValue('/calculator')
      render(<Header />)
      
      const learnLink = screen.getByRole('link', { name: /^learn$/i })
      expect(learnLink).not.toHaveAttribute('aria-current')
    })

    it('should have aria-label on navigation', () => {
      render(<Header />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })
  })

  describe('Footer Component', () => {
    it('should have aria-label on social icon links', () => {
      render(<Footer />)
      
      const facebookLink = screen.getByRole('link', { name: /follow us on facebook/i })
      expect(facebookLink).toHaveAttribute('aria-label', 'Follow us on Facebook')
      
      const instagramLink = screen.getByRole('link', { name: /follow us on instagram/i })
      expect(instagramLink).toHaveAttribute('aria-label', 'Follow us on Instagram')
      
      const linkedinLink = screen.getByRole('link', { name: /follow us on linkedin/i })
      expect(linkedinLink).toHaveAttribute('aria-label', 'Follow us on LinkedIn')
    })

    it('should have descriptive text for all footer links', () => {
      render(<Footer />)
      
      // All footer links should have visible text or aria-label
      const allLinks = screen.getAllByRole('link')
      
      allLinks.forEach(link => {
        const hasText = link.textContent && link.textContent.trim().length > 0
        const hasAriaLabel = link.hasAttribute('aria-label')
        
        expect(hasText || hasAriaLabel).toBe(true)
      })
    })
  })

  describe('Breadcrumbs Component', () => {
    it('should have aria-label on breadcrumb navigation', () => {
      const items = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loan', href: '/loan-options/fha-home-loan' }
      ]
      
      render(<Breadcrumbs items={items} />)
      
      const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    })

    it('should have aria-current="page" on current breadcrumb item', () => {
      const items = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loan', href: '/loan-options/fha-home-loan' }
      ]
      
      render(<Breadcrumbs items={items} />)
      
      const currentItem = screen.getByText('FHA Loan')
      expect(currentItem).toHaveAttribute('aria-current', 'page')
    })

    it('should have aria-hidden on breadcrumb separators', () => {
      const items = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loan', href: '/loan-options/fha-home-loan' }
      ]
      
      const { container } = render(<Breadcrumbs items={items} />)
      
      const separators = container.querySelectorAll('[aria-hidden="true"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('BlogCard Component', () => {
    const mockBlogPost: BlogPost = {
      slug: 'test-post',
      title: 'Test Blog Post',
      excerpt: 'This is a test excerpt',
      content: 'Full content here',
      author: 'Test Author',
      publishDate: '2024-01-15',
      category: 'Home Buying',
      tags: ['test'],
      featuredImage: '/test-image.jpg',
      readTime: 5,
      metadata: {
        title: 'Test Post',
        description: 'Test description',
        keywords: ['test']
      }
    }

    it('should have aria-label on blog card link', () => {
      render(<BlogCard blogPost={mockBlogPost} />)
      
      const link = screen.getByRole('link', { name: /read article: test blog post/i })
      expect(link).toHaveAttribute('aria-label')
    })

    it('should have aria-hidden on decorative arrow', () => {
      const { container } = render(<BlogCard blogPost={mockBlogPost} />)
      
      // Arrow is now an SVG icon, check for aria-hidden on the arrow container
      const arrow = container.querySelector('[aria-hidden="true"]')
      expect(arrow).toBeInTheDocument()
    })
  })

  describe('LoanOptionCard Component', () => {
    const mockLoanOption: LoanOption = {
      id: 'test-loan',
      slug: 'test-loan',
      title: 'Test Loan',
      shortDescription: 'A test loan option',
      fullDescription: 'Full description',
      benefits: ['Benefit 1'],
      requirements: ['Requirement 1'],
      idealFor: ['First-time buyers'],
      icon: 'home',
      relatedCalculators: [],
      metadata: {
        title: 'Test Loan',
        description: 'Test description',
        keywords: ['test']
      }
    }

    it('should have aria-label on loan option card link', () => {
      render(<LoanOptionCard loanOption={mockLoanOption} />)
      
      const link = screen.getByRole('link', { name: /learn more about test loan/i })
      expect(link).toHaveAttribute('aria-label')
    })

    it('should have aria-hidden on decorative arrow', () => {
      const { container } = render(<LoanOptionCard loanOption={mockLoanOption} />)
      
      // Arrow is now an SVG icon, check for aria-hidden on the arrow container
      const arrow = container.querySelector('[aria-hidden="true"]')
      expect(arrow).toBeInTheDocument()
    })
  })

  describe('Icon Buttons', () => {
    it('should have descriptive aria-label on all icon-only buttons', () => {
      render(<Header />)
      
      // Mobile menu toggle is an icon-only button - use specific selector
      const toggleButton = screen.getByRole('button', { name: /open menu|close menu/i })
      expect(toggleButton).toHaveAttribute('aria-label')
      
      const ariaLabel = toggleButton.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel!.length).toBeGreaterThan(0)
    })
  })

  describe('Image Buttons', () => {
    it('should have alt text on logo image used as link', () => {
      render(<Header />)
      
      const logoImage = screen.getByAltText(/model mortgage/i)
      expect(logoImage).toBeInTheDocument()
      expect(logoImage).toHaveAttribute('alt')
      
      const altText = logoImage.getAttribute('alt')
      expect(altText).toBeTruthy()
      expect(altText!.length).toBeGreaterThan(0)
    })
  })

  describe('Active Navigation State - Requirement 8.3', () => {
    it('should highlight calculator navigation when on calculator page', () => {
      usePathname.mockReturnValue('/calculator')
      render(<Header />)
      
      const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
      expect(calculatorLink).toHaveClass('active')
      expect(calculatorLink).toHaveAttribute('aria-current', 'page')
    })

    it('should highlight calculator navigation when on nested calculator page', () => {
      usePathname.mockReturnValue('/calculator/affordability')
      render(<Header />)
      
      const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
      expect(calculatorLink).toHaveClass('active')
      expect(calculatorLink).toHaveAttribute('aria-current', 'page')
    })

    it('should highlight blog navigation when on blog listing page', () => {
      usePathname.mockReturnValue('/blog')
      render(<Header />)
      
      const blogLink = screen.getByRole('link', { name: /^blog$/i })
      expect(blogLink).toHaveClass('active')
      expect(blogLink).toHaveAttribute('aria-current', 'page')
    })

    it('should highlight blog navigation when on blog post page', () => {
      usePathname.mockReturnValue('/blog/my-article')
      render(<Header />)
      
      const blogLink = screen.getByRole('link', { name: /^blog$/i })
      expect(blogLink).toHaveClass('active')
      expect(blogLink).toHaveAttribute('aria-current', 'page')
    })

    it('should highlight loan options navigation when on loan options page', () => {
      usePathname.mockReturnValue('/loan-options/fha-home-loan')
      render(<Header />)
      
      const loanOptionsLink = screen.getByRole('link', { name: /loan options/i })
      expect(loanOptionsLink).toHaveClass('active')
      expect(loanOptionsLink).toHaveAttribute('aria-current', 'page')
    })

    it('should only highlight one navigation item at a time', () => {
      usePathname.mockReturnValue('/calculator')
      render(<Header />)
      
      const allLinks = screen.getAllByRole('link')
      const activeLinks = allLinks.filter(link => 
        link.hasAttribute('aria-current') && link.getAttribute('aria-current') === 'page'
      )
      
      expect(activeLinks.length).toBe(1)
    })
  })
})
