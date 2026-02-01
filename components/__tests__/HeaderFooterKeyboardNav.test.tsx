/**
 * Header and Footer Keyboard Navigation Tests
 * 
 * Tests keyboard navigation and accessibility for Header and Footer components.
 * Validates Requirements: 12.4, 12.5
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import Footer from '../Footer';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Header and Footer Keyboard Navigation', () => {
  describe('Header Keyboard Navigation', () => {
    it('should allow tabbing through all navigation links', () => {
      render(<Header />);
      
      // Get all navigation links
      const homeLink = screen.getByText('Home').closest('a');
      const learnLink = screen.getByText('Learn').closest('a');
      const calculatorLink = screen.getByText('Calculator').closest('a');
      
      // All links should be focusable
      expect(homeLink).toBeInTheDocument();
      expect(learnLink).toBeInTheDocument();
      expect(calculatorLink).toBeInTheDocument();
      
      // Links should not have negative tabindex
      expect(homeLink).not.toHaveAttribute('tabindex', '-1');
      expect(learnLink).not.toHaveAttribute('tabindex', '-1');
      expect(calculatorLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should show focus indicators on navigation links', () => {
      render(<Header />);
      
      const homeLink = screen.getByText('Home').closest('a');
      
      // Focus the link
      homeLink?.focus();
      
      // Link should be focused
      expect(homeLink).toHaveFocus();
    });

    it('should allow keyboard interaction with mobile menu toggle', () => {
      render(<Header />);
      
      const toggleButton = screen.getByLabelText('Open menu');
      
      // Button should be focusable
      toggleButton.focus();
      expect(toggleButton).toHaveFocus();
      
      // Should be able to activate with Enter key
      fireEvent.keyDown(toggleButton, { key: 'Enter' });
      
      // Should be able to activate with Space key
      fireEvent.keyDown(toggleButton, { key: ' ' });
    });

    it('should close mobile menu with Escape key', () => {
      render(<Header />);
      
      const toggleButton = screen.getByLabelText('Open menu');
      
      // Open menu
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Menu should be closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have proper tab order for CTA buttons', () => {
      render(<Header />);
      
      const preQualifyButton = screen.getByText('Pre-Qualify').closest('button');
      const applyButton = screen.getByText('Apply Online').closest('button');
      
      // Buttons should be focusable
      expect(preQualifyButton).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
      
      // Buttons should not have negative tabindex
      expect(preQualifyButton).not.toHaveAttribute('tabindex', '-1');
      expect(applyButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('should have accessible logo link', () => {
      render(<Header />);
      
      const logoLink = screen.getByAltText('Model Mortgage - Houston Mortgage Broker').closest('a');
      
      // Logo link should be focusable
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Footer Keyboard Navigation', () => {
    it('should allow tabbing through all footer links', () => {
      render(<Footer />);
      
      // Get some footer links
      const aboutLink = screen.getByText('Our Story').closest('a');
      const teamLink = screen.getByText('Meet Our Team').closest('a');
      const reviewsLink = screen.getByText('Client Reviews').closest('a');
      
      // All links should be focusable
      expect(aboutLink).toBeInTheDocument();
      expect(teamLink).toBeInTheDocument();
      expect(reviewsLink).toBeInTheDocument();
      
      // Links should not have negative tabindex
      expect(aboutLink).not.toHaveAttribute('tabindex', '-1');
      expect(teamLink).not.toHaveAttribute('tabindex', '-1');
      expect(reviewsLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should show focus indicators on footer links', () => {
      render(<Footer />);
      
      const aboutLink = screen.getByText('Our Story').closest('a');
      
      // Focus the link
      aboutLink?.focus();
      
      // Link should be focused
      expect(aboutLink).toHaveFocus();
    });

    it('should allow keyboard navigation to social media links', () => {
      render(<Footer />);
      
      const facebookLink = screen.getByLabelText('Follow us on Facebook');
      const instagramLink = screen.getByLabelText('Follow us on Instagram');
      const linkedinLink = screen.getByLabelText('Connect with us on LinkedIn');
      
      // All social links should be focusable
      expect(facebookLink).toBeInTheDocument();
      expect(instagramLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      
      // Links should not have negative tabindex
      expect(facebookLink).not.toHaveAttribute('tabindex', '-1');
      expect(instagramLink).not.toHaveAttribute('tabindex', '-1');
      expect(linkedinLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should allow keyboard navigation to contact links', () => {
      render(<Footer />);
      
      const phoneLink = screen.getByText('(832) 727-4128').closest('a');
      const emailLink = screen.getByText('info@modelmortgage.com').closest('a');
      
      // Contact links should be focusable
      expect(phoneLink).toBeInTheDocument();
      expect(emailLink).toBeInTheDocument();
      
      // Links should not have negative tabindex
      expect(phoneLink).not.toHaveAttribute('tabindex', '-1');
      expect(emailLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should allow keyboard navigation to legal links', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByText('Privacy Policy').closest('a');
      const nmlsLink = screen.getByText('NMLS Consumer Access').closest('a');
      const adaLink = screen.getByText('ADA Accessibility').closest('a');
      
      // Legal links should be focusable
      expect(privacyLink).toBeInTheDocument();
      expect(nmlsLink).toBeInTheDocument();
      expect(adaLink).toBeInTheDocument();
      
      // Links should not have negative tabindex
      expect(privacyLink).not.toHaveAttribute('tabindex', '-1');
      expect(nmlsLink).not.toHaveAttribute('tabindex', '-1');
      expect(adaLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should have accessible logo link', () => {
      render(<Footer />);
      
      const logo = screen.getByAltText('Model Mortgage - Houston Mortgage Broker');
      
      // Logo should be present and have proper alt text
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('alt', 'Model Mortgage - Houston Mortgage Broker');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus order in Header', () => {
      const { container } = render(<Header />);
      
      // Get all focusable elements
      const focusableElements = container.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      
      // Should have multiple focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // All focusable elements should not have negative tabindex
      focusableElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should maintain focus order in Footer', () => {
      const { container } = render(<Footer />);
      
      // Get all focusable elements
      const focusableElements = container.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      
      // Should have multiple focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // All focusable elements should not have negative tabindex
      focusableElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA attributes in Header', () => {
      render(<Header />);
      
      // Navigation should have aria-label
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      // Mobile toggle should have aria-expanded
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toHaveAttribute('aria-expanded');
      expect(toggleButton).toHaveAttribute('aria-controls', 'main-navigation');
    });

    it('should have proper ARIA attributes for social media links in Footer', () => {
      render(<Footer />);
      
      // Social media links should have aria-label
      const facebookLink = screen.getByLabelText('Follow us on Facebook');
      const instagramLink = screen.getByLabelText('Follow us on Instagram');
      const linkedinLink = screen.getByLabelText('Connect with us on LinkedIn');
      
      expect(facebookLink).toHaveAttribute('aria-label');
      expect(instagramLink).toHaveAttribute('aria-label');
      expect(linkedinLink).toHaveAttribute('aria-label');
    });

    it('should have proper ARIA attributes for icons', () => {
      const { container } = render(<Header />);
      
      // Decorative icons should have aria-hidden="true"
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Skip Links and Landmarks', () => {
    it('should have navigation landmark in Header', () => {
      render(<Header />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have contentinfo landmark in Footer', () => {
      render(<Footer />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });
});
