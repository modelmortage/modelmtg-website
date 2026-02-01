/**
 * Accessibility Audit Tests
 * 
 * Runs axe-core accessibility audits on all pages to identify and fix
 * WCAG 2.1 AA violations.
 * 
 * **Validates: Requirements 7.3**
 * 
 * Task: 14.3 Run accessibility audit
 */

import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Import pages
import HomePage from '@/app/page'
import AboutPage from '@/app/about/page'
import MeetOurTeamPage from '@/app/meet-our-team/page'
import ScheduleCallPage from '@/app/schedule-a-call/page'
import ReviewsPage from '@/app/reviews/page'
import PrivacyPolicyPage from '@/app/privacy-policy/page'
import AdaAccessibilityPage from '@/app/ada-accessibility-statement/page'
import BlogListingPage from '@/app/blog/page'
import LearningCenterPage from '@/app/learning-center/page'
import MatthewBramowPage from '@/app/matthew-bramow/page'
import RolstonNichollsPage from '@/app/rolston-nicholls/page'
import AffordabilityCalculatorPage from '@/app/calculator/affordability/page'
import PurchaseCalculatorPage from '@/app/calculator/purchase/page'
import RefinanceCalculatorPage from '@/app/calculator/refinance/page'
import RentVsBuyCalculatorPage from '@/app/calculator/rent-vs-buy/page'
import VAPurchaseCalculatorPage from '@/app/calculator/va-purchase/page'
import VARefinanceCalculatorPage from '@/app/calculator/va-refinance/page'
import DSCRCalculatorPage from '@/app/calculator/dscr/page'

// Axe configuration for page-level tests
const axeConfig = {
  runOnly: {
    type: 'tag' as const,
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
  rules: {
    // Disable rules that require full document context
    'html-has-lang': { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
    'region': { enabled: false },
  },
}

describe('Accessibility Audit - All Pages', () => {
  describe('Home and Main Pages', () => {
    it('should have no accessibility violations on Home page', async () => {
      const { container } = render(<HomePage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on About Us page', async () => {
      const { container } = render(<AboutPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Meet Our Team page', async () => {
      const { container } = render(<MeetOurTeamPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Schedule a Call page', async () => {
      const { container } = render(<ScheduleCallPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Reviews page', async () => {
      const { container } = render(<ReviewsPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Privacy Policy page', async () => {
      const { container } = render(<PrivacyPolicyPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on ADA Accessibility Statement page', async () => {
      const { container } = render(<AdaAccessibilityPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)
  })

  describe('Blog and Learning Center Pages', () => {
    it('should have no accessibility violations on Blog listing page', async () => {
      const { container } = render(<BlogListingPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Learning Center page', async () => {
      const { container } = render(<LearningCenterPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)
  })

  describe('Team Member Profile Pages', () => {
    it('should have no accessibility violations on Matthew Bramow profile page', async () => {
      const { container } = render(<MatthewBramowPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Rolston Nicholls profile page', async () => {
      const { container } = render(<RolstonNichollsPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)
  })

  describe('Calculator Pages', () => {
    it('should have no accessibility violations on Affordability Calculator page', async () => {
      const { container } = render(<AffordabilityCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Purchase Calculator page', async () => {
      const { container } = render(<PurchaseCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Refinance Calculator page', async () => {
      const { container } = render(<RefinanceCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on Rent vs Buy Calculator page', async () => {
      const { container } = render(<RentVsBuyCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on VA Purchase Calculator page', async () => {
      const { container } = render(<VAPurchaseCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on VA Refinance Calculator page', async () => {
      const { container } = render(<VARefinanceCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)

    it('should have no accessibility violations on DSCR Calculator page', async () => {
      const { container } = render(<DSCRCalculatorPage />)
      const results = await axe(container, axeConfig)
      expect(results).toHaveNoViolations()
    }, 15000)
  })

  describe('Critical Accessibility Rules', () => {
    it('should verify color contrast on all calculator pages', async () => {
      const calculatorPages = [
        AffordabilityCalculatorPage,
        PurchaseCalculatorPage,
        RefinanceCalculatorPage,
        RentVsBuyCalculatorPage,
        VAPurchaseCalculatorPage,
        VARefinanceCalculatorPage,
        DSCRCalculatorPage,
      ]

      for (const Page of calculatorPages) {
        const { container } = render(<Page />)
        const results = await axe(container, {
          runOnly: {
            type: 'rule',
            values: ['color-contrast'],
          },
        })
        expect(results).toHaveNoViolations()
      }
    }, 30000)

    it('should verify keyboard accessibility on all interactive pages', async () => {
      const interactivePages = [
        HomePage,
        AffordabilityCalculatorPage,
        ScheduleCallPage,
      ]

      for (const Page of interactivePages) {
        const { container } = render(<Page />)
        const results = await axe(container, {
          runOnly: {
            type: 'rule',
            values: ['button-name', 'link-name', 'tabindex'],
          },
        })
        expect(results).toHaveNoViolations()
      }
    }, 30000)

    it('should verify ARIA attributes on all pages', async () => {
      const pages = [
        HomePage,
        AboutPage,
        BlogListingPage,
        AffordabilityCalculatorPage,
      ]

      for (const Page of pages) {
        const { container } = render(<Page />)
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
        })
        expect(results).toHaveNoViolations()
      }
    }, 30000)

    it('should verify image accessibility on all pages with images', async () => {
      const pagesWithImages = [
        HomePage,
        AboutPage,
        BlogListingPage,
        MatthewBramowPage,
        RolstonNichollsPage,
      ]

      for (const Page of pagesWithImages) {
        const { container } = render(<Page />)
        const results = await axe(container, {
          runOnly: {
            type: 'rule',
            values: ['image-alt', 'image-redundant-alt'],
          },
        })
        expect(results).toHaveNoViolations()
      }
    }, 30000)

    it('should verify form accessibility on calculator pages', async () => {
      const calculatorPages = [
        AffordabilityCalculatorPage,
        PurchaseCalculatorPage,
        RefinanceCalculatorPage,
      ]

      for (const Page of calculatorPages) {
        const { container } = render(<Page />)
        const results = await axe(container, {
          runOnly: {
            type: 'rule',
            values: ['label', 'label-title-only', 'form-field-multiple-labels'],
          },
        })
        expect(results).toHaveNoViolations()
      }
    }, 30000)
  })

  describe('Comprehensive WCAG 2.1 AA Coverage', () => {
    it('should pass all WCAG 2.1 AA rules on a sample of pages', async () => {
      const samplePages = [
        { name: 'Home', component: HomePage },
        { name: 'About', component: AboutPage },
        { name: 'Blog', component: BlogListingPage },
        { name: 'Affordability Calculator', component: AffordabilityCalculatorPage },
        { name: 'Matthew Bramow Profile', component: MatthewBramowPage },
      ]

      for (const { name, component: Page } of samplePages) {
        const { container } = render(<Page />)
        const results = await axe(container, axeConfig)
        
        if (results.violations.length > 0) {
          console.error(`Violations found on ${name} page:`, results.violations)
        }
        
        expect(results).toHaveNoViolations()
      }
    }, 60000)
  })
})
