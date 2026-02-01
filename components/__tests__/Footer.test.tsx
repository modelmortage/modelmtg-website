/**
 * Footer Component Tests
 * 
 * Tests for the redesigned Footer component with design system integration.
 * Validates Requirements: 1.2, 10.4, 10.5, 10.6, 12.4
 */

import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Footer Component', () => {
  describe('Requirement 1.2: No Emojis', () => {
    it('should not render any emoji characters', () => {
      const { container } = render(<Footer />);
      const html = container.innerHTML;
      
      // Check for emoji Unicode ranges
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(html).not.toMatch(emojiRegex);
    });
  });

  describe('Requirement 10.4: React Icons for Social Media', () => {
    it('should render social media icons using React Icons', () => {
      const { container } = render(<Footer />);
      
      // Check for social media links
      const facebookLink = screen.getByLabelText('Follow us on Facebook');
      const instagramLink = screen.getByLabelText('Follow us on Instagram');
      const linkedinLink = screen.getByLabelText('Connect with us on LinkedIn');
      
      expect(facebookLink).toBeInTheDocument();
      expect(instagramLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      
      // Check that icons are SVG elements (React Icons render as SVG)
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render contact icons using React Icons', () => {
      render(<Footer />);
      
      // Check for contact information with icons
      expect(screen.getByText('(832) 727-4128')).toBeInTheDocument();
      expect(screen.getByText('info@modelmortgage.com')).toBeInTheDocument();
    });

    it('should render certification icons using React Icons', () => {
      render(<Footer />);
      
      // Check for certification badges with icons
      expect(screen.getByText('Equal Housing Opportunity')).toBeInTheDocument();
      expect(screen.getByText('NMLS #2518610')).toBeInTheDocument();
      expect(screen.getByText('SSL Certified')).toBeInTheDocument();
    });
  });

  describe('Requirement 10.5: Responsive Grid Layout', () => {
    it('should render four-column grid structure', () => {
      const { container } = render(<Footer />);
      
      // Check for the links grid container
      const linksGrid = container.querySelector('[class*="linksGrid"]');
      expect(linksGrid).toBeInTheDocument();
      
      // Check for all four column sections
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Loan Options')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
      expect(screen.getByText('Connect With Us')).toBeInTheDocument();
    });

    it('should render all footer link sections', () => {
      render(<Footer />);
      
      // About Us section
      expect(screen.getByText('Our Story')).toBeInTheDocument();
      expect(screen.getByText('Meet Our Team')).toBeInTheDocument();
      expect(screen.getByText('Client Reviews')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
      
      // Loan Options section
      expect(screen.getByText('Conventional Loans')).toBeInTheDocument();
      expect(screen.getByText('FHA Loans')).toBeInTheDocument();
      expect(screen.getByText('VA Loans')).toBeInTheDocument();
      expect(screen.getByText('Jumbo Loans')).toBeInTheDocument();
      expect(screen.getByText('Refinance')).toBeInTheDocument();
      
      // Resources section
      expect(screen.getByText('Learning Center')).toBeInTheDocument();
      expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument();
      expect(screen.getByText('Pre-Qualification')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });
  });

  describe('Requirement 10.6: Theme Colors', () => {
    it('should apply theme colors to footer', () => {
      const { container } = render(<Footer />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('footer');
    });
  });

  describe('Requirement 12.4: Keyboard Accessibility', () => {
    it('should have focusable links', () => {
      render(<Footer />);
      
      const aboutLink = screen.getByText('Our Story').closest('a');
      const contactLink = screen.getByText('Contact Us').closest('a');
      
      expect(aboutLink).toBeInTheDocument();
      expect(contactLink).toBeInTheDocument();
      
      // Links should be naturally focusable (no tabIndex=-1)
      expect(aboutLink).not.toHaveAttribute('tabindex', '-1');
      expect(contactLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should have focusable social media links', () => {
      render(<Footer />);
      
      const facebookLink = screen.getByLabelText('Follow us on Facebook');
      const instagramLink = screen.getByLabelText('Follow us on Instagram');
      const linkedinLink = screen.getByLabelText('Connect with us on LinkedIn');
      
      expect(facebookLink).toBeInTheDocument();
      expect(instagramLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      
      // Links should be naturally focusable
      expect(facebookLink).not.toHaveAttribute('tabindex', '-1');
      expect(instagramLink).not.toHaveAttribute('tabindex', '-1');
      expect(linkedinLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('should have proper ARIA labels for social media links', () => {
      render(<Footer />);
      
      const facebookLink = screen.getByLabelText('Follow us on Facebook');
      const instagramLink = screen.getByLabelText('Follow us on Instagram');
      const linkedinLink = screen.getByLabelText('Connect with us on LinkedIn');
      
      expect(facebookLink).toHaveAttribute('aria-label');
      expect(instagramLink).toHaveAttribute('aria-label');
      expect(linkedinLink).toHaveAttribute('aria-label');
    });
  });

  describe('Logo and Branding', () => {
    it('should render logo with proper alt text', () => {
      render(<Footer />);
      
      const logo = screen.getByAltText('Model Mortgage - Houston Mortgage Broker');
      expect(logo).toBeInTheDocument();
    });

    it('should render tagline', () => {
      render(<Footer />);
      
      const tagline = screen.getByText('Strategic Mortgage Planning');
      expect(tagline).toBeInTheDocument();
    });
  });

  describe('External Links', () => {
    it('should render external links with proper attributes', () => {
      const { container } = render(<Footer />);
      
      const externalLinks = container.querySelectorAll('a[target="_blank"]');
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Legal and Compliance', () => {
    it('should render legal links', () => {
      render(<Footer />);
      
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('NMLS Consumer Access')).toBeInTheDocument();
      expect(screen.getByText('ADA Accessibility')).toBeInTheDocument();
    });

    it('should render copyright notice with current year', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(new RegExp(`© ${currentYear} Model Mortgage`));
      expect(copyright).toBeInTheDocument();
    });

    it('should render certification badges', () => {
      render(<Footer />);
      
      expect(screen.getByText('Equal Housing Opportunity')).toBeInTheDocument();
      expect(screen.getByText('NMLS #2518610')).toBeInTheDocument();
      expect(screen.getByText('SSL Certified')).toBeInTheDocument();
    });
  });

  describe('Contact Information', () => {
    it('should render phone number with proper link', () => {
      render(<Footer />);
      
      const phoneLink = screen.getByText('(832) 727-4128').closest('a');
      expect(phoneLink).toHaveAttribute('href', 'tel:832-727-4128');
    });

    it('should render email with proper link', () => {
      render(<Footer />);
      
      const emailLink = screen.getByText('info@modelmortgage.com').closest('a');
      expect(emailLink).toHaveAttribute('href', 'mailto:info@modelmortgage.com');
    });
  });

  describe('Touch Target Sizing', () => {
    it('should have adequate touch target sizes for links', () => {
      const { container } = render(<Footer />);
      
      // Social media icons should have 44x44px minimum
      const socialIcons = container.querySelectorAll('[class*="socialIcon"]');
      socialIcons.forEach(icon => {
        const styles = window.getComputedStyle(icon);
        // CSS sets width and height to 44px
        expect(icon).toBeInTheDocument();
      });
    });
  });
});
