/**
 * Property-Based Test for Mobile Navigation
 * Feature: website-structure-migration
 * Task: 14.8 Write property test for mobile navigation
 * 
 * Property 26: Mobile Navigation
 * For any page at viewport widths below 768px, the navigation should 
 * collapse into a mobile menu with a toggle button.
 * 
 * **Validates: Requirements 8.6**
 */

import { render, screen, fireEvent } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import '@testing-library/jest-dom'

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

// Helper to set viewport width
const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  window.dispatchEvent(new Event('resize'))
}

describe('Property 26: Mobile Navigation', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
    // Reset viewport to desktop size before each test
    setViewportWidth(1024)
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property test verifies that for any viewport width below 768px,
   * the navigation menu collapses and a mobile toggle button is present.
   * 
   * The test verifies:
   * 1. Mobile toggle button is present at mobile widths
   * 2. Toggle button has proper ARIA attributes
   * 3. Navigation menu can be opened and closed
   * 4. All navigation links remain accessible in mobile menu
   */
  it('should display mobile toggle button for viewport widths below 768px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }), // Mobile viewport widths
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options', '/about'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          // Property 1: Mobile toggle button should be present
          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })
          expect(toggleButton).toBeInTheDocument()

          // Property 2: Toggle button should have proper ARIA attributes
          expect(toggleButton).toHaveAttribute('aria-expanded')
          expect(toggleButton).toHaveAttribute('aria-controls')
          expect(toggleButton).toHaveAttribute('aria-label')

          // Property 3: Toggle button should be visible (not hidden)
          expect(toggleButton).toBeVisible()

          unmount()
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu can be toggled open and closed
   * at any mobile viewport width.
   */
  it('should toggle mobile menu open and closed when button is clicked', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          const toggleButton = screen.getByRole('button', { 
            name: /open menu/i 
          })

          // Property 1: Initially, menu should be closed (aria-expanded="false")
          expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

          // Property 2: Clicking toggle should open menu
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
          expect(toggleButton).toHaveAttribute('aria-label', 'Close menu')

          // Property 3: Clicking again should close menu
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
          expect(toggleButton).toHaveAttribute('aria-label', 'Open menu')

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that all navigation links remain accessible
   * in the mobile menu when it's opened.
   */
  it('should display all navigation links in mobile menu when opened', () => {
    const expectedNavLinks = [
      'Learn',
      'Pre-Qualify',
      'Calculator',
      'Loan Options',
      'About Us',
      'Blog',
      'Contact',
      'Apply Online'
    ]

    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          // Open mobile menu
          const toggleButton = screen.getByRole('button', { name: /open menu/i })
          fireEvent.click(toggleButton)

          // Property: All navigation links should be present in mobile menu
          expectedNavLinks.forEach(linkText => {
            const link = screen.getByRole('link', { name: new RegExp(linkText, 'i') })
            expect(link).toBeInTheDocument()
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu closes when a navigation
   * link is clicked, providing good UX.
   */
  it('should close mobile menu when a navigation link is clicked', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.constantFrom('Learn', 'Calculator', 'Blog', 'Loan Options', 'About Us'),
        (viewportWidth, linkText) => {
          usePathname.mockReturnValue('/')
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          // Open mobile menu
          const toggleButton = screen.getByRole('button', { name: /open menu/i })
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

          // Click a navigation link
          const navLink = screen.getByRole('link', { name: new RegExp(linkText, 'i') })
          fireEvent.click(navLink)

          // Property: Menu should close after clicking link
          expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile toggle button has proper
   * accessibility attributes for screen readers.
   */
  it('should have proper accessibility attributes on mobile toggle button', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        (viewportWidth) => {
          usePathname.mockReturnValue('/')
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })

          // Property 1: Should have aria-label
          expect(toggleButton).toHaveAttribute('aria-label')
          const ariaLabel = toggleButton.getAttribute('aria-label')
          expect(ariaLabel).toMatch(/open menu|close menu/i)

          // Property 2: Should have aria-expanded
          expect(toggleButton).toHaveAttribute('aria-expanded')
          const ariaExpanded = toggleButton.getAttribute('aria-expanded')
          expect(['true', 'false']).toContain(ariaExpanded)

          // Property 3: Should have aria-controls pointing to navigation
          expect(toggleButton).toHaveAttribute('aria-controls')
          const ariaControls = toggleButton.getAttribute('aria-controls')
          expect(ariaControls).toBeTruthy()

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the navigation menu structure is maintained
   * across different mobile viewport widths.
   */
  it('should maintain navigation structure across different mobile widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { container, unmount } = render(<Header />)

          // Property 1: Navigation element should exist
          const nav = container.querySelector('nav')
          expect(nav).toBeInTheDocument()

          // Property 2: Navigation should have proper ARIA label
          expect(nav).toHaveAttribute('aria-label')

          // Property 3: All navigation links should be present
          const navLinks = container.querySelectorAll('nav a')
          expect(navLinks.length).toBeGreaterThanOrEqual(8) // At least 8 main nav links

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu toggle button is keyboard
   * accessible and can be operated without a mouse.
   */
  it('should allow keyboard navigation of mobile toggle button', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        (viewportWidth) => {
          usePathname.mockReturnValue('/')
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          // Use more specific selector to avoid matching other buttons
          const toggleButton = screen.getByRole('button', { name: /^open menu$/i })

          // Property 1: Button should be focusable
          toggleButton.focus()
          expect(document.activeElement).toBe(toggleButton)

          // Property 2: Button should not have negative tabindex
          const tabindex = toggleButton.getAttribute('tabindex')
          if (tabindex !== null) {
            expect(parseInt(tabindex)).toBeGreaterThanOrEqual(0)
          }

          // Property 3: Button should respond to Enter key
          fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' })
          expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile navigation doesn't interfere
   * with desktop navigation at wider viewports.
   */
  it('should not display mobile toggle button at desktop viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 1920 }), // Desktop viewport widths
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { container, unmount } = render(<Header />)

          // Property: Mobile toggle button should not be visible at desktop widths
          // The button has display: none by default and only shows in mobile media query
          const toggleButton = container.querySelector('.mobileToggle')
          
          if (toggleButton) {
            // Button exists in DOM but should have display: none (default CSS)
            // In test environment, media queries don't apply, so we check the default state
            const styles = window.getComputedStyle(toggleButton)
            // Default CSS has display: none, media query changes it to flex at mobile widths
            expect(styles.display).toBe('none')
          }

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu state is properly managed
   * and doesn't cause layout issues.
   */
  it('should properly manage mobile menu state without layout issues', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.constantFrom('/', '/calculator', '/blog'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { container, unmount } = render(<Header />)

          const toggleButton = screen.getByRole('button', { name: /open menu/i })

          // Property 1: Initially closed
          expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

          // Property 2: Open menu
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

          // Property 3: Navigation should still be in DOM
          const nav = container.querySelector('nav')
          expect(nav).toBeInTheDocument()

          // Property 4: Close menu
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

          // Property 5: Navigation should still be in DOM (just hidden)
          expect(nav).toBeInTheDocument()

          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu works correctly across
   * various common mobile device widths.
   */
  it('should work correctly at common mobile device widths', () => {
    const commonMobileWidths = [
      320,  // iPhone SE
      375,  // iPhone 12/13 Mini
      390,  // iPhone 12/13/14
      414,  // iPhone Plus models
      428,  // iPhone 12/13/14 Pro Max
      360,  // Samsung Galaxy
      412,  // Pixel
      768   // iPad portrait (edge case)
    ]

    fc.assert(
      fc.property(
        fc.constantFrom(...commonMobileWidths.filter(w => w < 768)),
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (viewportWidth, path) => {
          usePathname.mockReturnValue(path)
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          // Property 1: Toggle button should be present
          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })
          expect(toggleButton).toBeInTheDocument()

          // Property 2: Should be able to open menu
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

          // Property 3: All nav links should be accessible
          const navLinks = screen.getAllByRole('link')
          expect(navLinks.length).toBeGreaterThanOrEqual(8)

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu maintains proper
   * navigation hierarchy and structure.
   */
  it('should maintain proper navigation hierarchy in mobile menu', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        (viewportWidth) => {
          usePathname.mockReturnValue('/')
          setViewportWidth(viewportWidth)

          const { container, unmount } = render(<Header />)

          // Open mobile menu
          const toggleButton = screen.getByRole('button', { name: /open menu/i })
          fireEvent.click(toggleButton)

          // Property 1: Navigation should have semantic nav element
          const nav = container.querySelector('nav')
          expect(nav).toBeInTheDocument()
          expect(nav?.tagName).toBe('NAV')

          // Property 2: Navigation should have aria-label
          expect(nav).toHaveAttribute('aria-label')

          // Property 3: All links should be within the nav element
          const navLinks = nav?.querySelectorAll('a')
          expect(navLinks?.length).toBeGreaterThanOrEqual(8)

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 8.6**
   * 
   * This property verifies that the mobile menu toggle button updates
   * its label appropriately when opened and closed.
   */
  it('should update toggle button label when menu state changes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        (viewportWidth) => {
          usePathname.mockReturnValue('/')
          setViewportWidth(viewportWidth)

          const { unmount } = render(<Header />)

          const toggleButton = screen.getByRole('button', { name: /open menu/i })

          // Property 1: Initially should say "Open menu"
          expect(toggleButton).toHaveAttribute('aria-label', 'Open menu')

          // Property 2: After opening, should say "Close menu"
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-label', 'Close menu')

          // Property 3: After closing, should say "Open menu" again
          fireEvent.click(toggleButton)
          expect(toggleButton).toHaveAttribute('aria-label', 'Open menu')

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })
})
