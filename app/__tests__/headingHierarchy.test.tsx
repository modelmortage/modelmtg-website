/**
 * Heading Hierarchy Tests
 * 
 * Validates: Requirements 6.3
 * - Ensures all pages have exactly one H1 element
 * - Ensures proper heading nesting (no skipped levels)
 */

import { render } from '@testing-library/react'
import { JSDOM } from 'jsdom'

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
  notFound: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Helper function to check heading hierarchy in rendered HTML
function checkHeadingHierarchy(html: string): {
  h1Count: number
  hasSkippedLevels: boolean
  skippedLevels: string[]
  headingSequence: string[]
} {
  const dom = new JSDOM(html)
  const document = dom.window.document

  // Count H1 elements
  const h1Elements = document.querySelectorAll('h1')
  const h1Count = h1Elements.length

  // Get all heading elements in order
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const headingSequence = headings.map(h => h.tagName.toLowerCase())

  // Check for skipped levels
  const skippedLevels: string[] = []
  let hasSkippedLevels = false

  for (let i = 1; i < headingSequence.length; i++) {
    const currentLevel = parseInt(headingSequence[i].substring(1))
    const previousLevel = parseInt(headingSequence[i - 1].substring(1))
    
    // If current level is more than 1 greater than previous, we skipped a level
    if (currentLevel > previousLevel + 1) {
      hasSkippedLevels = true
      skippedLevels.push(
        `Skipped from ${headingSequence[i - 1]} to ${headingSequence[i]} at position ${i}`
      )
    }
  }

  return {
    h1Count,
    hasSkippedLevels,
    skippedLevels,
    headingSequence,
  }
}

describe('Heading Hierarchy - Content Pages', () => {
  test('About page has exactly one H1 and proper nesting', async () => {
    const AboutPage = (await import('@/app/about/page')).default
    const { container } = render(<AboutPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    if (result.hasSkippedLevels) {
      console.log('Skipped levels:', result.skippedLevels)
      console.log('Heading sequence:', result.headingSequence)
    }
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Meet Our Team page has exactly one H1 and proper nesting', async () => {
    const MeetOurTeamPage = (await import('@/app/meet-our-team/page')).default
    const { container } = render(<MeetOurTeamPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    if (result.hasSkippedLevels) {
      console.log('Meet Our Team - Skipped levels:', result.skippedLevels)
      console.log('Meet Our Team - Heading sequence:', result.headingSequence)
    }
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Schedule a Call page has exactly one H1 and proper nesting', async () => {
    const ScheduleACallPage = (await import('@/app/schedule-a-call/page')).default
    const { container } = render(<ScheduleACallPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Reviews page has exactly one H1 and proper nesting', async () => {
    const ReviewsPage = (await import('@/app/reviews/page')).default
    const { container } = render(<ReviewsPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Privacy Policy page has exactly one H1 and proper nesting', async () => {
    const PrivacyPolicyPage = (await import('@/app/privacy-policy/page')).default
    const { container } = render(<PrivacyPolicyPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('ADA Accessibility Statement page has exactly one H1 and proper nesting', async () => {
    const ADAPage = (await import('@/app/ada-accessibility-statement/page')).default
    const { container } = render(<ADAPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })
})

describe('Heading Hierarchy - Blog Pages', () => {
  test('Blog listing page has exactly one H1 and proper nesting', async () => {
    const BlogPage = (await import('@/app/blog/page')).default
    const { container } = render(<BlogPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    if (result.hasSkippedLevels) {
      console.log('Blog listing - Skipped levels:', result.skippedLevels)
      console.log('Blog listing - Heading sequence:', result.headingSequence)
    }
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Learning Center page has exactly one H1 and proper nesting', async () => {
    const LearningCenterPage = (await import('@/app/learning-center/page')).default
    const { container } = render(<LearningCenterPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Blog post page has exactly one H1 and proper nesting', async () => {
    const BlogPostPage = (await import('@/app/blog/[slug]/page')).default
    const { container } = render(<BlogPostPage params={{ slug: 'step-by-step-guide-shopping-new-home' }} />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    if (result.hasSkippedLevels) {
      console.log('Blog post - Skipped levels:', result.skippedLevels)
      console.log('Blog post - Heading sequence:', result.headingSequence)
    }
    expect(result.hasSkippedLevels).toBe(false)
  })
})

describe('Heading Hierarchy - Calculator Pages', () => {
  test('Affordability calculator has exactly one H1 and proper nesting', async () => {
    const AffordabilityPage = (await import('@/app/calculator/affordability/page')).default
    const { container } = render(<AffordabilityPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    if (result.hasSkippedLevels) {
      console.log('Skipped levels:', result.skippedLevels)
      console.log('Heading sequence:', result.headingSequence)
    }
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Purchase calculator has exactly one H1 and proper nesting', async () => {
    const PurchasePage = (await import('@/app/calculator/purchase/page')).default
    const { container } = render(<PurchasePage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Refinance calculator has exactly one H1 and proper nesting', async () => {
    const RefinancePage = (await import('@/app/calculator/refinance/page')).default
    const { container } = render(<RefinancePage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Rent vs Buy calculator has exactly one H1 and proper nesting', async () => {
    const RentVsBuyPage = (await import('@/app/calculator/rent-vs-buy/page')).default
    const { container } = render(<RentVsBuyPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('VA Purchase calculator has exactly one H1 and proper nesting', async () => {
    const VAPurchasePage = (await import('@/app/calculator/va-purchase/page')).default
    const { container } = render(<VAPurchasePage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('VA Refinance calculator has exactly one H1 and proper nesting', async () => {
    const VARefinancePage = (await import('@/app/calculator/va-refinance/page')).default
    const { container } = render(<VARefinancePage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('DSCR calculator has exactly one H1 and proper nesting', async () => {
    const DSCRPage = (await import('@/app/calculator/dscr/page')).default
    const { container } = render(<DSCRPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })
})

describe('Heading Hierarchy - Loan Options Pages', () => {
  test('Loan options hub page has exactly one H1 and proper nesting', async () => {
    const LoanOptionsPage = (await import('@/app/loan-options/page')).default
    const { container } = render(<LoanOptionsPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Individual loan option page has exactly one H1 and proper nesting', async () => {
    const LoanOptionPage = (await import('@/app/loan-options/[slug]/page')).default
    const { container } = render(<LoanOptionPage params={{ slug: 'fixed-rate-mortgage' }} />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })
})

describe('Heading Hierarchy - Team Member Pages', () => {
  test('Matthew Bramow profile has exactly one H1 and proper nesting', async () => {
    const MatthewBramowPage = (await import('@/app/matthew-bramow/page')).default
    const { container } = render(<MatthewBramowPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })

  test('Rolston Nicholls profile has exactly one H1 and proper nesting', async () => {
    const RolstonNichollsPage = (await import('@/app/rolston-nicholls/page')).default
    const { container } = render(<RolstonNichollsPage />)
    const html = container.innerHTML

    const result = checkHeadingHierarchy(html)

    expect(result.h1Count).toBe(1)
    expect(result.hasSkippedLevels).toBe(false)
  })
})
