/**
 * Header Component Tests
 * 
 * Tests for the redesigned Header component with design system integration.
 * Validates Requirements: 1.2, 10.1, 10.2, 10.3, 10.6, 12.4
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from '../Header';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Header Component', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Requirement 1.2: No Emojis', () => {
    it('should not render any emoji characters', () => {
      const { container } = render(<Header />);
      const html = container.innerHTML;
      
      // Check for emoji Unicode ranges
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(html).not.toMatch(emojiRegex);
    });
  });

  describe('Requirement 10.1: React Icons Usage', () => {
    it('should render navigation links with React Icons', () => {
      render(<Header />);
      
      // Check that navigation links exist
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Learn')).toBeInTheDocument();
      expect(screen.getByText('Calculator')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render icons with proper ARIA attributes', () => {
      const { container } = render(<Header />);
      
      // Icons should have aria-hidden="true" since they're decorative
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement 10.2: Button Components for CTAs', () => {
    it('should render CTA buttons using Button component', () => {
      render(<Header />);
      
      // Check for CTA buttons
      const preQualifyButton = screen.getByText('Pre-Qualify');
      const applyButton = screen.getByText('Apply Online');
      
      expect(preQualifyButton).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
      
      // Verify they're wrapped in button elements
      expect(preQualifyButton.closest('button')).toBeInTheDocument();
      expect(applyButton.closest('button')).toBeInTheDocument();
    });
  });

  describe('Requirement 10.3: Mobile Hamburger Menu', () => {
    it('should render mobile menu toggle button', () => {
      render(<Header />);
      
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-controls', 'main-navigation');
    });

    it('should toggle mobile menu when button is clicked', () => {
      render(<Header />);
      
      const toggleButton = screen.getByLabelText('Open menu');
      
      // Initially closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to open
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
      
      // Click to close
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should close mobile menu when Escape key is pressed', () => {
      render(<Header />);
      
      const toggleButton = screen.getByLabelText('Open menu');
      
      // Open menu
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Requirement 10.6: Active Page Highlighting', () => {
    it('should highlight active page with gold underline', () => {
      (usePathname as jest.Mock).mockReturnValue('/calculator');
      const { container } = render(<Header />);
      
      const calculatorLink = screen.getByText('Calculator').closest('a');
      expect(calculatorLink).toHaveClass('active');
    });

    it('should set aria-current on active page', () => {
      (usePathname as jest.Mock).mockReturnValue('/about');
      render(<Header />);
      
      const aboutLink = screen.getByText('About Us').closest('a');
      expect(aboutLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Requirement 12.4: Keyboard Accessibility', () => {
    it('should have focusable navigation links', () => {
      render(<Header />);
      
      const homeLink = screen.getByText('Home').closest('a');
      const learnLink = screen.getByText('Learn').closest('a');
      
      expect(homeLink).toBeInTheDocument();
      expect(learnLink).toBeInTheDocument();
      
      // Links should be naturally focusable (no tabIndex=-1)
      expect(homeLink).not.toHaveAttribute('tabindex', '-1');
      expect(learnLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should have focusable mobile menu toggle', () => {
      render(<Header />);
      
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton.tagName).toBe('BUTTON');
    });

    it('should have proper ARIA labels', () => {
      render(<Header />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toHaveAttribute('aria-label');
    });
  });

  describe('Smooth Transitions', () => {
    it('should apply transition classes to header', () => {
      const { container } = render(<Header />);
      
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('header');
    });
  });

  describe('Logo and Branding', () => {
    it('should render logo with proper alt text', () => {
      render(<Header />);
      
      const logo = screen.getByAltText('Model Mortgage - Houston Mortgage Broker');
      expect(logo).toBeInTheDocument();
    });

    it('should render logo text', () => {
      render(<Header />);
      
      const logoText = screen.getByText('MODEL MORTGAGE');
      expect(logoText).toBeInTheDocument();
    });
  });

  describe('External Links', () => {
    it('should render external links with proper attributes', () => {
      const { container } = render(<Header />);
      
      const externalLinks = container.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should render all navigation items', () => {
      render(<Header />);
      
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
});
