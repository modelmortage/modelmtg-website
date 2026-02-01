/**
 * Animation utilities for UI redesign
 * Provides hooks and helpers for smooth animations with reduced motion support
 */

'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Hook to check if user prefers reduced motion
 * Returns true if prefers-reduced-motion is set
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if matchMedia is available (not available in some test environments)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook for viewport intersection animations
 * Triggers animation when element enters viewport
 * 
 * @param options - IntersectionObserver options
 * @returns ref to attach to element and isVisible state
 */
export function useIntersectionAnimation(
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px' }
) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // If reduced motion is preferred, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Once visible, stop observing
        observer.unobserve(element)
      }
    }, options)

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [options.threshold, options.rootMargin, prefersReducedMotion])

  return { ref, isVisible }
}

/**
 * Animation configuration presets
 */
export const animations = {
  fadeIn: {
    duration: 400,
    easing: 'ease-out',
    delay: 0,
  },
  slideUp: {
    duration: 350,
    easing: 'ease-out',
    delay: 0,
  },
  scaleIn: {
    duration: 300,
    easing: 'ease-out',
    delay: 0,
  },
  fast: {
    duration: 150,
    easing: 'ease-out',
    delay: 0,
  },
  normal: {
    duration: 250,
    easing: 'ease-out',
    delay: 0,
  },
  slow: {
    duration: 400,
    easing: 'ease-out',
    delay: 0,
  },
} as const

/**
 * Get animation props based on config and reduced motion preference
 */
export function getAnimationProps(
  config: typeof animations[keyof typeof animations],
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) {
    return {
      duration: 0,
      easing: config.easing,
      delay: 0,
    }
  }
  return config
}
