# Implementation Plan: Homepage GSAP Animations

## Overview

This implementation plan adds GSAP-powered animations to the homepage of a Next.js 14+ TypeScript application. The approach follows a bottom-up strategy: first establishing the animation infrastructure (hooks, utilities, configuration), then progressively integrating animations into each homepage section. Each task builds incrementally with testing sub-tasks to validate functionality early.

## Tasks

- [x] 1. Install GSAP dependencies and configure Next.js
  - Install `gsap` package (version 3.12+)
  - Install `@gsap/react` for React integration
  - Configure Next.js to handle GSAP imports (if needed for SSR)
  - Verify installation by importing GSAP in a test file
  - _Requirements: 1.1, 1.4_

- [ ] 2. Create animation configuration and constants
  - [x] 2.1 Create `src/utils/animations/config.ts` with timing constants
    - Define `ANIMATION_DURATION` object (FAST: 0.3s, MEDIUM: 0.6s, SLOW: 1.0s, HERO: 1.2s)
    - Define `STAGGER_DELAY` object (TIGHT: 0.1s, MEDIUM: 0.15s, LOOSE: 0.2s)
    - Define `EASING` object (DEFAULT, SMOOTH, HERO, BOUNCE)
    - Define `SCROLL_TRIGGER_DEFAULTS` with start position and toggle actions
    - Define mobile breakpoint and multiplier constants
    - Export all constants with TypeScript `as const` assertions
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ]* 2.2 Write unit tests for configuration constants
    - Test that all constants are properly exported
    - Test that mobile multipliers are correct values
    - _Requirements: 18.1, 18.2, 18.3_

- [ ] 3. Implement accessibility utilities
  - [x] 3.1 Create `src/utils/animations/accessibility.ts`
    - Implement `checkReducedMotion()` function to check prefers-reduced-motion media query
    - Implement `watchReducedMotion()` function with event listener and cleanup
    - Implement `getAnimationDuration()` function that returns 0 when reduced motion is enabled
    - Add SSR safety checks (typeof window !== 'undefined')
    - Export all functions with TypeScript types
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 3.2 Write property test for accessibility utilities
    - **Property 1: Reduced motion disables animations**
    - **Validates: Requirements 2.1, 2.2**

- [ ] 4. Create animation pattern utilities
  - [x] 4.1 Create `src/utils/animations/patterns.ts`
    - Define `FadeInOptions` and `StaggerRevealOptions` TypeScript interfaces
    - Implement `fadeIn()` function with opacity, y, x, scale parameters
    - Implement `staggerReveal()` function that extends fadeIn with stagger
    - Implement `slideInFromRight()`, `slideInFromLeft()`, `slideInFromBottom()` helper functions
    - Implement `scaleIn()` function for scale-based reveals
    - Add will-change cleanup in onComplete callbacks
    - _Requirements: 1.3, 15.4, 15.5_
  
  - [ ]* 4.2 Write unit tests for animation patterns
    - Test that fadeIn returns correct GSAP TweenVars object
    - Test that staggerReveal includes stagger property
    - Test that slide helpers set correct x/y values
    - _Requirements: 1.3_

- [ ] 5. Create ScrollTrigger utilities
  - [x] 5.1 Create `src/utils/animations/scrollTrigger.ts`
    - Define `CreateScrollTriggerOptions` TypeScript interface
    - Implement `createScrollTrigger()` function with default options
    - Implement `createParallax()` function for parallax effects
    - Implement `isMobile()` function to check viewport width
    - Implement `getResponsiveDuration()` function with mobile multiplier
    - Implement `getResponsiveStagger()` function with mobile multiplier
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 17.1, 17.2, 17.3_
  
  - [ ]* 5.2 Write property test for responsive utilities
    - **Property 2: Mobile reduces animation durations**
    - **Validates: Requirements 16.1, 16.2**

- [ ] 6. Create central animations index file
  - [x] 6.1 Create `src/utils/animations/index.ts`
    - Export all functions from config.ts
    - Export all functions from accessibility.ts
    - Export all functions from patterns.ts
    - Export all functions from scrollTrigger.ts
    - Provide clean public API for consumers
    - _Requirements: 1.1, 1.3_

- [ ] 7. Implement core useGsapAnimation hook
  - [x] 7.1 Create `src/hooks/useGsapAnimation.ts`
    - Define `UseGsapAnimationOptions` and `UseGsapAnimationReturn` TypeScript interfaces
    - Implement hook that creates GSAP context with gsap.context()
    - Implement reduced motion detection using checkReducedMotion()
    - Implement watchReducedMotion() listener with cleanup
    - Return animate() and animateStagger() helper functions
    - Implement cleanup logic that reverts GSAP context and kills ScrollTriggers
    - Add null checks and error handling with console warnings
    - _Requirements: 1.1, 1.2, 2.1, 2.3, 2.4, 20.1, 20.2, 20.3_
  
  - [ ]* 7.2 Write property test for useGsapAnimation hook
    - **Property 3: Hook cleanup reverts all animations**
    - **Validates: Requirements 1.2**
  
  - [ ]* 7.3 Write unit tests for useGsapAnimation hook
    - Test that hook returns null when reduced motion is enabled
    - Test that cleanup function is called on unmount
    - Test that ScrollTrigger instances are killed on cleanup
    - _Requirements: 1.2, 2.1, 20.2_

- [ ] 8. Checkpoint - Verify animation infrastructure
  - Ensure all utility files compile without TypeScript errors
  - Ensure all tests pass
  - Ask the user if questions arise

- [ ] 9. Implement Hero section animations
  - [x] 9.1 Update `src/components/home/Hero.tsx` with GSAP animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and animation utilities
    - Create refs for headline, subheadline, memo card, and skyline elements
    - Implement useEffect with GSAP timeline for entrance animations
    - Add headline staggered character reveal (0.8s duration)
    - Add subheadline fade-in with 0.2s delay
    - Add memo card slide-in from right (1s duration)
    - Add parallax effect to skyline background (0.5x speed)
    - Implement cleanup in useEffect return
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 9.2 Write property test for Hero animations
    - **Property 4: Hero animations complete within 2 seconds**
    - **Validates: Requirements 3.5**

- [ ] 10. Implement SolutionsOverview section animations
  - [x] 10.1 Update `src/components/home/SolutionsOverview.tsx` with scroll-triggered animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and staggerReveal pattern
    - Create refs for container and loan cards array
    - Implement scroll-triggered stagger reveal (0.15s stagger, 0.6s duration)
    - Add hover animations for card scale (1.02) with 0.3s duration
    - Use getResponsiveDuration and getResponsiveStagger for mobile
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 10.2 Write property test for SolutionsOverview animations
    - **Property 5: Cards reveal with consistent stagger timing**
    - **Validates: Requirements 4.1, 4.2**

- [ ] 11. Implement Process section animations
  - [x] 11.1 Update `src/components/home/Process.tsx` with sequential step animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and slideInFromLeft pattern
    - Create refs for container and process step elements
    - Implement scroll-triggered sequential reveal (0.2s stagger, 0.7s duration)
    - Add connecting line draw animations between steps
    - Ensure step N completes before step N+1 begins
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 11.2 Write unit tests for Process animations
    - Test that steps animate sequentially
    - Test that connecting lines animate after steps
    - _Requirements: 5.3, 5.4_

- [ ] 12. Implement Team section animations
  - [ ] 12.1 Update `src/components/home/Team.tsx` with card animations
    - Add 'use client' directive (if not already present)
    - Import useGsapAnimation hook and scaleIn pattern
    - Create refs for team card elements
    - Implement scroll-triggered stagger reveal (0.12s stagger, 0.6s duration)
    - Add scale animation from 0.95 to 1.0
    - Add hover lift effect (4px translateY) with 0.3s duration
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 12.2 Write property test for Team animations
    - **Property 6: Team cards scale consistently on reveal**
    - **Validates: Requirements 6.2**

- [ ] 13. Implement Reviews section animations
  - [x] 13.1 Update `src/components/home/Reviews.tsx` with fade animations
    - Add GSAP imports (already has 'use client')
    - Import useGsapAnimation hook and fadeIn pattern
    - Create refs for section container and review cards
    - Implement scroll-triggered fade-in for container (0.6s duration)
    - Add star rating sequential reveal (0.05s stagger)
    - Implement review card transition animations (0.4s fade out, 0.4s fade in with 0.2s overlap)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 13.2 Write unit tests for Reviews animations
    - Test that star ratings animate with correct stagger
    - Test that card transitions have proper timing overlap
    - _Requirements: 7.4_

- [ ] 14. Implement HoustonNuances section animations
  - [ ] 14.1 Update `src/components/home/HoustonNuances.tsx` with content block animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and slideInFromBottom pattern
    - Create refs for heading and content blocks
    - Implement heading animation with 0.3s lead time
    - Implement scroll-triggered content block stagger (0.15s stagger, 0.7s duration)
    - Add slide from bottom effect (50px y offset)
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 14.2 Write property test for HoustonNuances animations
    - **Property 7: Heading animates before content blocks**
    - **Validates: Requirements 8.3**

- [ ] 15. Implement LocalAreas section animations
  - [ ] 15.1 Update `src/components/home/LocalAreas.tsx` with area card animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and slideInFromRight pattern
    - Create refs for area card elements
    - Implement scroll-triggered stagger reveal (0.1s stagger, 0.6s duration)
    - Add slide from right effect
    - Add hover brighten effect (0.3s duration)
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ]* 15.2 Write unit tests for LocalAreas animations
    - Test that cards slide from right with correct offset
    - Test that hover effect applies brightness change
    - _Requirements: 9.2, 9.3_

- [ ] 16. Implement Resources section animations
  - [ ] 16.1 Update `src/components/home/Resources.tsx` with resource card animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and scaleIn pattern
    - Create refs for resource card and icon elements
    - Implement scroll-triggered stagger reveal (0.12s stagger, 0.6s duration)
    - Add scale animation from 0.98 to 1.0
    - Add icon rotation effect (-5 to 0 degrees)
    - Add hover lift effect (0.3s duration)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 16.2 Write property test for Resources animations
    - **Property 8: Resource icons rotate on reveal**
    - **Validates: Requirements 10.3**

- [ ] 17. Implement LocationMap section animations
  - [ ] 17.1 Update `src/components/home/LocationMap.tsx` with map animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and fadeIn pattern
    - Create refs for map container and location markers
    - Implement scroll-triggered fade-in for map (0.8s duration)
    - Add location marker stagger reveal (0.1s stagger)
    - Add marker scale animation with bounce effect (0 to 1.0, back.out easing)
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ]* 17.2 Write unit tests for LocationMap animations
    - Test that markers use bounce easing
    - Test that markers animate after map container
    - _Requirements: 11.3_

- [ ] 18. Implement FinalCta section animations
  - [ ] 18.1 Update `src/components/home/FinalCta.tsx` with CTA animations
    - Add 'use client' directive
    - Import useGsapAnimation hook and scaleIn pattern
    - Create refs for container, heading, and button elements
    - Implement scroll-triggered container scale (0.95 to 1.0, 0.8s duration)
    - Add heading slide-up animation (0.6s duration)
    - Add button pulse effect starting 0.4s after heading
    - Add hover scale effect (1.05) with 0.3s duration
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 18.2 Write property test for FinalCta animations
    - **Property 9: CTA button animates after heading**
    - **Validates: Requirements 12.3**

- [ ] 19. Implement Navigation animations
  - [ ] 19.1 Update `components/Header.tsx` with navigation animations
    - Add 'use client' directive (if not already present)
    - Import useGsapAnimation hook and fadeIn pattern
    - Create ref for navigation container
    - Implement page load fade-in (0.5s duration)
    - Add hover underline animation for links (0.3s duration)
    - Implement scroll-based background blur effect (0.4s transition)
    - Add scroll position detection to toggle blur on/off
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ]* 19.2 Write unit tests for Navigation animations
    - Test that navigation fades in on mount
    - Test that blur effect toggles based on scroll position
    - _Requirements: 13.1, 13.3, 13.4_

- [ ] 20. Implement smooth scroll behavior
  - [ ] 20.1 Create smooth scroll utility or update existing navigation
    - Implement smooth scroll function with 1s duration
    - Use power1.inOut easing for smooth scroll
    - Account for fixed header height in scroll calculations
    - Apply to all anchor link clicks in navigation
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ]* 20.2 Write unit tests for smooth scroll
    - Test that scroll duration is correct
    - Test that header offset is calculated correctly
    - _Requirements: 14.3_

- [ ] 21. Checkpoint - Verify all section animations
  - Test each homepage section in the browser
  - Verify animations trigger at correct scroll positions
  - Verify reduced motion preference disables animations
  - Ensure all tests pass
  - Ask the user if questions arise

- [ ] 22. Add performance optimizations
  - [ ] 22.1 Audit and optimize animation performance
    - Verify all animations use only transform and opacity properties
    - Add will-change property during active animations
    - Remove will-change property after animations complete
    - Test that animations maintain 60fps on target devices
    - Add performance monitoring in development mode
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 22.2 Write property test for performance optimization
    - **Property 10: Animations use only GPU-accelerated properties**
    - **Validates: Requirements 15.1, 15.2**

- [ ] 23. Implement mobile responsiveness
  - [ ] 23.1 Add mobile-specific animation adjustments
    - Verify getResponsiveDuration reduces durations by 30% on mobile
    - Verify getResponsiveStagger reduces stagger by 40% on mobile
    - Disable parallax effects on mobile viewports
    - Add viewport resize listener to update animation parameters
    - Test all sections on mobile viewport sizes
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 23.2 Write property test for mobile responsiveness
    - **Property 11: Mobile viewport reduces animation timing**
    - **Validates: Requirements 16.1, 16.2, 16.3**

- [ ] 24. Add development debugging features
  - [ ] 24.1 Implement ScrollTrigger markers and error handling
    - Enable ScrollTrigger markers in development mode
    - Add descriptive error messages for failed GSAP initializations
    - Add warnings for null refs during animation setup
    - Add error handling for missing ScrollTrigger plugin
    - Add TypeScript type validation for all animation configs
    - _Requirements: 17.3, 20.1, 20.2, 20.3, 20.4_
  
  - [ ]* 24.2 Write unit tests for error handling
    - Test that null refs log warnings
    - Test that missing ScrollTrigger logs errors
    - _Requirements: 20.2, 20.3_

- [ ] 25. Final integration and testing
  - [ ] 25.1 Integration testing across all sections
    - Test complete page load animation sequence
    - Test scroll-triggered animations from top to bottom
    - Verify no animation conflicts or timing issues
    - Test with reduced motion enabled
    - Test on mobile and desktop viewports
    - Verify all ScrollTriggers clean up properly on navigation
    - _Requirements: 1.2, 2.1, 16.4, 17.2_
  
  - [ ]* 25.2 Write integration tests for full page animations
    - Test that all sections animate in correct order
    - Test that cleanup occurs on page navigation
    - _Requirements: 1.2, 17.2_

- [ ] 26. Final checkpoint - Complete verification
  - Run all unit tests and property tests
  - Verify TypeScript compilation with no errors
  - Test in multiple browsers (Chrome, Firefox, Safari)
  - Verify accessibility with screen readers
  - Ensure all animations respect reduced motion preference
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Animation infrastructure (tasks 1-8) must be completed before section animations (tasks 9-20)
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and error conditions
- Mobile responsiveness is built into utilities and applied automatically
- All animations respect prefers-reduced-motion accessibility setting
