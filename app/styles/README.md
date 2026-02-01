# Theme System

This directory contains the centralized theme configuration for the Model Mortgage website redesign.

## Files

### `theme.ts`
The main theme configuration file containing:
- **Color Palette**: Primary (gold), neutral (charcoal, grays), and semantic colors
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (4px base unit)
- **Breakpoints**: Responsive design breakpoints
- **Shadows**: Box shadow values for elevation
- **Transitions**: Animation timing values

### `colors.ts`
Color utilities and accessibility helpers:
- **Contrast Ratios**: Pre-calculated WCAG AA contrast ratios
- **Accessible Pairs**: Pre-validated color combinations
- **Semantic Guidelines**: Usage guidelines for semantic colors
- **Utility Functions**: Calculate contrast ratios and check WCAG compliance
- **Chart Colors**: Accessible color palette for data visualization

### `typography.ts`
Typography utilities and heading definitions:
- **Heading Sizes**: Pre-configured h1-h6 styles with proper hierarchy
- **Body Text Styles**: Default, large, small, long-form, and caption styles
- **Font Weight Utilities**: Easy access to all font weights
- **Line Height Utilities**: Tight, normal, and relaxed line heights
- **Font Size Scale**: Complete scale from xs to 5xl
- **Helper Functions**: Get heading styles, convert to pixels, validate hierarchy
- **CSS Variables**: Pre-configured CSS custom properties

### `spacing.ts`
Spacing and layout utilities:
- **Spacing Scale**: 4px-based spacing system (xs through 3xl)
- **Breakpoints**: Responsive design breakpoints with media query helpers
- **Shadows**: Box shadow values for elevation and depth
- **Transitions**: Animation timing values (150-400ms)
- **Helper Functions**: Convert units, validate values, create custom transitions
- **CSS Variables**: Pre-configured CSS custom properties
- **Container Utilities**: Max-width values for responsive containers

See [SPACING_LAYOUT_SYSTEM.md](./SPACING_LAYOUT_SYSTEM.md) for detailed documentation.

### `index.ts`
Central export point for all theme utilities.

## Usage

### Importing the Theme

```typescript
// Import the complete theme
import { theme } from '@/app/styles';

// Import specific parts
import { colors, typography, spacing } from '@/app/styles';

// Import types
import type { Theme, ColorPalette } from '@/app/styles';
```

### Using Colors

```typescript
import { colors } from '@/app/styles';

// Primary colors
const goldText = colors.primary.gold;        // #8B6F14
const goldBg = colors.primary.goldLight;     // #D4AF37
const goldDark = colors.primary.goldDark;    // #6B5410

// Neutral colors
const textColor = colors.neutral.charcoal;   // #36454F
const bgColor = colors.neutral.white;        // #FFFFFF

// Semantic colors
const successColor = colors.semantic.success; // #0D9668
const errorColor = colors.semantic.error;     // #DC2626
```

### Using Typography

```typescript
import { typography } from '@/app/styles';

// Font sizes
const bodySize = typography.fontSize.base;    // 1rem (16px)
const headingSize = typography.fontSize['3xl']; // 1.875rem (30px)

// Font weights
const normalWeight = typography.fontWeight.regular; // 400
const boldWeight = typography.fontWeight.bold;      // 700

// Line heights
const bodyLineHeight = typography.lineHeight.normal; // 1.5
```

### Using Heading Styles

```typescript
import { headingSizes, getHeadingStyle } from '@/app/styles';

// Get pre-configured heading styles
const h1Style = headingSizes.h1;
// { fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, fontFamily: 'Georgia, ...' }

// Or use the helper function
const h2Style = getHeadingStyle(2);

// Apply to a component
const Heading = styled.h1`
  font-size: ${headingSizes.h1.fontSize};
  font-weight: ${headingSizes.h1.fontWeight};
  line-height: ${headingSizes.h1.lineHeight};
  font-family: ${headingSizes.h1.fontFamily};
`;
```

### Using Body Text Styles

```typescript
import { bodyTextStyles } from '@/app/styles';

// Default body text
const defaultText = bodyTextStyles.default;
// { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5, fontFamily: '...' }

// Long-form content with relaxed line height
const articleText = bodyTextStyles.longForm;
// { fontSize: '1rem', fontWeight: 400, lineHeight: 1.75, fontFamily: '...' }

// Small caption text
const captionText = bodyTextStyles.caption;
// { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5, fontFamily: '...' }
```

### Using Spacing

```typescript
import { spacing } from '@/app/styles';

// Spacing values
const smallGap = spacing.sm;   // 0.5rem (8px)
const mediumGap = spacing.md;  // 1rem (16px)
const largeGap = spacing.lg;   // 1.5rem (24px)
```

### Checking Color Contrast

```typescript
import { meetsWCAGAA, getContrastRatio } from '@/app/styles';

// Check if a color combination meets WCAG AA
const result = meetsWCAGAA('#8B6F14', '#FFFFFF', false);
console.log(result.passes); // true
console.log(result.ratio);  // 4.79

// Get contrast ratio between two colors
const ratio = getContrastRatio('#8B6F14', '#FFFFFF');
console.log(ratio); // 4.79
```

## Color Palette

### Primary Colors

| Color | Hex | Usage | Contrast on White |
|-------|-----|-------|-------------------|
| Gold | `#8B6F14` | Primary brand color, text | 4.79:1 ✓ |
| Gold Light | `#D4AF37` | Backgrounds, decorative | - |
| Gold Dark | `#6B5410` | Active states, emphasis | - |

### Neutral Colors

| Color | Hex | Usage | Contrast on White |
|-------|-----|-------|-------------------|
| Charcoal | `#36454F` | Primary text, dark backgrounds | 9.9:1 ✓ |
| Charcoal Light | `#4A5A65` | Secondary text | 7.14:1 ✓ |
| Charcoal Dark | `#2A3439` | Emphasis text | 12.74:1 ✓ |
| Gray 100 | `#F7F7F7` | Light backgrounds | - |
| Gray 200 | `#E5E5E5` | Borders, dividers | - |
| Gray 300 | `#D1D1D1` | Disabled states | - |
| Gray 400 | `#757575` | Secondary text (large) | 4.61:1 ✓ |
| Gray 500 | `#6B6B6B` | Secondary text | 5.33:1 ✓ |
| White | `#FFFFFF` | Backgrounds, text on dark | - |

### Semantic Colors

| Color | Hex | Usage | Contrast on White |
|-------|-----|-------|-------------------|
| Success | `#0D9668` | Success states, positive feedback | 3.76:1 (large text) ✓ |
| Warning | `#D97706` | Warning states, caution | 3.19:1 (large text) ✓ |
| Error | `#DC2626` | Error states, validation errors | 4.83:1 ✓ |
| Info | `#2563EB` | Informational messages | 5.17:1 ✓ |

## Accessibility

All color combinations in this theme have been verified to meet **WCAG AA** accessibility standards:

- **Normal text** (< 18px or < 14px bold): 4.5:1 minimum contrast ratio
- **Large text** (≥ 18px or ≥ 14px bold): 3:1 minimum contrast ratio

### Verified Combinations

✓ Gold on White: 4.79:1 (normal text)  
✓ Charcoal on White: 9.9:1 (normal text)  
✓ White on Charcoal: 9.9:1 (normal text)  
✓ White on Gold: 4.79:1 (normal text)  
✓ Error on White: 4.83:1 (normal text)  
✓ Info on White: 5.17:1 (normal text)  
✓ Success on White: 3.76:1 (large text)  
✓ Warning on White: 3.19:1 (large text)  

## Typography Scale

| Size | Value | Pixels | Usage |
|------|-------|--------|-------|
| xs | 0.75rem | 12px | Small labels, captions |
| sm | 0.875rem | 14px | Secondary text |
| base | 1rem | 16px | Body text (default) |
| lg | 1.125rem | 18px | Large body text |
| xl | 1.25rem | 20px | Small headings |
| 2xl | 1.5rem | 24px | Medium headings |
| 3xl | 1.875rem | 30px | Large headings |
| 4xl | 2.25rem | 36px | Extra large headings |
| 5xl | 3rem | 48px | Hero headings |

## Heading Hierarchy

| Heading | Size | Pixels | Weight | Line Height | Font Family | Usage |
|---------|------|--------|--------|-------------|-------------|-------|
| h1 | 3rem | 48px | 700 (bold) | 1.2 (tight) | Georgia (serif) | Page titles, hero headings |
| h2 | 2.25rem | 36px | 700 (bold) | 1.2 (tight) | Georgia (serif) | Section headings |
| h3 | 1.875rem | 30px | 600 (semibold) | 1.2 (tight) | Georgia (serif) | Subsection headings |
| h4 | 1.5rem | 24px | 600 (semibold) | 1.5 (normal) | System (sans-serif) | Card titles, component headings |
| h5 | 1.25rem | 20px | 500 (medium) | 1.5 (normal) | System (sans-serif) | Small headings, labels |
| h6 | 1.125rem | 18px | 500 (medium) | 1.5 (normal) | System (sans-serif) | Smallest headings, captions |

### Heading Guidelines

- **h1-h3**: Use serif font (Georgia) for elegant, traditional feel
- **h4-h6**: Use sans-serif font (system) for modern, clean look
- **h1-h3**: Use tight line height (1.2) for compact headings
- **h4-h6**: Use normal line height (1.5) for better readability
- **h1-h2**: Use bold weight (700) for maximum emphasis
- **h3-h4**: Use semibold weight (600) for strong emphasis
- **h5-h6**: Use medium weight (500) for subtle emphasis

## Spacing Scale

| Size | Value | Pixels | Usage |
|------|-------|--------|-------|
| xs | 0.25rem | 4px | Tight spacing |
| sm | 0.5rem | 8px | Compact spacing, icon gaps |
| md | 1rem | 16px | Default spacing |
| lg | 1.5rem | 24px | Generous spacing |
| xl | 2rem | 32px | Large spacing |
| 2xl | 3rem | 48px | Extra large spacing |
| 3xl | 4rem | 64px | Maximum spacing |

## Breakpoints

| Breakpoint | Value | Usage |
|------------|-------|-------|
| mobile | 320px | Small phones and up |
| tablet | 768px | Tablets and up |
| desktop | 1024px | Desktop and up |
| wide | 1440px | Large desktop and up |

## Verification

To verify all color combinations meet WCAG AA standards, run:

```bash
node verify-contrast.js
```

This will check all color combinations and report any that don't meet accessibility standards.

## Best Practices

1. **Always use theme colors** instead of hardcoded hex values
2. **Check contrast ratios** when creating new color combinations
3. **Use semantic colors** for their intended purposes (success, error, etc.)
4. **Follow the spacing scale** for consistent layouts
5. **Use the typography scale** for consistent text hierarchy
6. **Test at all breakpoints** to ensure responsive design works correctly

## Examples

### CSS Module

```css
.button {
  background-color: var(--color-gold);
  color: var(--color-white);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-fast);
}
```

### Inline Styles (TypeScript)

```typescript
import { colors, spacing, typography } from '@/app/styles';

const buttonStyle = {
  backgroundColor: colors.primary.gold,
  color: colors.neutral.white,
  padding: `${spacing.md} ${spacing.lg}`,
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
};
```

### Styled Components

```typescript
import styled from 'styled-components';
import { colors, spacing, typography } from '@/app/styles';

const Button = styled.button`
  background-color: ${colors.primary.gold};
  color: ${colors.neutral.white};
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
`;
```
