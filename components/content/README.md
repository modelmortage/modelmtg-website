# Content Components

This directory contains reusable components for displaying content throughout the website.

## LoanOptionCard

A card component for displaying loan option information with responsive design and hover effects.

### Usage

```tsx
import { LoanOptionCard } from '@/components/content'
import { loanOptions } from '@/lib/content/loanOptions'

export default function LoanOptionsPage() {
  return (
    <div className="grid">
      {loanOptions.map((option) => (
        <LoanOptionCard key={option.id} loanOption={option} />
      ))}
    </div>
  )
}
```

### Props

- `loanOption` (LoanOption): The loan option data to display
  - `id`: Unique identifier
  - `slug`: URL slug for the loan option page
  - `title`: Display title
  - `shortDescription`: Brief description shown on the card
  - `icon`: Icon identifier (home, shield, flag, tree, building, key, percent, chart, refresh, dollar, star)
  - Other fields used on detail pages

### Features

- **Responsive Design**: Adapts to mobile, tablet, and desktop viewports
- **Hover Effects**: Animated border, shadow, and arrow on hover
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Touch Optimization**: Appropriate touch target sizes for mobile devices
- **Icon Mapping**: Automatic emoji icon display based on loan type

### Styling

The component uses CSS Modules with the design system variables:
- `--deep-charcoal`: Card background
- `--gold-main`: Accent color for borders and arrows
- `--ivory-white`: Text color
- `--transition-smooth`: Animation timing

### Responsive Breakpoints

- Desktop: Full size (320px+ width cards)
- Tablet: 768px and below
- Mobile: 480px and below
- Touch devices: Optimized touch targets
