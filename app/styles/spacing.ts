/**
 * Spacing Utilities
 * 
 * Additional spacing utilities and helper functions.
 * Provides consistent spacing throughout the application.
 */

import { spacing, breakpoints, shadows, transitions } from './theme';

/**
 * Spacing Scale
 * 
 * Consistent spacing scale based on 4px base unit.
 * Use these values for margins, padding, and gaps.
 */
export const spacingScale = {
  xs: spacing.xs,    // 0.25rem (4px)
  sm: spacing.sm,    // 0.5rem (8px)
  md: spacing.md,    // 1rem (16px)
  lg: spacing.lg,    // 1.5rem (24px)
  xl: spacing.xl,    // 2rem (32px)
  '2xl': spacing['2xl'], // 3rem (48px)
  '3xl': spacing['3xl'], // 4rem (64px)
};

/**
 * Spacing in Pixels
 * 
 * Spacing values converted to pixels for calculations.
 */
export const spacingInPixels = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

/**
 * Get spacing value in pixels
 * 
 * @param size - Spacing size key (xs, sm, md, etc.)
 * @returns Spacing value in pixels
 */
export function getSpacingInPixels(size: keyof typeof spacingScale): number {
  return spacingInPixels[size];
}

/**
 * Get spacing value in rem
 * 
 * @param size - Spacing size key (xs, sm, md, etc.)
 * @returns Spacing value in rem
 */
export function getSpacingInRem(size: keyof typeof spacingScale): string {
  return spacingScale[size];
}

/**
 * Multiply spacing value
 * 
 * @param size - Spacing size key (xs, sm, md, etc.)
 * @param multiplier - Multiplier value
 * @returns Spacing value multiplied by the multiplier
 */
export function multiplySpacing(
  size: keyof typeof spacingScale,
  multiplier: number
): string {
  const pixels = getSpacingInPixels(size) * multiplier;
  return `${pixels / 16}rem`;
}

/**
 * Responsive Breakpoints
 * 
 * Breakpoints for different device sizes.
 */
export const responsiveBreakpoints = {
  mobile: breakpoints.mobile,    // 320px
  tablet: breakpoints.tablet,    // 768px
  desktop: breakpoints.desktop,  // 1024px
  wide: breakpoints.wide,        // 1440px
};

/**
 * Breakpoints in Pixels
 * 
 * Breakpoint values as numbers for calculations.
 */
export const breakpointsInPixels = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

/**
 * Get breakpoint value in pixels
 * 
 * @param breakpoint - Breakpoint key (mobile, tablet, desktop, wide)
 * @returns Breakpoint value in pixels
 */
export function getBreakpointInPixels(
  breakpoint: keyof typeof responsiveBreakpoints
): number {
  return breakpointsInPixels[breakpoint];
}

/**
 * Media Query Helpers
 * 
 * Helper functions to generate media queries for responsive design.
 */
export const mediaQueries = {
  /**
   * Mobile and up (min-width: 320px)
   */
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  
  /**
   * Tablet and up (min-width: 768px)
   */
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  
  /**
   * Desktop and up (min-width: 1024px)
   */
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  
  /**
   * Wide screens and up (min-width: 1440px)
   */
  wide: `@media (min-width: ${breakpoints.wide})`,
  
  /**
   * Mobile only (max-width: 767px)
   */
  mobileOnly: `@media (max-width: 767px)`,
  
  /**
   * Tablet only (min-width: 768px and max-width: 1023px)
   */
  tabletOnly: `@media (min-width: ${breakpoints.tablet}) and (max-width: 1023px)`,
  
  /**
   * Desktop only (min-width: 1024px and max-width: 1439px)
   */
  desktopOnly: `@media (min-width: ${breakpoints.desktop}) and (max-width: 1439px)`,
};

/**
 * Shadow Utilities
 * 
 * Box shadow values for elevation and depth.
 */
export const shadowValues = {
  sm: shadows.sm,  // Subtle shadow for slight elevation
  md: shadows.md,  // Medium shadow for cards and buttons
  lg: shadows.lg,  // Large shadow for modals and popovers
  xl: shadows.xl,  // Extra large shadow for prominent elements
};

/**
 * Get shadow value
 * 
 * @param size - Shadow size (sm, md, lg, xl)
 * @returns Shadow CSS value
 */
export function getShadow(size: keyof typeof shadowValues): string {
  return shadowValues[size];
}

/**
 * Transition Utilities
 * 
 * Animation timing for smooth interactions.
 * All durations are between 150ms and 400ms for optimal perceived performance.
 */
export const transitionValues = {
  fast: transitions.fast,      // 150ms ease-out
  normal: transitions.normal,  // 250ms ease-out
  slow: transitions.slow,      // 400ms ease-out
};

/**
 * Transition Durations in Milliseconds
 * 
 * Transition duration values as numbers for calculations.
 */
export const transitionDurationsInMs = {
  fast: 150,
  normal: 250,
  slow: 400,
};

/**
 * Get transition value
 * 
 * @param speed - Transition speed (fast, normal, slow)
 * @returns Transition CSS value
 */
export function getTransition(speed: keyof typeof transitionValues): string {
  return transitionValues[speed];
}

/**
 * Get transition duration in milliseconds
 * 
 * @param speed - Transition speed (fast, normal, slow)
 * @returns Duration in milliseconds
 */
export function getTransitionDuration(
  speed: keyof typeof transitionValues
): number {
  return transitionDurationsInMs[speed];
}

/**
 * Create custom transition
 * 
 * @param properties - CSS properties to transition (e.g., 'all', 'opacity', 'transform')
 * @param duration - Duration in milliseconds (150-400ms recommended)
 * @param easing - Easing function (default: 'ease-out')
 * @returns Transition CSS value
 */
export function createTransition(
  properties: string | string[],
  duration: number,
  easing: string = 'ease-out'
): string {
  // Ensure duration is within recommended range
  const clampedDuration = Math.max(150, Math.min(400, duration));
  
  const props = Array.isArray(properties) ? properties : [properties];
  return props
    .map(prop => `${prop} ${clampedDuration}ms ${easing}`)
    .join(', ');
}

/**
 * Spacing CSS Variables
 * 
 * CSS custom properties for use in stylesheets.
 */
export const spacingCSSVariables = {
  '--spacing-xs': spacing.xs,
  '--spacing-sm': spacing.sm,
  '--spacing-md': spacing.md,
  '--spacing-lg': spacing.lg,
  '--spacing-xl': spacing.xl,
  '--spacing-2xl': spacing['2xl'],
  '--spacing-3xl': spacing['3xl'],
};

/**
 * Breakpoint CSS Variables
 * 
 * CSS custom properties for breakpoints.
 */
export const breakpointCSSVariables = {
  '--breakpoint-mobile': breakpoints.mobile,
  '--breakpoint-tablet': breakpoints.tablet,
  '--breakpoint-desktop': breakpoints.desktop,
  '--breakpoint-wide': breakpoints.wide,
};

/**
 * Shadow CSS Variables
 * 
 * CSS custom properties for shadows.
 */
export const shadowCSSVariables = {
  '--shadow-sm': shadows.sm,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
};

/**
 * Transition CSS Variables
 * 
 * CSS custom properties for transitions.
 */
export const transitionCSSVariables = {
  '--transition-fast': transitions.fast,
  '--transition-normal': transitions.normal,
  '--transition-slow': transitions.slow,
};

/**
 * All Layout CSS Variables
 * 
 * Combined CSS variables for spacing, breakpoints, shadows, and transitions.
 */
export const layoutCSSVariables = {
  ...spacingCSSVariables,
  ...breakpointCSSVariables,
  ...shadowCSSVariables,
  ...transitionCSSVariables,
};

/**
 * Validate spacing value
 * 
 * Checks if a spacing value is a multiple of the base spacing unit (4px).
 * 
 * @param pixels - Spacing value in pixels
 * @returns Whether the value is a valid spacing multiple
 */
export function isValidSpacingMultiple(pixels: number): boolean {
  return pixels % 4 === 0;
}

/**
 * Get nearest valid spacing value
 * 
 * Rounds a pixel value to the nearest valid spacing multiple (4px).
 * 
 * @param pixels - Spacing value in pixels
 * @returns Nearest valid spacing value in pixels
 */
export function getNearestSpacingMultiple(pixels: number): number {
  return Math.round(pixels / 4) * 4;
}

/**
 * Validate transition duration
 * 
 * Checks if a transition duration is within the recommended range (150-400ms).
 * 
 * @param milliseconds - Duration in milliseconds
 * @returns Whether the duration is within the valid range
 */
export function isValidTransitionDuration(milliseconds: number): boolean {
  return milliseconds >= 150 && milliseconds <= 400;
}

/**
 * Container Max Widths
 * 
 * Maximum widths for content containers at different breakpoints.
 * Ensures content doesn't become too wide on large screens.
 */
export const containerMaxWidths = {
  mobile: '100%',
  tablet: '720px',
  desktop: '960px',
  wide: '1200px',
};

/**
 * Get container max width
 * 
 * @param breakpoint - Breakpoint key (mobile, tablet, desktop, wide)
 * @returns Maximum width for the container
 */
export function getContainerMaxWidth(
  breakpoint: keyof typeof containerMaxWidths
): string {
  return containerMaxWidths[breakpoint];
}

/**
 * Export all spacing utilities
 */
export {
  spacing,
  breakpoints,
  shadows,
  transitions,
};

export default {
  spacing: spacingScale,
  breakpoints: responsiveBreakpoints,
  shadows: shadowValues,
  transitions: transitionValues,
  mediaQueries,
};
