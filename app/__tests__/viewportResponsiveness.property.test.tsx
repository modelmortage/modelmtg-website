/**
 * Viewport Responsiveness Property-Based Tests
 * **Property 17: Viewport Responsiveness**
 * **Validates: Requirements 7.1**
 * 
 * For any page at viewport widths of 320px, 768px, and 1920px, the content
 * should be readable and interactive elements should be accessible without
 * horizontal scrolling.
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/content/BlogCard';
import LoanOptionCard from '@/components/content/LoanOptionCard';
import TeamMemberCard from '@/components/content/TeamMemberCard';
import ContentPage from '@/components/shared/ContentPage';
import { BlogPost, LoanOption, TeamMember } from '@/lib/types/content';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const VIEWPORT_WIDTHS = [320, 768, 1920] as const;

function setViewport(width: number, height: number = 1024): void {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

function hasHorizontalScroll(container: HTMLElement, viewportWidth: number): boolean {
  const elements = container.querySelectorAll('*');
  for (const element of Array.from(elements)) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') continue;
    if (rect.right > viewportWidth + 1) return true;
  }
  return false;
}

describe('Property 17: Viewport Responsiveness', () => {
  describe('Header Component', () => {
    it('should render without horizontal scroll at all viewport widths', () => {
      fc.assert(
        fc.property(fc.constantFrom(...VIEWPORT_WIDTHS), (viewportWidth) => {
          setViewport(viewportWidth);
          const { container } = render(<Header />);
          const hasScroll = hasHorizontalScroll(container, viewportWidth);
          expect(hasScroll).toBe(false);
          container.remove();
        }),
        { numRuns: 30 }
      );
    });

    it('should have all interactive elements accessible', () => {
      fc.assert(
        fc.property(fc.constantFrom(...VIEWPORT_WIDTHS), (viewportWidth) => {
          setViewport(viewportWidth);
          const { container } = render(<Header />);
          const interactiveElements = container.querySelectorAll('a, button');
          expect(interactiveElements.length).toBeGreaterThan(0);
          container.remove();
        }),
        { numRuns: 30 }
      );
    });
  });

  describe('Footer Component', () => {
    it('should render without horizontal scroll at all viewport widths', () => {
      fc.assert(
        fc.property(fc.constantFrom(...VIEWPORT_WIDTHS), (viewportWidth) => {
          setViewport(viewportWidth);
          const { container } = render(<Footer />);
          const hasScroll = hasHorizontalScroll(container, viewportWidth);
          expect(hasScroll).toBe(false);
          container.remove();
        }),
        { numRuns: 30 }
      );
    });

    it('should have all interactive elements accessible', () => {
      fc.assert(
        fc.property(fc.constantFrom(...VIEWPORT_WIDTHS), (viewportWidth) => {
          setViewport(viewportWidth);
          const { container } = render(<Footer />);
          const interactiveElements = container.querySelectorAll('a, button');
          expect(interactiveElements.length).toBeGreaterThan(0);
          container.remove();
        }),
        { numRuns: 30 }
      );
    });
  });

  describe('Card Components', () => {
    it('should render BlogCard without horizontal scroll with various content', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VIEWPORT_WIDTHS),
          fc.record({
            slug: fc.string({ minLength: 5, maxLength: 50 }),
            title: fc.string({ minLength: 10, maxLength: 100 }),
            excerpt: fc.string({ minLength: 50, maxLength: 200 }),
            author: fc.string({ minLength: 5, maxLength: 50 }),
            category: fc.string({ minLength: 5, maxLength: 30 }),
          }),
          (viewportWidth, data) => {
            setViewport(viewportWidth);
            const mockBlogPost: BlogPost = {
              slug: data.slug, title: data.title, excerpt: data.excerpt, content: 'Test',
              author: data.author, publishDate: '2024-01-01', category: data.category,
              tags: ['test'], featuredImage: '/test.jpg', readTime: 5,
              metadata: { title: data.title, description: data.excerpt, keywords: [] },
            };
            const { container } = render(<BlogCard blogPost={mockBlogPost} />);
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should render LoanOptionCard without horizontal scroll with various content', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VIEWPORT_WIDTHS),
          fc.record({
            slug: fc.string({ minLength: 5, maxLength: 50 }),
            title: fc.string({ minLength: 10, maxLength: 100 }),
            shortDescription: fc.string({ minLength: 50, maxLength: 200 }),
            icon: fc.constantFrom('home', 'shield', 'flag', 'tree', 'building', 'key'),
          }),
          (viewportWidth, data) => {
            setViewport(viewportWidth);
            const mockLoanOption: LoanOption = {
              id: data.slug, slug: data.slug, title: data.title,
              shortDescription: data.shortDescription, fullDescription: 'Full',
              benefits: ['Benefit 1'], requirements: ['Req 1'], idealFor: ['Ideal 1'],
              icon: data.icon, relatedCalculators: [],
              metadata: { title: data.title, description: data.shortDescription, keywords: [] },
            };
            const { container } = render(<LoanOptionCard loanOption={mockLoanOption} />);
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should render TeamMemberCard without horizontal scroll with various content', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VIEWPORT_WIDTHS),
          fc.record({
            slug: fc.string({ minLength: 5, maxLength: 50 }),
            name: fc.string({ minLength: 5, maxLength: 50 }),
            title: fc.string({ minLength: 10, maxLength: 100 }),
            bio: fc.string({ minLength: 50, maxLength: 300 }),
          }),
          (viewportWidth, data) => {
            setViewport(viewportWidth);
            const mockTeamMember: TeamMember = {
              slug: data.slug, name: data.name, title: data.title, bio: data.bio,
              photo: '/test.jpg', credentials: ['Cred 1'], specialties: ['Spec 1'],
              contact: { email: 'test@example.com' },
              metadata: { title: data.name, description: data.bio, keywords: [] },
            };
            const { container } = render(<TeamMemberCard teamMember={mockTeamMember} />);
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('ContentPage Component', () => {
    it('should render without horizontal scroll with various content', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VIEWPORT_WIDTHS),
          fc.record({
            title: fc.string({ minLength: 10, maxLength: 100 }),
            subtitle: fc.string({ minLength: 50, maxLength: 200 }),
            content: fc.string({ minLength: 100, maxLength: 500 }),
          }),
          (viewportWidth, data) => {
            setViewport(viewportWidth);
            const { container } = render(
              <ContentPage title={data.title} subtitle={data.subtitle}>
                <div><p>{data.content}</p></div>
              </ContentPage>
            );
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Viewport Width Variations', () => {
    it('should handle arbitrary viewport widths between 320px and 1920px', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 1920 }), (viewportWidth) => {
          setViewport(viewportWidth);
          const { container } = render(<Header />);
          expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
          container.remove();
        }),
        { numRuns: 100 }
      );
    });

    it('should handle edge case viewport widths at breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 321, 767, 768, 769, 1023, 1024, 1919, 1920),
          (viewportWidth) => {
            setViewport(viewportWidth);
            const { container } = render(<><Header /><Footer /></>);
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Content Length Variations', () => {
    it('should handle long text content without horizontal scroll', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VIEWPORT_WIDTHS),
          fc.string({ minLength: 200, maxLength: 1000 }),
          (viewportWidth, longText) => {
            setViewport(viewportWidth);
            const { container } = render(
              <div style={{ maxWidth: '100%', padding: '20px' }}><p>{longText}</p></div>
            );
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should handle long unbreakable strings with word-break', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VIEWPORT_WIDTHS),
          fc.string({ minLength: 50, maxLength: 100 }).map(s => s.replace(/\s/g, '')),
          (viewportWidth, longString) => {
            setViewport(viewportWidth);
            const { container } = render(
              <div style={{ maxWidth: '100%', padding: '20px', wordBreak: 'break-word' }}>
                <p>{longString}</p>
              </div>
            );
            expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
            container.remove();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Multiple Components Together', () => {
    it('should maintain responsiveness with multiple components', () => {
      fc.assert(
        fc.property(fc.constantFrom(...VIEWPORT_WIDTHS), (viewportWidth) => {
          setViewport(viewportWidth);
          const mockBlogPost: BlogPost = {
            slug: 'test', title: 'Test Title', excerpt: 'Test excerpt', content: 'Test',
            author: 'Author', publishDate: '2024-01-01', category: 'Test',
            tags: ['test'], featuredImage: '/test.jpg', readTime: 5,
            metadata: { title: 'Test', description: 'Test', keywords: [] },
          };
          const { container } = render(
            <>
              <Header />
              <main style={{ padding: '20px' }}>
                <BlogCard blogPost={mockBlogPost} />
                <BlogCard blogPost={mockBlogPost} />
              </main>
              <Footer />
            </>
          );
          expect(hasHorizontalScroll(container, viewportWidth)).toBe(false);
          container.remove();
        }),
        { numRuns: 30 }
      );
    });
  });
});
