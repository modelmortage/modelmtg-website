/**
 * Color Utilities
 * 
 * Additional color utilities and contrast validation functions.
 * Ensures all color combinations meet WCAG AA accessibility standards.
 */

import { colors } from './theme';

/**
 * Color Contrast Ratios
 * 
 * Pre-calculated contrast ratios for common color combinations.
 * All ratios meet WCAG AA standards where applicable.
 * 
 * WCAG AA Requirements:
 * - Normal text (< 18px or < 14px bold): 4.5:1 minimum
 * - Large text (≥ 18px or ≥ 14px bold): 3:1 minimum
 * - UI components and graphical objects: 3:1 minimum
 */
export const contrastRatios = {
  // Primary color combinations
  goldOnWhite: 4.79,           // ✓ Normal text
  charcoalOnWhite: 9.9,        // ✓ Normal text
  whiteOnCharcoal: 9.9,        // ✓ Normal text
  whiteOnGold: 4.79,           // ✓ Normal text
  charcoalOnGoldLight: 4.71,   // ✓ Normal text
  
  // Semantic color combinations
  successOnWhite: 3.76,        // ✓ Large text
  warningOnWhite: 3.19,        // ✓ Large text
  errorOnWhite: 4.83,          // ✓ Normal text
  infoOnWhite: 5.17,           // ✓ Normal text
  
  // Neutral combinations
  gray500OnWhite: 5.33,        // ✓ Normal text
  gray400OnWhite: 4.61,        // ✓ Large text
  charcoalLightOnWhite: 7.14,  // ✓ Normal text
  charcoalDarkOnWhite: 12.74,  // ✓ Normal text
};

/**
 * Accessible Color Pairs
 * 
 * Pre-validated color pairs that meet WCAG AA standards for normal text.
 * Use these combinations for text and backgrounds.
 */
export const accessiblePairs = {
  // Dark text on light backgrounds
  darkOnLight: [
    { text: colors.neutral.charcoal, background: colors.neutral.white },
    { text: colors.neutral.charcoalLight, background: colors.neutral.white },
    { text: colors.neutral.charcoalDark, background: colors.neutral.white },
    { text: colors.neutral.gray500, background: colors.neutral.white },
    { text: colors.primary.gold, background: colors.neutral.white },
    { text: colors.semantic.error, background: colors.neutral.white },
    { text: colors.semantic.info, background: colors.neutral.white },
    { text: colors.neutral.charcoal, background: colors.neutral.gray100 },
    { text: colors.neutral.charcoal, background: colors.primary.goldLight },
  ],
  
  // Light text on dark backgrounds
  lightOnDark: [
    { text: colors.neutral.white, background: colors.neutral.charcoal },
    { text: colors.neutral.white, background: colors.neutral.charcoalLight },
    { text: colors.neutral.white, background: colors.neutral.charcoalDark },
    { text: colors.neutral.white, background: colors.primary.gold },
    { text: colors.neutral.white, background: colors.primary.goldDark },
    { text: colors.neutral.white, background: colors.neutral.gray500 },
  ],
};

/**
 * Semantic Color Usage Guidelines
 * 
 * Guidelines for using semantic colors with proper contrast.
 */
export const semanticColorGuidelines = {
  success: {
    color: colors.semantic.success,
    onWhite: {
      minSize: '18px',
      minWeight: 'normal',
      note: 'Use for large text (18px+) or with darker background',
    },
    recommendedBackground: colors.neutral.white,
    alternativeText: colors.neutral.charcoal, // Use charcoal text with success background
  },
  
  warning: {
    color: colors.semantic.warning,
    onWhite: {
      minSize: '18px',
      minWeight: 'normal',
      note: 'Use for large text (18px+) or with darker background',
    },
    recommendedBackground: colors.neutral.white,
    alternativeText: colors.neutral.charcoal, // Use charcoal text with warning background
  },
  
  error: {
    color: colors.semantic.error,
    onWhite: {
      minSize: '16px',
      minWeight: 'normal',
      note: 'Meets WCAG AA for normal text',
    },
    recommendedBackground: colors.neutral.white,
    alternativeText: colors.neutral.white, // Use white text with error background
  },
  
  info: {
    color: colors.semantic.info,
    onWhite: {
      minSize: '16px',
      minWeight: 'normal',
      note: 'Meets WCAG AA for normal text',
    },
    recommendedBackground: colors.neutral.white,
    alternativeText: colors.neutral.white, // Use white text with info background
  },
};

/**
 * Calculate relative luminance of a color
 * 
 * @param hex - Hex color code (e.g., '#FFFFFF')
 * @returns Relative luminance value (0-1)
 */
export function getRelativeLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AA standards
 * 
 * @param textColor - Text color (hex)
 * @param backgroundColor - Background color (hex)
 * @param isLargeText - Whether the text is large (18px+ or 14px+ bold)
 * @returns Object with pass/fail status and contrast ratio
 */
export function meetsWCAGAA(
  textColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const required = isLargeText ? 3.0 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
  };
}

/**
 * Get accessible text color for a given background
 * 
 * @param backgroundColor - Background color (hex)
 * @returns Recommended text color (charcoal or white)
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  const luminance = getRelativeLuminance(backgroundColor);
  
  // Use white text for dark backgrounds, charcoal for light backgrounds
  return luminance > 0.5 ? colors.neutral.charcoal : colors.neutral.white;
}

/**
 * Color palette for charts
 * 
 * Accessible color palette for data visualization.
 * All colors have sufficient contrast against white backgrounds.
 */
export const chartColors = [
  colors.primary.gold,        // Primary data series
  colors.semantic.info,       // Secondary data series
  colors.neutral.charcoal,    // Tertiary data series
  colors.semantic.success,    // Positive values
  colors.semantic.error,      // Negative values
  colors.primary.goldDark,    // Additional series
  colors.neutral.charcoalLight, // Additional series
];

/**
 * Export all colors for convenience
 */
export { colors };
export default colors;
