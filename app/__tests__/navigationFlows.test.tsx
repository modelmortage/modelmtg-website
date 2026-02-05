/**
 * Unit Tests for Navigation Flows
 * Task: 14.1 Test navigation flows
 * Requirements: 8.3, 8.4, 8.5
 * 
 * Tests verify:
 * - All navigation links work correctly
 * - Breadcrumbs on nested pages
 * - Active navigation states
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ContentPage from '@/components/shared/ContentPage'

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

describe('Navigation Flows - Unit Tests', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  describe('Requirement 8.5: Navigation Link Functionality', () => {
    it('should have all header navigation links with correct href attributes', () => {
      render(<Header />)

      const expectedLinks = [
        { name: /^learn$/i, href: '/learn' },
        { name: /pre-qualify/i, href: '/pre-qualify' },
        { name: /^calculator$/i, href: '/calculator' },
        { name: /loan options/i, href: '/loan-options' },
        { name: /about us/i, href: '/about' },
        { name: /^blog$/i, href: '/blog' },
        { name: /^contact$/i, href: '/contact' },
        { name: /apply online/i, href: '/apply' }
      ]

      expectedLinks.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('should have footer navigation links with correct href attributes', () => {
      render(<Footer />)

      const expectedFooterLinks = [
        { name: /our story/i, href: '/about' },
        { name: /meet our team/i, href: '/team' },
        { name: /client reviews/i, href: '/reviews' },
        { name: /contact us/i, href: '/contact' },
        { name: /learning center/i, href: '/learn' },
        { name: /mortgage calculator/i, href: '/calculator' },
        { name: /pre-qualification/i, href: '/pre-qualify' },
        { name: /privacy policy/i, href: '/privacy-policy' },
        { name: /ada accessibility/i, href: '/ada-accessibility-statement' }
      ]

      expectedFooterLinks.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('should have loan options links in footer', () => {
      render(<Footer />)

      const loanOptionLinks = [
        { name: /conventional loans/i, href: '/loan-options/conventional' },
        { name: /fha loans/i, href: '/loan-options/fha-home-loan' },
        { name: /va loans/i, href: '/loan-options/va' },
        { name: /jumbo loans/i, href: '/loan-options/jumbo' },
        { name: /refinance/i, href: '/loan-options/refinance' }
      ]

      loanOptionLinks.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', href)
      })
    })

    it('should have contact links in footer', () => {
      render(<Footer />)

      const phoneLink = screen.getByRole('link', { name: /\(832\) 727-4128/i })
      expect(phoneLink).toHaveAttribute('href', 'tel:832-727-4128')

      const emailLink = screen.getByRole('link', { name: /email us today/i })
      expect(emailLink).toHaveAttribute('href', 'mailto:info@modelmortgage.com')
    })

    it('should not have broken links (empty or invalid hrefs)', () => {
      const { container } = render(
        <>
          <Header />
          <Footer />
        </>
      )

      const allLinks = container.querySelectorAll('a[href]')
      expect(allLinks.length).toBeGreaterThan(0)

      allLinks.forEach(link => {
        const href = link.getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).not.toBe('')
        
        // Valid hrefs should start with /, mailto:, tel:, or http
        // Note: Social media links may have # as placeholder, which is acceptable
        if (href !== '#') {
          expect(
            href?.startsWith('/') || 
            href?.startsWith('mailto:') || 
            href?.startsWith('tel:') || 
            href?.startsWith('http')
          ).toBe(true)
        }
      })
    })
  })

  describe('Requirement 8.4: Breadcrumb Navigation', () => {
    it('should render breadcrumbs with home link on nested pages', () => {
      const breadcrumbItems = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loans', href: '/loan-options/fha-home-loan' }
      ]

      render(<Breadcrumbs items={breadcrumbItems} />)

      // Home link should always be present
      const homeLink = screen.getByRole('link', { name: /^home$/i })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should render all breadcrumb items in correct order', () => {
      const breadcrumbItems = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loans', href: '/loan-options/fha-home-loan' }
      ]

      render(<Breadcrumbs items={breadcrumbItems} />)

      const loanOptionsLink = screen.getByRole('link', { name: /loan options/i })
      expect(loanOptionsLink).toBeInTheDocument()
      expect(loanOptionsLink).toHaveAttribute('href', '/loan-options')

      // Last item should not be a link
      const currentPage = screen.getByText(/fha loans/i)
      expect(currentPage).toBeInTheDocument()
      expect(currentPage).toHaveAttribute('aria-current', 'page')
      expect(currentPage.tagName).not.toBe('A')
    })

    it('should mark the last breadcrumb item as current page', () => {
      const breadcrumbItems = [
        { label: 'Blog', href: '/blog' },
        { label: 'Article Title', href: '/blog/article-slug' }
      ]

      render(<Breadcrumbs items={breadcrumbItems} />)

      const currentPage = screen.getByText(/article title/i)
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('should have proper ARIA label for breadcrumb navigation', () => {
      const breadcrumbItems = [
        { label: 'Loan Options', href: '/loan-options' }
      ]

      render(<Breadcrumbs items={breadcrumbItems} />)

      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(breadcrumbNav).toBeInTheDocument()
    })

    it('should render breadcrumbs in ContentPage component', () => {
      const breadcrumbItems = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loans', href: '/loan-options/fha-home-loan' }
      ]

      render(
        <ContentPage
          title="FHA Loans"
          breadcrumbs={breadcrumbItems}
        >
          <p>Content</p>
        </ContentPage>
      )

      const homeLink = screen.getByRole('link', { name: /^home$/i })
      expect(homeLink).toBeInTheDocument()

      // Use getAllByRole since "Loan Options" appears in both header and breadcrumbs
      const loanOptionsLinks = screen.getAllByRole('link', { name: /loan options/i })
      expect(loanOptionsLinks.length).toBeGreaterThanOrEqual(1)
      // Verify at least one has the correct href
      const breadcrumbLink = loanOptionsLinks.find(link => link.getAttribute('href') === '/loan-options')
      expect(breadcrumbLink).toBeInTheDocument()
    })

    it('should handle deep breadcrumb hierarchies', () => {
      const breadcrumbItems = [
        { label: 'Level 1', href: '/level1' },
        { label: 'Level 2', href: '/level1/level2' },
        { label: 'Level 3', href: '/level1/level2/level3' },
        { label: 'Current Page', href: '/level1/level2/level3/current' }
      ]

      render(<Breadcrumbs items={breadcrumbItems} />)

      // All intermediate levels should be links
      expect(screen.getByRole('link', { name: /level 1/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /level 2/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /level 3/i })).toBeInTheDocument()

      // Last item should be current page
      const currentPage = screen.getByText(/current page/i)
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('should have separators between breadcrumb items', () => {
      const breadcrumbItems = [
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loans', href: '/loan-options/fha-home-loan' }
      ]

      const { container } = render(<Breadcrumbs items={breadcrumbItems} />)

      const separators = container.querySelectorAll('[aria-hidden="true"]')
      // Should have separators between items (not after last item)
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Requirement 8.3: Active Navigation States', () => {
    it('should mark calculator link as active on calculator page', () => {
      usePathname.mockReturnValue('/calculator')
      render(<Header />)

      const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
      expect(calculatorLink).toHaveClass('active')
      expect(calculatorLink).toHaveAttribute('aria-current', 'page')
    })

    it('should mark calculator link as active on nested calculator pages', () => {
      const calculatorPages = [
        '/calculator/affordability',
        '/calculator/purchase',
        '/calculator/refinance',
        '/calculator/rent-vs-buy',
        '/calculator/va-purchase',
        '/calculator/va-refinance',
        '/calculator/dscr'
      ]

      calculatorPages.forEach(path => {
        usePathname.mockReturnValue(path)
        const { unmount } = render(<Header />)

        const calculatorLink = screen.getByRole('link', { name: /^calculator$/i })
        expect(calculatorLink).toHaveClass('active')
        expect(calculatorLink).toHaveAttribute('aria-current', 'page')

        unmount()
      })
    })

    it('should mark blog link as active on blog listing page', () => {
      usePathname.mockReturnValue('/blog')
      render(<Header />)

      const blogLink = screen.getByRole('link', { name: /^blog$/i })
      expect(blogLink).toHaveClass('active')
      expect(blogLink).toHaveAttribute('aria-current', 'page')
    })

    it('should mark blog link as active on blog post pages', () => {
      usePathname.mockReturnValue('/blog/my-article-slug')
      render(<Header />)

      const blogLink = screen.getByRole('link', { name: /^blog$/i })
      expect(blogLink).toHaveClass('active')
      expect(blogLink).toHaveAttribute('aria-current', 'page')
    })

    it('should mark loan options link as active on loan options pages', () => {
      const loanOptionPages = [
        '/loan-options',
        '/loan-options/fha-home-loan',
        '/loan-options/va',
        '/loan-options/conventional',
        '/loan-options/jumbo'
      ]

      loanOptionPages.forEach(path => {
        usePathname.mockReturnValue(path)
        const { unmount } = render(<Header />)

        const loanOptionsLink = screen.getByRole('link', { name: /loan options/i })
        expect(loanOptionsLink).toHaveClass('active')
        expect(loanOptionsLink).toHaveAttribute('aria-current', 'page')

        unmount()
      })
    })

    it('should mark about link as active on about page', () => {
      usePathname.mockReturnValue('/about')
      render(<Header />)

      const aboutLink = screen.getByRole('link', { name: /about us/i })
      expect(aboutLink).toHaveClass('active')
      expect(aboutLink).toHaveAttribute('aria-current', 'page')
    })

    it('should mark learn link as active on learn page', () => {
      usePathname.mockReturnValue('/learn')
      render(<Header />)

      const learnLink = screen.getByRole('link', { name: /^learn$/i })
      expect(learnLink).toHaveClass('active')
      expect(learnLink).toHaveAttribute('aria-current', 'page')
    })

    it('should mark contact link as active on contact page', () => {
      usePathname.mockReturnValue('/contact')
      render(<Header />)

      const contactLink = screen.getByRole('link', { name: /^contact$/i })
      expect(contactLink).toHaveClass('active')
      expect(contactLink).toHaveAttribute('aria-current', 'page')
    })

    it('should mark pre-qualify link as active on pre-qualify page', () => {
      usePathname.mockReturnValue('/pre-qualify')
      render(<Header />)

      const preQualifyLink = screen.getByRole('link', { name: /pre-qualify/i })
      expect(preQualifyLink).toHaveClass('active')
      expect(preQualifyLink).toHaveAttribute('aria-current', 'page')
    })

    it('should only mark one navigation item as active at a time', () => {
      usePathname.mockReturnValue('/calculator/affordability')
      const { container } = render(<Header />)

      const activeLinks = container.querySelectorAll('.active')
      expect(activeLinks.length).toBe(1)
      expect(activeLinks[0]).toHaveTextContent(/calculator/i)
    })

    it('should not mark CTA button as active even on apply page', () => {
      usePathname.mockReturnValue('/apply')
      render(<Header />)

      const applyButton = screen.getByRole('link', { name: /apply online/i })
      expect(applyButton).not.toHaveClass('active')
      expect(applyButton).toHaveClass('ctaButton')
    })

    it('should not mark any navigation item as active on home page', () => {
      usePathname.mockReturnValue('/')
      const { container } = render(<Header />)

      const activeLinks = container.querySelectorAll('.active')
      expect(activeLinks.length).toBe(0)
    })

    it('should update active state when pathname changes', () => {
      usePathname.mockReturnValue('/blog')
      const { rerender, container } = render(<Header />)

      let activeLinks = container.querySelectorAll('.active')
      expect(activeLinks.length).toBe(1)
      expect(activeLinks[0]).toHaveTextContent(/blog/i)

      // Change pathname
      usePathname.mockReturnValue('/calculator')
      rerender(<Header />)

      activeLinks = container.querySelectorAll('.active')
      expect(activeLinks.length).toBe(1)
      expect(activeLinks[0]).toHaveTextContent(/calculator/i)
    })
  })

  describe('Integration: Navigation Flow Scenarios', () => {
    it('should have consistent navigation structure across header and footer', () => {
      render(
        <>
          <Header />
          <Footer />
        </>
      )

      // Both should have navigation elements
      const navigations = screen.getAllByRole('navigation')
      expect(navigations.length).toBeGreaterThanOrEqual(1)

      // Both should have links
      const allLinks = screen.getAllByRole('link')
      expect(allLinks.length).toBeGreaterThan(0)

      // All links should have valid hrefs
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('href')
        const href = link.getAttribute('href')
        expect(href).toBeTruthy()
      })
    })

    it('should render complete navigation flow for nested page', () => {
      usePathname.mockReturnValue('/loan-options/fha-home-loan')

      render(
        <ContentPage
          title="FHA Loans"
          breadcrumbs={[
            { label: 'Loan Options', href: '/loan-options' },
            { label: 'FHA Loans', href: '/loan-options/fha-home-loan' }
          ]}
        >
          <p>Content</p>
        </ContentPage>
      )

      // Header should be present with active state
      const loanOptionsLink = screen.getAllByRole('link', { name: /loan options/i })[0]
      expect(loanOptionsLink).toHaveClass('active')

      // Breadcrumbs should be present
      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i })
      expect(breadcrumbNav).toBeInTheDocument()

      // Footer should be present
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('should have accessible navigation for keyboard users', () => {
      render(<Header />)

      const allLinks = screen.getAllByRole('link')
      
      // All links should be keyboard accessible (no negative tabindex)
      allLinks.forEach(link => {
        const tabindex = link.getAttribute('tabindex')
        if (tabindex !== null) {
          expect(parseInt(tabindex)).toBeGreaterThanOrEqual(0)
        }
      })
    })
  })
})
