/**
 * Animation Configuration and Constants
 * 
 * Centralized timing, easing, and configuration values for GSAP animations
 */

/**
 * Animation duration constants (in seconds)
 */
export const ANIMATION_DURATION = {
  FAST: 0.3,
  MEDIUM: 0.6,
  SLOW: 1.0,
  HERO: 1.2,
} as const

/**
 * Stagger delay constants (in seconds)
 */
export const STAGGER_DELAY = {
  TIGHT: 0.1,
  MEDIUM: 0.15,
  LOOSE: 0.2,
} as const

/**
 * Easing presets for different animation types
 */
export const EASING = {
  DEFAULT: 'power2.out',
  SMOOTH: 'power1.inOut',
  HERO: 'power3.out',
  BOUNCE: 'back.out(1.7)',
} as const

/**
 * ScrollTrigger default configuration
 */
export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top 80%',
  toggleActions: 'play none none none',
  once: true,
} as const

/**
 * Mobile breakpoint (in pixels)
 */
export const MOBILE_BREAKPOINT = 768

/**
 * Mobile animation duration multiplier (reduces duration by 30%)
 */
export const MOBILE_DURATION_MULTIPLIER = 0.7

/**
 * Mobile stagger delay multiplier (reduces stagger by 40%)
 */
export const MOBILE_STAGGER_MULTIPLIER = 0.6
