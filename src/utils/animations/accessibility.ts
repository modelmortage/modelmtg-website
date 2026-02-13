/**
 * Animation Accessibility Utilities
 * 
 * Utilities for respecting user motion preferences and ensuring accessible animations
 */

/**
 * Check if user prefers reduced motion
 * @returns true if user prefers reduced motion, false otherwise
 */
export function checkReducedMotion(): boolean {
  // SSR safety check
  if (typeof window === 'undefined') {
    return false
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

/**
 * Watch for changes to reduced motion preference
 * @param callback Function to call when preference changes
 * @returns Cleanup function to remove the listener
 */
export function watchReducedMotion(callback: (prefersReduced: boolean) => void): () => void {
  // SSR safety check
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  
  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches)
  }

  // Add listener
  mediaQuery.addEventListener('change', handler)

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler)
  }
}

/**
 * Get animation duration that respects reduced motion preference
 * @param duration The desired animation duration in seconds
 * @returns 0 if reduced motion is enabled, otherwise the original duration
 */
export function getAnimationDuration(duration: number): number {
  return checkReducedMotion() ? 0 : duration
}
