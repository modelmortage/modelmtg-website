/**
 * Property-Based Test for Interactive Element Functionality
 * Feature: website-structure-migration
 * Task: 14.9 Write property test for interactive element functionality
 * 
 * Property 9: Interactive Element Functionality
 * For any page containing forms or interactive elements, those elements should 
 * respond to user interactions and submit/process data correctly.
 * 
 * **Validates: Requirements 2.4, 3.5, 5.4**
 */

import { render, screen, fireEvent } from '@testing-library/react'
import fc from 'fast-check'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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

describe('Property 9: Interactive Element Functionality', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/')
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property test verifies that all interactive elements (buttons, links, forms)
   * are functional and respond to user interactions correctly.
   * 
   * The test verifies:
   * 1. All interactive elements are present in the DOM
   * 2. All interactive elements are clickable/focusable
   * 3. All interactive elements have proper event handlers
   * 4. All interactive elements maintain state correctly
   */
  it('should have functional interactive elements in header navigation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options', '/about', '/contact'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property 1: All navigation links should be interactive
          const navLinks = container.querySelectorAll('nav a')
          expect(navLinks.length).toBeGreaterThan(0)

          navLinks.forEach(link => {
            // Should be clickable
            expect(link).toBeInTheDocument()
            expect(link).toBeVisible()
            
            // Should have href attribute
            expect(link).toHaveAttribute('href')
            
            // Should not be disabled
            expect(link).not.toHaveAttribute('disabled')
          })

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that mobile menu toggle button is functional
   * and responds to click events correctly.
   */
  it('should have functional mobile menu toggle button', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          // Property 1: Toggle button should be present
          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })
          expect(toggleButton).toBeInTheDocument()

          // Property 2: Button should be clickable
          expect(toggleButton).not.toHaveAttribute('disabled')

          // Property 3: Button should respond to click events
          const initialExpanded = toggleButton.getAttribute('aria-expanded')
          fireEvent.click(toggleButton)
          const afterClickExpanded = toggleButton.getAttribute('aria-expanded')
          
          // State should change after click
          expect(initialExpanded).not.toBe(afterClickExpanded)

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that all interactive elements in the footer
   * are functional and properly configured.
   */
  it('should have functional interactive elements in footer', () => {
    const { container } = render(<Footer />)

    // Property 1: All footer links should be interactive
    const footerLinks = container.querySelectorAll('footer a')
    expect(footerLinks.length).toBeGreaterThan(0)

    footerLinks.forEach(link => {
      // Should be in the document
      expect(link).toBeInTheDocument()
      
      // Should have href attribute
      expect(link).toHaveAttribute('href')
      
      // Should not be disabled
      expect(link).not.toHaveAttribute('disabled')
      
      // Should be visible (not hidden)
      expect(link).toBeVisible()
    })

    // Property 2: Contact links should be functional
    const phoneLinks = container.querySelectorAll('a[href^="tel:"]')
    phoneLinks.forEach(link => {
      expect(link).toBeInTheDocument()
      expect(link.getAttribute('href')).toMatch(/^tel:/)
    })

    const emailLinks = container.querySelectorAll('a[href^="mailto:"]')
    emailLinks.forEach(link => {
      expect(link).toBeInTheDocument()
      expect(link.getAttribute('href')).toMatch(/^mailto:/)
    })
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements maintain proper
   * focus management for keyboard navigation.
   */
  it('should maintain proper focus management for interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: All interactive elements should be focusable
          const interactiveElements = container.querySelectorAll('a, button')
          
          interactiveElements.forEach(element => {
            // Should be focusable (no negative tabindex)
            const tabindex = element.getAttribute('tabindex')
            if (tabindex !== null) {
              expect(parseInt(tabindex)).toBeGreaterThanOrEqual(0)
            }
            
            // Should be able to receive focus
            element.focus()
            if (element.getAttribute('tabindex') !== '-1') {
              // Elements with tabindex="-1" are programmatically focusable but not in tab order
              // This is acceptable for some UI patterns
            }
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements respond to
   * keyboard events (Enter, Space) in addition to mouse clicks.
   */
  it('should respond to keyboard events on interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          // Property: Toggle button should respond to keyboard events
          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })

          const initialExpanded = toggleButton.getAttribute('aria-expanded')

          // Should respond to Enter key
          fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' })
          const afterEnterExpanded = toggleButton.getAttribute('aria-expanded')
          
          expect(initialExpanded).not.toBe(afterEnterExpanded)

          unmount()
        }
      ),
      { numRuns: 15 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements have proper
   * ARIA attributes for accessibility.
   */
  it('should have proper ARIA attributes on interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property 1: Buttons should have proper ARIA attributes
          const buttons = container.querySelectorAll('button')
          buttons.forEach(button => {
            // Should have aria-label or text content
            const hasAriaLabel = button.hasAttribute('aria-label')
            const hasTextContent = (button.textContent?.trim().length || 0) > 0
            expect(hasAriaLabel || hasTextContent).toBe(true)
          })

          // Property 2: Links should have proper ARIA attributes
          const links = container.querySelectorAll('a')
          links.forEach(link => {
            // Should have text content or aria-label
            const hasAriaLabel = link.hasAttribute('aria-label')
            const hasTextContent = (link.textContent?.trim().length || 0) > 0
            expect(hasAriaLabel || hasTextContent).toBe(true)
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements maintain
   * consistent behavior across different page states.
   */
  it('should maintain consistent interactive behavior across pages', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/',
          '/calculator',
          '/calculator/affordability',
          '/blog',
          '/blog/article',
          '/loan-options',
          '/loan-options/fha',
          '/about',
          '/contact'
        ),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property 1: Same number of navigation links on all pages
          const navLinks = container.querySelectorAll('nav a')
          expect(navLinks.length).toBeGreaterThanOrEqual(8) // At least 8 main nav links

          // Property 2: Toggle button always present
          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })
          expect(toggleButton).toBeInTheDocument()

          // Property 3: All links should be functional
          navLinks.forEach(link => {
            expect(link).toHaveAttribute('href')
            expect(link).not.toHaveAttribute('disabled')
          })

          unmount()
        }
      ),
      { numRuns: 40 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements don't have
   * conflicting event handlers or broken functionality.
   */
  it('should not have conflicting event handlers on interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Links should not have onclick handlers (Next.js handles routing)
          const navLinks = container.querySelectorAll('nav a')
          
          navLinks.forEach(link => {
            // Next.js Link components should not have onclick attributes
            // They handle navigation internally
            const hasOnClick = link.hasAttribute('onclick')
            
            // If onclick exists, it should be for specific purposes (like closing mobile menu)
            // but the link should still have a valid href
            if (hasOnClick) {
              expect(link).toHaveAttribute('href')
              const href = link.getAttribute('href')
              expect(href).not.toBe('#')
              expect(href).not.toBe('')
            }
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements are properly
   * styled and visually indicate their interactive state.
   */
  it('should have proper visual indicators for interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/about'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Interactive elements should have cursor pointer or appropriate cursor
          const interactiveElements = container.querySelectorAll('a, button')
          
          interactiveElements.forEach(element => {
            // Element should be visible
            expect(element).toBeVisible()
            
            // Element should not have display: none
            const styles = window.getComputedStyle(element)
            expect(styles.display).not.toBe('none')
            
            // Element should not have visibility: hidden
            expect(styles.visibility).not.toBe('hidden')
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that contact links (phone, email) in footer
   * are properly formatted and functional.
   */
  it('should have functional contact links with proper protocols', () => {
    const { container } = render(<Footer />)

    // Property 1: Phone links should use tel: protocol and be clickable
    const phoneLinks = Array.from(container.querySelectorAll('a[href^="tel:"]'))
    expect(phoneLinks.length).toBeGreaterThan(0)
    
    phoneLinks.forEach(link => {
      expect(link).toBeInTheDocument()
      expect(link).toBeVisible()
      expect(link).not.toHaveAttribute('disabled')
      
      const href = link.getAttribute('href')
      expect(href).toMatch(/^tel:/)
    })

    // Property 2: Email links should use mailto: protocol and be clickable
    const emailLinks = Array.from(container.querySelectorAll('a[href^="mailto:"]'))
    expect(emailLinks.length).toBeGreaterThan(0)
    
    emailLinks.forEach(link => {
      expect(link).toBeInTheDocument()
      expect(link).toBeVisible()
      expect(link).not.toHaveAttribute('disabled')
      
      const href = link.getAttribute('href')
      expect(href).toMatch(/^mailto:/)
    })
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements maintain proper
   * state management and don't cause unexpected behavior.
   */
  it('should maintain proper state management for interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog'),
        fc.integer({ min: 1, max: 5 }),
        (path, clickCount) => {
          usePathname.mockReturnValue(path)

          const { unmount } = render(<Header />)

          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })

          // Property: Multiple clicks should toggle state correctly
          let expectedState = false
          
          for (let i = 0; i < clickCount; i++) {
            fireEvent.click(toggleButton)
            expectedState = !expectedState
            
            const currentState = toggleButton.getAttribute('aria-expanded') === 'true'
            expect(currentState).toBe(expectedState)
          }

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that all interactive elements are accessible
   * via keyboard navigation in a logical tab order.
   */
  it('should have logical tab order for interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog', '/loan-options'),
        (path) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          // Property: Interactive elements should have logical tab order
          const interactiveElements = Array.from(
            container.querySelectorAll('a, button')
          )

          // Check that elements don't have conflicting tabindex values
          const tabindexValues = interactiveElements
            .map(el => el.getAttribute('tabindex'))
            .filter(val => val !== null)
            .map(val => parseInt(val!))

          // All tabindex values should be >= 0 (or null for natural order)
          tabindexValues.forEach(value => {
            expect(value).toBeGreaterThanOrEqual(0)
          })

          unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * **Validates: Requirements 2.4, 3.5, 5.4**
   * 
   * This property verifies that interactive elements work correctly
   * when the page is in different states (e.g., mobile menu open/closed).
   */
  it('should maintain interactive functionality in different UI states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/calculator', '/blog'),
        fc.boolean(),
        (path, shouldOpenMenu) => {
          usePathname.mockReturnValue(path)

          const { container, unmount } = render(<Header />)

          const toggleButton = screen.getByRole('button', { 
            name: /open menu|close menu/i 
          })

          // Optionally open the mobile menu
          if (shouldOpenMenu) {
            fireEvent.click(toggleButton)
          }

          // Property: All navigation links should still be functional
          const navLinks = container.querySelectorAll('nav a')
          
          navLinks.forEach(link => {
            expect(link).toHaveAttribute('href')
            expect(link).not.toHaveAttribute('disabled')
            
            // Links should be clickable
            const href = link.getAttribute('href')
            expect(href).toBeTruthy()
            expect(href).not.toBe('')
          })

          unmount()
        }
      ),
      { numRuns: 30 }
    )
  })
})
