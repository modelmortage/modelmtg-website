/**
 * Animation Utilities - Central Export
 * 
 * Public API for all animation utilities, patterns, and configurations
 */

// Export all configuration constants
export {
  ANIMATION_DURATION,
  STAGGER_DELAY,
  EASING,
  SCROLL_TRIGGER_DEFAULTS,
  MOBILE_BREAKPOINT,
  MOBILE_DURATION_MULTIPLIER,
  MOBILE_STAGGER_MULTIPLIER,
} from './config'

// Export all accessibility utilities
export {
  checkReducedMotion,
  watchReducedMotion,
  getAnimationDuration,
} from './accessibility'

// Export all animation patterns
export {
  fadeIn,
  staggerReveal,
  slideInFromRight,
  slideInFromLeft,
  slideInFromBottom,
  scaleIn,
} from './patterns'

export type {
  FadeInOptions,
  StaggerRevealOptions,
} from './patterns'

// Export all ScrollTrigger utilities
export {
  createScrollTrigger,
  createParallax,
  isMobile,
  getResponsiveDuration,
  getResponsiveStagger,
} from './scrollTrigger'

export type {
  CreateScrollTriggerOptions,
} from './scrollTrigger'
