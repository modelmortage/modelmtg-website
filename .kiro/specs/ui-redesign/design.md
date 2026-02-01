# Design Document: UI Redesign

## Overview

This design document outlines the technical approach for redesigning the Model Mortgage website with modern, professional aesthetics. The redesign replaces emoji-based iconography with React Icons, implements data visualization using Recharts, and establishes a comprehensive design system while maintaining existing functionality.

The redesign follows a component-first approach, building a design system foundation before migrating individual pages. This ensures consistency and reduces duplication while allowing for incremental rollout.

## Architecture

### High-Level Architecture

The redesign maintains the existing Next.js/React architecture while introducing new layers:

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  (Pages: Home, Calculators, Content, Blog, Profiles)   │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Design System Layer                     │
│  (Components, Theme, Typography, Spacing, Colors)       │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Library Layer                          │
│  (React Icons, Recharts, Framer Motion)                 │
└─────────────────────────────────────────────────────────┘
```

### Design System Structure

```
app/
├── components/
│   ├── design-system/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Icon/
│   │   ├── Chart/
│   │   └── index.ts
│   ├── layout/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Container/
│   └── features/
│       ├── calculators/
│       ├── blog/
│       └── profiles/
├── styles/
│   ├── theme.ts
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── utils/
    ├── animations.ts
    └── responsive.ts
```

## Components and Interfaces

### 1. Theme System

**Purpose:** Centralized configuration for colors, typography, spacing, and breakpoints.

**Interface:**

```typescript
// styles/theme.ts
export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
  shadows: Shadows;
  transitions: Transitions;
}

export interface ColorPalette {
  primary: {
    gold: string;
    goldLight: string;
    goldDark: string;
  };
  neutral: {
    charcoal: string;
    charcoalLight: string;
    charcoalDark: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    white: string;
  };
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Typography {
  fontFamily: {
    primary: string;
    heading: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface Breakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}
```

### 2. Button Component

**Purpose:** Consistent, accessible button styling across all pages.

**Interface:**

```typescript
// components/design-system/Button/Button.tsx
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps>;
```

**Behavior:**
- Primary variant uses gold background with charcoal text
- Secondary variant uses charcoal background with white text
- Outline variant has transparent background with gold border
- Ghost variant has no background or border, only text color
- Hover states darken/lighten colors by 10%
- Focus states show visible outline for keyboard navigation
- Loading state shows spinner and disables interaction
- Icons are positioned with appropriate spacing (8px gap)

### 3. Card Component

**Purpose:** Consistent container for content grouping.

**Interface:**

```typescript
// components/design-system/Card/Card.tsx
export interface CardProps {
  children: React.ReactNode;
  variant: 'elevated' | 'outlined' | 'flat';
  padding: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps>;
```

**Behavior:**
- Elevated variant has box-shadow
- Outlined variant has border, no shadow
- Flat variant has background color only
- Hoverable cards lift slightly on hover (transform: translateY(-4px))
- Clickable cards show pointer cursor and scale slightly on hover

### 4. Input Component

**Purpose:** Consistent form input styling with validation feedback.

**Interface:**

```typescript
// components/design-system/Input/Input.tsx
export interface InputProps {
  type: 'text' | 'email' | 'number' | 'tel' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps>;
```

**Behavior:**
- Label floats above input when focused or filled
- Error state shows red border and error message below
- Icon appears on left side of input with 12px padding
- Focus state shows gold border
- Disabled state shows gray background and cursor

### 5. Icon Wrapper Component

**Purpose:** Consistent icon sizing, coloring, and accessibility.

**Interface:**

```typescript
// components/design-system/Icon/Icon.tsx
export interface IconProps {
  icon: IconType; // from react-icons
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  ariaLabel?: string;
  className?: string;
}

export const Icon: React.FC<IconProps>;
```

**Behavior:**
- Size 'sm' = 16px, 'md' = 24px, 'lg' = 32px, 'xl' = 48px
- Color defaults to currentColor (inherits from parent)
- Provides aria-label for screen readers when icon has semantic meaning
- Applies aria-hidden="true" when icon is purely decorative

### 6. Chart Components

**Purpose:** Consistent data visualization for calculator results.

**Interface:**

```typescript
// components/design-system/Chart/Chart.tsx
export interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartData[];
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
}

export interface ChartData {
  [key: string]: string | number;
}

export const Chart: React.FC<ChartProps>;
```

**Behavior:**
- Uses Recharts library under the hood
- Applies theme colors by default
- Responsive by default (ResponsiveContainer)
- Provides tooltip on hover
- Includes accessible data table alternative (hidden visually, available to screen readers)

### 7. Calculator Result Display

**Purpose:** Specialized component for displaying calculator results with charts.

**Interface:**

```typescript
// components/features/calculators/ResultDisplay.tsx
export interface ResultDisplayProps {
  title: string;
  results: CalculatorResult[];
  chartType: 'line' | 'bar' | 'pie';
  chartData: ChartData[];
  summary: ResultSummary;
}

export interface CalculatorResult {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  format?: 'currency' | 'percentage' | 'number';
}

export interface ResultSummary {
  monthlyPayment?: number;
  totalInterest?: number;
  totalPrincipal?: number;
  [key: string]: any;
}

export const ResultDisplay: React.FC<ResultDisplayProps>;
```

**Behavior:**
- Displays key metrics in card format at top
- Shows chart visualization below metrics
- Formats currency values with $ and commas
- Formats percentages with % symbol
- Animates numbers counting up on initial display

### 8. Header Component

**Purpose:** Consistent navigation across all pages.

**Interface:**

```typescript
// components/layout/Header/Header.tsx
export interface HeaderProps {
  transparent?: boolean;
  fixed?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export const Header: React.FC<HeaderProps>;
```

**Behavior:**
- Desktop: horizontal navigation with dropdowns
- Mobile: hamburger menu with slide-out drawer
- Transparent variant for hero sections (becomes solid on scroll)
- Fixed positioning with smooth show/hide on scroll
- Active page highlighted with gold underline
- Smooth transitions for all interactions

### 9. Footer Component

**Purpose:** Consistent footer information and links.

**Interface:**

```typescript
// components/layout/Footer/Footer.tsx
export interface FooterProps {
  // No props needed, uses static content
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const Footer: React.FC<FooterProps>;
```

**Behavior:**
- Four-column layout on desktop
- Stacked layout on mobile
- Social media icons with hover effects
- Contact information with icons
- Copyright and legal links at bottom

### 10. Animation Utilities

**Purpose:** Consistent animations respecting user preferences.

**Interface:**

```typescript
// utils/animations.ts
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export const fadeIn: AnimationConfig;
export const slideUp: AnimationConfig;
export const scaleIn: AnimationConfig;

export function useReducedMotion(): boolean;
export function getAnimationProps(config: AnimationConfig): object;
```

**Behavior:**
- useReducedMotion hook checks prefers-reduced-motion media query
- Returns instant animations (duration: 0) when reduced motion preferred
- Default animations use ease-out easing
- Durations range from 150ms (fast) to 400ms (slow)

## Data Models

### Theme Configuration

```typescript
// styles/theme.ts
export const theme: Theme = {
  colors: {
    primary: {
      gold: '#D4AF37',
      goldLight: '#E5C158',
      goldDark: '#B8941F',
    },
    neutral: {
      charcoal: '#36454F',
      charcoalLight: '#4A5A65',
      charcoalDark: '#2A3439',
      gray100: '#F7F7F7',
      gray200: '#E5E5E5',
      gray300: '#D1D1D1',
      gray400: '#9E9E9E',
      gray500: '#6B6B6B',
      white: '#FFFFFF',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: 'Georgia, "Times New Roman", serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '400ms ease-out',
  },
};
```

### Icon Mapping

```typescript
// utils/iconMapping.ts
import {
  FaHome,
  FaCalculator,
  FaUsers,
  FaPhone,
  FaStar,
  FaBook,
  FaChartLine,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  // ... more icons
} from 'react-icons/fa';

export const iconMap = {
  home: FaHome,
  calculator: FaCalculator,
  team: FaUsers,
  phone: FaPhone,
  star: FaStar,
  book: FaBook,
  chart: FaChartLine,
  success: FaCheckCircle,
  info: FaInfoCircle,
  warning: FaExclamationTriangle,
  // ... more mappings
};

export type IconName = keyof typeof iconMap;
```

### Calculator Data Models

```typescript
// types/calculator.ts
export interface CalculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment?: number;
  propertyTax?: number;
  homeInsurance?: number;
  hoa?: number;
  pmi?: number;
}

export interface CalculatorOutput {
  monthlyPayment: number;
  principalAndInterest: number;
  propertyTax: number;
  homeInsurance: number;
  hoa: number;
  pmi: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface ChartDataPoint {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After analyzing all acceptance criteria, the following properties represent testable, universal behaviors that validate the UI redesign requirements. Many criteria were identified as non-testable (documentation, subjective design goals, implementation order) or examples (specific page structures). The properties below focus on behaviors that can be verified across all components and pages.

### Property 1: Emoji Elimination

*For any* rendered component in the application, the output HTML should not contain any emoji characters (Unicode ranges U+1F300-U+1F9FF, U+2600-U+26FF, U+2700-U+27BF).

**Validates: Requirements 1.2, 1.3**

### Property 2: Icon Accessibility

*For any* Icon component used for functional purposes (not purely decorative), the component should have an aria-label or aria-labelledby attribute.

**Validates: Requirements 1.5, 12.2**

### Property 3: Chart Visualization for Calculator Results

*For any* calculator result display, when calculation data is available, the rendered output should include a Chart component from the Chart_Library.

**Validates: Requirements 2.1**

### Property 4: Chart Color Consistency

*For any* Chart component rendered, the color props passed to the chart should be values from the theme Color_Scheme.

**Validates: Requirements 2.6**

### Property 5: Chart Responsiveness

*For any* Chart component, rendering at different viewport widths (320px, 768px, 1024px) should complete without errors and maintain readability.

**Validates: Requirements 2.5, 11.5**

### Property 6: Typography Consistency

*For any* text element (headings, paragraphs, labels), the applied font size, weight, and line height should match values defined in the theme typography configuration.

**Validates: Requirements 3.3, 6.1**

### Property 7: Spacing Consistency

*For any* component using spacing (margins, padding, gaps), the spacing values should be multiples of the theme spacing units.

**Validates: Requirements 3.4**

### Property 8: Viewport Intersection Animations

*For any* element with viewport-triggered animations, when the element enters the viewport, an animation class or style should be applied.

**Validates: Requirements 4.4, 13.2**

### Property 9: Responsive Rendering

*For any* page in the application, rendering at mobile (320px), tablet (768px), and desktop (1024px) viewport widths should complete without errors.

**Validates: Requirements 4.5, 6.5, 9.5, 11.1**

### Property 10: Input Visual Feedback

*For any* Input component, when the user interacts with it (focus, blur, change), the component should update its visual state (border color, background, or label position).

**Validates: Requirements 5.5**

### Property 11: Responsive Layout Adaptation

*For any* page with responsive layouts, when the viewport width crosses a defined breakpoint (768px, 1024px), the layout structure should change (grid columns, flex direction, or visibility).

**Validates: Requirements 11.2**

### Property 12: Touch Target Sizing

*For any* interactive element (buttons, links, form controls), the rendered element should have a minimum size of 44x44 pixels on mobile viewports.

**Validates: Requirements 11.3**

### Property 13: WCAG Compliance

*For any* page in the application, automated accessibility testing (using axe-core or similar) should report zero violations of WCAG 2.1 AA standards.

**Validates: Requirements 12.1**

### Property 14: Color Contrast Compliance

*For any* color combination used for text on background in the theme, the contrast ratio should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 12.3, 15.4**

### Property 15: Keyboard Accessibility

*For any* interactive element (buttons, links, form controls), the element should be focusable via keyboard (tabIndex >= 0 or naturally focusable element).

**Validates: Requirements 12.4**

### Property 16: Focus Indicators

*For any* interactive element, when focused, the element should have a visible focus indicator (outline, border, or box-shadow that differs from unfocused state).

**Validates: Requirements 12.5**

### Property 17: Chart Accessibility

*For any* Chart component, the component should include either a hidden data table or an aria-describedby attribute pointing to a text description of the data.

**Validates: Requirements 12.6**

### Property 18: Interactive Element Transitions

*For any* interactive element (buttons, links, cards), the element should have CSS transition properties defined for state changes.

**Validates: Requirements 13.1**

### Property 19: Reduced Motion Respect

*For any* animated element, when the user has prefers-reduced-motion enabled, the animation duration should be 0ms or the animation should be disabled.

**Validates: Requirements 13.3**

### Property 20: Animation Duration Constraints

*For any* animation or transition defined in the application, the duration value should be between 150ms and 400ms (unless reduced motion is preferred).

**Validates: Requirements 13.4**

### Property 21: Reading Width Constraints

*For any* long-form text content (blog posts, articles, content pages), the text container should have a max-width constraint to limit line length to approximately 60-80 characters.

**Validates: Requirements 16.5**

### Property 22: Button Component Consistency

*For any* button element in the application, the element should use the Button component from the design system rather than native button elements with custom styles.

**Validates: Requirements 17.1**

### Property 23: Input Component Consistency

*For any* form input element in the application, the element should use the Input component from the design system rather than native input elements with custom styles.

**Validates: Requirements 17.2**

### Property 24: Card Component Consistency

*For any* content container that groups related information with visual boundaries, the container should use the Card component from the design system.

**Validates: Requirements 17.3**

### Property 25: Functionality Preservation

*For any* page that has been migrated to the new design, all existing interactive functionality (form submissions, calculations, navigation) should continue to work identically to the pre-migration behavior.

**Validates: Requirements 19.3**

## Error Handling

### Component Error Boundaries

All major page sections should be wrapped in React Error Boundaries to prevent entire page crashes:

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card variant="outlined" padding="lg">
          <Icon icon={FaExclamationTriangle} color="error" />
          <h3>Something went wrong</h3>
          <p>We're sorry, but this section failed to load.</p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### Chart Rendering Errors

Charts may fail to render due to invalid data or library issues:

```typescript
// components/design-system/Chart/Chart.tsx
export const Chart: React.FC<ChartProps> = ({ data, type, ...props }) => {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    return (
      <div className="chart-error">
        <Icon icon={FaChartLine} size="lg" color="gray400" />
        <p>Unable to display chart</p>
        <Button size="sm" onClick={() => setError(null)}>Retry</Button>
      </div>
    );
  }

  try {
    return <ChartComponent data={data} type={type} {...props} />;
  } catch (err) {
    setError(err as Error);
    return null;
  }
};
```

### Icon Loading Errors

If an icon fails to load or is not found:

```typescript
// components/design-system/Icon/Icon.tsx
export const Icon: React.FC<IconProps> = ({ icon: IconComponent, ...props }) => {
  if (!IconComponent) {
    console.warn('Icon component not found');
    return null; // Fail silently for missing icons
  }

  return <IconComponent {...props} />;
};
```

### Image Loading Errors

Images should have fallback handling:

```typescript
// components/Image.tsx
export const Image: React.FC<ImageProps> = ({ src, alt, fallback }) => {
  const [error, setError] = React.useState(false);

  if (error && fallback) {
    return <img src={fallback} alt={alt} />;
  }

  if (error) {
    return (
      <div className="image-placeholder">
        <Icon icon={FaImage} size="lg" color="gray400" />
      </div>
    );
  }

  return <img src={src} alt={alt} onError={() => setError(true)} />;
};
```

### Form Validation Errors

Input components should handle validation errors gracefully:

```typescript
// components/design-system/Input/Input.tsx
export const Input: React.FC<InputProps> = ({ error, ...props }) => {
  return (
    <div className="input-wrapper">
      <input {...props} aria-invalid={!!error} aria-describedby={error ? 'error-msg' : undefined} />
      {error && (
        <span id="error-msg" className="error-message" role="alert">
          <Icon icon={FaExclamationCircle} size="sm" />
          {error}
        </span>
      )}
    </div>
  );
};
```

### Animation Errors

Animations should degrade gracefully if the animation library fails:

```typescript
// utils/animations.ts
export function useAnimation(config: AnimationConfig) {
  const reducedMotion = useReducedMotion();
  
  try {
    if (reducedMotion) {
      return { duration: 0 };
    }
    return config;
  } catch (err) {
    console.warn('Animation error:', err);
    return { duration: 0 }; // Disable animations on error
  }
}
```

## Testing Strategy

### Dual Testing Approach

The UI redesign requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific component examples, edge cases, and integration points
- **Property tests**: Verify universal properties across all components and pages

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across many generated inputs.

### Property-Based Testing Configuration

**Library Selection**: Use `@fast-check/jest` for TypeScript/React property-based testing.

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: ui-redesign, Property {number}: {property_text}`

**Example Property Test**:

```typescript
// __tests__/emoji-elimination.property.test.tsx
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { getAllComponents } from '../test-utils/component-registry';

// Feature: ui-redesign, Property 1: Emoji Elimination
describe('Property 1: Emoji Elimination', () => {
  it('should not render any emoji characters in any component', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getAllComponents()),
        fc.record({
          text: fc.string(),
          number: fc.integer(),
          boolean: fc.boolean(),
        }),
        (Component, props) => {
          const { container } = render(<Component {...props} />);
          const html = container.innerHTML;
          
          // Check for emoji Unicode ranges
          const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
          expect(html).not.toMatch(emojiRegex);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

**Component Testing**:
- Test each design system component in isolation
- Test component variants (primary, secondary, etc.)
- Test component states (hover, focus, disabled, etc.)
- Test accessibility attributes
- Test responsive behavior at key breakpoints

**Example Unit Test**:

```typescript
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../components/design-system/Button';

describe('Button Component', () => {
  it('should render primary variant with correct styles', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button-primary');
  });

  it('should render icon with correct positioning', () => {
    render(
      <Button variant="primary" icon={<TestIcon />} iconPosition="left">
        Click me
      </Button>
    );
    const button = screen.getByRole('button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.parentElement).toHaveClass('icon-left');
  });

  it('should be keyboard accessible', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });
});
```

**Page Testing**:
- Test that pages render without errors
- Test that pages include expected components
- Test that pages are responsive
- Test that pages maintain existing functionality

**Integration Testing**:
- Test calculator flows with new UI components
- Test form submissions with new Input components
- Test navigation with new Header component
- Test that charts display correctly with calculator results

### Accessibility Testing

Use `jest-axe` for automated accessibility testing:

```typescript
// __tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations on home page', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on calculator page', async () => {
    const { container } = render(<CalculatorPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Visual Regression Testing

Consider using Chromatic or Percy for visual regression testing:
- Capture screenshots of all pages before migration
- Capture screenshots after migration
- Compare for unintended visual changes
- Review and approve intentional design changes

### Performance Testing

Monitor performance metrics during migration:
- Page load time (should not increase)
- Time to Interactive (should not increase)
- Bundle size (should not significantly increase)
- Lighthouse scores (should maintain or improve)

### Test Organization

```
app/
├── __tests__/
│   ├── properties/
│   │   ├── emoji-elimination.property.test.tsx
│   │   ├── icon-accessibility.property.test.tsx
│   │   ├── responsive-rendering.property.test.tsx
│   │   └── ...
│   ├── components/
│   │   ├── Button.test.tsx
│   │   ├── Card.test.tsx
│   │   ├── Input.test.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── home.test.tsx
│   │   ├── calculators.test.tsx
│   │   └── ...
│   └── accessibility/
│       ├── wcag-compliance.test.tsx
│       └── keyboard-navigation.test.tsx
└── test-utils/
    ├── component-registry.ts
    ├── render-with-theme.tsx
    └── test-data-generators.ts
```

### Testing Priorities

1. **Critical Path**: Calculator functionality, form submissions, navigation
2. **Design System**: Core components (Button, Input, Card, Icon, Chart)
3. **Accessibility**: WCAG compliance, keyboard navigation, screen reader support
4. **Responsive**: Mobile, tablet, desktop rendering
5. **Visual**: Consistent styling, proper spacing, color usage
6. **Performance**: Bundle size, load times, animation performance

### Continuous Testing

- Run unit tests on every commit
- Run property tests on every pull request
- Run accessibility tests on every pull request
- Run visual regression tests on every pull request
- Run performance tests weekly or before major releases
