/**
 * Typography Utilities
 * 
 * Additional typography utilities and heading definitions.
 * Provides helper functions and pre-configured heading styles.
 */

import { typography } from './theme';

/**
 * Heading Sizes
 * 
 * Pre-configured heading sizes with appropriate hierarchy.
 * Each heading includes font size, font weight, and line height.
 * 
 * Usage:
 * - h1: Page titles, hero headings (48px)
 * - h2: Section headings (36px)
 * - h3: Subsection headings (30px)
 * - h4: Card titles, component headings (24px)
 * - h5: Small headings, labels (20px)
 * - h6: Smallest headings, captions (18px)
 */
export const headingSizes = {
  h1: {
    fontSize: typography.fontSize['5xl'],  // 3rem (48px)
    fontWeight: typography.fontWeight.bold,  // 700
    lineHeight: typography.lineHeight.tight,  // 1.2
    fontFamily: typography.fontFamily.heading,
  },
  h2: {
    fontSize: typography.fontSize['4xl'],  // 2.25rem (36px)
    fontWeight: typography.fontWeight.bold,  // 700
    lineHeight: typography.lineHeight.tight,  // 1.2
    fontFamily: typography.fontFamily.heading,
  },
  h3: {
    fontSize: typography.fontSize['3xl'],  // 1.875rem (30px)
    fontWeight: typography.fontWeight.semibold,  // 600
    lineHeight: typography.lineHeight.tight,  // 1.2
    fontFamily: typography.fontFamily.heading,
  },
  h4: {
    fontSize: typography.fontSize['2xl'],  // 1.5rem (24px)
    fontWeight: typography.fontWeight.semibold,  // 600
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.heading,
  },
  h5: {
    fontSize: typography.fontSize.xl,  // 1.25rem (20px)
    fontWeight: typography.fontWeight.medium,  // 500
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.primary,
  },
  h6: {
    fontSize: typography.fontSize.lg,  // 1.125rem (18px)
    fontWeight: typography.fontWeight.medium,  // 500
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.primary,
  },
};

/**
 * Body Text Styles
 * 
 * Pre-configured body text styles for different contexts.
 */
export const bodyTextStyles = {
  // Default body text (16px, regular weight, normal line height)
  default: {
    fontSize: typography.fontSize.base,  // 1rem (16px)
    fontWeight: typography.fontWeight.regular,  // 400
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.primary,
  },
  
  // Large body text for emphasis (18px)
  large: {
    fontSize: typography.fontSize.lg,  // 1.125rem (18px)
    fontWeight: typography.fontWeight.regular,  // 400
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.primary,
  },
  
  // Small body text for secondary content (14px)
  small: {
    fontSize: typography.fontSize.sm,  // 0.875rem (14px)
    fontWeight: typography.fontWeight.regular,  // 400
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.primary,
  },
  
  // Long-form content with relaxed line height for better readability
  longForm: {
    fontSize: typography.fontSize.base,  // 1rem (16px)
    fontWeight: typography.fontWeight.regular,  // 400
    lineHeight: typography.lineHeight.relaxed,  // 1.75
    fontFamily: typography.fontFamily.primary,
  },
  
  // Caption text for labels and small notes (12px)
  caption: {
    fontSize: typography.fontSize.xs,  // 0.75rem (12px)
    fontWeight: typography.fontWeight.regular,  // 400
    lineHeight: typography.lineHeight.normal,  // 1.5
    fontFamily: typography.fontFamily.primary,
  },
};

/**
 * Font Weight Utilities
 * 
 * Helper functions to apply font weights consistently.
 */
export const fontWeights = {
  light: typography.fontWeight.light,      // 300
  regular: typography.fontWeight.regular,  // 400
  medium: typography.fontWeight.medium,    // 500
  semibold: typography.fontWeight.semibold, // 600
  bold: typography.fontWeight.bold,        // 700
};

/**
 * Line Height Utilities
 * 
 * Helper functions to apply line heights consistently.
 */
export const lineHeights = {
  tight: typography.lineHeight.tight,      // 1.2 - For headings
  normal: typography.lineHeight.normal,    // 1.5 - For body text
  relaxed: typography.lineHeight.relaxed,  // 1.75 - For long-form content
};

/**
 * Font Size Scale
 * 
 * Complete font size scale from xs to 5xl.
 */
export const fontSizes = {
  xs: typography.fontSize.xs,      // 0.75rem (12px)
  sm: typography.fontSize.sm,      // 0.875rem (14px)
  base: typography.fontSize.base,  // 1rem (16px)
  lg: typography.fontSize.lg,      // 1.125rem (18px)
  xl: typography.fontSize.xl,      // 1.25rem (20px)
  '2xl': typography.fontSize['2xl'], // 1.5rem (24px)
  '3xl': typography.fontSize['3xl'], // 1.875rem (30px)
  '4xl': typography.fontSize['4xl'], // 2.25rem (36px)
  '5xl': typography.fontSize['5xl'], // 3rem (48px)
};

/**
 * Typography CSS Variables
 * 
 * CSS custom properties for use in stylesheets.
 * These can be used in CSS modules or global styles.
 */
export const typographyCSSVariables = {
  // Font families
  '--font-family-primary': typography.fontFamily.primary,
  '--font-family-heading': typography.fontFamily.heading,
  
  // Font sizes
  '--font-size-xs': typography.fontSize.xs,
  '--font-size-sm': typography.fontSize.sm,
  '--font-size-base': typography.fontSize.base,
  '--font-size-lg': typography.fontSize.lg,
  '--font-size-xl': typography.fontSize.xl,
  '--font-size-2xl': typography.fontSize['2xl'],
  '--font-size-3xl': typography.fontSize['3xl'],
  '--font-size-4xl': typography.fontSize['4xl'],
  '--font-size-5xl': typography.fontSize['5xl'],
  
  // Font weights
  '--font-weight-light': typography.fontWeight.light.toString(),
  '--font-weight-regular': typography.fontWeight.regular.toString(),
  '--font-weight-medium': typography.fontWeight.medium.toString(),
  '--font-weight-semibold': typography.fontWeight.semibold.toString(),
  '--font-weight-bold': typography.fontWeight.bold.toString(),
  
  // Line heights
  '--line-height-tight': typography.lineHeight.tight.toString(),
  '--line-height-normal': typography.lineHeight.normal.toString(),
  '--line-height-relaxed': typography.lineHeight.relaxed.toString(),
};

/**
 * Get heading style by level
 * 
 * @param level - Heading level (1-6)
 * @returns Heading style object
 */
export function getHeadingStyle(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const headingKey = `h${level}` as keyof typeof headingSizes;
  return headingSizes[headingKey];
}

/**
 * Get font size in pixels
 * 
 * Converts rem values to pixels for calculations.
 * Assumes base font size of 16px.
 * 
 * @param size - Font size key (xs, sm, base, etc.)
 * @returns Font size in pixels
 */
export function getFontSizeInPixels(size: keyof typeof fontSizes): number {
  const remValue = parseFloat(fontSizes[size]);
  return remValue * 16; // Base font size is 16px
}

/**
 * Check if font size meets minimum requirement
 * 
 * @param size - Font size key
 * @param minimum - Minimum size in pixels (default: 16px)
 * @returns Whether the font size meets the minimum
 */
export function meetsMinimumFontSize(
  size: keyof typeof fontSizes,
  minimum: number = 16
): boolean {
  const pixels = getFontSizeInPixels(size);
  return pixels >= minimum;
}

/**
 * Get optimal line length for readability
 * 
 * Returns the maximum width for text containers to maintain
 * optimal reading width (60-80 characters).
 * 
 * @param fontSize - Font size key
 * @returns Maximum width in rem units
 */
export function getOptimalLineLength(size: keyof typeof fontSizes): string {
  const pixels = getFontSizeInPixels(size);
  // Optimal line length is approximately 70 characters
  // Average character width is roughly 0.5em
  const optimalWidth = 70 * pixels * 0.5;
  return `${optimalWidth / 16}rem`; // Convert to rem
}

/**
 * Typography Hierarchy Validation
 * 
 * Validates that heading sizes follow proper hierarchy.
 * Each heading should be smaller than the previous level.
 */
export function validateTypographyHierarchy(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check that h1 > h2 > h3 > h4 > h5 > h6
  const h1Size = getFontSizeInPixels('5xl');
  const h2Size = getFontSizeInPixels('4xl');
  const h3Size = getFontSizeInPixels('3xl');
  const h4Size = getFontSizeInPixels('2xl');
  const h5Size = getFontSizeInPixels('xl');
  const h6Size = getFontSizeInPixels('lg');
  
  if (h1Size <= h2Size) errors.push('h1 should be larger than h2');
  if (h2Size <= h3Size) errors.push('h2 should be larger than h3');
  if (h3Size <= h4Size) errors.push('h3 should be larger than h4');
  if (h4Size <= h5Size) errors.push('h4 should be larger than h5');
  if (h5Size <= h6Size) errors.push('h5 should be larger than h6');
  
  // Check that base font size is at least 16px
  const baseSize = getFontSizeInPixels('base');
  if (baseSize < 16) {
    errors.push('Base font size should be at least 16px');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export typography from theme for convenience
 */
export { typography };
export default typography;
