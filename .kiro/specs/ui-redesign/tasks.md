# Implementation Plan: UI Redesign

## Overview

This implementation plan breaks down the comprehensive UI redesign into incremental, testable steps. The approach follows a component-first strategy: build the design system foundation, then migrate pages systematically. Each task builds on previous work, ensuring no orphaned code and maintaining functionality throughout the migration.

The plan prioritizes shared components (Header, Footer) and the design system before individual pages, allowing for consistent application of the new design across all pages.

## Tasks

- [x] 1. Install and configure required libraries
  - Install React Icons library: `npm install react-icons`
  - Install Recharts library: `npm install recharts`
  - Install property-based testing library: `npm install --save-dev @fast-check/jest`
  - Install accessibility testing library: `npm install --save-dev jest-axe @testing-library/jest-dom`
  - Verify all dependencies are compatible with existing React version
  - _Requirements: 14.1, 14.2_

- [x] 2. Create theme system and design tokens
  - [x] 2.1 Create theme configuration file with color palette
    - Define gold and charcoal primary colors with light/dark variants
    - Define neutral gray scale (gray100-gray500, white)
    - Define semantic colors (success, warning, error, info)
    - Ensure all color combinations meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
    - _Requirements: 3.1, 3.2, 15.1, 15.2, 15.3, 15.4_
  
  - [x] 2.2 Define typography system
    - Create font size scale (xs through 5xl)
    - Define font weights (light, regular, medium, semibold, bold)
    - Define line heights (tight, normal, relaxed)
    - Set base font size to minimum 16px
    - Define heading sizes (h1-h6) with appropriate hierarchy
    - _Requirements: 3.3, 16.1, 16.2, 16.3, 16.4_
  
  - [x] 2.3 Define spacing and layout system
    - Create spacing scale (xs through 3xl)
    - Define breakpoints (mobile: 320px, tablet: 768px, desktop: 1024px, wide: 1440px)
    - Define shadow values (sm, md, lg, xl)
    - Define transition timing values (fast: 150ms, normal: 250ms, slow: 400ms)
    - _Requirements: 3.4, 11.1, 13.4_
  
  - [ ]* 2.4 Write unit tests for theme configuration
    - Test that theme includes all required color values
    - Test that base font size is at least 16px
    - Test that animation durations are between 150ms and 400ms
    - Test that breakpoints are defined correctly
    - _Requirements: 15.1, 15.2, 15.3, 16.3, 13.4_

- [x] 3. Build core design system components
  - [x] 3.1 Create Icon wrapper component
    - Implement Icon component with size variants (sm: 16px, md: 24px, lg: 32px, xl: 48px)
    - Support color prop (defaults to currentColor)
    - Add aria-label prop for accessibility
    - Apply aria-hidden="true" when icon is decorative
    - _Requirements: 1.1, 1.4, 1.5_
  
  - [ ]* 3.2 Write property test for Icon accessibility
    - **Property 2: Icon Accessibility**
    - **Validates: Requirements 1.5, 12.2**
  
  - [x] 3.3 Create Button component
    - Implement variants (primary, secondary, outline, ghost)
    - Implement sizes (sm, md, lg)
    - Support icon with left/right positioning
    - Add loading state with spinner
    - Ensure minimum 44x44px touch target on mobile
    - Add hover, focus, and active states
    - Include visible focus indicator for keyboard navigation
    - Apply theme colors and transitions
    - _Requirements: 3.6, 11.3, 12.4, 12.5, 13.1_
  
  - [ ]* 3.4 Write unit tests for Button component
    - Test all variants render correctly
    - Test icon positioning (left/right)
    - Test loading state disables interaction
    - Test keyboard accessibility (focusable, focus indicator)
    - Test minimum touch target size on mobile viewport
    - _Requirements: 3.6, 11.3, 12.4, 12.5_
  
  - [x] 3.5 Create Card component
    - Implement variants (elevated, outlined, flat)
    - Implement padding sizes (sm, md, lg)
    - Add hoverable prop with lift animation
    - Support onClick for clickable cards
    - Apply theme colors and shadows
    - _Requirements: 3.5, 13.1_
  
  - [ ]* 3.6 Write unit tests for Card component
    - Test all variants render correctly
    - Test hoverable cards have hover styles
    - Test clickable cards have pointer cursor
    - Test padding sizes apply correctly
    - _Requirements: 3.5_
  
  - [x] 3.7 Create Input component
    - Implement input types (text, email, number, tel, password)
    - Add floating label behavior
    - Support error state with error message
    - Support helper text
    - Support icon on left side
    - Add focus state with gold border
    - Ensure keyboard accessible
    - Apply theme colors and transitions
    - _Requirements: 5.1, 12.4, 13.1_
  
  - [ ]* 3.8 Write property test for Input visual feedback
    - **Property 10: Input Visual Feedback**
    - **Validates: Requirements 5.5**
  
  - [ ]* 3.9 Write unit tests for Input component
    - Test floating label behavior
    - Test error state displays error message
    - Test icon positioning
    - Test focus state styling
    - Test keyboard accessibility
    - _Requirements: 5.1, 12.4_

- [x] 4. Build Chart components
  - [x] 4.1 Create Chart wrapper component
    - Implement chart types (line, bar, pie, area) using Recharts
    - Apply theme colors to charts
    - Make charts responsive using ResponsiveContainer
    - Add tooltip on hover
    - Include hidden data table for screen reader accessibility
    - Support custom height prop
    - Support legend and grid toggles
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 12.6_
  
  - [ ]* 4.2 Write property test for Chart color consistency
    - **Property 4: Chart Color Consistency**
    - **Validates: Requirements 2.6**
  
  - [ ]* 4.3 Write property test for Chart responsiveness
    - **Property 5: Chart Responsiveness**
    - **Validates: Requirements 2.5, 11.5**
  
  - [ ]* 4.4 Write property test for Chart accessibility
    - **Property 17: Chart Accessibility**
    - **Validates: Requirements 12.6**
  
  - [x] 4.5 Create ResultDisplay component for calculators
    - Display key metrics in card format
    - Render chart visualization below metrics
    - Format currency values with $ and commas
    - Format percentages with % symbol
    - Add number count-up animation on initial display
    - _Requirements: 2.2, 2.3, 5.3_
  
  - [ ]* 4.6 Write property test for Chart visualization in calculator results
    - **Property 3: Chart Visualization for Calculator Results**
    - **Validates: Requirements 2.1**
  
  - [ ]* 4.7 Write unit tests for ResultDisplay component
    - Test that metrics display correctly
    - Test that chart renders with correct data
    - Test currency formatting
    - Test percentage formatting
    - _Requirements: 2.2, 2.3_

- [x] 5. Create animation utilities
  - [x] 5.1 Implement animation helper functions
    - Create useReducedMotion hook to check prefers-reduced-motion
    - Create animation configs (fadeIn, slideUp, scaleIn)
    - Create viewport intersection observer hook for scroll animations
    - Ensure animations respect reduced motion preference
    - Keep animation durations between 150ms and 400ms
    - _Requirements: 13.2, 13.3, 13.4_
  
  - [ ]* 5.2 Write property test for reduced motion respect
    - **Property 19: Reduced Motion Respect**
    - **Validates: Requirements 13.3**
  
  - [ ]* 5.3 Write property test for animation duration constraints
    - **Property 20: Animation Duration Constraints**
    - **Validates: Requirements 13.4**
  
  - [ ]* 5.4 Write unit tests for animation utilities
    - Test useReducedMotion returns correct value
    - Test viewport intersection triggers animation
    - Test animation durations are within range
    - _Requirements: 13.2, 13.3, 13.4_

- [x] 6. Checkpoint - Ensure all design system tests pass
  - Run all unit tests and property tests for design system components
  - Verify no accessibility violations in design system components
  - Ensure all tests pass, ask the user if questions arise

- [x] 7. Redesign Header component
  - [x] 7.1 Update Header with new design system components
    - Replace emoji icons with React Icons
    - Use Button components for CTAs
    - Apply theme colors (gold and charcoal)
    - Implement desktop horizontal navigation with dropdowns
    - Implement mobile hamburger menu with slide-out drawer
    - Add smooth transitions for all interactions
    - Highlight active page with gold underline
    - Make header fixed with show/hide on scroll
    - Ensure keyboard accessible navigation
    - _Requirements: 1.2, 10.1, 10.2, 10.3, 10.6, 12.4_
  
  - [ ]* 7.2 Write unit tests for Header component
    - Test that no emojis are rendered
    - Test that React Icons are used
    - Test mobile menu opens/closes
    - Test active page highlighting
    - Test keyboard navigation
    - _Requirements: 1.2, 10.2, 10.3, 12.4_

- [x] 8. Redesign Footer component
  - [x] 8.1 Update Footer with new design system components
    - Replace emoji icons with React Icons
    - Use four-column grid layout on desktop
    - Use stacked layout on mobile
    - Add social media icons with hover effects
    - Add contact information with icons
    - Apply theme colors
    - Ensure all links are keyboard accessible
    - _Requirements: 1.2, 10.4, 10.5, 10.6, 12.4_
  
  - [ ]* 8.2 Write unit tests for Footer component
    - Test that no emojis are rendered
    - Test that React Icons are used for social media
    - Test responsive layout (grid on desktop, stacked on mobile)
    - Test keyboard accessibility of links
    - _Requirements: 1.2, 10.5, 12.4_

- [x] 9. Checkpoint - Test Header and Footer
  - Verify Header and Footer render correctly on all pages
  - Test responsive behavior at all breakpoints
  - Test keyboard navigation
  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Redesign Home page
  - [x] 10.1 Update Home page with new design system
    - Replace all emojis with React Icons
    - Create modern hero section with clear value proposition
    - Use Card components for features/services
    - Add icons to represent key features
    - Implement smooth scroll animations for elements entering viewport
    - Apply theme typography and spacing
    - Ensure fully responsive (mobile, tablet, desktop)
    - Maintain all existing functionality
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 19.3_
  
  - [ ]* 10.2 Write property test for emoji elimination on Home page
    - **Property 1: Emoji Elimination**
    - **Validates: Requirements 1.2, 1.3**
  
  - [ ]* 10.3 Write property test for responsive rendering on Home page
    - **Property 9: Responsive Rendering**
    - **Validates: Requirements 4.5, 11.1**
  
  - [ ]* 10.4 Write property test for viewport animations on Home page
    - **Property 8: Viewport Intersection Animations**
    - **Validates: Requirements 4.4, 13.2**
  
  - [ ]* 10.5 Write unit tests for Home page
    - Test hero section renders correctly
    - Test Card components are used for features
    - Test icons are present
    - Test responsive layout at breakpoints
    - _Requirements: 4.2, 4.3, 4.5_

- [x] 11. Redesign Calculator pages (Affordability, Purchase, Refinance, Rent vs Buy, VA Purchase, VA Refinance, DSCR)
  - [x] 11.1 Update calculator form inputs
    - Replace all emojis with React Icons
    - Use Input components for all form fields
    - Group related fields using Card containers
    - Add icons to input fields for visual indicators
    - Apply theme typography and spacing
    - Ensure immediate visual feedback on interaction
    - _Requirements: 1.2, 5.1, 5.2, 5.4, 5.5_
  
  - [x] 11.2 Update calculator results display
    - Use ResultDisplay component with charts
    - Display payment breakdowns as interactive charts
    - Display amortization schedules with visual representations
    - Use appropriate chart types for different data (bar, line, pie)
    - Ensure charts are responsive
    - Apply theme colors to charts
    - Maintain all existing calculation functionality
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.3, 5.6_
  
  - [ ]* 11.3 Write property test for calculator functionality preservation
    - **Property 25: Functionality Preservation**
    - **Validates: Requirements 19.3**
  
  - [ ]* 11.4 Write unit tests for calculator pages
    - Test Input components are used for all fields
    - Test Card components group related inputs
    - Test ResultDisplay renders with charts
    - Test chart types are appropriate for data
    - Test calculations produce correct results
    - _Requirements: 5.1, 5.2, 5.3, 2.2, 2.3, 2.4_

- [x] 12. Checkpoint - Test Calculator pages
  - Verify all 7 calculator pages render correctly
  - Test all calculations produce correct results
  - Test charts display correctly
  - Test responsive behavior
  - Ensure all tests pass, ask the user if questions arise

- [x] 13. Redesign Content pages (About Us, Meet Our Team, Schedule a Call, Reviews, Privacy Policy, ADA Statement)
  - [x] 13.1 Update Content pages with new design system
    - Replace all emojis with React Icons
    - Apply improved typography with appropriate line height and font sizes
    - Use Card components for team information with photos and contact info
    - Add icons to enhance visual communication
    - Implement better visual hierarchy with clear section breaks
    - Apply theme colors, typography, and spacing
    - Ensure fully responsive across all device sizes
    - _Requirements: 1.2, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 13.2 Write property test for typography consistency on Content pages
    - **Property 6: Typography Consistency**
    - **Validates: Requirements 3.3, 6.1**
  
  - [ ]* 13.3 Write unit tests for Content pages
    - Test Card components are used for team info
    - Test icons are present
    - Test typography uses theme values
    - Test responsive layout at breakpoints
    - _Requirements: 6.2, 6.3, 6.5_

- [x] 14. Redesign Loan Options pages (all 11 loan option pages)
  - [x] 14.1 Update Loan Options pages with new design system
    - Replace all emojis with React Icons
    - Use consistent layouts with clear headings and sections
    - Use icon-enhanced lists for loan features/benefits
    - Use Button components for call-to-action buttons
    - Add visual elements (icons, cards) to break up text content
    - Apply theme colors, typography, and spacing
    - Maintain all existing informational content
    - _Requirements: 1.2, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 14.2 Write property test for icon-enhanced lists on Loan pages
    - **Property 7.2: Icon-enhanced lists**
    - **Validates: Requirements 7.2**
  
  - [ ]* 14.3 Write property test for layout consistency across Loan pages
    - **Property 7.1: Consistent layouts**
    - **Validates: Requirements 7.1**
  
  - [ ]* 14.4 Write unit tests for Loan Options pages
    - Test icons are used in feature lists
    - Test Button components are used for CTAs
    - Test Card components are used for content sections
    - Test consistent layout structure across all loan pages
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 15. Redesign Blog and Learning Center pages
  - [x] 15.1 Update Blog listing page
    - Replace all emojis with React Icons
    - Use card-based grid layout for blog listings
    - Add featured images to blog cards
    - Apply theme typography and spacing
    - Ensure responsive grid layout
    - _Requirements: 1.2, 8.2_
  
  - [x] 15.2 Update individual Blog post pages
    - Replace all emojis with React Icons
    - Use modern article layout with featured images
    - Apply improved reading typography with appropriate line length (max-width for 60-80 characters)
    - Add social sharing buttons with icons
    - Apply theme colors, typography, and spacing
    - _Requirements: 1.2, 8.1, 8.3, 8.5, 16.5_
  
  - [x] 15.3 Update Learning Center page
    - Replace all emojis with React Icons
    - Organize content with visual categories using icons
    - Use Card components for content sections
    - Apply theme colors, typography, and spacing
    - _Requirements: 1.2, 8.4_
  
  - [ ]* 15.4 Write property test for reading width constraints on Blog posts
    - **Property 21: Reading Width Constraints**
    - **Validates: Requirements 16.5**
  
  - [ ]* 15.5 Write unit tests for Blog and Learning Center pages
    - Test Card components are used for blog listings
    - Test blog posts have max-width constraints
    - Test social sharing buttons include icons
    - Test Learning Center uses icons for categories
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [x] 16. Redesign Profile pages (Matthew Bramow, Rolston Nicholls)
  - [x] 16.1 Update Profile pages with new design system
    - Replace all emojis with React Icons
    - Display team member information in professional layout
    - Use icons for contact methods and credentials
    - Use consistent styling with other Content pages
    - Include professional photography with appropriate sizing and styling
    - Apply theme colors, typography, and spacing
    - Ensure fully responsive
    - _Requirements: 1.2, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 16.2 Write property test for icon usage on Profile pages
    - **Property 9.2: Icons for contact methods**
    - **Validates: Requirements 9.2**
  
  - [ ]* 16.3 Write unit tests for Profile pages
    - Test icons are used for contact information
    - Test professional photos are displayed with correct sizing
    - Test responsive layout at breakpoints
    - Test styling consistency with Content pages
    - _Requirements: 9.2, 9.4, 9.5_

- [x] 17. Checkpoint - Test all redesigned pages
  - Verify all pages render correctly
  - Test responsive behavior on all pages
  - Test that no emojis appear anywhere
  - Ensure all tests pass, ask the user if questions arise

- [x] 18. Implement comprehensive property-based tests
  - [x]* 18.1 Write property test for spacing consistency
    - **Property 7: Spacing Consistency**
    - **Validates: Requirements 3.4**
  
  - [x]* 18.2 Write property test for responsive layout adaptation
    - **Property 11: Responsive Layout Adaptation**
    - **Validates: Requirements 11.2**
  
  - [x]* 18.3 Write property test for touch target sizing
    - **Property 12: Touch Target Sizing**
    - **Validates: Requirements 11.3**
  
  - [x]* 18.4 Write property test for WCAG compliance
    - **Property 13: WCAG Compliance**
    - **Validates: Requirements 12.1**
  
  - [x]* 18.5 Write property test for color contrast compliance
    - **Property 14: Color Contrast Compliance**
    - **Validates: Requirements 12.3, 15.4**
  
  - [x]* 18.6 Write property test for keyboard accessibility
    - **Property 15: Keyboard Accessibility**
    - **Validates: Requirements 12.4**
  
  - [-]* 18.7 Write property test for focus indicators
    - **Property 16: Focus Indicators**
    - **Validates: Requirements 12.5**
  
  - [ ]* 18.8 Write property test for interactive element transitions
    - **Property 18: Interactive Element Transitions**
    - **Validates: Requirements 13.1**
  
  - [ ]* 18.9 Write property test for Button component consistency
    - **Property 22: Button Component Consistency**
    - **Validates: Requirements 17.1**
  
  - [ ]* 18.10 Write property test for Input component consistency
    - **Property 23: Input Component Consistency**
    - **Validates: Requirements 17.2**
  
  - [ ]* 18.11 Write property test for Card component consistency
    - **Property 24: Card Component Consistency**
    - **Validates: Requirements 17.3**

- [x] 19. Performance optimization
  - [x] 19.1 Optimize icon imports
    - Use individual icon imports instead of importing entire icon packages
    - Verify tree-shaking is working correctly
    - _Requirements: 14.3, 18.2_
  
  - [x] 19.2 Implement code splitting for charts
    - Use dynamic imports for Chart components
    - Load chart library only on Calculator pages
    - _Requirements: 18.3_
  
  - [x] 19.3 Implement lazy loading for images
    - Use Next.js Image component with lazy loading
    - Add loading placeholders for images
    - _Requirements: 18.1_
  
  - [ ]* 19.4 Write unit tests for performance optimizations
    - Test that icons are imported individually
    - Test that chart components use dynamic imports
    - Test that images use lazy loading
    - _Requirements: 18.1, 18.2, 18.3_

- [x] 20. Final accessibility audit
  - [x] 20.1 Run automated accessibility tests on all pages
    - Use jest-axe to test all pages for WCAG violations
    - Fix any violations found
    - _Requirements: 12.1_
  
  - [x] 20.2 Test keyboard navigation on all pages
    - Verify all interactive elements are keyboard accessible
    - Verify focus indicators are visible
    - Verify tab order is logical
    - _Requirements: 12.4, 12.5_
  
  - [ ]* 20.3 Write comprehensive accessibility test suite
    - Test all pages for WCAG compliance
    - Test keyboard navigation flows
    - Test screen reader compatibility
    - _Requirements: 12.1, 12.4, 12.5_

- [x] 21. Final checkpoint - Complete testing and verification
  - Run all unit tests and property tests
  - Verify all pages render correctly
  - Verify no emojis appear anywhere in the application
  - Verify all charts display correctly
  - Verify responsive behavior on all pages
  - Verify accessibility compliance on all pages
  - Verify performance metrics meet or exceed baseline
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout the migration
- Property tests validate universal correctness properties across all components
- Unit tests validate specific examples, edge cases, and integration points
- The migration follows a component-first approach: build design system, then migrate pages
- All existing functionality must be preserved during migration
- Performance should be maintained or improved throughout the redesign
