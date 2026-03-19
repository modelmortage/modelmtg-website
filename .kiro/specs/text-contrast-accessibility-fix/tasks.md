# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Text Contrast on Dark Backgrounds
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate insufficient contrast ratios on dark backgrounds
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - text elements with colors #94a3b8 or #a1a1a1 on dark backgrounds (#0a0a0a, #141318, #1a1a1c, #050505)
  - Test that text elements with colors #94a3b8 or #a1a1a1 on dark backgrounds have contrast ratios < 4.5:1 (from Bug Condition in design)
  - Measure contrast ratios for:
    - FinalCta `.subtext` on #0a0a0a background (expected: ~2.8:1)
    - SolutionsOverview `.description` on #0a0a0a background (expected: ~2.6:1)
    - Footer `.address` on #141318 background (expected: ~2.9:1)
  - Use browser developer tools or automated accessibility testing tools (axe DevTools, Lighthouse)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS with contrast ratios between 2.5:1 and 3:1 (this is correct - it proves the bug exists)
  - Document counterexamples found: specific elements, their colors, backgrounds, and measured contrast ratios
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Dark Background Text Colors
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (text on light backgrounds, border colors, brand colors)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - GoogleReviews section text colors remain #94A3B8 on white background
    - LoanProgramsGrid and AdvantageSection hover border colors remain #94A3B8
    - Gold accent colors (#c5a059, #d4b26a, #C9A44C) remain unchanged
    - Layout properties (padding, margins, font sizes) remain unchanged
    - Hover effects and transitions continue working identically
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for text contrast accessibility on dark backgrounds

  - [x] 3.1 Update FinalCta.module.css
    - Change line 59: `.subtext { color: #94a3b8; }` to `.subtext { color: #E2E8F0; }`
    - Context: Section has `background-color: #0a0a0a`
    - Improves contrast from ~2.8:1 to ~13:1
    - _Bug_Condition: isBugCondition(cssRule) where cssRule.color = '#94a3b8' AND cssRule.appliedToElement.computedBackgroundColor = '#0a0a0a'_
    - _Expected_Behavior: contrastRatio >= 4.5 AND result.color IN ['#ffffff', '#E2E8F0']_
    - _Preservation: Text colors on light backgrounds, brand colors, border colors, layout properties remain unchanged_
    - _Requirements: 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Update SolutionsOverview.module.css
    - Change line 39: `.description { color: #a1a1a1; }` to `.description { color: #E2E8F0; }`
    - Change line 81: `.categoryDescription { color: #a1a1a1; }` to `.categoryDescription { color: #E2E8F0; }`
    - Change line 146: `.dealSpecs { color: #a1a1a1; }` to `.dealSpecs { color: #E2E8F0; }`
    - Context: Wrapper has `background-color: #0a0a0a`
    - Improves contrast from ~2.6:1 to ~13:1
    - _Bug_Condition: isBugCondition(cssRule) where cssRule.color = '#a1a1a1' AND cssRule.appliedToElement.computedBackgroundColor = '#0a0a0a'_
    - _Expected_Behavior: contrastRatio >= 4.5 AND result.color IN ['#ffffff', '#E2E8F0']_
    - _Preservation: Text colors on light backgrounds, brand colors, border colors, layout properties remain unchanged_
    - _Requirements: 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.3 Update Footer.module.css
    - Change line 99: `.address { color: #94a3b8; }` to `.address { color: #E2E8F0; }`
    - Context: Footer has `background: #141318`
    - Improves contrast from ~2.9:1 to ~12.5:1
    - _Bug_Condition: isBugCondition(cssRule) where cssRule.color = '#94a3b8' AND cssRule.appliedToElement.computedBackgroundColor = '#141318'_
    - _Expected_Behavior: contrastRatio >= 4.5 AND result.color IN ['#ffffff', '#E2E8F0']_
    - _Preservation: Text colors on light backgrounds, brand colors, border colors, layout properties remain unchanged_
    - _Requirements: 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.4 Verify and update CinematicCTA.module.css if needed
    - Check line 94 background context
    - If on dark background: Change `color: #94A3B8;` to `color: #E2E8F0;`
    - If on light background: PRESERVE existing color
    - _Bug_Condition: isBugCondition(cssRule) where cssRule.color = '#94A3B8' AND cssRule.appliedToElement.computedBackgroundColor is dark_
    - _Expected_Behavior: contrastRatio >= 4.5 AND result.color IN ['#ffffff', '#E2E8F0'] for dark backgrounds_
    - _Preservation: Text colors on light backgrounds remain unchanged_
    - _Requirements: 2.1, 2.3, 2.4, 3.1_

  - [x] 3.5 Update loanOptions.module.css dark mode styles
    - Change line 79: `color: #94a3b8;` to `color: #E2E8F0;` within `@media (prefers-color-scheme: dark)`
    - Change line 191: `color: #94a3b8;` to `color: #E2E8F0;` within `@media (prefers-color-scheme: dark)`
    - Change line 311: `color: #94a3b8;` to `color: #E2E8F0;` within `@media (prefers-color-scheme: dark)`
    - Change line 369: `color: #94a3b8;` to `color: #E2E8F0;` within `@media (prefers-color-scheme: dark)`
    - Context: These are already in dark mode media queries
    - _Bug_Condition: isBugCondition(cssRule) where cssRule.color = '#94a3b8' AND cssRule is within dark mode media query_
    - _Expected_Behavior: contrastRatio >= 4.5 AND result.color IN ['#ffffff', '#E2E8F0']_
    - _Preservation: Light mode styles remain unchanged_
    - _Requirements: 2.1, 2.3, 2.4, 3.1_

  - [x] 3.6 Verify and update contact.module.css if needed
    - Check line 260 background context
    - If on dark background: Change `color: #94a3b8;` to `color: #E2E8F0;`
    - If on light background: PRESERVE existing color
    - _Bug_Condition: isBugCondition(cssRule) where cssRule.color = '#94a3b8' AND cssRule.appliedToElement.computedBackgroundColor is dark_
    - _Expected_Behavior: contrastRatio >= 4.5 AND result.color IN ['#ffffff', '#E2E8F0'] for dark backgrounds_
    - _Preservation: Text colors on light backgrounds remain unchanged_
    - _Requirements: 2.1, 2.3, 2.4, 3.1_

  - [x] 3.7 Verify GoogleReviews.module.css is preserved
    - Confirm lines 118, 132 remain `color: #94A3B8;` - NO CHANGE
    - Context: Section has `background: #FFFFFF` (light background)
    - Existing contrast is acceptable on light backgrounds
    - _Preservation: Text colors on light backgrounds must remain unchanged_
    - _Requirements: 3.1_

  - [x] 3.8 Verify border colors are preserved
    - Confirm LoanProgramsGrid.module.css line 50 border-color remains #94A3B8
    - Confirm AdvantageSection.module.css line 102 border-color remains #94A3B8
    - Border colors have different contrast requirements and are decorative
    - _Preservation: Border colors remain unchanged_
    - _Requirements: 3.4_

  - [x] 3.9 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Text Contrast on Dark Backgrounds
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify contrast ratios now meet WCAG AA standards (≥ 4.5:1):
      - FinalCta `.subtext` on #0a0a0a background (expected: ~13:1)
      - SolutionsOverview text elements on #0a0a0a background (expected: ~13:1)
      - Footer `.address` on #141318 background (expected: ~12.5:1)
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.10 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Dark Background Text Colors
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify all preservation requirements still hold:
      - GoogleReviews section text colors remain #94A3B8 on white background
      - Border colors remain #94A3B8 for LoanProgramsGrid and AdvantageSection
      - Gold accent colors remain unchanged
      - Layout properties remain unchanged
      - Hover effects continue working identically
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Run all accessibility tests and verify no contrast violations
  - Run visual regression tests for light background sections
  - Test responsive breakpoints and dark mode media queries
  - Ensure all tests pass, ask the user if questions arise
