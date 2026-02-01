/**
 * Theme Configuration
 * 
 * Centralized theme configuration for the Model Mortgage website redesign.
 * Includes color palette, typography, spacing, breakpoints, shadows, and transitions.
 * 
 * All color combinations meet WCAG AA contrast requirements:
 * - 4.5:1 for normal text
 * - 3:1 for large text (18px+ or 14px+ bold)
 */

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

export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Transitions {
  fast: string;
  normal: string;
  slow: string;
}

export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
  shadows: Shadows;
  transitions: Transitions;
}

/**
 * Color Palette
 * 
 * Primary Colors:
 * - Gold (#8B6F14): Primary brand color (darker for accessibility)
 * - Gold Light (#D4AF37): Lighter variant for backgrounds and decorative elements
 * - Gold Dark (#6B5410): Darker variant for active states and emphasis
 * 
 * Neutral Colors:
 * - Charcoal (#36454F): Primary text and dark backgrounds
 * - Charcoal Light (#4A5A65): Secondary text and lighter dark backgrounds
 * - Charcoal Dark (#2A3439): Emphasis text and darker backgrounds
 * - Gray scale (100-500): Various UI elements, borders, backgrounds
 * - White (#FFFFFF): Light backgrounds and text on dark backgrounds
 * 
 * Semantic Colors:
 * - Success (#0D9668): Success states, positive feedback (darker for accessibility)
 * - Warning (#D97706): Warning states, caution messages (darker for accessibility)
 * - Error (#DC2626): Error states, validation errors (darker for accessibility)
 * - Info (#2563EB): Informational messages, tips (darker for accessibility)
 * 
 * WCAG AA Contrast Compliance:
 * All color combinations have been verified to meet WCAG AA standards:
 * - Gold (#8B6F14) on White (#FFFFFF): 4.79:1 ✓ (normal text)
 * - Charcoal (#36454F) on White (#FFFFFF): 9.9:1 ✓ (normal text)
 * - White (#FFFFFF) on Charcoal (#36454F): 9.9:1 ✓ (normal text)
 * - White (#FFFFFF) on Gold (#8B6F14): 4.79:1 ✓ (normal text)
 * - Charcoal (#36454F) on Gold Light (#D4AF37): 4.71:1 ✓ (normal text)
 * - Success (#0D9668) on White (#FFFFFF): 3.76:1 ✓ (large text)
 * - Warning (#D97706) on White (#FFFFFF): 3.19:1 ✓ (large text)
 * - Error (#DC2626) on White (#FFFFFF): 4.83:1 ✓ (normal text)
 * - Info (#2563EB) on White (#FFFFFF): 5.17:1 ✓ (normal text)
 */
export const colors: ColorPalette = {
  primary: {
    gold: '#8B6F14',      // Darker gold for text (meets WCAG AA)
    goldLight: '#D4AF37', // Original gold for backgrounds
    goldDark: '#6B5410',  // Even darker for emphasis
  },
  neutral: {
    charcoal: '#36454F',
    charcoalLight: '#4A5A65',
    charcoalDark: '#2A3439',
    gray100: '#F7F7F7',
    gray200: '#E5E5E5',
    gray300: '#D1D1D1',
    gray400: '#757575',   // Darker gray for better contrast
    gray500: '#6B6B6B',
    white: '#FFFFFF',
  },
  semantic: {
    success: '#0D9668',   // Darker green for better contrast
    warning: '#D97706',   // Darker orange for better contrast
    error: '#DC2626',     // Darker red for better contrast
    info: '#2563EB',      // Darker blue for better contrast
  },
};

/**
 * Typography System
 * 
 * Font Families:
 * - Primary: System font stack for optimal performance and readability
 * - Heading: Serif font for elegant headings
 * 
 * Font Sizes:
 * - Base size: 16px (1rem) for optimal readability
 * - Scale: Modular scale for consistent hierarchy
 * 
 * Font Weights:
 * - Light (300): Subtle text, decorative elements
 * - Regular (400): Body text, default weight
 * - Medium (500): Emphasis, subheadings
 * - Semibold (600): Strong emphasis, button text
 * - Bold (700): Headings, important text
 * 
 * Line Heights:
 * - Tight (1.2): Headings, compact text
 * - Normal (1.5): Body text, optimal readability
 * - Relaxed (1.75): Long-form content, enhanced readability
 */
export const typography: Typography = {
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
};

/**
 * Spacing System
 * 
 * Consistent spacing scale based on 4px base unit.
 * Use these values for margins, padding, and gaps.
 * 
 * - xs: 4px - Tight spacing, small gaps
 * - sm: 8px - Compact spacing, icon gaps
 * - md: 16px - Default spacing, comfortable gaps
 * - lg: 24px - Generous spacing, section gaps
 * - xl: 32px - Large spacing, major sections
 * - 2xl: 48px - Extra large spacing, page sections
 * - 3xl: 64px - Maximum spacing, hero sections
 */
export const spacing: Spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

/**
 * Breakpoints
 * 
 * Responsive design breakpoints for different device sizes.
 * 
 * - mobile: 320px - Small phones and up
 * - tablet: 768px - Tablets and up
 * - desktop: 1024px - Desktop and up
 * - wide: 1440px - Large desktop and up
 */
export const breakpoints: Breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

/**
 * Shadows
 * 
 * Box shadow values for elevation and depth.
 * 
 * - sm: Subtle shadow for slight elevation
 * - md: Medium shadow for cards and buttons
 * - lg: Large shadow for modals and popovers
 * - xl: Extra large shadow for prominent elements
 */
export const shadows: Shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

/**
 * Transitions
 * 
 * Animation timing for smooth interactions.
 * All durations are between 150ms and 400ms for optimal perceived performance.
 * 
 * - fast: 150ms - Quick transitions, hover effects
 * - normal: 250ms - Default transitions, most interactions
 * - slow: 400ms - Slow transitions, complex animations
 */
export const transitions: Transitions = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '400ms ease-out',
};

/**
 * Complete Theme Object
 * 
 * Export the complete theme configuration for use throughout the application.
 */
export const theme: Theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  transitions,
};

/**
 * Default export for convenience
 */
export default theme;
