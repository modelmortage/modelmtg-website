# Implementation Plan: Website Structure Migration

## Overview

This implementation plan breaks down the migration of modelmtg.com content and structure into a Next.js application. The approach follows an incremental strategy: establish shared infrastructure first, then implement calculators, content pages, loan options, blog system, and team profiles. Each major section includes testing tasks to validate functionality early.

## Tasks

- [x] 1. Set up shared infrastructure and type definitions
  - Create TypeScript interfaces for all content types (Calculator, LoanOption, BlogPost, TeamMember, PageMetadata)
  - Create utility functions for formatting (currency, percentages, numbers)
  - Create validation schemas using Zod for all calculator inputs
  - Create SEO utility functions (generateMetadata, generateStructuredData)
  - Set up shared calculator components (CalculatorLayout, CalculatorForm, CalculatorResults, CalculatorCTA)
  - _Requirements: 1.1, 1.2, 6.1, 6.2, 10.3_

- [x] 1.1 Write unit tests for utility functions
  - Test currency formatting with various inputs
  - Test percentage formatting
  - Test number formatting with decimal places
  - _Requirements: 1.7_

- [ ] 2. Implement calculator logic and validation
  - [x] 2.1 Implement affordability calculator logic
    - Create calculation function using DTI ratio and mortgage formula
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [x] 2.2 Write property test for affordability calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**
  
  - [x] 2.3 Write property test for affordability input validation
    - **Property 4: Input Validation**
    - **Validates: Requirements 1.4**
  
  - [ ] 2.4 Implement purchase calculator logic
    - Create calculation function for monthly payment (P&I, taxes, insurance, HOA)
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 2.5 Write property test for purchase calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**
  
  - [ ] 2.6 Implement refinance calculator logic
    - Create calculation function for savings and break-even analysis
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 2.7 Write property test for refinance calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**
  
  - [ ] 2.8 Implement rent vs buy calculator logic
    - Create calculation function comparing total costs over time
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 2.9 Write property test for rent vs buy calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**
  
  - [ ] 2.10 Implement VA purchase calculator logic
    - Create calculation function including VA funding fee
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 2.11 Write property test for VA purchase calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**
  
  - [ ] 2.12 Implement VA refinance calculator logic
    - Create calculation function for VA refinance with funding fee
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 2.13 Write property test for VA refinance calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**
  
  - [ ] 2.14 Implement DSCR investment calculator logic
    - Create calculation function for DSCR ratio and cash flow
    - Implement input validation schema
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [ ] 2.15 Write property test for DSCR calculator
    - **Property 3: Calculation Accuracy**
    - **Validates: Requirements 1.3, 1.6**

- [ ] 3. Complete calculator pages
  - [ ] 3.1 Complete affordability calculator page
    - Update existing page to use shared components and new calculation logic
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_
  
  - [ ] 3.2 Complete purchase calculator page
    - Update existing page to use shared components and new calculation logic
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_
  
  - [ ] 3.3 Create refinance calculator page
    - Implement page using shared calculator components
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_
  
  - [ ] 3.4 Create rent vs buy calculator page
    - Implement page using shared calculator components
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_
  
  - [ ] 3.5 Create VA purchase calculator page
    - Implement page using shared calculator components
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_
  
  - [ ] 3.6 Create VA refinance calculator page
    - Implement page using shared calculator components
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_
  
  - [ ] 3.7 Create DSCR investment calculator page
    - Implement page using shared calculator components
    - Add proper SEO metadata
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 6.1, 6.2, 7.1_

- [ ] 3.8 Write property test for calculator interface completeness
  - **Property 2: Calculator Interface Completeness**
  - **Validates: Requirements 1.2**

- [ ] 3.9 Write property test for result formatting
  - **Property 5: Result Formatting**
  - **Validates: Requirements 1.7**

- [ ] 4. Checkpoint - Ensure all calculator tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Create content page infrastructure
  - Create reusable ContentPage component for consistent layout
  - Create Breadcrumbs component for navigation
  - Update Header component to highlight active navigation items
  - Ensure Header and Footer are consistent across all pages
  - _Requirements: 2.3, 8.1, 8.2, 8.3, 8.4_

- [ ] 5.1 Write property test for navigation consistency
  - **Property 7: Navigation Consistency**
  - **Validates: Requirements 2.3, 8.1, 8.2**

- [ ] 5.2 Write property test for design system consistency
  - **Property 8: Design System Consistency**
  - **Validates: Requirements 2.5**

- [ ] 6. Implement main content pages
  - [ ] 6.1 Create About Us page
    - Fetch content from modelmtg.com/about-us
    - Structure content in TypeScript file
    - Implement page with proper SEO metadata
    - _Requirements: 2.1, 2.2, 2.5, 6.1, 6.2_
  
  - [ ] 6.2 Create Meet Our Team page
    - Structure team overview content
    - Add links to individual team member profiles
    - Implement page with proper SEO metadata
    - _Requirements: 2.1, 2.2, 2.5, 5.3, 6.1, 6.2_
  
  - [ ] 6.3 Create Schedule a Call page
    - Implement scheduling interface or embed Calendly
    - Add proper SEO metadata
    - _Requirements: 2.1, 2.2, 2.4, 6.1, 6.2_
  
  - [ ] 6.4 Create Reviews page
    - Structure review content
    - Implement reviews display with proper formatting
    - Add structured data for reviews
    - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.6_
  
  - [ ] 6.5 Create Privacy Policy page
    - Structure privacy policy content
    - Implement page with proper formatting
    - _Requirements: 2.1, 2.2, 6.1, 6.2_
  
  - [ ] 6.6 Create ADA Accessibility Statement page
    - Structure accessibility statement content
    - Implement page with proper formatting
    - _Requirements: 2.1, 2.2, 6.1, 6.2_

- [ ] 6.7 Write property test for content page rendering
  - **Property 6: Content Page Rendering**
  - **Validates: Requirements 2.2**

- [ ] 7. Implement loan options pages
  - [ ] 7.1 Create loan options content structure
    - Create TypeScript file with all 11 loan option definitions
    - Include overview, benefits, requirements, ideal for, related calculators
    - _Requirements: 3.1, 3.4, 10.1, 10.3_
  
  - [ ] 7.2 Create LoanOptionCard component
    - Implement card component for loan option display
    - Ensure responsive design
    - _Requirements: 3.2, 10.5_
  
  - [ ] 7.3 Create individual loan option pages
    - Implement Fixed Rate Mortgage page
    - Implement FHA Home Loan page
    - Implement VA Home Loan page
    - Implement USDA Loan page
    - Implement Jumbo Home Loan page
    - Implement First Time Home Buyer page
    - Implement Low Down Payment Purchase Options page
    - Implement Investment Property Loans page
    - Implement Refinance page
    - Implement Cash Out Refinance page
    - Implement VA Loan Refinance Options page
    - Add proper SEO metadata to all pages
    - Add breadcrumb navigation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 8.4_

- [ ] 7.4 Write property test for loan options structure
  - **Property 10: Loan Options Structure**
  - **Validates: Requirements 3.2, 3.3**

- [ ] 8. Checkpoint - Ensure all content page tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement blog system
  - [ ] 9.1 Create blog content structure
    - Create TypeScript file with blog post definitions
    - Include at least 10 articles from the "Learn" category
    - Structure with title, excerpt, content, author, date, category, tags, featured image
    - _Requirements: 4.4, 4.6, 10.1, 10.3, 10.4_
  
  - [ ] 9.2 Create BlogCard component
    - Implement card component for blog post preview
    - Display title, excerpt, date, featured image
    - Ensure responsive design
    - _Requirements: 4.3, 10.5_
  
  - [ ] 9.3 Create blog listing page
    - Implement /blog page displaying all articles
    - Use BlogCard components
    - Add proper SEO metadata
    - _Requirements: 4.1, 4.3, 6.1, 6.2_
  
  - [ ] 9.4 Create learning center page
    - Implement /learning-center page organizing educational content
    - Add proper SEO metadata
    - _Requirements: 4.2, 6.1, 6.2_
  
  - [ ] 9.5 Create dynamic blog post page
    - Implement /blog/[slug]/page.tsx for individual posts
    - Display full article content with proper formatting
    - Add breadcrumb navigation
    - Add structured data for articles
    - _Requirements: 4.5, 4.6, 6.1, 6.2, 6.6, 8.4_

- [ ] 9.6 Write property test for blog post metadata completeness
  - **Property 11: Blog Post Metadata Completeness**
  - **Validates: Requirements 4.3, 4.6**

- [ ] 9.7 Write property test for blog post content rendering
  - **Property 12: Blog Post Content Rendering**
  - **Validates: Requirements 4.5**

- [ ] 10. Implement team member profiles
  - [ ] 10.1 Create team member content structure
    - Create TypeScript file with team member definitions
    - Include Matthew Bramow and Rolston Nicholls profiles
    - Structure with name, title, bio, photo, credentials, specialties, contact info
    - _Requirements: 5.1, 10.1, 10.3_
  
  - [ ] 10.2 Create TeamMemberCard component
    - Implement card component for team member display
    - Ensure responsive design
    - _Requirements: 10.5_
  
  - [ ] 10.3 Create individual team member pages
    - Implement /matthew-bramow page
    - Implement /rolston-nicholls page
    - Display photo, bio, credentials, contact information
    - Add proper SEO metadata
    - _Requirements: 5.1, 5.2, 6.1, 6.2_

- [ ] 10.4 Write property test for team profile completeness
  - **Property 13: Team Profile Completeness**
  - **Validates: Requirements 5.2**

- [ ] 11. Implement SEO enhancements
  - [ ] 11.1 Add metadata to all pages
    - Ensure all pages have unique title tags
    - Ensure all pages have meta descriptions ≤160 characters
    - Add Open Graph tags to all pages
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 11.2 Implement structured data
    - Add Organization schema to home page
    - Add Article schema to blog posts
    - Add BreadcrumbList schema to nested pages
    - _Requirements: 6.6_
  
  - [ ] 11.3 Generate sitemap
    - Create sitemap.xml including all public pages
    - _Requirements: 6.5_
  
  - [ ] 11.4 Verify heading hierarchy
    - Ensure all pages have exactly one H1
    - Ensure proper heading nesting (no skipped levels)
    - _Requirements: 6.3_

- [ ] 11.5 Write property test for page metadata completeness
  - **Property 14: Page Metadata Completeness**
  - **Validates: Requirements 6.1, 6.2, 6.4**

- [ ] 11.6 Write property test for heading hierarchy
  - **Property 15: Heading Hierarchy**
  - **Validates: Requirements 6.3**

- [ ] 11.7 Write property test for structured data validity
  - **Property 16: Structured Data Validity**
  - **Validates: Requirements 6.6**

- [ ] 12. Implement responsive design and accessibility
  - [ ] 12.1 Ensure responsive layouts
    - Test all pages at 320px, 768px, and 1920px viewports
    - Ensure no horizontal scrolling
    - Ensure readable text and accessible interactive elements
    - _Requirements: 7.1_
  
  - [ ] 12.2 Implement mobile navigation
    - Create collapsible mobile menu for viewports <768px
    - Add hamburger toggle button
    - _Requirements: 8.6_
  
  - [ ] 12.3 Ensure touch target sizing
    - Verify all buttons and links are at least 44x44px
    - _Requirements: 7.2_
  
  - [ ] 12.4 Add ARIA labels
    - Add aria-label to icon buttons and image buttons
    - Add aria-current to active navigation items
    - _Requirements: 7.5, 8.3_
  
  - [ ] 12.5 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Ensure logical tab order
    - _Requirements: 7.4_
  
  - [ ] 12.6 Verify color contrast
    - Check all text elements meet WCAG AA contrast ratios
    - Fix any contrast issues
    - _Requirements: 7.6_

- [ ] 12.7 Write property test for viewport responsiveness
  - **Property 17: Viewport Responsiveness**
  - **Validates: Requirements 7.1**

- [ ] 12.8 Write property test for touch target sizing
  - **Property 18: Touch Target Sizing**
  - **Validates: Requirements 7.2**

- [ ] 12.9 Write property test for WCAG compliance
  - **Property 19: WCAG Compliance**
  - **Validates: Requirements 7.3**

- [ ] 12.10 Write property test for keyboard navigation
  - **Property 20: Keyboard Navigation**
  - **Validates: Requirements 7.4**

- [ ] 12.11 Write property test for ARIA labels
  - **Property 21: ARIA Labels**
  - **Validates: Requirements 7.5**

- [ ] 12.12 Write property test for color contrast
  - **Property 22: Color Contrast**
  - **Validates: Requirements 7.6**

- [ ] 13. Implement performance optimizations
  - [ ] 13.1 Optimize images
    - Convert all images to WebP format
    - Use Next.js Image component with responsive sizes
    - _Requirements: 9.2_
  
  - [ ] 13.2 Configure static generation
    - Ensure content pages use static generation
    - Configure ISR for blog listing page
    - _Requirements: 9.3_
  
  - [ ] 13.3 Verify code splitting
    - Check build output for multiple chunks
    - Ensure dynamic imports where appropriate
    - _Requirements: 9.4_
  
  - [ ] 13.4 Verify link prefetching
    - Ensure Next.js Link components trigger prefetch
    - _Requirements: 9.5_

- [ ] 13.5 Write property test for image optimization
  - **Property 27: Image Optimization**
  - **Validates: Requirements 9.2**

- [ ] 13.6 Write property test for link prefetching
  - **Property 28: Link Prefetching**
  - **Validates: Requirements 9.5**

- [ ] 14. Final integration and testing
  - [ ] 14.1 Test navigation flows
    - Verify all navigation links work correctly
    - Verify breadcrumbs on nested pages
    - Verify active navigation states
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [ ] 14.2 Test form functionality
    - Test all calculator forms
    - Test contact forms and scheduling
    - Verify validation and error handling
    - _Requirements: 2.4, 3.5, 5.4_
  
  - [ ] 14.3 Run accessibility audit
    - Run axe-core on all pages
    - Fix any accessibility violations
    - _Requirements: 7.3_
  
  - [ ] 14.4 Verify SEO implementation
    - Check all pages have proper metadata
    - Verify sitemap includes all pages
    - Verify structured data is valid
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 14.5 Write property test for active navigation state
  - **Property 23: Active Navigation State**
  - **Validates: Requirements 8.3**

- [ ] 14.6 Write property test for breadcrumb navigation
  - **Property 24: Breadcrumb Navigation**
  - **Validates: Requirements 8.4**

- [ ] 14.7 Write property test for navigation link functionality
  - **Property 25: Navigation Link Functionality**
  - **Validates: Requirements 8.5**

- [ ] 14.8 Write property test for mobile navigation
  - **Property 26: Mobile Navigation**
  - **Validates: Requirements 8.6**

- [ ] 14.9 Write property test for interactive element functionality
  - **Property 9: Interactive Element Functionality**
  - **Validates: Requirements 2.4, 3.5, 5.4**

- [ ] 14.10 Write property test for file naming consistency
  - **Property 29: File Naming Consistency**
  - **Validates: Requirements 10.4**

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Calculator implementation follows priority order based on user needs
- Content migration should preserve SEO value from source website
