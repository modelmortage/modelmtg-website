/**
 * Header and Footer Responsive Behavior Tests
 * 
 * Tests responsive behavior at all breakpoints for Header and Footer components.
 * Validates Requirements: 11.1, 11.2
 */

import { render, screen } from '@testing-library/react';
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

describe('Header and Footer Responsive Behavior', () => {
  // Helper function to set viewport width
  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  describe('Header Responsive Behavior', () => {
    it('should render correctly at mobile viewport (320px)', () => {
      setViewportWidth(320);
      const { container } = render(<Header />);
      
      // Header should be present
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // Mobile toggle button should be present
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();
      
      // Navigation should be present (even if hidden by CSS)
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should render correctly at tablet viewport (768px)', () => {
      setViewportWidth(768);
      const { container } = render(<Header />);
      
      // Header should be present
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // All navigation items should be present
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      expect(screen.getByText('Calculator')).toBeInTheDocument();
    });

    it('should render correctly at desktop viewport (1024px)', () => {
      setViewportWidth(1024);
      const { container } = render(<Header />);
      
      // Header should be present
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // All navigation items should be present
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      expect(screen.getByText('Calculator')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      
      // CTA buttons should be present
      expect(screen.getByText('Pre-Qualify')).toBeInTheDocument();
      expect(screen.getByText('Apply Online')).toBeInTheDocument();
    });

    it('should render correctly at wide viewport (1440px)', () => {
      setViewportWidth(1440);
      const { container } = render(<Header />);
      
      // Header should be present
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // All navigation items should be present
      const navItems = [
        'Home',
        'Learn',
        'Calculator',
        'Loan Options',
        'About Us',
        'Blog',
        'Contact',
      ];
      
      navItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe('Footer Responsive Behavior', () => {
    it('should render correctly at mobile viewport (320px)', () => {
      setViewportWidth(320);
      const { container } = render(<Footer />);
      
      // Footer should be present
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      // All sections should be present (even if stacked)
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
    });

    it('should render correctly at tablet viewport (768px)', () => {
      setViewportWidth(768);
      const { container } = render(<Footer />);
      
      // Footer should be present
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      // All link sections should be present
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
      
      // Social media links should be present
      expect(screen.getByLabelText('Follow us on Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Follow us on Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('Connect with us on LinkedIn')).toBeInTheDocument();
    });

    it('should render correctly at desktop viewport (1024px)', () => {
      setViewportWidth(1024);
      const { container } = render(<Footer />);
      
      // Footer should be present
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      // Grid layout should be present
      const linksGrid = container.querySelector('[class*="linksGrid"]');
      expect(linksGrid).toBeInTheDocument();
      
      // All sections should be present
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
    });

    it('should render correctly at wide viewport (1440px)', () => {
      setViewportWidth(1440);
      const { container } = render(<Footer />);
      
      // Footer should be present
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      // All sections should be present
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
      
      // Legal links should be present
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('NMLS Consumer Access')).toBeInTheDocument();
      expect(screen.getByText('ADA Accessibility')).toBeInTheDocument();
    });
  });

  describe('Breakpoint Transitions', () => {
    it('should handle viewport width changes without errors', () => {
      const { rerender } = render(<Header />);
      
      // Test transitions between breakpoints
      setViewportWidth(320);
      rerender(<Header />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      setViewportWidth(768);
      rerender(<Header />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      setViewportWidth(1024);
      rerender(<Header />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      setViewportWidth(1440);
      rerender(<Header />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle Footer viewport width changes without errors', () => {
      const { container, rerender } = render(<Footer />);
      
      // Test transitions between breakpoints
      setViewportWidth(320);
      rerender(<Footer />);
      expect(container.querySelector('footer')).toBeInTheDocument();
      
      setViewportWidth(768);
      rerender(<Footer />);
      expect(container.querySelector('footer')).toBeInTheDocument();
      
      setViewportWidth(1024);
      rerender(<Footer />);
      expect(container.querySelector('footer')).toBeInTheDocument();
      
      setViewportWidth(1440);
      rerender(<Footer />);
      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });

  describe('Content Consistency Across Breakpoints', () => {
    it('should render same navigation links at all breakpoints', () => {
      const breakpoints = [320, 768, 1024, 1440];
      const expectedLinks = [
        'Home',
        'Learn',
        'Calculator',
        'Loan Options',
        'About Us',
        'Blog',
        'Contact',
      ];
      
      breakpoints.forEach(width => {
        setViewportWidth(width);
        const { unmount } = render(<Header />);
        
        expectedLinks.forEach(link => {
          expect(screen.getByText(link)).toBeInTheDocument();
        });
        
        unmount();
      });
    });

    it('should render same footer sections at all breakpoints', () => {
      const breakpoints = [320, 768, 1024, 1440];
      const expectedSections = [
        'About Us',
        'Loan Options',
        'Resources',
        'Connect With Us',
      ];
      
      breakpoints.forEach(width => {
        setViewportWidth(width);
        const { unmount } = render(<Footer />);
        
        expectedSections.forEach(section => {
          expect(screen.getByText(section)).toBeInTheDocument();
        });
        
        unmount();
      });
    });
  });
});
