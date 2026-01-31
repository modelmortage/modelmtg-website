# Design Document: Website Structure Migration

## Overview

This design outlines the architecture and implementation approach for migrating the complete structure and content from modelmtg.com to a Next.js application. The system will implement 7 mortgage calculators, 20+ content pages, a blog system, and team profiles while maintaining the existing gold/charcoal design system and ensuring optimal SEO performance.

The migration follows a component-based architecture using Next.js 14 App Router, TypeScript for type safety, and a content-first approach that separates presentation from data. All pages will be statically generated where possible for optimal performance and SEO.

## Architecture

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: CSS Modules with global design system variables
- **Content Management**: Structured TypeScript/JSON for content, MDX for blog posts
- **SEO**: next-seo for metadata management, structured data with JSON-LD
- **Forms**: React Hook Form for calculator inputs and contact forms
- **Validation**: Zod for input validation schemas

### Directory Structure

```
app/
├── calculator/
│   ├── affordability/page.tsx
│   ├── purchase/page.tsx
│   ├── refinance/page.tsx
│   ├── rent-vs-buy/page.tsx
│   ├── va-purchase/page.tsx
│   ├── va-refinance/page.tsx
│   └── dscr/page.tsx
├── loan-options/
│   ├── page.tsx (hub)
│   ├── fixed-rate-mortgage/page.tsx
│   ├── fha-home-loan/page.tsx
│   ├── va-home-loan/page.tsx
│   ├── usda-loan/page.tsx
│   ├── jumbo-home-loan/page.tsx
│   ├── first-time-home-buyer/page.tsx
│   ├── low-down-payment-purchase-options/page.tsx
│   ├── investment-property-loans/page.tsx
│   ├── refinance/page.tsx
│   ├── cash-out-refinance/page.tsx
│   └── va-loan-refinance-options/page.tsx
├── blog/
│   ├── page.tsx (listing)
│   └── [slug]/page.tsx (individual posts)
├── learning-center/page.tsx
├── about-us/page.tsx
├── meet-our-team/page.tsx
├── schedule-a-call/page.tsx
├── reviews/page.tsx
├── privacy-policy/page.tsx
├── ada-accessibility-statement/page.tsx
├── matthew-bramow/page.tsx
├── rolston-nicholls/page.tsx
└── layout.tsx

components/
├── calculators/
│   ├── CalculatorLayout.tsx
│   ├── CalculatorForm.tsx
│   ├── CalculatorResults.tsx
│   └── CalculatorCTA.tsx
├── content/
│   ├── ContentPage.tsx
│   ├── LoanOptionCard.tsx
│   ├── BlogCard.tsx
│   └── TeamMemberCard.tsx
├── shared/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Breadcrumbs.tsx
│   └── SEOHead.tsx
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    └── Input.tsx

lib/
├── calculators/
│   ├── affordability.ts
│   ├── purchase.ts
│   ├── refinance.ts
│   ├── rentVsBuy.ts
│   ├── vaPurchase.ts
│   ├── vaRefinance.ts
│   └── dscr.ts
├── content/
│   ├── loanOptions.ts
│   ├── blogPosts.ts
│   └── teamMembers.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── seo.ts
└── types/
    ├── calculator.ts
    ├── content.ts
    └── blog.ts
```

### Page Generation Strategy

- **Static Generation (SSG)**: Content pages, loan options, team profiles, blog posts
- **Client-Side Rendering (CSR)**: Calculator pages (require user interaction)
- **Incremental Static Regeneration (ISR)**: Blog listing page (revalidate every 24 hours)

## Components and Interfaces

### Calculator System

#### Calculator Types Interface

```typescript
// lib/types/calculator.ts

export interface CalculatorInput {
  label: string
  name: string
  type: 'number' | 'currency' | 'percentage'
  placeholder: string
  defaultValue?: string | number
  min?: number
  max?: number
  step?: number
  required: boolean
  helpText?: string
}

export interface CalculatorResult {
  label: string
  value: number
  format: 'currency' | 'percentage' | 'number'
  highlight?: boolean
  description?: string
}

export interface CalculatorConfig {
  id: string
  title: string
  description: string
  icon: string
  inputs: CalculatorInput[]
  calculate: (inputs: Record<string, number>) => CalculatorResult[]
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
}
```

#### Calculator Implementations

Each calculator will implement the `CalculatorConfig` interface with specific calculation logic:

**Affordability Calculator**:
- Inputs: Annual income, monthly debts, down payment, interest rate
- Formula: Max loan = (monthly payment capacity) × ((1 - (1 + r)^-n) / r)
- Where: r = monthly interest rate, n = 360 months (30 years)
- DTI ratio: 43% (conservative standard)

**Purchase Calculator**:
- Inputs: Home price, down payment, interest rate, loan term, property tax rate, insurance, HOA
- Outputs: Monthly payment (P&I), property tax, insurance, HOA, total monthly payment, total interest

**Refinance Calculator**:
- Inputs: Current loan balance, current rate, new rate, remaining term, new term, closing costs
- Outputs: New monthly payment, monthly savings, break-even point, total savings

**Rent vs Buy Calculator**:
- Inputs: Home price, down payment, interest rate, rent amount, years to stay, appreciation rate
- Outputs: Total cost of buying, total cost of renting, net difference, recommendation

**VA Purchase Calculator**:
- Inputs: Home price, down payment (0% default), interest rate, VA funding fee, property tax, insurance
- Outputs: Monthly payment, funding fee amount, total monthly cost

**VA Refinance Calculator**:
- Inputs: Current balance, current rate, new rate, cash out amount, funding fee
- Outputs: New monthly payment, monthly savings, cash received

**DSCR Investment Calculator**:
- Inputs: Property price, down payment, interest rate, monthly rent, expenses
- Outputs: DSCR ratio, monthly cash flow, annual ROI, loan qualification status

#### Shared Calculator Components

```typescript
// components/calculators/CalculatorLayout.tsx
interface CalculatorLayoutProps {
  config: CalculatorConfig
  children: React.ReactNode
}

// components/calculators/CalculatorForm.tsx
interface CalculatorFormProps {
  inputs: CalculatorInput[]
  onCalculate: (values: Record<string, number>) => void
}

// components/calculators/CalculatorResults.tsx
interface CalculatorResultsProps {
  results: CalculatorResult[] | null
  loading: boolean
}
```

### Content Management System

#### Content Types

```typescript
// lib/types/content.ts

export interface LoanOption {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  benefits: string[]
  requirements: string[]
  idealFor: string[]
  icon: string
  relatedCalculators: string[]
  metadata: PageMetadata
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  featuredImage: string
  readTime: number
  metadata: PageMetadata
}

export interface TeamMember {
  slug: string
  name: string
  title: string
  bio: string
  photo: string
  credentials: string[]
  specialties: string[]
  contact: {
    email?: string
    phone?: string
    calendly?: string
  }
  metadata: PageMetadata
}

export interface PageMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
}
```

#### Content Storage

Content will be stored in structured TypeScript files for type safety and easy maintenance:

```typescript
// lib/content/loanOptions.ts
export const loanOptions: LoanOption[] = [
  {
    id: 'fixed-rate-mortgage',
    slug: 'fixed-rate-mortgage',
    title: 'Fixed Rate Mortgage',
    shortDescription: 'Predictable payments with a locked interest rate',
    // ... rest of content
  },
  // ... other loan options
]

// lib/content/blogPosts.ts
export const blogPosts: BlogPost[] = [
  {
    slug: 'step-by-step-guide-shopping-new-home',
    title: 'A Step-by-Step Guide to Shopping for a New Home',
    // ... rest of content
  },
  // ... other blog posts
]
```

### SEO and Metadata System

#### SEO Utilities

```typescript
// lib/utils/seo.ts

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  article?: {
    publishedTime: string
    author: string
    tags: string[]
  }
}

export function generateMetadata(config: SEOConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      type: config.ogType || 'website',
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    alternates: {
      canonical: config.canonical,
    },
  }
}

export function generateStructuredData(type: 'article' | 'organization' | 'breadcrumb', data: any) {
  // Returns JSON-LD structured data
}
```

## Data Models

### Calculator Input Validation

```typescript
// lib/utils/validators.ts
import { z } from 'zod'

export const affordabilitySchema = z.object({
  annualIncome: z.number().min(0).max(10000000),
  monthlyDebts: z.number().min(0).max(100000),
  downPayment: z.number().min(0).max(10000000),
  interestRate: z.number().min(0).max(20),
})

export const purchaseSchema = z.object({
  homePrice: z.number().min(1000).max(100000000),
  downPayment: z.number().min(0).max(100000000),
  interestRate: z.number().min(0).max(20),
  loanTerm: z.number().min(1).max(30),
  propertyTaxRate: z.number().min(0).max(10),
  insurance: z.number().min(0).max(100000),
  hoa: z.number().min(0).max(10000),
})

// Similar schemas for other calculators
```

### Content Data Models

```typescript
// lib/types/content.ts

export interface ContentSection {
  heading: string
  content: string
  subsections?: ContentSection[]
}

export interface CallToAction {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface PageContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage?: string
  }
  sections: ContentSection[]
  cta?: CallToAction
  sidebar?: {
    relatedLinks: Array<{ text: string; href: string }>
    contactInfo?: boolean
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Calculator Correctness Properties

**Property 1: Calculator URL Accessibility**
*For any* calculator type (Affordability, Purchase, Refinance, Rent vs Buy, VA Purchase, VA Refinance, DSCR), the corresponding URL path should be accessible and return a successful response.
**Validates: Requirements 1.1**

**Property 2: Calculator Interface Completeness**
*For any* calculator page, the rendered interface should contain all required input fields as defined in the calculator configuration.
**Validates: Requirements 1.2**

**Property 3: Calculation Accuracy**
*For any* valid input set to a calculator, the computed results should match the expected output based on industry-standard mortgage formulas within a tolerance of $0.01.
**Validates: Requirements 1.3, 1.6**

**Property 4: Input Validation**
*For any* invalid input (negative numbers, non-numeric values, out-of-range values), the calculator should reject the input and display a validation error without performing calculation.
**Validates: Requirements 1.4**

**Property 5: Result Formatting**
*For any* calculation result, currency values should be formatted with $ and commas, percentages with % symbol, and numbers with appropriate decimal places.
**Validates: Requirements 1.7**

### Content Page Properties

**Property 6: Content Page Rendering**
*For any* content page (About Us, Meet Our Team, Schedule a Call, Reviews, Privacy Policy, ADA Statement), the page should render without errors and display the expected content sections.
**Validates: Requirements 2.2**

**Property 7: Navigation Consistency**
*For any* page in the system, both the header and footer components should be present and contain the same navigation structure and links.
**Validates: Requirements 2.3, 8.1, 8.2**

**Property 8: Design System Consistency**
*For any* page, the CSS should use the established design system variables (--gold-main, --midnight-black, --deep-charcoal, --ivory-white) for colors.
**Validates: Requirements 2.5**

**Property 9: Interactive Element Functionality**
*For any* page containing forms or interactive elements, those elements should respond to user interactions and submit/process data correctly.
**Validates: Requirements 2.4, 3.5, 5.4**

### Loan Options Properties

**Property 10: Loan Options Structure**
*For any* loan options page, the content should include all required sections: overview, benefits list, requirements list, and call-to-action.
**Validates: Requirements 3.2, 3.3**

### Blog System Properties

**Property 11: Blog Post Metadata Completeness**
*For any* blog post (in listing or individual page), the rendered output should include title, excerpt, author, publication date, category, and featured image.
**Validates: Requirements 4.3, 4.6**

**Property 12: Blog Post Content Rendering**
*For any* blog post page, the complete article content should be rendered with proper HTML structure and formatting.
**Validates: Requirements 4.5**

### Team Profile Properties

**Property 13: Team Profile Completeness**
*For any* team member profile page, the rendered output should include photo, bio, credentials, and contact information.
**Validates: Requirements 5.2**

### SEO Properties

**Property 14: Page Metadata Completeness**
*For any* page, the HTML head should contain a unique title tag, meta description (≤160 characters), and Open Graph tags (og:title, og:description).
**Validates: Requirements 6.1, 6.2, 6.4**

**Property 15: Heading Hierarchy**
*For any* page, there should be exactly one H1 element, and all heading elements should follow proper nesting order (H1 → H2 → H3, no skipping levels).
**Validates: Requirements 6.3**

**Property 16: Structured Data Validity**
*For any* page with structured data, the JSON-LD script should be present, valid JSON, and conform to schema.org specifications.
**Validates: Requirements 6.6**

### Responsive Design Properties

**Property 17: Viewport Responsiveness**
*For any* page at viewport widths of 320px, 768px, and 1920px, the content should be readable and interactive elements should be accessible without horizontal scrolling.
**Validates: Requirements 7.1**

**Property 18: Touch Target Sizing**
*For any* interactive element (button, link, form input), the touch target should be at least 44x44 pixels for usability on touch devices.
**Validates: Requirements 7.2**

### Accessibility Properties

**Property 19: WCAG Compliance**
*For any* page, automated accessibility testing should report zero violations of WCAG 2.1 AA standards.
**Validates: Requirements 7.3**

**Property 20: Keyboard Navigation**
*For any* page, all interactive elements should be reachable via keyboard navigation with visible focus indicators and logical tab order.
**Validates: Requirements 7.4**

**Property 21: ARIA Labels**
*For any* interactive element without visible text (icons, image buttons), appropriate ARIA labels or aria-label attributes should be present.
**Validates: Requirements 7.5**

**Property 22: Color Contrast**
*For any* text element, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 7.6**

### Navigation Properties

**Property 23: Active Navigation State**
*For any* page, the navigation item corresponding to the current page should have an active state indicator (class or style).
**Validates: Requirements 8.3**

**Property 24: Breadcrumb Navigation**
*For any* nested page (loan options, blog posts, team profiles), breadcrumb navigation should be present showing the hierarchical path.
**Validates: Requirements 8.4**

**Property 25: Navigation Link Functionality**
*For any* navigation link, clicking it should navigate to the correct URL without errors or broken links.
**Validates: Requirements 8.5**

**Property 26: Mobile Navigation**
*For any* page at viewport widths below 768px, the navigation should collapse into a mobile menu with a toggle button.
**Validates: Requirements 8.6**

### Performance Properties

**Property 27: Image Optimization**
*For any* image element, the image should be served in WebP format (or have WebP alternatives) and use responsive sizing attributes.
**Validates: Requirements 9.2**

**Property 28: Link Prefetching**
*For any* Next.js Link component, hovering or focusing the link should trigger a prefetch request for the target page.
**Validates: Requirements 9.5**

### Content Management Properties

**Property 29: File Naming Consistency**
*For any* blog post file, the filename should follow the kebab-case naming convention and match the post slug.
**Validates: Requirements 10.4**

## Error Handling

### Calculator Error Handling

**Input Validation Errors**:
- Display inline error messages next to invalid fields
- Prevent calculation until all inputs are valid
- Provide helpful error messages (e.g., "Interest rate must be between 0% and 20%")

**Calculation Errors**:
- Handle edge cases (division by zero, negative results)
- Display user-friendly error messages
- Log errors for debugging

**Example Error States**:
```typescript
interface CalculatorError {
  field: string
  message: string
  type: 'validation' | 'calculation'
}
```

### Content Loading Errors

**Missing Content**:
- Display 404 page for non-existent routes
- Provide navigation back to home or relevant section
- Log missing content for monitoring

**Image Loading Errors**:
- Provide fallback images or placeholders
- Use Next.js Image component error handling
- Gracefully degrade if images fail to load

### Form Submission Errors

**Network Errors**:
- Display retry button
- Preserve form data
- Show clear error message

**Validation Errors**:
- Highlight invalid fields
- Display specific error messages
- Prevent submission until valid

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs using randomized testing

### Property-Based Testing Configuration

**Library**: fast-check (for TypeScript/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: `Feature: website-structure-migration, Property {number}: {property_text}`

**Example Property Test**:
```typescript
import fc from 'fast-check'

// Feature: website-structure-migration, Property 3: Calculation Accuracy
test('affordability calculator produces accurate results', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 20000, max: 500000 }), // income
      fc.integer({ min: 0, max: 5000 }), // debts
      fc.integer({ min: 0, max: 200000 }), // down payment
      fc.float({ min: 2, max: 10 }), // interest rate
      (income, debts, downPayment, rate) => {
        const result = calculateAffordability(income, debts, downPayment, rate)
        const expected = calculateExpectedAffordability(income, debts, downPayment, rate)
        expect(Math.abs(result - expected)).toBeLessThan(0.01)
      }
    ),
    { numRuns: 100 }
  )
})
```

### Unit Testing Focus

**Calculator Tests**:
- Test specific known examples (e.g., $80k income → $X home price)
- Test edge cases (zero down payment, maximum DTI)
- Test error conditions (negative inputs, invalid rates)

**Component Tests**:
- Test component rendering with specific props
- Test user interactions (button clicks, form submissions)
- Test conditional rendering logic

**Integration Tests**:
- Test page navigation flows
- Test form submission end-to-end
- Test calculator workflows

### Testing Tools

- **Unit Testing**: Jest + React Testing Library
- **Property Testing**: fast-check
- **E2E Testing**: Playwright (for critical user flows)
- **Accessibility Testing**: axe-core + jest-axe
- **Visual Regression**: Percy or Chromatic (optional)

### Test Coverage Goals

- **Calculator Logic**: 100% coverage (critical business logic)
- **Components**: 80% coverage (focus on logic, not styling)
- **Utilities**: 90% coverage (formatters, validators)
- **Pages**: Integration tests for critical paths

## Implementation Notes

### Content Migration Strategy

1. **Phase 1**: Scrape and structure content from modelmtg.com
2. **Phase 2**: Create TypeScript content files with proper typing
3. **Phase 3**: Implement page templates and components
4. **Phase 4**: Populate pages with migrated content
5. **Phase 5**: SEO optimization and metadata

### Calculator Implementation Priority

1. Affordability Calculator (already started)
2. Purchase Calculator (already started)
3. Refinance Calculator
4. VA Purchase Calculator
5. VA Refinance Calculator
6. Rent vs Buy Calculator
7. DSCR Investment Calculator

### Performance Optimization

- Use Next.js Image component for all images
- Implement lazy loading for below-the-fold content
- Minimize JavaScript bundle size with code splitting
- Use static generation for all non-interactive pages
- Implement caching strategies for API calls (if any)

### Accessibility Considerations

- Ensure all forms have proper labels
- Provide skip navigation links
- Use semantic HTML elements
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Ensure keyboard navigation works throughout
- Maintain sufficient color contrast ratios

### SEO Best Practices

- Unique, descriptive title tags for each page
- Meta descriptions that encourage clicks
- Proper heading hierarchy (single H1 per page)
- Internal linking between related pages
- XML sitemap generation
- Structured data for rich snippets
- Canonical URLs to prevent duplicate content
- Open Graph tags for social sharing
