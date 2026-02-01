/**
 * Styles Index
 * 
 * Central export point for all theme and style utilities.
 */

export { theme, colors, typography, spacing, breakpoints, shadows, transitions } from './theme';
export type { Theme, ColorPalette, Typography, Spacing, Breakpoints, Shadows, Transitions } from './theme';

export {
  contrastRatios,
  accessiblePairs,
  semanticColorGuidelines,
  chartColors,
  getRelativeLuminance,
  getContrastRatio,
  meetsWCAGAA,
  getAccessibleTextColor,
} from './colors';

export {
  headingSizes,
  bodyTextStyles,
  fontWeights,
  lineHeights,
  fontSizes,
  typographyCSSVariables,
  getHeadingStyle,
  getFontSizeInPixels,
  meetsMinimumFontSize,
  getOptimalLineLength,
  validateTypographyHierarchy,
} from './typography';

export {
  spacingScale,
  spacingInPixels,
  getSpacingInPixels,
  getSpacingInRem,
  multiplySpacing,
  responsiveBreakpoints,
  breakpointsInPixels,
  getBreakpointInPixels,
  mediaQueries,
  shadowValues,
  getShadow,
  transitionValues,
  transitionDurationsInMs,
  getTransition,
  getTransitionDuration,
  createTransition,
  spacingCSSVariables,
  breakpointCSSVariables,
  shadowCSSVariables,
  transitionCSSVariables,
  layoutCSSVariables,
  isValidSpacingMultiple,
  getNearestSpacingMultiple,
  isValidTransitionDuration,
  containerMaxWidths,
  getContainerMaxWidth,
} from './spacing';

export { default } from './theme';
