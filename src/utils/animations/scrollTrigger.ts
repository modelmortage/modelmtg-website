/**
 * ScrollTrigger Utilities
 * 
 * Helper functions for creating scroll-triggered animations with GSAP ScrollTrigger
 */

import type { ScrollTriggerInstanceVars } from 'gsap/ScrollTrigger'
import {
  SCROLL_TRIGGER_DEFAULTS,
  MOBILE_BREAKPOINT,
  MOBILE_DURATION_MULTIPLIER,
  MOBILE_STAGGER_MULTIPLIER,
} from './config'

/**
 * Options for creating a ScrollTrigger
 */
export interface CreateScrollTriggerOptions extends Partial<ScrollTriggerInstanceVars> {
  trigger?: string | Element
  start?: string
  end?: string
  toggleActions?: string
  once?: boolean
  markers?: boolean
}

/**
 * Create a ScrollTrigger configuration with defaults
 */
export function createScrollTrigger(options: CreateScrollTriggerOptions = {}): ScrollTriggerInstanceVars {
  return {
    ...SCROLL_TRIGGER_DEFAULTS,
    ...options,
  } as ScrollTriggerInstanceVars
}

/**
 * Create a parallax effect configuration
 */
export function createParallax(speed = 0.5): { y: string; ease: string } {
  return {
    y: `${speed * 100}%`,
    ease: 'none',
  }
}

/**
 * Check if current viewport is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * Get responsive animation duration based on viewport
 */
export function getResponsiveDuration(duration: number): number {
  return isMobile() ? duration * MOBILE_DURATION_MULTIPLIER : duration
}

/**
 * Get responsive stagger delay based on viewport
 */
export function getResponsiveStagger(stagger: number): number {
  return isMobile() ? stagger * MOBILE_STAGGER_MULTIPLIER : stagger
}
