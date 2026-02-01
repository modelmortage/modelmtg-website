# Design System Components

This directory contains the core design system components for the Model Mortgage website redesign. These components provide consistent styling, accessibility, and user experience across the application.

## Components

### Icon
Wrapper component for React Icons with consistent sizing and accessibility.

**Features:**
- Size variants: `sm` (16px), `md` (24px), `lg` (32px), `xl` (48px)
- Color inheritance or custom colors
- Automatic accessibility attributes
- Decorative vs functional icon handling

**Usage:**
```tsx
import { Icon } from '@/components/design-system';
import { FaHome } from 'react-icons/fa';

// Functional icon with aria-label
<Icon icon={FaHome} size="md" ariaLabel="Home" />

// Decorative icon (no aria-label)
<Icon icon={FaStar} size="sm" />
```

### Button
Accessible button component with multiple variants and states.

**Features:**
- Variants: `primary`, `secondary`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Icon support with left/right positioning
- Loading state with spinner
- Minimum 44x44px touch targets on mobile
- Keyboard accessible with focus indicators

**Usage:**
```tsx
import { Button } from '@/components/design-system';
import { FaArrowRight } from 'react-icons/fa';

// Primary button
<Button variant="primary" size="md">Click me</Button>

// Button with icon
<Button 
  variant="primary" 
  icon={<FaArrowRight />} 
  iconPosition="right"
>
  Continue
</Button>

// Loading button
<Button variant="primary" loading>Processing...</Button>
```

### Card
Container component for grouping related content.

**Features:**
- Variants: `elevated` (shadow), `outlined` (border), `flat` (background)
- Padding sizes: `sm`, `md`, `lg`
- Hoverable state with lift animation
- Clickable support with keyboard accessibility

**Usage:**
```tsx
import { Card } from '@/components/design-system';

// Elevated card
<Card variant="elevated" padding="md">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Clickable card
<Card 
  variant="outlined" 
  hoverable 
  onClick={() => console.log('clicked')}
>
  <p>Click me!</p>
</Card>
```

### Input
Form input component with floating labels and validation.

**Features:**
- Input types: `text`, `email`, `number`, `tel`, `password`
- Floating label behavior
- Error state with error messages
- Helper text support
- Icon support
- Keyboard accessible

**Usage:**
```tsx
import { Input } from '@/components/design-system';
import { FaEnvelope } from 'react-icons/fa';

// Basic input
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
/>

// Input with error
<Input
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  error="Password must be at least 8 characters"
/>

// Input with icon
<Input
  label="Search"
  value={search}
  onChange={setSearch}
  icon={<FaSearch />}
/>
```

### Chart
Wrapper for Recharts with consistent theming and accessibility.

**Features:**
- Chart types: `line`, `bar`, `pie`, `area`
- Theme color integration
- Responsive by default
- Accessible with hidden data table
- Tooltip support
- Legend and grid options

**Usage:**
```tsx
import { Chart } from '@/components/design-system';

// Line chart
<Chart
  type="line"
  data={data}
  xAxisKey="month"
  yAxisKey="value"
  title="Monthly Revenue"
  showLegend
/>

// Bar chart with multiple series
<Chart
  type="bar"
  data={data}
  xAxisKey="category"
  yAxisKey={["value1", "value2"]}
  showLegend
  showGrid
/>

// Pie chart
<Chart
  type="pie"
  data={data}
  yAxisKey="value"
  title="Distribution"
/>
```

### ResultDisplay
Specialized component for displaying calculator results with charts.

**Features:**
- Key metrics display in card format
- Chart visualization
- Currency and percentage formatting
- Number count-up animation
- Summary section

**Usage:**
```tsx
import { ResultDisplay } from '@/components/design-system';
import { FaDollarSign, FaHome } from 'react-icons/fa';

<ResultDisplay
  title="Your Monthly Payment"
  results={[
    { 
      label: "Principal & Interest", 
      value: 1500, 
      format: "currency",
      icon: <FaDollarSign />
    },
    { 
      label: "Property Tax", 
      value: 300, 
      format: "currency",
      icon: <FaHome />
    },
  ]}
  chartType="bar"
  chartData={chartData}
  chartConfig={{
    xAxisKey: "category",
    yAxisKey: "amount",
    showLegend: true,
    title: "Payment Breakdown"
  }}
  summary={{
    monthlyPayment: 1800,
    totalInterest: 150000,
    totalPrincipal: 300000
  }}
/>
```

## Theme Integration

All components use the centralized theme system from `app/styles/theme.ts`:

- **Colors**: Gold and charcoal primary colors, semantic colors
- **Typography**: Consistent font sizes, weights, and line heights
- **Spacing**: 4px-based spacing scale
- **Shadows**: Elevation levels for depth
- **Transitions**: Smooth animations (150-400ms)
- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px), Wide (1440px)

## Accessibility

All components follow WCAG 2.1 AA standards:

- ✓ Keyboard accessible
- ✓ Focus indicators
- ✓ ARIA labels and roles
- ✓ Color contrast compliance
- ✓ Screen reader support
- ✓ Minimum touch target sizes (44x44px on mobile)

## File Structure

```
design-system/
├── Icon/
│   ├── Icon.tsx
│   ├── Icon.module.css
│   └── index.ts
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.module.css
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.module.css
│   └── index.ts
├── Chart/
│   ├── Chart.tsx
│   ├── Chart.module.css
│   └── index.ts
├── ResultDisplay/
│   ├── ResultDisplay.tsx
│   ├── ResultDisplay.module.css
│   └── index.ts
├── index.ts (exports all components)
└── README.md (this file)
```

## Import Pattern

Always import from the design system index for consistency:

```tsx
import { 
  Icon, 
  Button, 
  Card, 
  Input, 
  Chart, 
  ResultDisplay 
} from '@/components/design-system';
```

## Next Steps

After implementing these core components, the next phase includes:

1. Creating animation utilities for scroll-triggered animations
2. Migrating Header and Footer components to use design system
3. Redesigning calculator pages with new components
4. Implementing property-based tests for component behavior
5. Running accessibility audits

## Requirements Validated

These components satisfy the following requirements from the UI Redesign spec:

- **Requirement 1**: Icon System Replacement (Icon component)
- **Requirement 2**: Calculator Visualization (Chart, ResultDisplay)
- **Requirement 3**: Design System Implementation (All components)
- **Requirement 5**: Calculator Pages Redesign (Input, ResultDisplay)
- **Requirement 11**: Responsive Design (All components)
- **Requirement 12**: Accessibility Compliance (All components)
- **Requirement 13**: Animation and Transitions (All components)
- **Requirement 17**: Component Consistency (All components)
