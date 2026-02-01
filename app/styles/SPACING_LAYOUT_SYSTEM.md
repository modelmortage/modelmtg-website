# Spacing and Layout System

This document describes the spacing and layout system for the Model Mortgage website redesign. The system provides consistent spacing, responsive breakpoints, shadows, and transitions throughout the application.

## Table of Contents

1. [Spacing Scale](#spacing-scale)
2. [Breakpoints](#breakpoints)
3. [Shadows](#shadows)
4. [Transitions](#transitions)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

---

## Spacing Scale

The spacing system is based on a **4px base unit** for consistent spacing throughout the application. All spacing values are multiples of 4px.

### Available Spacing Values

| Size | Value (rem) | Value (px) | Use Case |
|------|-------------|------------|----------|
| `xs` | 0.25rem | 4px | Tight spacing, small gaps between related elements |
| `sm` | 0.5rem | 8px | Compact spacing, icon gaps, small padding |
| `md` | 1rem | 16px | Default spacing, comfortable gaps, standard padding |
| `lg` | 1.5rem | 24px | Generous spacing, section gaps, card padding |
| `xl` | 2rem | 32px | Large spacing, major sections, component separation |
| `2xl` | 3rem | 48px | Extra large spacing, page sections, hero padding |
| `3xl` | 4rem | 64px | Maximum spacing, hero sections, major page divisions |

### Importing Spacing

```typescript
// Import from theme
import { spacing } from '@/app/styles/theme';

// Import from spacing utilities
import { spacingScale, getSpacingInPixels } from '@/app/styles/spacing';
```

### Usage in Components

```typescript
// In TypeScript/React
const styles = {
  padding: spacing.md,        // 1rem (16px)
  marginBottom: spacing.lg,   // 1.5rem (24px)
  gap: spacing.sm,            // 0.5rem (8px)
};

// Get spacing in pixels for calculations
const paddingPx = getSpacingInPixels('md'); // 16
```

### Usage in CSS Modules

```css
.container {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-sm);
}

.hero {
  padding-top: var(--spacing-3xl);
  padding-bottom: var(--spacing-2xl);
}
```

---

## Breakpoints

Responsive design breakpoints for different device sizes. The system uses a **mobile-first approach**.

### Available Breakpoints

| Breakpoint | Value | Description |
|------------|-------|-------------|
| `mobile` | 320px | Small phones and up |
| `tablet` | 768px | Tablets and up |
| `desktop` | 1024px | Desktop and up |
| `wide` | 1440px | Large desktop and up |

### Importing Breakpoints

```typescript
// Import from theme
import { breakpoints } from '@/app/styles/theme';

// Import from spacing utilities
import { responsiveBreakpoints, mediaQueries } from '@/app/styles/spacing';
```

### Usage with Media Queries

```typescript
// In TypeScript/React (CSS-in-JS)
const styles = {
  fontSize: '16px',
  
  // Tablet and up
  [mediaQueries.tablet]: {
    fontSize: '18px',
  },
  
  // Desktop and up
  [mediaQueries.desktop]: {
    fontSize: '20px',
  },
};
```

### Usage in CSS Modules

```css
.container {
  padding: var(--spacing-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
  }
}

/* Wide screens and up */
@media (min-width: 1440px) {
  .container {
    padding: var(--spacing-2xl);
  }
}
```

### Available Media Query Helpers

```typescript
import { mediaQueries } from '@/app/styles/spacing';

// Min-width queries (mobile-first)
mediaQueries.mobile    // @media (min-width: 320px)
mediaQueries.tablet    // @media (min-width: 768px)
mediaQueries.desktop   // @media (min-width: 1024px)
mediaQueries.wide      // @media (min-width: 1440px)

// Max-width and range queries
mediaQueries.mobileOnly   // @media (max-width: 767px)
mediaQueries.tabletOnly   // @media (min-width: 768px) and (max-width: 1023px)
mediaQueries.desktopOnly  // @media (min-width: 1024px) and (max-width: 1439px)
```

---

## Shadows

Box shadow values for elevation and depth. Use shadows to create visual hierarchy and indicate interactive elements.

### Available Shadow Values

| Size | Value | Use Case |
|------|-------|----------|
| `sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle shadow for slight elevation (input fields, small cards) |
| `md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Medium shadow for cards and buttons |
| `lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Large shadow for modals and popovers |
| `xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Extra large shadow for prominent elements (hero cards, featured content) |

### Importing Shadows

```typescript
// Import from theme
import { shadows } from '@/app/styles/theme';

// Import from spacing utilities
import { shadowValues, getShadow } from '@/app/styles/spacing';
```

### Usage in Components

```typescript
// In TypeScript/React
const styles = {
  boxShadow: shadows.md,  // Medium shadow for cards
};

// Get shadow value
const cardShadow = getShadow('md');
```

### Usage in CSS Modules

```css
.card {
  box-shadow: var(--shadow-md);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.modal {
  box-shadow: var(--shadow-xl);
}

.input {
  box-shadow: var(--shadow-sm);
}
```

---

## Transitions

Animation timing for smooth interactions. All durations are between **150ms and 400ms** for optimal perceived performance.

### Available Transition Values

| Speed | Value | Duration | Use Case |
|-------|-------|----------|----------|
| `fast` | `150ms ease-out` | 150ms | Quick transitions, hover effects, color changes |
| `normal` | `250ms ease-out` | 250ms | Default transitions, most interactions, opacity changes |
| `slow` | `400ms ease-out` | 400ms | Slow transitions, complex animations, layout changes |

### Importing Transitions

```typescript
// Import from theme
import { transitions } from '@/app/styles/theme';

// Import from spacing utilities
import { transitionValues, getTransition, createTransition } from '@/app/styles/spacing';
```

### Usage in Components

```typescript
// In TypeScript/React
const styles = {
  transition: transitions.normal,  // 250ms ease-out
};

// Create custom transition
const customTransition = createTransition(['opacity', 'transform'], 250);
// Result: 'opacity 250ms ease-out, transform 250ms ease-out'
```

### Usage in CSS Modules

```css
.button {
  transition: var(--transition-fast);
  /* Transitions all properties in 150ms */
}

.card {
  transition: var(--transition-normal);
  /* Transitions all properties in 250ms */
}

.modal {
  transition: var(--transition-slow);
  /* Transitions all properties in 400ms */
}

/* Specific properties */
.link {
  transition: color 150ms ease-out, background-color 150ms ease-out;
}
```

### Respecting Reduced Motion

Always respect user preferences for reduced motion:

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Usage Examples

### Example 1: Card Component

```typescript
import { spacing, shadows, transitions } from '@/app/styles/theme';

const cardStyles = {
  padding: spacing.lg,           // 24px padding
  marginBottom: spacing.md,      // 16px margin
  borderRadius: '8px',
  boxShadow: shadows.md,         // Medium shadow
  transition: transitions.normal, // 250ms transition
  
  '&:hover': {
    boxShadow: shadows.lg,       // Larger shadow on hover
    transform: 'translateY(-4px)',
  },
};
```

### Example 2: Responsive Container

```typescript
import { spacing, breakpoints } from '@/app/styles/theme';
import { mediaQueries } from '@/app/styles/spacing';

const containerStyles = {
  padding: spacing.md,           // 16px on mobile
  
  [mediaQueries.tablet]: {
    padding: spacing.lg,         // 24px on tablet
  },
  
  [mediaQueries.desktop]: {
    padding: spacing.xl,         // 32px on desktop
  },
  
  [mediaQueries.wide]: {
    padding: spacing['2xl'],     // 48px on wide screens
  },
};
```

### Example 3: Button with Transitions

```typescript
import { spacing, transitions } from '@/app/styles/theme';

const buttonStyles = {
  padding: `${spacing.sm} ${spacing.lg}`,  // 8px 24px
  transition: createTransition(['background-color', 'transform'], 150),
  
  '&:hover': {
    transform: 'scale(1.05)',
  },
  
  '&:active': {
    transform: 'scale(0.95)',
  },
};
```

### Example 4: CSS Module with Variables

```css
/* styles.module.css */
.container {
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }
}

.container:hover {
  box-shadow: var(--shadow-md);
}
```

---

## Best Practices

### Spacing

1. **Use the spacing scale consistently** - Always use values from the spacing scale rather than arbitrary pixel values.

2. **Maintain vertical rhythm** - Use consistent spacing between elements to create visual harmony.

3. **Group related elements** - Use smaller spacing (xs, sm) for related elements and larger spacing (lg, xl) for separate sections.

4. **Responsive spacing** - Increase spacing on larger screens for better use of space.

```typescript
// ✅ Good - Uses spacing scale
padding: spacing.md,
marginBottom: spacing.lg,

// ❌ Bad - Arbitrary values
padding: '15px',
marginBottom: '23px',
```

### Breakpoints

1. **Mobile-first approach** - Start with mobile styles and add larger breakpoints as needed.

2. **Test at all breakpoints** - Ensure your design works at 320px, 768px, 1024px, and 1440px.

3. **Use semantic breakpoints** - Use breakpoint names (mobile, tablet, desktop) rather than pixel values.

```typescript
// ✅ Good - Mobile-first
const styles = {
  fontSize: '16px',
  [mediaQueries.tablet]: { fontSize: '18px' },
  [mediaQueries.desktop]: { fontSize: '20px' },
};

// ❌ Bad - Desktop-first
const styles = {
  fontSize: '20px',
  '@media (max-width: 1024px)': { fontSize: '18px' },
  '@media (max-width: 768px)': { fontSize: '16px' },
};
```

### Shadows

1. **Use shadows for elevation** - Larger shadows indicate higher elevation in the visual hierarchy.

2. **Animate shadows on hover** - Increase shadow size on hover to indicate interactivity.

3. **Don't overuse shadows** - Too many shadows can make the design feel cluttered.

```typescript
// ✅ Good - Progressive elevation
boxShadow: shadows.md,
'&:hover': { boxShadow: shadows.lg },

// ❌ Bad - Inconsistent shadows
boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
```

### Transitions

1. **Keep durations short** - Use 150-400ms for optimal perceived performance.

2. **Use ease-out easing** - Provides natural-feeling animations.

3. **Respect reduced motion** - Always check for `prefers-reduced-motion` preference.

4. **Transition specific properties** - Avoid transitioning `all` when possible for better performance.

```typescript
// ✅ Good - Specific properties
transition: createTransition(['opacity', 'transform'], 250),

// ❌ Bad - Transitions everything
transition: 'all 250ms ease-out',
```

### Container Widths

1. **Use max-width for readability** - Limit content width on large screens.

2. **Center containers** - Use `margin: 0 auto` to center containers.

```typescript
// ✅ Good - Responsive container
const containerStyles = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: spacing.md,
};
```

---

## Validation Functions

The spacing utilities provide validation functions to ensure consistency:

```typescript
import {
  isValidSpacingMultiple,
  getNearestSpacingMultiple,
  isValidTransitionDuration,
} from '@/app/styles/spacing';

// Check if a value is a valid spacing multiple (4px)
isValidSpacingMultiple(16);  // true
isValidSpacingMultiple(15);  // false

// Get nearest valid spacing value
getNearestSpacingMultiple(15);  // 16
getNearestSpacingMultiple(18);  // 20

// Check if transition duration is valid (150-400ms)
isValidTransitionDuration(250);  // true
isValidTransitionDuration(500);  // false
```

---

## CSS Variables

All spacing, breakpoint, shadow, and transition values are available as CSS variables:

```css
/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 3rem;
--spacing-3xl: 4rem;

/* Breakpoints */
--breakpoint-mobile: 320px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1440px;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Transitions */
--transition-fast: 150ms ease-out;
--transition-normal: 250ms ease-out;
--transition-slow: 400ms ease-out;
```

---

## Summary

The spacing and layout system provides:

- ✅ **7 spacing values** (xs through 3xl) based on 4px increments
- ✅ **4 responsive breakpoints** (mobile, tablet, desktop, wide)
- ✅ **4 shadow values** (sm, md, lg, xl) for elevation
- ✅ **3 transition speeds** (fast, normal, slow) between 150-400ms
- ✅ **Helper functions** for calculations and validation
- ✅ **CSS variables** for use in stylesheets
- ✅ **Media query helpers** for responsive design

All values meet the requirements specified in the design document and follow best practices for accessibility and performance.
