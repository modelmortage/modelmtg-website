/**
 * Animation Pattern Utilities
 * 
 * Reusable animation patterns and helper functions for common GSAP animations
 */

// import type { TweenVars } from 'gsap'
import { ANIMATION_DURATION, EASING } from './config'

// Temporary type definition to avoid GSAP dependency
type TweenVars = any

/**
 * Options for fade-in animations
 */
export interface FadeInOptions {
  opacity?: number
  y?: number
  x?: number
  scale?: number
  duration?: number
  ease?: string
  delay?: number
}

/**
 * Options for stagger reveal animations
 */
export interface StaggerRevealOptions extends FadeInOptions {
  stagger?: number
}

/**
 * Create a fade-in animation configuration
 */
export function fadeIn(options: FadeInOptions = {}): TweenVars {
  const {
    opacity = 0,
    y = 20,
    x = 0,
    scale = 1,
    duration = ANIMATION_DURATION.MEDIUM,
    ease = EASING.DEFAULT,
    delay = 0,
  } = options

  return {
    from: {
      opacity,
      y,
      x,
      scale,
    },
    to: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      ease,
      delay,
      onComplete: () => {
        // Remove will-change after animation completes
        if (typeof document !== 'undefined') {
          const elements = document.querySelectorAll('[style*="will-change"]')
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.willChange = 'auto'
            }
          })
        }
      },
    },
  }
}

/**
 * Create a stagger reveal animation configuration
 */
export function staggerReveal(options: StaggerRevealOptions = {}): TweenVars {
  const { stagger = 0.15, ...fadeInOptions } = options
  const baseConfig = fadeIn(fadeInOptions)

  return {
    ...baseConfig,
    to: {
      ...baseConfig.to,
      stagger,
    },
  }
}

/**
 * Slide in from right animation
 */
export function slideInFromRight(duration = ANIMATION_DURATION.MEDIUM, distance = 50): TweenVars {
  return fadeIn({
    x: distance,
    y: 0,
    duration,
  })
}

/**
 * Slide in from left animation
 */
export function slideInFromLeft(duration = ANIMATION_DURATION.MEDIUM, distance = 50): TweenVars {
  return fadeIn({
    x: -distance,
    y: 0,
    duration,
  })
}

/**
 * Slide in from bottom animation
 */
export function slideInFromBottom(duration = ANIMATION_DURATION.MEDIUM, distance = 50): TweenVars {
  return fadeIn({
    y: distance,
    x: 0,
    duration,
  })
}

/**
 * Scale in animation
 */
export function scaleIn(duration = ANIMATION_DURATION.MEDIUM, fromScale = 0.95): TweenVars {
  return fadeIn({
    scale: fromScale,
    y: 0,
    x: 0,
    duration,
  })
}
