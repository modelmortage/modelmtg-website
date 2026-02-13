/**
 * useGsapAnimation Hook
 * 
 * Core React hook for managing GSAP animations with proper cleanup and accessibility
 */

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { checkReducedMotion, watchReducedMotion } from '@/src/utils/animations'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Options for useGsapAnimation hook
 */
export interface UseGsapAnimationOptions {
  /**
   * Scope element for GSAP context (optional)
   */
  scope?: React.RefObject<HTMLElement>
  
  /**
   * Dependencies array for re-running animations
   */
  dependencies?: React.DependencyList
}

/**
 * Return type for useGsapAnimation hook
 */
export interface UseGsapAnimationReturn {
  /**
   * Animate a single element or array of elements
   */
  animate: (target: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.core.Tween | null
  
  /**
   * Animate multiple elements with stagger
   */
  animateStagger: (targets: gsap.TweenTarget, vars: gsap.TweenVars) => gsap.core.Tween | null
  
  /**
   * GSAP context for scoped animations
   */
  ctx: gsap.Context | null
}

/**
 * Custom hook for GSAP animations with automatic cleanup and accessibility
 */
export function useGsapAnimation(
  options: UseGsapAnimationOptions = {}
): UseGsapAnimationReturn | null {
  const { scope, dependencies = [] } = options
  const ctxRef = useRef<gsap.Context | null>(null)
  const reducedMotionRef = useRef<boolean>(checkReducedMotion())

  // Animate helper function
  const animate = useCallback((target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    if (reducedMotionRef.current) {
      return null
    }

    if (!target) {
      console.warn('[useGsapAnimation] Target element is null or undefined')
      return null
    }

    try {
      return gsap.to(target, vars)
    } catch (error) {
      console.error('[useGsapAnimation] Animation failed:', error)
      return null
    }
  }, [])

  // Animate stagger helper function
  const animateStagger = useCallback((targets: gsap.TweenTarget, vars: gsap.TweenVars) => {
    if (reducedMotionRef.current) {
      return null
    }

    if (!targets) {
      console.warn('[useGsapAnimation] Target elements are null or undefined')
      return null
    }

    try {
      return gsap.to(targets, vars)
    } catch (error) {
      console.error('[useGsapAnimation] Stagger animation failed:', error)
      return null
    }
  }, [])

  useEffect(() => {
    // Check if ScrollTrigger is available
    if (typeof window !== 'undefined' && !ScrollTrigger) {
      console.error('[useGsapAnimation] ScrollTrigger plugin not found. Make sure to register it.')
    }

    // Create GSAP context
    ctxRef.current = gsap.context(() => {}, scope?.current || undefined)

    // Watch for reduced motion changes
    const cleanup = watchReducedMotion((prefersReduced) => {
      reducedMotionRef.current = prefersReduced
      
      if (prefersReduced && ctxRef.current) {
        // Kill all animations if reduced motion is enabled
        ctxRef.current.revert()
      }
    })

    // Cleanup function
    return () => {
      cleanup()
      
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }

      // Kill all ScrollTriggers in this scope
      if (typeof window !== 'undefined' && ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (scope?.current && trigger.trigger === scope.current) {
            trigger.kill()
          }
        })
      }
    }
  }, dependencies)

  // Return null if reduced motion is enabled
  if (reducedMotionRef.current) {
    return null
  }

  return {
    animate,
    animateStagger,
    ctx: ctxRef.current,
  }
}
