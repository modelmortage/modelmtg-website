# Shared Components

This directory contains reusable infrastructure components for content pages.

## Components

### ContentPage

A reusable layout component for consistent content page structure with Header, Footer, hero section, breadcrumbs, and optional CTA.

**Usage:**

```tsx
import { ContentPage } from '@/components/shared'

export default function AboutPage() {
  return (
    <ContentPage
      title="About Us"
      subtitle="Learn about our mission and values"
      breadcrumbs={[
        { label: 'About', href: '/about' }
      ]}
    >
      <section>
        <h2>Our Story</h2>
        <p>Content goes here...</p>
      </section>
    </ContentPage>
  )
}
```

**Props:**

- `title` (required): Page title displayed in the hero section
- `subtitle` (optional): Subtitle or description below the title
- `breadcrumbs` (optional): Array of breadcrumb items for navigation
- `children` (required): Main content of the page
- `heroImage` (optional): Background image URL for the hero section
- `heroBackground` (optional): Custom background color for the hero section
- `showCTA` (optional): Whether to show the CTA section (default: true)
- `cta` (optional): Custom CTA configuration object

### Breadcrumbs

A navigation component that shows the hierarchical path to the current page.

**Usage:**

```tsx
import { Breadcrumbs } from '@/components/shared'

export default function MyComponent() {
  return (
    <Breadcrumbs
      items={[
        { label: 'Loan Options', href: '/loan-options' },
        { label: 'FHA Loans', href: '/loan-options/fha' }
      ]}
    />
  )
}
```

**Props:**

- `items` (required): Array of breadcrumb items with `label` and `href`

**Note:** The "Home" breadcrumb is automatically prepended.

## Header Component Updates

The Header component has been updated to support active navigation highlighting:

- Automatically highlights the current navigation item based on the URL path
- Uses `usePathname()` from Next.js to detect the current route
- Adds `active` class and `aria-current="page"` attribute to active items
- Supports nested routes (e.g., `/calculator/affordability` highlights "Calculator")

## Footer Component

The Footer component remains consistent across all pages and includes:

- Company logo and tagline
- Navigation links organized by category
- Contact information
- Legal links (Privacy Policy, ADA Accessibility)
- Certifications and copyright information

## Design System

All components use the established design system variables:

- Colors: `--gold-main`, `--gold-light`, `--midnight-black`, `--deep-charcoal`, `--ivory-white`
- Fonts: `--font-serif` (Playfair Display), `--font-sans` (Inter)
- Transitions: `--transition-fast`, `--transition-smooth`
- Spacing: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`

## Accessibility

All components follow WCAG 2.1 AA standards:

- Proper semantic HTML structure
- ARIA labels and attributes where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
