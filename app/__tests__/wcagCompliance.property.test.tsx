/**
 * WCAG Compliance Property-Based Tests
 * 
 * **Property 19: WCAG Compliance**
 * For any page, automated accessibility testing should report zero violations
 * of WCAG 2.1 AA standards.
 * 
 * **Validates: Requirements 7.3**
 * 
 * Feature: website-structure-migration, Property 19: WCAG Compliance
 */

import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import fc from 'fast-check'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentPage from '@/components/shared/ContentPage'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import BlogCard from '@/components/content/BlogCard'
import LoanOptionCard from '@/components/content/LoanOptionCard'
import TeamMemberCard from '@/components/content/TeamMemberCard'
import { BlogPost, LoanOption, TeamMember } from '@/lib/types/content'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Property 19: WCAG Compliance - Requirements 7.3', () => {
  /**
   * Property: For any page, automated accessibility testing should report
   * zero violations of WCAG 2.1 AA standards
   */

  describe('Core navigation components', () => {
    it('should have no WCAG violations in Header component', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const { container } = render(<Header />)
          const results = await axe(container, {
            rules: {
              // WCAG 2.1 AA rules
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false }, // Not applicable to component tests
              'html-has-lang': { enabled: false }, // Not applicable to component tests
              'landmark-no-duplicate-banner': { enabled: false }, // Component may be rendered multiple times
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 5 }
      )
    }, 15000)

    it('should have no WCAG violations in Footer component', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const { container } = render(<Footer />)
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 5 }
      )
    }, 15000)

    it('should have no WCAG violations in Breadcrumbs component', async () => {
      const breadcrumbArbitrary = fc.array(
        fc.record({
          label: fc.string({ minLength: 3, maxLength: 30 }),
          href: fc.constantFrom('/about', '/blog', '/loan-options', '/calculator'),
        }),
        { minLength: 1, maxLength: 4 }
      )

      await fc.assert(
        fc.asyncProperty(breadcrumbArbitrary, async (items) => {
          const { container } = render(<Breadcrumbs items={items} />)
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 10 }
      )
    }, 15000)
  })

  describe('Content page components', () => {
    it('should have no WCAG violations in ContentPage component', async () => {
      const contentPageArbitrary = fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length >= 10),
        subtitle: fc.string({ minLength: 20, maxLength: 200 }).filter(s => s.trim().length >= 20),
      })

      await fc.assert(
        fc.asyncProperty(contentPageArbitrary, async (props) => {
          const { container } = render(
            <ContentPage
              title={props.title}
              subtitle={props.subtitle}
              cta={{
                title: 'Get Started',
                description: 'Contact us today',
                buttonText: 'Schedule Call',
                buttonHref: '/schedule-a-call',
              }}
            >
              <div>
                <h2>Test Section</h2>
                <p>Test content paragraph with sufficient length for testing.</p>
              </div>
            </ContentPage>
          )
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-no-duplicate-main': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 10 }
      )
    }, 30000)
  })

  describe('Card components', () => {
    const blogPostArbitrary = fc.record({
      slug: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      title: fc.string({ minLength: 10, maxLength: 100 }),
      excerpt: fc.string({ minLength: 20, maxLength: 200 }),
      content: fc.string({ minLength: 50, maxLength: 500 }),
      author: fc.string({ minLength: 5, maxLength: 50 }),
      publishDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
        .map(d => d.toISOString().split('T')[0]),
      category: fc.constantFrom('Home Buying', 'Refinancing', 'Investment'),
      tags: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
      featuredImage: fc.constant('/test-image.jpg'),
      readTime: fc.integer({ min: 1, max: 20 }),
      metadata: fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        description: fc.string({ minLength: 20, maxLength: 160 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
      }),
    })

    it('should have no WCAG violations in BlogCard component', async () => {
      await fc.assert(
        fc.asyncProperty(blogPostArbitrary, async (blogPost) => {
          const { container } = render(<BlogCard blogPost={blogPost as BlogPost} />)
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 15 }
      )
    }, 30000)

    const loanOptionArbitrary = fc.record({
      id: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      slug: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      title: fc.string({ minLength: 10, maxLength: 100 }),
      shortDescription: fc.string({ minLength: 20, maxLength: 200 }),
      fullDescription: fc.string({ minLength: 50, maxLength: 500 }),
      benefits: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      requirements: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      idealFor: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
      icon: fc.constantFrom('home', 'shield', 'flag', 'tree', 'building'),
      relatedCalculators: fc.array(fc.string({ minLength: 5, maxLength: 20 }), { maxLength: 3 }),
      metadata: fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        description: fc.string({ minLength: 20, maxLength: 160 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
      }),
    })

    it('should have no WCAG violations in LoanOptionCard component', async () => {
      await fc.assert(
        fc.asyncProperty(loanOptionArbitrary, async (loanOption) => {
          const { container } = render(<LoanOptionCard loanOption={loanOption as LoanOption} />)
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 15 }
      )
    }, 30000)

    const teamMemberArbitrary = fc.record({
      slug: fc.array(fc.constantFrom('a', 'b', 'c', '-'), { minLength: 5, maxLength: 20 }).map(arr => arr.join('')),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      title: fc.string({ minLength: 10, maxLength: 100 }),
      bio: fc.string({ minLength: 50, maxLength: 500 }),
      photo: fc.constant('/test-photo.jpg'),
      credentials: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
      specialties: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
      contact: fc.record({
        email: fc.option(fc.emailAddress(), { nil: undefined }),
        phone: fc.option(fc.constant('555-1234'), { nil: undefined }),
        calendly: fc.option(fc.constant('https://calendly.com/test'), { nil: undefined }),
      }),
      metadata: fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        description: fc.string({ minLength: 20, maxLength: 160 }),
        keywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
      }),
    })

    it('should have no WCAG violations in TeamMemberCard component', async () => {
      await fc.assert(
        fc.asyncProperty(teamMemberArbitrary, async (teamMember) => {
          const { container } = render(<TeamMemberCard teamMember={teamMember as TeamMember} />)
          const results = await axe(container, {
            rules: {
              'color-contrast': { enabled: true },
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'landmark-one-main': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 15 }
      )
    }, 30000)
  })

  describe('Comprehensive WCAG 2.1 AA rule coverage', () => {
    it('should verify all critical WCAG 2.1 AA rules on Header', async () => {
      const { container } = render(<Header />)
      
      // Test with comprehensive WCAG 2.1 AA ruleset
      const results = await axe(container, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: {
          'valid-lang': { enabled: false },
          'html-has-lang': { enabled: false },
          'landmark-one-main': { enabled: false },
          'landmark-no-duplicate-banner': { enabled: false },
          'landmark-no-duplicate-contentinfo': { enabled: false },
          'page-has-heading-one': { enabled: false },
          'region': { enabled: false },
        },
      })
      
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should verify all critical WCAG 2.1 AA rules on Footer', async () => {
      const { container } = render(<Footer />)
      
      const results = await axe(container, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: {
          'valid-lang': { enabled: false },
          'html-has-lang': { enabled: false },
          'landmark-one-main': { enabled: false },
          'landmark-no-duplicate-banner': { enabled: false },
          'landmark-no-duplicate-contentinfo': { enabled: false },
          'page-has-heading-one': { enabled: false },
          'region': { enabled: false },
        },
      })
      
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should verify keyboard accessibility rules', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const { container } = render(<Header />)
          
          const results = await axe(container, {
            runOnly: {
              type: 'rule',
              values: [
                'button-name',
                'link-name',
                'tabindex',
                'focus-order-semantics',
              ],
            },
            rules: {
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
            },
          })
          
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 5 }
      )
    }, 15000)

    it('should verify ARIA rules', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const { container } = render(<Footer />)
          
          const results = await axe(container, {
            runOnly: {
              type: 'rule',
              values: [
                'aria-allowed-attr',
                'aria-required-attr',
                'aria-valid-attr',
                'aria-valid-attr-value',
                'aria-roles',
              ],
            },
            rules: {
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
            },
          })
          
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 5 }
      )
    }, 15000)

    it('should verify semantic HTML rules', async () => {
      const contentPageArbitrary = fc.record({
        title: fc.string({ minLength: 10, maxLength: 100 }),
        subtitle: fc.string({ minLength: 20, maxLength: 200 }),
      })

      await fc.assert(
        fc.asyncProperty(contentPageArbitrary, async (props) => {
          const { container } = render(
            <ContentPage
              title={props.title}
              subtitle={props.subtitle}
            >
              <div>
                <h2>Section Heading</h2>
                <p>Content paragraph with sufficient text for testing purposes.</p>
                <ul>
                  <li>List item one</li>
                  <li>List item two</li>
                </ul>
              </div>
            </ContentPage>
          )
          
          const results = await axe(container, {
            runOnly: {
              type: 'rule',
              values: [
                'list',
                'listitem',
                'definition-list',
                'dlitem',
              ],
            },
            rules: {
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'region': { enabled: false },
            },
          })
          
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 10 }
      )
    }, 30000)

    it('should verify image accessibility rules', async () => {
      const blogPostArbitrary = fc.record({
        slug: fc.constant('test-post'),
        title: fc.string({ minLength: 10, maxLength: 100 }),
        excerpt: fc.string({ minLength: 20, maxLength: 200 }),
        content: fc.constant('Test content'),
        author: fc.constant('Test Author'),
        publishDate: fc.constant('2024-01-15'),
        category: fc.constant('Test'),
        tags: fc.constant(['test']),
        featuredImage: fc.constant('/test-image.jpg'),
        readTime: fc.constant(5),
        metadata: fc.constant({
          title: 'Test',
          description: 'Test',
          keywords: ['test'],
        }),
      })

      await fc.assert(
        fc.asyncProperty(blogPostArbitrary, async (blogPost) => {
          const { container } = render(<BlogCard blogPost={blogPost as BlogPost} />)
          
          const results = await axe(container, {
            runOnly: {
              type: 'rule',
              values: [
                'image-alt',
                'image-redundant-alt',
              ],
            },
            rules: {
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
            },
          })
          
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 10 }
      )
    }, 30000)
  })

  describe('Property: Zero violations across component variations', () => {
    it('should have zero violations for any valid component configuration', async () => {
      // Test multiple component types in a single property
      const componentArbitrary = fc.oneof(
        fc.constant({ type: 'header', component: <Header /> }),
        fc.constant({ type: 'footer', component: <Footer /> }),
        fc.record({
          type: fc.constant('breadcrumbs'),
          items: fc.array(
            fc.record({
              label: fc.string({ minLength: 3, maxLength: 20 }),
              href: fc.constantFrom('/about', '/blog', '/contact'),
            }),
            { minLength: 1, maxLength: 3 }
          ),
        }).map(config => ({
          type: 'breadcrumbs',
          component: <Breadcrumbs items={config.items} />,
        }))
      )

      await fc.assert(
        fc.asyncProperty(componentArbitrary, async (config) => {
          const { container } = render(config.component)
          
          const results = await axe(container, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
            },
            rules: {
              'valid-lang': { enabled: false },
              'html-has-lang': { enabled: false },
              'landmark-one-main': { enabled: false },
              'landmark-no-duplicate-banner': { enabled: false },
              'landmark-no-duplicate-contentinfo': { enabled: false },
              'page-has-heading-one': { enabled: false },
              'region': { enabled: false },
            },
          })
          
          expect(results).toHaveNoViolations()
        }),
        { numRuns: 20 }
      )
    }, 60000)
  })
})
